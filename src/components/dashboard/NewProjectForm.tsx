"use client";

import { useActionState } from "react";
import { createProjectAction, type ActionState } from "@/app/actions/projects";

const inputClass =
  "w-full rounded-lg bg-white border border-ink/15 px-4 py-3 focus:border-gold-dark focus:outline-none transition-colors";
const labelClass = "block text-xs uppercase tracking-widest text-ink/50 mb-2";

export function NewProjectForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createProjectAction,
    {}
  );

  return (
    <form action={formAction} className="space-y-6 max-w-xl">
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="groomName" className={labelClass}>
            Groom&apos;s Name
          </label>
          <input id="groomName" name="groomName" required className={inputClass} placeholder="Amir" />
        </div>
        <div>
          <label htmlFor="brideName" className={labelClass}>
            Bride&apos;s Name
          </label>
          <input id="brideName" name="brideName" required className={inputClass} placeholder="Aisyah" />
        </div>
      </div>
      <div>
        <label htmlFor="weddingDate" className={labelClass}>
          Wedding Date
        </label>
        <input id="weddingDate" name="weddingDate" type="date" required className={inputClass} />
      </div>
      <div>
        <label htmlFor="title" className={labelClass}>
          Invitation Title <span className="text-ink/30 normal-case">(optional)</span>
        </label>
        <input
          id="title"
          name="title"
          className={inputClass}
          placeholder="The Wedding of Amir & Aisyah"
        />
      </div>

      {state.error && (
        <p className="text-red-600 text-sm rounded-lg bg-red-50 border border-red-200 px-4 py-3">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-gold text-night px-8 py-3.5 font-medium hover:bg-gold-light transition-colors disabled:opacity-60"
      >
        {pending ? "Creating…" : "Create Invitation"}
      </button>
    </form>
  );
}
