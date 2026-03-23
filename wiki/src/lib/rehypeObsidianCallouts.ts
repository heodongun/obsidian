import { toString } from "hast-util-to-string";
import { visit } from "unist-util-visit";

function textNode(value: string) {
  return {
    type: "text",
    value,
  };
}

function elementNode(tagName: string, className: string[], children: any[]) {
  return {
    type: "element",
    tagName,
    properties: {
      className,
    },
    children,
  };
}

export function rehypeObsidianCallouts() {
  return (tree: any) => {
    visit(tree, "element", (node: any, index: number | undefined, parent: any) => {
      if (!parent || typeof index !== "number" || node.tagName !== "blockquote") {
        return;
      }

      const firstChild = (node.children || []).find((child: any) => {
        return child.type === "element" && child.tagName === "p";
      });

      if (!firstChild) {
        return;
      }

      const marker = toString(firstChild as any).trim().match(/^\[!(\w+)\]([+-])?\s*(.*)$/);
      if (!marker) {
        return;
      }

      const calloutType = marker[1].toLowerCase();
      const collapseMode = marker[2] || "";
      const title = marker[3] || `${calloutType.charAt(0).toUpperCase()}${calloutType.slice(1)}`;
      const contentChildren = (node.children || []).filter((child: any) => child !== firstChild);

      const titleRow = elementNode("div", ["callout-title-row"], [
        elementNode("span", ["callout-badge"], [textNode(calloutType)]),
        elementNode("span", ["callout-title-text"], [textNode(title)]),
      ]);
      const content = elementNode("div", ["callout-body"], contentChildren);

      if (collapseMode) {
        parent.children[index] = {
          type: "element",
          tagName: "details",
          properties: {
            className: ["obsidian-callout", `callout-${calloutType}`, "callout-collapsible"],
            open: collapseMode === "+" ? true : undefined,
            dataCallout: calloutType,
          },
          children: [
            {
              type: "element",
              tagName: "summary",
              properties: {
                className: ["callout-summary"],
              },
              children: [titleRow],
            },
            content,
          ],
        };
        return;
      }

      parent.children[index] = {
        type: "element",
        tagName: "section",
        properties: {
          className: ["obsidian-callout", `callout-${calloutType}`],
          dataCallout: calloutType,
        },
        children: [titleRow, content],
      };
    });
  };
}
