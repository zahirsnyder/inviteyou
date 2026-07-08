"use client";

import { useTransition } from "react";
import { toggleWishVisibilityAction } from "@/app/actions/projects";

export function WishVisibilityToggle({
  projectId,
  wishId,
  isVisible,
}: {
  projectId: string;
  wishId: string;
  isVisible: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => toggleWishVisibilityAction(projectId, wishId, !isVisible))}
      disabled={pending}
      className={`text-xs rounded-full px-4 py-1.5 border transition-colors disabled:opacity-50 ${
        isVisible
          ? "border-ink/20 text-ink/60 hover:border-amber-400 hover:text-amber-700"
          : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
      }`}
    >
      {pending ? "…" : isVisible ? "Hide from page" : "Show on page"}
    </button>
  );
}
