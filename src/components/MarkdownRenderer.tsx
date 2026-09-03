import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface MarkdownRendererProps {
  content: string;
}

let mermaidReady: Promise<typeof import("mermaid").default> | null = null;

const loadMermaid = () => {
  if (!mermaidReady) {
    mermaidReady = import("mermaid").then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        securityLevel: "loose",
        fontFamily: "ui-monospace, monospace",
      });
      return mermaid;
    });
  }
  return mermaidReady;
};

const MermaidBlock = ({ code }: { code: string }) => {
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
    loadMermaid()
      .then((mermaid) => mermaid.render(id, code))
      .then(({ svg }) => {
        if (!cancelled) setSvg(svg);
      })
      .catch(() => {
        if (!cancelled) setSvg("");
      });
    return () => {
      cancelled = true;
    };
  }, [code]);

  if (!svg) {
    return (
      <pre className="text-sm font-mono text-muted-foreground overflow-x-auto">{code}</pre>
    );
  }
  return (
    <div
      className="my-6 flex justify-center rounded-xl border border-border bg-secondary/40 p-4 [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  return (
    <div className="prose prose-invert max-w-none prose-headings:text-foreground prose-headings:font-semibold prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-code:text-primary prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-secondary prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-li:text-muted-foreground prose-th:text-foreground prose-td:text-muted-foreground prose-hr:border-border prose-blockquote:border-primary/50 prose-blockquote:text-muted-foreground prose-img:rounded-lg">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ className, children, ...props }) {
            const isMermaid = /language-mermaid/.test(className || "");
            if (isMermaid) {
              return <MermaidBlock code={String(children).trim()} />;
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
