"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FiCopy, FiCheck } from "react-icons/fi";

export default function CodeBlock({
  language,
  children,
}) {

  const [copied, setCopied] = useState(false);

  const copyCode = async () => {

    await navigator.clipboard.writeText(children);

    setCopied(true);

    setTimeout(() => {

      setCopied(false);

    }, 2000);

  };

  return (

    <div className="relative rounded-xl overflow-hidden">

      <button
        onClick={copyCode}
        className="absolute right-3 top-3 bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded-lg text-sm flex items-center gap-2"
      >
        {copied ? <FiCheck /> : <FiCopy />}
        {copied ? "Copied" : "Copy"}
      </button>

      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: "12px",
          paddingTop: "48px",
        }}
      >
        {children}
      </SyntaxHighlighter>

    </div>

  );

}