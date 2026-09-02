"use client";

import { useState, useTransition } from "react";
import { extendInvitationAction } from "@/app/actions/projects";

export function ExtendInvitationButton({ projectId }: { projectId: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <span>
      <button
        onClick={() =>
          startTransition(async () => {
            setError(null);
            const res = await extendInvitationAction(projectId);
            if (res?.error) setError(res.error);
          })
        }
        disabled={pending}
        className="rounded-full bg-ink text-cream px-5 py-2 text-sm font-medium hover:bg-ink/80 transition-colors disabled:opacity-60"
      >
        {pending ? "Extending…" : "Extend 6 months"}
      </button>
      {error && <span className="ml-2 text-xs text-red-600">{error}</span>}
    </span>
  );
}
