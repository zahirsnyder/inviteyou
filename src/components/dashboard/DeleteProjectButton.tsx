"use client";

import { useTransition } from "react";
import { deleteProjectAction } from "@/app/actions/projects";

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        if (confirm("Delete this wedding project and all its RSVPs, wishes, and photos? This cannot be undone.")) {
          startTransition(() => deleteProjectAction(projectId));
        }
      }}
      disabled={pending}
      className="rounded-full border border-red-300 text-red-600 px-6 py-2.5 text-sm hover:bg-red-50 transition-colors disabled:opacity-60"
    >
      {pending ? "Deleting…" : "Delete Project"}
    </button>
  );
}
