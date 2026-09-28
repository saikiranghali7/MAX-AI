"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import CodeBlock from "./CodeBlock";

export default function MarkdownMessage({ content }) {
  return (
    <div className="prose prose-invert max-w-none break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mb-4 mt-6">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold mb-3 mt-5">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="text-xl font-semibold mb-2 mt-4">
              {children}
            </h3>
          ),

          p: ({ children }) => (
            <p className="mb-3 leading-7 text-zinc-100">
              {children}
            </p>
          ),

          strong: ({ children }) => (
            <strong className="font-bold text-white">
              {children}
            </strong>
          ),

          em: ({ children }) => (
            <em className="italic">
              {children}
            </em>
          ),

          ul: ({ children }) => (
            <ul className="list-disc pl-6 mb-3">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="list-decimal pl-6 mb-3">
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li className="mb-1">
              {children}
            </li>
          ),

          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-zinc-300 my-4">
              {children}
            </blockquote>
          ),

          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              {children}
            </a>
          ),

          code({ inline, className, children }) {
            const match = /language-(\w+)/.exec(className || "");

            if (!inline && match) {
              return (
                <CodeBlock language={match[1]}>
                  {String(children).replace(/\n$/, "")}
                </CodeBlock>
              );
            }

            return (
              <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-pink-400">
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
}