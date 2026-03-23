const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const matter = require("gray-matter");
const fg = require("fast-glob");
const chokidar = require("chokidar");
const GithubSluggerModule = require("github-slugger");
const GithubSlugger = GithubSluggerModule.default || GithubSluggerModule;

const ROOT = path.resolve(__dirname, "..");
const WRITE_ROOT = path.join(ROOT, "write");
const GENERATED_ROOT = path.join(ROOT, "wiki", "public", "generated");
const GENERATED_DOCS_ROOT = path.join(GENERATED_ROOT, "docs");

const WATCH_MODE = process.argv.includes("--watch");

function posixPath(filePath) {
  return filePath.split(path.sep).join(path.posix.sep);
}

function normalizeKey(value) {
  return String(value || "")
    .normalize("NFKC")
    .replace(/\.md$/i, "")
    .trim()
    .toLowerCase();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function encodeRoutePath(routePath) {
  return routePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function stripMarkdown(value) {
  return String(value || "")
    .replace(/^---[\s\S]*?---\s*/m, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/^>+\s?/gm, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\[\[[^\]]+]]/g, " ")
    .replace(/[*_~>-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function makeDescription(frontmatter, content) {
  if (typeof frontmatter.description === "string" && frontmatter.description.trim()) {
    return frontmatter.description.trim();
  }

  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && !line.startsWith("> [!"));

  const excerpt = stripMarkdown(lines.slice(0, 4).join(" "));
  return excerpt.slice(0, 220);
}

function extractTitle(frontmatter, content, fallback) {
  if (typeof frontmatter.title === "string" && frontmatter.title.trim()) {
    return frontmatter.title.trim();
  }

  const match = content.match(/^#\s+(.+)$/m);
  if (match) {
    return match[1].trim();
  }

  return fallback;
}

function readArrayValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function extractHeadings(markdown) {
  const slugger = new GithubSlugger();
  return markdown
    .split(/\r?\n/)
    .map((line) => line.match(/^(#{1,6})\s+(.+)$/))
    .filter(Boolean)
    .map((match) => {
      const depth = match[1].length;
      const text = match[2].trim();
      return {
        depth,
        text,
        id: slugger.slug(text),
      };
    });
}

function splitWikiTarget(input) {
  const [targetAndHeading, alias] = input.split("|");
  const [target, heading] = targetAndHeading.split("#");

  return {
    target: (target || "").trim(),
    heading: heading ? heading.trim() : "",
    alias: alias ? alias.trim() : "",
  };
}

function resolveWikiTarget(target, currentDoc, aliasMap) {
  const candidates = [];
  const cleanTarget = target.replace(/\\/g, "/");

  if (!cleanTarget) {
    candidates.push(currentDoc.routePath);
  } else {
    candidates.push(cleanTarget);
    candidates.push(cleanTarget.replace(/^\.\//, ""));
    candidates.push(path.posix.join(path.posix.dirname(currentDoc.routePath), cleanTarget));
    candidates.push(path.posix.basename(cleanTarget));
  }

  for (const candidate of candidates) {
    const routePath = aliasMap.get(normalizeKey(candidate));
    if (routePath) {
      return routePath;
    }
  }

  return null;
}

function rewriteWikiLinks(markdown, currentDoc, aliasMap) {
  const wikiLinks = [];

  const rewritten = markdown.replace(/(!)?\[\[([^[\]]+)]]/g, (_whole, embedFlag, inner) => {
    const { target, heading, alias } = splitWikiTarget(inner);
    const resolved = resolveWikiTarget(target, currentDoc, aliasMap);
    const label = alias || (heading ? `${target || currentDoc.title} · ${heading}` : target || currentDoc.title);

    if (!resolved) {
      wikiLinks.push({
        label,
        target,
        heading: heading || null,
        resolved: false,
      });
      return `<span class="unresolved-wikilink">${escapeHtml(label)}</span>`;
    }

    const headingId = heading ? new GithubSlugger().slug(heading) : "";
    const href = `#/docs/${encodeRoutePath(resolved)}${headingId ? `?heading=${encodeURIComponent(headingId)}` : ""}`;

    wikiLinks.push({
      label,
      target: resolved,
      heading: headingId || null,
      resolved: true,
    });

    if (embedFlag) {
      return `> Embedded note: [${label}](${href})`;
    }

    return `[${label}](${href})`;
  });

  return {
    rewritten,
    wikiLinks,
  };
}

function buildTree(docs) {
  const root = {
    id: "root",
    name: "write",
    type: "folder",
    path: "",
    children: [],
  };

  const folderMap = new Map([["", root]]);

  for (const doc of docs) {
    let currentPath = "";
    let parent = root;

    for (const segment of doc.folderSegments) {
      currentPath = currentPath ? `${currentPath}/${segment}` : segment;

      if (!folderMap.has(currentPath)) {
        const folderNode = {
          id: currentPath,
          name: segment,
          type: "folder",
          path: currentPath,
          children: [],
        };
        folderMap.set(currentPath, folderNode);
        parent.children.push(folderNode);
      }

      parent = folderMap.get(currentPath);
    }

    parent.children.push({
      id: doc.id,
      name: doc.title,
      type: "file",
      path: doc.routePath,
      docId: doc.id,
      relativePath: doc.relativePath,
    });
  }

  const sortChildren = (node) => {
    node.children.sort((left, right) => {
      if (left.type !== right.type) {
        return left.type === "folder" ? -1 : 1;
      }
      return left.name.localeCompare(right.name, "ko");
    });

    node.children
      .filter((child) => child.type === "folder")
      .forEach((child) => sortChildren(child));
  };

  sortChildren(root);
  return root;
}

function serializeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n", "utf8");
}

function loadDocs() {
  const files = fg.sync(["**/*.md"], {
    cwd: WRITE_ROOT,
    onlyFiles: true,
    dot: false,
    ignore: ["**/.obsidian/**", "**/.DS_Store"],
  });

  const docs = files.map((relativeFilePath) => {
    const absolutePath = path.join(WRITE_ROOT, relativeFilePath);
    const source = fs.readFileSync(absolutePath, "utf8");
    const stat = fs.statSync(absolutePath);
    const parsed = matter(source);
    const relativePath = posixPath(relativeFilePath);
    const routePath = relativePath.replace(/\.md$/i, "");
    const folderPath = path.posix.dirname(routePath);
    const folderSegments = folderPath === "." ? [] : folderPath.split("/");
    const fallbackTitle = path.basename(routePath);
    const title = extractTitle(parsed.data, parsed.content, fallbackTitle);
    const headings = extractHeadings(parsed.content);
    const description = makeDescription(parsed.data, parsed.content);
    const tags = [
      ...readArrayValue(parsed.data.tags),
      ...readArrayValue(parsed.data.keywords),
    ].filter((value, index, array) => array.indexOf(value) === index);

    return {
      absolutePath,
      relativePath,
      routePath,
      folderSegments,
      title,
      description,
      headings,
      tags,
      sourceKind: folderSegments[0] || "write",
      stat,
      rawContent: parsed.content.trim(),
      frontmatter: parsed.data,
    };
  });

  const aliasMap = new Map();
  for (const doc of docs) {
    const aliases = new Set([
      doc.title,
      path.basename(doc.routePath),
      doc.routePath,
      doc.relativePath,
    ]);

    for (const alias of aliases) {
      aliasMap.set(normalizeKey(alias), doc.routePath);
    }
  }

  const docsWithContent = docs.map((doc) => {
    const { rewritten, wikiLinks } = rewriteWikiLinks(doc.rawContent, doc, aliasMap);
    const wordCount = stripMarkdown(rewritten)
      .split(/\s+/)
      .filter(Boolean).length;
    const dataPath = posixPath(path.join("generated", "docs", `${doc.routePath}.json`));
    return {
      id: doc.routePath,
      absolutePath: doc.absolutePath,
      relativePath: doc.relativePath,
      routePath: doc.routePath,
      folderSegments: doc.folderSegments,
      title: doc.title,
      description: doc.description,
      headings: doc.headings,
      tags: doc.tags,
      sourceKind: doc.sourceKind,
      mtime: doc.stat.mtime.toISOString(),
      wordCount,
      wikiLinks,
      frontmatter: doc.frontmatter,
      content: rewritten,
      dataPath,
    };
  });

  const docByRoute = new Map(docsWithContent.map((doc) => [doc.routePath, doc]));

  for (const doc of docsWithContent) {
    doc.backlinks = [];
  }

  for (const doc of docsWithContent) {
    for (const link of doc.wikiLinks.filter((item) => item.resolved && item.target)) {
      const targetDoc = docByRoute.get(link.target);
      if (!targetDoc) {
        continue;
      }

      targetDoc.backlinks.push({
        routePath: doc.routePath,
        title: doc.title,
        relativePath: doc.relativePath,
      });
    }
  }

  return docsWithContent.sort((left, right) => {
    return right.mtime.localeCompare(left.mtime);
  });
}

function buildOnce() {
  const docs = loadDocs();
  const tree = buildTree(docs);
  const versionSeed = docs
    .map((doc) => `${doc.relativePath}:${doc.mtime}:${doc.wordCount}`)
    .join("|");
  const version = crypto.createHash("sha1").update(versionSeed).digest("hex").slice(0, 12);
  const indexPayload = {
    version,
    generatedAt: new Date().toISOString(),
    writeRoot: WRITE_ROOT,
    docCount: docs.length,
    docs: docs.map((doc) => ({
      id: doc.id,
      relativePath: doc.relativePath,
      routePath: doc.routePath,
      folderSegments: doc.folderSegments,
      title: doc.title,
      description: doc.description,
      headings: doc.headings,
      tags: doc.tags,
      sourceKind: doc.sourceKind,
      mtime: doc.mtime,
      wordCount: doc.wordCount,
      wikiLinks: doc.wikiLinks,
      backlinks: doc.backlinks,
      dataPath: doc.dataPath,
    })),
    tree,
  };

  fs.rmSync(GENERATED_DOCS_ROOT, { recursive: true, force: true });
  fs.mkdirSync(GENERATED_DOCS_ROOT, { recursive: true });

  for (const doc of docs) {
    const docFilePath = path.join(ROOT, "wiki", "public", doc.dataPath);
    serializeJson(docFilePath, {
      meta: {
        id: doc.id,
        relativePath: doc.relativePath,
        routePath: doc.routePath,
        folderSegments: doc.folderSegments,
        title: doc.title,
        description: doc.description,
        headings: doc.headings,
        tags: doc.tags,
        sourceKind: doc.sourceKind,
        mtime: doc.mtime,
        wordCount: doc.wordCount,
        wikiLinks: doc.wikiLinks,
        backlinks: doc.backlinks,
      },
      frontmatter: doc.frontmatter,
      content: doc.content,
    });
  }

  serializeJson(path.join(GENERATED_ROOT, "content-index.json"), indexPayload);
  console.log(`[content] built ${docs.length} docs -> ${GENERATED_ROOT}`);
}

function watch() {
  buildOnce();
  const watcher = chokidar.watch(WRITE_ROOT, {
    ignored: (value) => value.includes(`${path.sep}.obsidian${path.sep}`) || path.basename(value).startsWith("."),
    ignoreInitial: true,
  });

  let timer = null;
  const schedule = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        buildOnce();
      } catch (error) {
        console.error("[content] rebuild failed");
        console.error(error);
      }
    }, 200);
  };

  watcher.on("add", schedule);
  watcher.on("change", schedule);
  watcher.on("unlink", schedule);
  watcher.on("addDir", schedule);
  watcher.on("unlinkDir", schedule);
  console.log(`[content] watching ${WRITE_ROOT}`);
}

if (WATCH_MODE) {
  watch();
} else {
  buildOnce();
}
