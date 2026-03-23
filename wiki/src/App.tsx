import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
import {
  HashRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import { buildDocRoute, encodeRoutePath, fetchContentIndex, fetchDocument } from "./content";
import { MarkdownView } from "./components/MarkdownView";
import type { ContentIndex, DocMeta, DocumentPayload, TreeNode } from "./types";

type ThemeMode = "light" | "dark";

interface SourceStat {
  sourceKind: string;
  count: number;
}

function formatAbsoluteDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatRelativeDate(value: string) {
  const date = new Date(value);
  const now = Date.now();
  const diff = now - date.getTime();
  const hours = Math.round(diff / 36e5);
  const days = Math.round(diff / 864e5);

  if (Math.abs(hours) < 24) {
    return `${hours}시간 전`;
  }
  if (Math.abs(days) < 30) {
    return `${days}일 전`;
  }
  return formatAbsoluteDate(value);
}

function formatWordCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function estimateReadMinutes(wordCount: number) {
  return Math.max(1, Math.round(wordCount / 220));
}

function getSourceStats(docs: DocMeta[]): SourceStat[] {
  return Array.from(
    docs.reduce((map, doc) => {
      map.set(doc.sourceKind, (map.get(doc.sourceKind) || 0) + 1);
      return map;
    }, new Map<string, number>()),
  )
    .map(([sourceKind, count]) => ({ sourceKind, count }))
    .sort((left, right) => right.count - left.count);
}

function getSourceLink(document: DocumentPayload | null) {
  const raw = document?.frontmatter.source;
  return typeof raw === "string" ? raw : null;
}

function stripLeadingTitleHeading(content: string, title: string) {
  const lines = content.replace(/^\uFEFF/, "").split(/\r?\n/);
  const normalizedTitle = title.trim().replace(/\s+/g, " ");
  let firstContentLine = 0;

  while (firstContentLine < lines.length && !lines[firstContentLine].trim()) {
    firstContentLine += 1;
  }

  const match = lines[firstContentLine]?.match(/^#\s+(.*)$/);
  if (!match) {
    return content;
  }

  if (match[1].trim().replace(/\s+/g, " ") !== normalizedTitle) {
    return content;
  }

  const remaining = [...lines.slice(0, firstContentLine), ...lines.slice(firstContentLine + 1)].join("\n");
  return remaining.replace(/^\s+/, "");
}

function useThemeMode() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const stored = window.localStorage.getItem("wiki-theme");
    return stored === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("wiki-theme", theme);
  }, [theme]);

  return {
    theme,
    toggleTheme() {
      setTheme((current) => (current === "light" ? "dark" : "light"));
    },
  };
}

function useContentIndex() {
  const [index, setIndex] = useState<ContentIndex | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadInitial() {
      try {
        const data = await fetchContentIndex(false);
        if (cancelled) {
          return;
        }
        setIndex(data);
        setError(null);
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load index");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadInitial();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!index) {
      return;
    }

    const timer = window.setInterval(async () => {
      try {
        const fresh = await fetchContentIndex(true);
        if (fresh.version !== index.version) {
          startTransition(() => {
            setIndex(fresh);
          });
        }
      } catch {
        // Ignore polling failures and keep the current snapshot.
      }
    }, 5000);

    return () => {
      window.clearInterval(timer);
    };
  }, [index]);

  return { index, loading, error, setIndex };
}

function useSearchResults(index: ContentIndex | null, query: string) {
  const deferredQuery = useDeferredValue(query);

  return useMemo(() => {
    if (!index) {
      return [];
    }
    if (!deferredQuery.trim()) {
      return index.docs.slice(0, 18);
    }

    const fuse = new Fuse(index.docs, {
      includeMatches: true,
      threshold: 0.28,
      keys: [
        { name: "title", weight: 0.5 },
        { name: "description", weight: 0.2 },
        { name: "relativePath", weight: 0.15 },
        { name: "tags", weight: 0.15 },
      ],
    });

    return fuse.search(deferredQuery, { limit: 24 }).map((result) => result.item);
  }, [deferredQuery, index]);
}

function HomePage({ docs }: { docs: DocMeta[] }) {
  const recentDocs = docs.slice(0, 6);
  const latestVelog = docs.filter((doc) => doc.sourceKind === "velog").slice(0, 4);
  const sourceStats = useMemo(() => getSourceStats(docs).slice(0, 6), [docs]);
  const deepReads = useMemo(() => [...docs].sort((left, right) => right.wordCount - left.wordCount).slice(0, 4), [docs]);
  const totalWords = useMemo(() => docs.reduce((sum, doc) => sum + doc.wordCount, 0), [docs]);

  return (
    <div className="page-shell">
      <div className="document-card overview-card">
        <header className="document-header overview-header">
          <p className="page-kicker">Overview</p>
          <h1>Study Wiki</h1>
          <p className="document-summary">
            `write/**` 전체를 정적 위키로 인덱싱하고, Velog 아카이브와 일반 노트를 같은 탐색 흐름 안에서 읽을 수 있게
            구성했습니다. DeepWiki처럼 문서가 중심이 되고 탐색 패널이 조용히 보조하는 레이아웃으로 정리했습니다.
          </p>
          <div className="document-meta-strip">
            <span className="meta-chip">{docs.length} notes</span>
            <span className="meta-chip">{sourceStats.length} collections</span>
            <span className="meta-chip">{formatWordCount(totalWords)} words</span>
          </div>
        </header>

        <details className="document-foldout" open>
          <summary>Relevant collections</summary>
          <div className="foldout-grid">
            {sourceStats.map((item) => (
              <div key={item.sourceKind} className="foldout-item">
                <strong>{item.sourceKind}</strong>
                <span>{item.count} indexed notes</span>
              </div>
            ))}
          </div>
        </details>

        <section className="content-section">
          <div className="content-section-header">
            <h2>Latest updates</h2>
            <span>mtime 기준</span>
          </div>
          <div className="article-link-list">
            {recentDocs.map((doc) => (
              <Link key={doc.id} to={buildDocRoute(doc.routePath)} className="article-link-row">
                <div>
                  <strong>{doc.title}</strong>
                  <p>{doc.description}</p>
                </div>
                <div className="row-meta">
                  <span>{doc.sourceKind}</span>
                  <span>{formatRelativeDate(doc.mtime)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="content-grid">
          <section className="content-section">
            <div className="content-section-header">
              <h2>Deep reads</h2>
              <span>긴 문서 우선</span>
            </div>
            <div className="article-link-list compact">
              {deepReads.map((doc) => (
                <Link key={doc.id} to={buildDocRoute(doc.routePath)} className="article-link-row">
                  <div>
                    <strong>{doc.title}</strong>
                    <p>{doc.description}</p>
                  </div>
                  <div className="row-meta">
                    <span>{estimateReadMinutes(doc.wordCount)} min</span>
                    <span>{formatWordCount(doc.wordCount)} words</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="content-section">
            <div className="content-section-header">
              <h2>Velog archive</h2>
              <span>최근 동기화</span>
            </div>
            <div className="article-link-list compact">
              {latestVelog.map((doc) => (
                <Link key={doc.id} to={buildDocRoute(doc.routePath)} className="article-link-row">
                  <div>
                    <strong>{doc.title}</strong>
                    <p>{doc.description}</p>
                  </div>
                  <div className="row-meta">
                    <span>{formatRelativeDate(doc.mtime)}</span>
                    <span>{doc.tags.length} tags</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}

function TreeSection({
  node,
  currentRoute,
  expandedFolders,
  onToggle,
  onFileSelect,
}: {
  node: TreeNode;
  currentRoute: string;
  expandedFolders: Set<string>;
  onToggle: (path: string) => void;
  onFileSelect: () => void;
}) {
  if (!node.children?.length) {
    return null;
  }

  return (
    <>
      {node.children.map((child) => {
        if (child.type === "folder") {
          const isExpanded = expandedFolders.has(child.path);
          return (
            <div key={child.id} className="tree-folder">
              <button type="button" className="tree-folder-toggle" onClick={() => onToggle(child.path)}>
                <span className="tree-arrow">{isExpanded ? "v" : ">"}</span>
                <span className="tree-folder-label">{child.name}</span>
              </button>
              {isExpanded ? (
                <div className="tree-folder-children">
                  <TreeSection
                    node={child}
                    currentRoute={currentRoute}
                    expandedFolders={expandedFolders}
                    onToggle={onToggle}
                    onFileSelect={onFileSelect}
                  />
                </div>
              ) : null}
            </div>
          );
        }

        return (
          <Link
            key={child.id}
            to={`/docs/${encodeRoutePath(child.path)}`}
            className={`tree-file ${currentRoute === child.path ? "is-active" : ""}`}
            onClick={onFileSelect}
          >
            <span className="tree-file-icon" aria-hidden="true" />
            <span className="tree-file-title">{child.name}</span>
          </Link>
        );
      })}
    </>
  );
}

function Sidebar({
  index,
  currentRoute,
  query,
  onQueryChange,
  mobileOpen,
  onMobileClose,
}: {
  index: ContentIndex;
  currentRoute: string;
  query: string;
  onQueryChange: (value: string) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const searchResults = useSearchResults(index, query);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(() => {
    const paths = new Set<string>();
    const currentSegments = currentRoute.split("/");
    currentSegments.slice(0, -1).reduce((accumulator, segment) => {
      const next = accumulator ? `${accumulator}/${segment}` : segment;
      paths.add(next);
      return next;
    }, "");
    return paths;
  });

  useEffect(() => {
    const nextPaths = new Set<string>();
    const currentSegments = currentRoute.split("/");
    currentSegments.slice(0, -1).reduce((accumulator, segment) => {
      const next = accumulator ? `${accumulator}/${segment}` : segment;
      nextPaths.add(next);
      return next;
    }, "");
    setExpandedFolders((previous) => new Set([...previous, ...nextPaths]));
  }, [currentRoute]);

  function toggleFolder(folderPath: string) {
    setExpandedFolders((previous) => {
      const next = new Set(previous);
      if (next.has(folderPath)) {
        next.delete(folderPath);
      } else {
        next.add(folderPath);
      }
      return next;
    });
  }

  return (
    <aside className={`sidebar ${mobileOpen ? "is-open" : ""}`}>
      <div className="sidebar-header compact">
        <p className="sidebar-label">Last indexed</p>
        <strong>{formatAbsoluteDate(index.generatedAt)}</strong>
      </div>

      <label className="search-box">
        <div className="search-head">
          <span className="search-label">Search wiki</span>
          <span className="search-shortcut">/</span>
        </div>
        <div className="search-input-wrap">
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="제목, 경로, 태그로 검색"
          />
          {query ? (
            <button type="button" className="search-clear" onClick={() => onQueryChange("")}>
              Clear
            </button>
          ) : null}
        </div>
      </label>

      <Link
        to="/"
        className={`sidebar-overview-link ${currentRoute ? "" : "is-active"}`}
        onClick={onMobileClose}
      >
        Overview
      </Link>

      {query.trim() ? (
        <section className="sidebar-section">
          <div className="section-header">
            <h3>Search</h3>
            <span>{searchResults.length}</span>
          </div>
          <div className="stack-list compact">
            {searchResults.map((doc) => (
              <Link
                key={doc.id}
                to={buildDocRoute(doc.routePath)}
                className={`stack-item search-result-item ${currentRoute === doc.routePath ? "is-active" : ""}`}
                onClick={onMobileClose}
              >
                <div>
                  <strong>{doc.title}</strong>
                  <p>{doc.relativePath}</p>
                </div>
                <span>{doc.sourceKind}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="sidebar-section grow">
        <div className="section-header">
          <h3>Navigation</h3>
          <span>{index.docCount}</span>
        </div>
        <TreeSection
          node={index.tree}
          currentRoute={currentRoute}
          expandedFolders={expandedFolders}
          onToggle={toggleFolder}
          onFileSelect={onMobileClose}
        />
      </section>
    </aside>
  );
}

function RightRail({ activeDocument, index }: { activeDocument: DocumentPayload | null; index: ContentIndex }) {
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!activeDocument?.meta.headings.length) {
      setActiveHeadingId(null);
      return;
    }

    const headings = activeDocument.meta.headings;

    function syncActiveHeading() {
      const sections = headings
        .map((heading) => globalThis.document.getElementById(heading.id))
        .filter((element): element is HTMLElement => Boolean(element));

      if (!sections.length) {
        setActiveHeadingId(null);
        return;
      }

      let nextActive = sections[0].id;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= 148) {
          nextActive = section.id;
        } else {
          break;
        }
      }

      setActiveHeadingId((current) => (current === nextActive ? current : nextActive));
    }

    const frame = window.requestAnimationFrame(syncActiveHeading);
    window.addEventListener("scroll", syncActiveHeading, { passive: true });
    window.addEventListener("resize", syncActiveHeading);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", syncActiveHeading);
      window.removeEventListener("resize", syncActiveHeading);
    };
  }, [activeDocument]);

  if (!activeDocument) {
    const sourceStats = getSourceStats(index.docs).slice(0, 4);
    const recentDocs = index.docs.slice(0, 4);

    return (
      <aside className="right-rail">
        <div className="right-card subtle-card">
          <h3>Vault snapshot</h3>
          <div className="right-meta-list">
            <span>Indexed</span>
            <strong>{formatAbsoluteDate(index.generatedAt)}</strong>
            <span>Notes</span>
            <strong>{index.docCount}</strong>
            <span>Collections</span>
            <strong>{sourceStats.length}</strong>
          </div>
        </div>

        <div className="right-card subtle-card">
          <div className="section-header">
            <h3>Collections</h3>
            <span>{sourceStats.length}</span>
          </div>
          <div className="stack-list compact">
            {sourceStats.map((item) => (
              <div key={item.sourceKind} className="stack-item">
                <div>
                  <strong>{item.sourceKind}</strong>
                  <p>{item.count} indexed notes</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="right-card">
          <div className="section-header">
            <h3>Recently updated</h3>
            <span>{recentDocs.length}</span>
          </div>
          <div className="stack-list compact">
            {recentDocs.map((doc) => (
              <Link key={doc.id} to={buildDocRoute(doc.routePath)} className="stack-item">
                <div>
                  <strong>{doc.title}</strong>
                  <p>{formatRelativeDate(doc.mtime)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </aside>
    );
  }

  const sourceLink = getSourceLink(activeDocument);

  return (
    <aside className="right-rail">
      <div className="right-card subtle-card">
        <h3>Document info</h3>
        <div className="right-meta-list">
          <span>Updated</span>
          <strong>{formatRelativeDate(activeDocument.meta.mtime)}</strong>
          <span>Read time</span>
          <strong>{estimateReadMinutes(activeDocument.meta.wordCount)} min</strong>
          <span>Connections</span>
          <strong>{activeDocument.meta.backlinks.length + activeDocument.meta.wikiLinks.length}</strong>
        </div>
        {sourceLink ? (
          <a className="inline-action" href={sourceLink} target="_blank" rel="noreferrer">
            Open original source
          </a>
        ) : null}
      </div>

      <div className="right-card toc-card">
        <div className="section-header">
          <h3>On this page</h3>
          <span>{activeDocument.meta.headings.length}</span>
        </div>
        <div className="toc-list">
          {activeDocument.meta.headings.length ? (
            activeDocument.meta.headings.map((heading) => (
              <button
                key={heading.id}
                type="button"
                className={`toc-item depth-${heading.depth} ${activeHeadingId === heading.id ? "is-active" : ""}`}
                onClick={() => {
                  globalThis.document.getElementById(heading.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                {heading.text}
              </button>
            ))
          ) : (
            <p className="muted-copy">헤딩이 없는 문서입니다.</p>
          )}
        </div>
      </div>

      <div className="right-card subtle-card">
        <div className="section-header">
          <h3>Backlinks</h3>
          <span>{activeDocument.meta.backlinks.length}</span>
        </div>
        {activeDocument.meta.backlinks.length ? (
          <div className="stack-list compact">
            {activeDocument.meta.backlinks.map((backlink) => (
              <Link key={`${backlink.routePath}-${backlink.relativePath}`} to={buildDocRoute(backlink.routePath)} className="stack-item">
                <div>
                  <strong>{backlink.title}</strong>
                  <p>{backlink.relativePath}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="muted-copy">이 문서를 가리키는 위키링크가 아직 없습니다.</p>
        )}
      </div>
    </aside>
  );
}

function DocumentPage({
  index,
  onDocumentChange,
}: {
  index: ContentIndex;
  onDocumentChange: (document: DocumentPayload | null) => void;
}) {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const routePath = decodeURIComponent(params["*"] || "");
  const docMeta = index.docs.find((doc) => doc.routePath === routePath) || null;
  const [loadedDocument, setLoadedDocument] = useState<DocumentPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!docMeta) {
        setLoading(false);
        setError("문서를 찾을 수 없습니다.");
        setLoadedDocument(null);
        onDocumentChange(null);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const payload = await fetchDocument(docMeta, index.version);
        if (cancelled) {
          return;
        }
        setLoadedDocument(payload);
        onDocumentChange(payload);
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "문서를 불러오지 못했습니다.");
          setLoadedDocument(null);
          onDocumentChange(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [docMeta, index.version, onDocumentChange]);

  useEffect(() => {
    if (!loadedDocument) {
      return;
    }
    const heading = searchParams.get("heading");
    window.requestAnimationFrame(() => {
      if (heading) {
        globalThis.document.getElementById(heading)?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    });
  }, [loadedDocument, searchParams]);

  if (loading) {
    return (
      <div className="page-shell">
        <div className="loading-card">
          <p className="eyebrow">Loading</p>
          <h2>문서를 읽어오는 중입니다.</h2>
        </div>
      </div>
    );
  }

  if (error || !loadedDocument || !docMeta) {
    return (
      <div className="page-shell">
        <div className="loading-card error">
          <p className="eyebrow">Not found</p>
          <h2>{error || "문서를 찾을 수 없습니다."}</h2>
        </div>
      </div>
    );
  }

  const sourceLink = getSourceLink(loadedDocument);
  const displayContent = stripLeadingTitleHeading(loadedDocument.content, docMeta.title);

  return (
    <div className="page-shell">
      <div className="document-card">
        <header className="document-header">
          <p className="page-kicker">{docMeta.sourceKind}</p>
          <h1>{docMeta.title}</h1>
          <p className="document-summary">{docMeta.description}</p>
          <div className="document-meta-strip">
            <span className="meta-chip">{formatRelativeDate(docMeta.mtime)}</span>
            <span className="meta-chip">{formatWordCount(docMeta.wordCount)} words</span>
            <span className="meta-chip">{docMeta.headings.length} sections</span>
            <span className="meta-chip">{docMeta.backlinks.length} backlinks</span>
          </div>
          {docMeta.tags.length ? (
            <div className="tag-row">
              {docMeta.tags.map((tag) => (
                <span key={tag} className="tag-chip">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </header>

        <div className="document-meta-bar">
          <div className="breadcrumb">
            <span>write</span>
            {docMeta.folderSegments.map((segment) => (
              <span key={segment}>{segment}</span>
            ))}
          </div>
          <div className="document-stats">
            <span>{docMeta.sourceKind}</span>
            <span>{formatWordCount(docMeta.wordCount)} words</span>
            <span>{docMeta.backlinks.length} backlinks</span>
            <span title={formatAbsoluteDate(docMeta.mtime)}>{formatRelativeDate(docMeta.mtime)}</span>
          </div>
        </div>

        <details className="document-foldout">
          <summary>Relevant note details</summary>
          <div className="foldout-grid foldout-grid-details">
            <div className="foldout-item">
              <strong>Path</strong>
              <span>{docMeta.relativePath}</span>
            </div>
            <div className="foldout-item">
              <strong>Collection</strong>
              <span>{docMeta.sourceKind}</span>
            </div>
            <div className="foldout-item">
              <strong>Updated</strong>
              <span>{formatAbsoluteDate(docMeta.mtime)}</span>
            </div>
            {sourceLink ? (
              <a className="foldout-item foldout-item-link" href={sourceLink} target="_blank" rel="noreferrer">
                <strong>Source</strong>
                <span>Open original source</span>
              </a>
            ) : null}
          </div>
        </details>

        <article className="markdown-body">
          <MarkdownView content={displayContent} />
        </article>
      </div>
    </div>
  );
}

function WikiShell({ index, theme, onThemeToggle }: { index: ContentIndex; theme: ThemeMode; onThemeToggle: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDocument, setActiveDocument] = useState<DocumentPayload | null>(null);
  const currentRoute = location.pathname.startsWith("/docs/")
    ? decodeURIComponent(location.pathname.replace(/^\/docs\//, ""))
    : "";
  const activeSourceLink = getSourceLink(activeDocument);

  useEffect(() => {
    setMobileOpen(false);
    if (!location.pathname.startsWith("/docs/")) {
      setActiveDocument(null);
    }
  }, [location.pathname]);

  return (
    <div className="app-frame">
      <div className="app-top-strip" />
      <header className="app-header">
        <div className="app-brand">
          <Link to="/" className="app-brand-title">
            StudyWiki
          </Link>
          <span className="app-brand-context">{activeDocument ? activeDocument.meta.relativePath : "write/**"}</span>
        </div>

        <div className="app-header-status">{index.generatedAt ? `Updated ${formatRelativeDate(index.generatedAt)}` : ""}</div>

        <div className="app-header-actions">
          <button type="button" className="mobile-menu-button" onClick={() => setMobileOpen(true)}>
            Menu
          </button>
          <button type="button" className={`header-button ${activeDocument ? "" : "is-active"}`} onClick={() => navigate("/")}>
            Overview
          </button>
          {activeSourceLink ? (
            <a className="header-button" href={activeSourceLink} target="_blank" rel="noreferrer">
              Original
            </a>
          ) : null}
          <button type="button" className="header-button" onClick={onThemeToggle}>
            {theme === "light" ? "Dark" : "Light"}
          </button>
        </div>
      </header>

      <div className="app-shell">
        <Sidebar
          index={index}
          currentRoute={currentRoute}
          query={query}
          onQueryChange={setQuery}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        {mobileOpen ? <button type="button" className="sidebar-scrim" onClick={() => setMobileOpen(false)} /> : null}

        <main className="main-panel">
          <Routes>
            <Route path="/" element={<HomePage docs={index.docs} />} />
            <Route path="/docs/*" element={<DocumentPage index={index} onDocumentChange={setActiveDocument} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <RightRail activeDocument={activeDocument} index={index} />
      </div>
    </div>
  );
}

export default function App() {
  const { theme, toggleTheme } = useThemeMode();
  const { index, loading, error } = useContentIndex();

  if (loading) {
    return (
      <div className="boot-screen">
        <div className="loading-card">
          <p className="eyebrow">Indexing</p>
          <h1>write 폴더를 스캔하는 중입니다.</h1>
        </div>
      </div>
    );
  }

  if (error || !index) {
    return (
      <div className="boot-screen">
        <div className="loading-card error">
          <p className="eyebrow">Startup error</p>
          <h1>{error || "콘텐츠 인덱스를 읽지 못했습니다."}</h1>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <WikiShell index={index} theme={theme} onThemeToggle={toggleTheme} />
    </HashRouter>
  );
}
