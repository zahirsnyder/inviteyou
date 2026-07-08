"use client";

import { useState } from "react";

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="rounded-full px-5 py-2 text-sm border border-ink/20 hover:border-ink/50 transition-colors"
    >
      {copied ? "Copied!" : "Copy Link"}
    </button>
  );
}
