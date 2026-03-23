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
  const featuredDoc = recentDocs[0] || null;
  const latestVelog = docs.filter((doc) => doc.sourceKind === "velog").slice(0, 4);
  const sourceStats = useMemo(() => getSourceStats(docs).slice(0, 6), [docs]);
  const deepReads = useMemo(() => [...docs].sort((left, right) => right.wordCount - left.wordCount).slice(0, 4), [docs]);
  const totalWords = useMemo(() => docs.reduce((sum, doc) => sum + doc.wordCount, 0), [docs]);

  return (
    <div className="page-shell home-shell">
      <section className="hero-panel hero-panel-vault">
        <div className="hero-panel-copy">
          <p className="eyebrow">Workspace</p>
          <h1>Obsidian 같은 질감으로 읽는 정적 Study Vault</h1>
          <p className="hero-copy">
            폴더 탐색, 위키링크, 백링크, Velog 아카이브를 하나의 작업 공간처럼 정리했습니다. 카드형 랜딩이 아니라
            실제 노트 앱처럼 탐색과 읽기가 자연스럽게 이어지도록 화면 리듬을 다시 잡았습니다.
          </p>
          <div className="hero-actions">
            {featuredDoc ? (
              <Link className="cta-button" to={buildDocRoute(featuredDoc.routePath)}>
                최근 노트 열기
              </Link>
            ) : null}
            {latestVelog[0] ? (
              <Link className="ghost-button hero-secondary-action" to={buildDocRoute(latestVelog[0].routePath)}>
                최신 Velog 보기
              </Link>
            ) : null}
          </div>
        </div>

        {featuredDoc ? (
          <Link to={buildDocRoute(featuredDoc.routePath)} className="hero-feature-card">
            <div className="hero-feature-header">
              <span className="eyebrow">Featured Note</span>
              <span className="hero-feature-time">{formatRelativeDate(featuredDoc.mtime)}</span>
            </div>
            <strong>{featuredDoc.title}</strong>
            <p>{featuredDoc.description}</p>
            <div className="hero-feature-meta">
              <span>{featuredDoc.sourceKind}</span>
              <span>{estimateReadMinutes(featuredDoc.wordCount)} min read</span>
              <span>{featuredDoc.headings.length} sections</span>
            </div>
          </Link>
        ) : null}
      </section>

      <section className="insight-band">
        <div className="metric-card metric-card-strong">
          <span className="metric-value">{docs.length}</span>
          <span className="metric-label">Indexed Notes</span>
        </div>
        <div className="metric-card">
          <span className="metric-value">{sourceStats.length}</span>
          <span className="metric-label">Collections</span>
        </div>
        <div className="metric-card">
          <span className="metric-value">{latestVelog.length ? latestVelog.length : 0}</span>
          <span className="metric-label">Latest Velog Shelf</span>
        </div>
        <div className="metric-card">
          <span className="metric-value">{formatWordCount(totalWords)}</span>
          <span className="metric-label">Readable Words</span>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-card dashboard-card-tall">
          <div className="card-header">
            <h2>Fresh Notes</h2>
            <span>mtime 기준</span>
          </div>
          <div className="stack-list">
            {recentDocs.map((doc) => (
              <Link key={doc.id} to={buildDocRoute(doc.routePath)} className="stack-item stack-item-rich">
                <div>
                  <strong>{doc.title}</strong>
                  <p>{doc.description}</p>
                </div>
                <div className="stack-meta">
                  <span>{doc.sourceKind}</span>
                  <span>{formatRelativeDate(doc.mtime)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h2>Collections</h2>
            <span>source kind 기준</span>
          </div>
          <div className="space-grid">
            {sourceStats.map((item) => (
              <div key={item.sourceKind} className="space-card">
                <strong>{item.sourceKind}</strong>
                <p>{item.count}개 문서</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dashboard-grid dashboard-grid-secondary">
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Deep Reads</h2>
            <span>긴 문서 우선</span>
          </div>
          <div className="shelf-list">
            {deepReads.map((doc) => (
              <Link key={doc.id} to={buildDocRoute(doc.routePath)} className="shelf-item">
                <div>
                  <strong>{doc.title}</strong>
                  <p>{doc.description}</p>
                </div>
                <div className="shelf-meta">
                  <span>{estimateReadMinutes(doc.wordCount)} min</span>
                  <span>{formatWordCount(doc.wordCount)} words</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h2>Velog Archive</h2>
            <span>최근 동기화</span>
          </div>
          <div className="shelf-list">
            {latestVelog.map((doc) => (
              <Link key={doc.id} to={buildDocRoute(doc.routePath)} className="shelf-item">
                <div>
                  <strong>{doc.title}</strong>
                  <p>{doc.description}</p>
                </div>
                <div className="shelf-meta">
                  <span>{formatRelativeDate(doc.mtime)}</span>
                  <span>{doc.tags.length} tags</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
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
  theme,
  onThemeToggle,
  mobileOpen,
  onMobileClose,
}: {
  index: ContentIndex;
  currentRoute: string;
  query: string;
  onQueryChange: (value: string) => void;
  theme: ThemeMode;
  onThemeToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const searchResults = useSearchResults(index, query);
  const recentDocs = index.docs.slice(0, 5);
  const sourceStats = useMemo(() => getSourceStats(index.docs).slice(0, 4), [index.docs]);
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
      <div className="sidebar-header">
        <div>
          <p className="eyebrow">Vault</p>
          <h2>Study Wiki</h2>
        </div>
        <button type="button" className="theme-toggle" onClick={onThemeToggle}>
          {theme === "light" ? "Dark" : "Light"}
        </button>
      </div>

      <div className="sidebar-spotlight">
        <div className="sidebar-topline">
          <Link
            to="/"
            className={`vault-home-link ${currentRoute ? "" : "is-active"}`}
            onClick={onMobileClose}
          >
            Dashboard
          </Link>
          <span className="sidebar-updated">{formatRelativeDate(index.generatedAt)}</span>
        </div>
        <div className="sidebar-stat-row">
          <div>
            <strong>{index.docCount}</strong>
            <span>notes</span>
          </div>
          <div>
            <strong>{sourceStats.length}</strong>
            <span>spaces</span>
          </div>
          <div>
            <strong>{index.docs.filter((doc) => doc.sourceKind === "velog").length}</strong>
            <span>velog</span>
          </div>
        </div>
      </div>

      <label className="search-box">
        <div className="search-head">
          <span className="search-label">Quick Find</span>
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
                className={`stack-item ${currentRoute === doc.routePath ? "is-active" : ""}`}
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
      ) : (
        <>
          <section className="sidebar-section">
            <div className="section-header">
              <h3>Recent</h3>
              <span>{recentDocs.length}</span>
            </div>
            <div className="stack-list compact">
              {recentDocs.map((doc) => (
                <Link
                  key={doc.id}
                  to={buildDocRoute(doc.routePath)}
                  className={`stack-item ${currentRoute === doc.routePath ? "is-active" : ""}`}
                  onClick={onMobileClose}
                >
                  <div>
                    <strong>{doc.title}</strong>
                    <p>{doc.sourceKind}</p>
                  </div>
                  <span>{formatRelativeDate(doc.mtime)}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="sidebar-section">
            <div className="section-header">
              <h3>Spaces</h3>
              <span>{sourceStats.length}</span>
            </div>
            <div className="source-pill-grid">
              {sourceStats.map((item) => (
                <div key={item.sourceKind} className="source-pill">
                  <span>{item.sourceKind}</span>
                  <strong>{item.count}</strong>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <section className="sidebar-section grow">
        <div className="section-header">
          <h3>Explorer</h3>
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

function RightRail({ activeDocument }: { activeDocument: DocumentPayload | null }) {
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
    return (
      <aside className="right-rail">
        <div className="right-card right-card-hero">
          <p className="eyebrow">Overview</p>
          <h3>문서를 열면 여기서 구조와 연결성을 확인합니다</h3>
          <p>
            아웃라인, 백링크, 읽는 흐름을 이 패널에 모았습니다. 큰 화면에서는 상시 보이고, 작은 화면에서는 본문 아래로
            이어져서 끊기지 않게 보입니다.
          </p>
          <div className="rail-stat-grid">
            <div className="rail-stat">
              <span>Mode</span>
              <strong>Overview</strong>
            </div>
            <div className="rail-stat">
              <span>Focus</span>
              <strong>Explore</strong>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  const sourceLink = getSourceLink(activeDocument);

  return (
    <aside className="right-rail">
      <div className="right-card right-card-hero">
        <p className="eyebrow">Now Reading</p>
        <h3>{activeDocument.meta.title}</h3>
        <div className="rail-stat-grid">
          <div className="rail-stat">
            <span>Read</span>
            <strong>{estimateReadMinutes(activeDocument.meta.wordCount)} min</strong>
          </div>
          <div className="rail-stat">
            <span>Links</span>
            <strong>{activeDocument.meta.backlinks.length + activeDocument.meta.wikiLinks.length}</strong>
          </div>
          <div className="rail-stat">
            <span>Updated</span>
            <strong>{formatRelativeDate(activeDocument.meta.mtime)}</strong>
          </div>
        </div>
        {sourceLink ? (
          <a className="hero-link-button" href={sourceLink} target="_blank" rel="noreferrer">
            Open original source
          </a>
        ) : null}
      </div>

      <div className="right-card">
        <div className="section-header">
          <h3>Outline</h3>
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

      <div className="right-card">
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
        <header className="document-hero">
          <div className="document-hero-copy">
            <div className="document-kicker-row">
              <span className="status-pill">{docMeta.sourceKind}</span>
              <span className="status-pill subtle">{docMeta.folderSegments[0] || "write"}</span>
            </div>
            <h1>{docMeta.title}</h1>
            <p>{docMeta.description}</p>
            {docMeta.tags.length ? (
              <div className="tag-row">
                {docMeta.tags.map((tag) => (
                  <span key={tag} className="tag-chip">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="document-hero-panel">
            <div className="hero-detail">
              <span>Updated</span>
              <strong>{formatRelativeDate(docMeta.mtime)}</strong>
              <small>{formatAbsoluteDate(docMeta.mtime)}</small>
            </div>
            <div className="hero-detail">
              <span>Read time</span>
              <strong>{estimateReadMinutes(docMeta.wordCount)} min</strong>
              <small>{formatWordCount(docMeta.wordCount)} words</small>
            </div>
            <div className="hero-detail">
              <span>Connections</span>
              <strong>{docMeta.backlinks.length + docMeta.wikiLinks.length}</strong>
              <small>{docMeta.headings.length} sections</small>
            </div>
            {sourceLink ? (
              <a className="hero-link-button" href={sourceLink} target="_blank" rel="noreferrer">
                Open original source
              </a>
            ) : null}
          </div>
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

  useEffect(() => {
    setMobileOpen(false);
    if (!location.pathname.startsWith("/docs/")) {
      setActiveDocument(null);
    }
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <Sidebar
        index={index}
        currentRoute={currentRoute}
        query={query}
        onQueryChange={setQuery}
        theme={theme}
        onThemeToggle={onThemeToggle}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {mobileOpen ? <button type="button" className="sidebar-scrim" onClick={() => setMobileOpen(false)} /> : null}

      <main className="main-panel">
        <div className="main-toolbar">
          <div className="toolbar-group">
            <button type="button" className="mobile-menu-button" onClick={() => setMobileOpen(true)}>
              Explorer
            </button>
            <button type="button" className="ghost-button" onClick={() => navigate("/")}>
              Dashboard
            </button>
            <div className="toolbar-context">
              <span>{activeDocument ? "Now reading" : "Workspace overview"}</span>
              <strong>{activeDocument ? activeDocument.meta.title : "Study Wiki"}</strong>
            </div>
          </div>
          <div className="toolbar-group">
            <span className="toolbar-hint">{index.generatedAt ? `Updated ${formatRelativeDate(index.generatedAt)}` : ""}</span>
            <span className="toolbar-badge">
              {activeDocument ? `${estimateReadMinutes(activeDocument.meta.wordCount)} min read` : `${index.docCount} notes`}
            </span>
          </div>
        </div>
        <Routes>
          <Route path="/" element={<HomePage docs={index.docs} />} />
          <Route path="/docs/*" element={<DocumentPage index={index} onDocumentChange={setActiveDocument} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <RightRail activeDocument={activeDocument} />
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
