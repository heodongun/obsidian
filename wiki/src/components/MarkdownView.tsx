import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import "katex/dist/katex.min.css";

import { rehypeObsidianCallouts } from "../lib/rehypeObsidianCallouts";

interface MarkdownViewProps {
  content: string;
}

export function MarkdownView({ content }: MarkdownViewProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeRaw, rehypeSlug, rehypeKatex, rehypeHighlight, rehypeObsidianCallouts]}
      components={{
        a({ href, children, ...props }) {
          const isExternal = typeof href === "string" && /^(https?:)?\/\//.test(href);
          const className = href?.startsWith("#/docs/") ? "wiki-link" : undefined;

          return (
            <a
              {...props}
              href={href}
              className={className}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noreferrer" : undefined}
            >
              {children}
            </a>
          );
        },
        img({ src, alt, ...props }) {
          return <img {...props} src={src} alt={alt || ""} loading="lazy" />;
        },
        code({ className, children, ...props }) {
          const language = className?.replace("language-", "") || "";
          const inline = !className;
          if (inline) {
            return (
              <code {...props} className="inline-code">
                {children}
              </code>
            );
          }

          return (
            <code {...props} className={className} data-language={language}>
              {children}
            </code>
          );
        },
        table({ children }) {
          return (
            <div className="table-wrap">
              <table>{children}</table>
            </div>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
