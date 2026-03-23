export interface WikiLink {
  label: string;
  target: string;
  heading: string | null;
  resolved: boolean;
}

export interface Backlink {
  routePath: string;
  title: string;
  relativePath: string;
}

export interface DocHeading {
  depth: number;
  text: string;
  id: string;
}

export interface DocMeta {
  id: string;
  relativePath: string;
  routePath: string;
  folderSegments: string[];
  title: string;
  description: string;
  headings: DocHeading[];
  tags: string[];
  sourceKind: string;
  mtime: string;
  wordCount: number;
  wikiLinks: WikiLink[];
  backlinks: Backlink[];
  dataPath: string;
}

export interface TreeNode {
  id: string;
  name: string;
  type: "folder" | "file";
  path: string;
  children?: TreeNode[];
  docId?: string;
  relativePath?: string;
}

export interface ContentIndex {
  version: string;
  generatedAt: string;
  writeRoot: string;
  docCount: number;
  docs: DocMeta[];
  tree: TreeNode;
}

export interface DocumentPayload {
  meta: Omit<DocMeta, "dataPath">;
  frontmatter: Record<string, unknown>;
  content: string;
}

