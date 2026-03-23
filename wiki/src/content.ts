import type { ContentIndex, DocMeta, DocumentPayload } from "./types";

const baseUrl = import.meta.env.BASE_URL;

function cacheBust(url: string, token: string) {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${encodeURIComponent(token)}`;
}

function encodeSegments(relativePath: string) {
  return relativePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

export function encodeRoutePath(routePath: string) {
  return encodeSegments(routePath);
}

export function formatRuntimePath(relativePath: string) {
  return `${baseUrl}${encodeSegments(relativePath)}`;
}

export function buildDocRoute(routePath: string, heading?: string | null) {
  const suffix = heading ? `?heading=${encodeURIComponent(heading)}` : "";
  return `/docs/${encodeRoutePath(routePath)}${suffix}`;
}

export async function fetchContentIndex(fresh = false): Promise<ContentIndex> {
  const url = `${baseUrl}generated/content-index.json`;
  const response = await fetch(fresh ? cacheBust(url, String(Date.now())) : url);
  if (!response.ok) {
    throw new Error(`Failed to load content index: ${response.status}`);
  }
  return response.json() as Promise<ContentIndex>;
}

export async function fetchDocument(meta: DocMeta, version: string): Promise<DocumentPayload> {
  const url = formatRuntimePath(meta.dataPath);
  const response = await fetch(cacheBust(url, version));
  if (!response.ok) {
    throw new Error(`Failed to load document: ${response.status}`);
  }
  return response.json() as Promise<DocumentPayload>;
}

