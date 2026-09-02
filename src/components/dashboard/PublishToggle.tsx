"use client";

import { useState, useTransition } from "react";
import { setPublishedAction } from "@/app/actions/projects";

export function PublishToggle({
  projectId,
  isPublished,
  disabled,
}: {
  projectId: string;
  isPublished: boolean;
  disabled?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={() =>
          startTransition(async () => {
            setError(null);
            const res = await setPublishedAction(projectId, !isPublished);
            if (res?.error) setError(res.error);
          })
        }
        disabled={pending || disabled}
        className={`rounded-full px-6 py-2.5 text-sm font-medium transition-colors disabled:opacity-60 ${
          isPublished
            ? "border border-ink/20 text-ink/70 hover:border-red-400 hover:text-red-600"
            : "bg-gold text-night hover:bg-gold-light"
        }`}
      >
        {pending ? "Saving…" : isPublished ? "Unpublish" : "Publish Invitation"}
      </button>
      {error && <p className="text-xs text-red-600 max-w-xs text-right">{error}</p>}
    </div>
  );
}
