const fs = require("node:fs");
const path = require("node:path");

const matter = require("gray-matter");

const ROOT = path.resolve(__dirname, "..");
const VELOG_DIR = path.join(ROOT, "write", "velog");
const USERNAME = "pobi";
const GRAPHQL_URL = "https://v3.velog.io/graphql";
const LIST_QUERY = `
  query velogPosts($input: GetPostsInput!) {
    posts(input: $input) {
      id
      title
      short_description
      thumbnail
      user {
        id
        username
        profile {
          id
          thumbnail
          display_name
        }
      }
      url_slug
      released_at
      updated_at
      comments_count
      tags
      is_private
      likes
    }
  }
`;

function ensureDir() {
  fs.mkdirSync(VELOG_DIR, { recursive: true });
}

function normalizeValue(value) {
  return String(value || "")
    .normalize("NFKC")
    .replace(/\.md$/i, "")
    .trim()
    .toLowerCase();
}

function parseTitleFromMarkdown(content, fallback) {
  const parsed = matter(content);
  if (typeof parsed.data.title === "string" && parsed.data.title.trim()) {
    return parsed.data.title.trim();
  }

  const match = parsed.content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : fallback;
}

function buildExistingIndex() {
  const files = fs.existsSync(VELOG_DIR)
    ? fs.readdirSync(VELOG_DIR).filter((file) => file.endsWith(".md"))
    : [];

  return files.map((fileName) => {
    const absolutePath = path.join(VELOG_DIR, fileName);
    const source = fs.readFileSync(absolutePath, "utf8");
    const parsed = matter(source);
    return {
      absolutePath,
      fileName,
      frontmatter: parsed.data,
      title: parseTitleFromMarkdown(source, path.basename(fileName, ".md")),
      stem: path.basename(fileName, ".md"),
    };
  });
}

function yamlLine(key, value) {
  return `${key}: ${JSON.stringify(String(value))}`;
}

function yamlArray(key, values) {
  if (!values.length) {
    return `${key}: []`;
  }

  return [ `${key}:`, ...values.map((value) => `  - ${JSON.stringify(String(value))}`) ].join("\n");
}

function findApolloState(html) {
  const marker = "window.__APOLLO_STATE__=";
  const start = html.indexOf(marker);
  if (start === -1) {
    throw new Error("APOLLO_STATE marker not found");
  }

  const from = start + marker.length;
  const end = html.indexOf(";</script>", from);
  if (end === -1) {
    throw new Error("APOLLO_STATE closing marker not found");
  }

  return JSON.parse(html.slice(from, end));
}

function resolveRef(state, ref) {
  if (!ref || typeof ref !== "object") {
    return null;
  }
  return state[ref.id] || null;
}

function parsePostFromHtml(url, html) {
  const state = findApolloState(html);
  const post = Object.values(state).find((entry) => {
    return entry && typeof entry === "object" && typeof entry.body === "string" && entry.url_slug;
  });

  if (!post) {
    throw new Error(`No post body found for ${url}`);
  }

  const user = resolveRef(state, post.user) || {};
  const profile = resolveRef(state, user.profile) || {};

  return {
    title: post.title,
    body: post.body.trim(),
    description: post.short_description || "",
    source: url,
    source_slug: post.url_slug,
    author: user.username || USERNAME,
    author_display_name: profile.display_name || "",
    released_at: post.released_at || "",
    updated_at: post.updated_at || "",
    tags: Array.isArray(post.tags) ? post.tags : [],
    thumbnail: post.thumbnail || "",
  };
}

function buildVelogMarkdown(post) {
  const frontmatter = [
    "---",
    yamlLine("title", post.title),
    yamlLine("description", post.description),
    yamlLine("source", post.source),
    yamlLine("source_slug", post.source_slug),
    yamlLine("author", post.author),
    post.author_display_name ? yamlLine("author_display_name", post.author_display_name) : null,
    post.released_at ? yamlLine("released_at", post.released_at) : null,
    post.updated_at ? yamlLine("updated_at", post.updated_at) : null,
    post.thumbnail ? yamlLine("thumbnail", post.thumbnail) : null,
    yamlArray("tags", post.tags),
    "---",
    "",
  ].filter(Boolean);

  const hasHeading = post.body.startsWith("# ");
  return `${frontmatter.join("\n")}${hasHeading ? post.body : `# ${post.title}\n\n${post.body}`}\n`;
}

function resolveTargetFile(post, existingFiles) {
  const normalizedTitle = normalizeValue(post.title);
  const normalizedSlug = normalizeValue(post.source_slug);

  const matched = existingFiles.find((item) => {
    return (
      normalizeValue(item.frontmatter.source_slug) === normalizedSlug ||
      normalizeValue(item.title) === normalizedTitle ||
      normalizeValue(item.stem) === normalizedSlug ||
      normalizeValue(item.stem) === normalizedTitle
    );
  });

  if (matched) {
    return matched.absolutePath;
  }

  return path.join(VELOG_DIR, `${post.source_slug}.md`);
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.text();
}

async function fetchPostPage(cursor) {
  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
    },
    body: JSON.stringify({
      query: LIST_QUERY,
      variables: {
        input: {
          cursor,
          username: USERNAME,
          limit: 10,
          tag: "",
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch post list: ${response.status}`);
  }

  const payload = await response.json();
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join(", "));
  }

  return Array.isArray(payload.data?.posts) ? payload.data.posts : [];
}

async function mapWithConcurrency(items, concurrency, worker) {
  const results = [];
  const executing = new Set();

  for (const item of items) {
    const task = Promise.resolve().then(() => worker(item));
    results.push(task);
    executing.add(task);

    const clear = () => executing.delete(task);
    task.then(clear, clear);

    if (executing.size >= concurrency) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}

async function collectAllPosts() {
  const posts = [];
  let cursor = null;

  while (true) {
    const page = await fetchPostPage(cursor);
    if (!page.length) {
      break;
    }

    posts.push(...page);
    if (page.length < 10) {
      break;
    }

    cursor = page[page.length - 1].id;
  }

  return posts.filter((post) => !post.is_private);
}

async function main() {
  ensureDir();
  const existingFiles = buildExistingIndex();
  const posts = await collectAllPosts();
  console.log(`[velog] collected ${posts.length} posts via GraphQL`);
  const failures = [];
  let created = 0;
  let updated = 0;
  let skipped = 0;

  await mapWithConcurrency(posts, 4, async (listItem) => {
    try {
      const url = `https://velog.io/@${USERNAME}/${encodeURIComponent(listItem.url_slug)}`;
      const html = await fetchHtml(url);
      const post = parsePostFromHtml(url, html);
      const targetFile = resolveTargetFile(post, existingFiles);
      const content = buildVelogMarkdown(post);
      const current = fs.existsSync(targetFile) ? fs.readFileSync(targetFile, "utf8") : null;

      if (current === content) {
        skipped += 1;
        return;
      }

      fs.writeFileSync(targetFile, content, "utf8");
      if (current) {
        updated += 1;
      } else {
        created += 1;
      }
    } catch (error) {
      failures.push({ url, error: error.message });
    }
  });

  console.log(`[velog] created ${created}, updated ${updated}, skipped ${skipped}`);
  if (failures.length) {
    console.error(`[velog] ${failures.length} failed`);
    for (const failure of failures) {
      console.error(`- ${failure.url}: ${failure.error}`);
    }
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
