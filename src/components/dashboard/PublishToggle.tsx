"use client";

import { useTransition } from "react";
import { setPublishedAction } from "@/app/actions/projects";

export function PublishToggle({
  projectId,
  isPublished,
}: {
  projectId: string;
  isPublished: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => setPublishedAction(projectId, !isPublished))}
      disabled={pending}
      className={`rounded-full px-6 py-2.5 text-sm font-medium transition-colors disabled:opacity-60 ${
        isPublished
          ? "border border-ink/20 text-ink/70 hover:border-red-400 hover:text-red-600"
          : "bg-gold text-night hover:bg-gold-light"
      }`}
    >
      {pending ? "Saving…" : isPublished ? "Unpublish" : "Publish Invitation"}
    </button>
  );
}
