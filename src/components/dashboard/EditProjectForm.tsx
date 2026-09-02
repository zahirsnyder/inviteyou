"use client";

import { useActionState } from "react";
import { updateProjectAction, type ActionState } from "@/app/actions/projects";

const inputClass =
  "w-full rounded-lg bg-white border border-ink/15 px-4 py-3 focus:border-gold-dark focus:outline-none transition-colors";
const labelClass = "block text-xs uppercase tracking-widest text-ink/50 mb-2";

export type ProjectFormData = {
  id: string;
  groomName: string;
  brideName: string;
  weddingDate: string; // yyyy-mm-dd
  title: string;
  quote: string;
  story: string;
  coverImageUrl: string;
  musicUrl: string;
  giftDetails: string;
};

export function EditProjectForm({
  project,
  locked = false,
}: {
  project: ProjectFormData;
  locked?: boolean;
}) {
  const boundAction = updateProjectAction.bind(null, project.id);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(boundAction, {});
  const lockedInput = `${inputClass} read-only:bg-ink/5 read-only:text-ink/50 read-only:cursor-not-allowed`;

  return (
    <form action={formAction} className="space-y-6">
      {locked && (
        <>
          <p className="text-sm rounded-lg bg-ink/5 border border-ink/10 px-4 py-3 text-ink/60">
            Names and wedding date are locked because this invitation has been published.
            A different wedding needs a new invitation.
          </p>
          {/* Read-only fields still post, but guarantee the values regardless. */}
          <input type="hidden" name="groomName" value={project.groomName} />
          <input type="hidden" name="brideName" value={project.brideName} />
          <input type="hidden" name="weddingDate" value={project.weddingDate} />
        </>
      )}
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="groomName" className={labelClass}>
            Groom&apos;s Name
          </label>
          <input id="groomName" name="groomName" required readOnly={locked} defaultValue={project.groomName} className={lockedInput} />
        </div>
        <div>
          <label htmlFor="brideName" className={labelClass}>
            Bride&apos;s Name
          </label>
          <input id="brideName" name="brideName" required readOnly={locked} defaultValue={project.brideName} className={lockedInput} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="weddingDate" className={labelClass}>
            Wedding Date
          </label>
          <input
            id="weddingDate"
            name="weddingDate"
            type="date"
            required
            disabled={locked}
            defaultValue={project.weddingDate}
            className={lockedInput}
          />
        </div>
        <div>
          <label htmlFor="title" className={labelClass}>
            Invitation Title
          </label>
          <input id="title" name="title" defaultValue={project.title} className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="quote" className={labelClass}>
          Quote / Verse
        </label>
        <textarea
          id="quote"
          name="quote"
          rows={2}
          defaultValue={project.quote}
          className={inputClass}
          placeholder="A verse or quote shown near the top of your invitation"
        />
      </div>

      <div>
        <label htmlFor="story" className={labelClass}>
          Your Story
        </label>
        <textarea
          id="story"
          name="story"
          rows={5}
          defaultValue={project.story}
          className={inputClass}
          placeholder="How you met, the proposal, your journey together…"
        />
      </div>

      <div>
        <label htmlFor="coverImageUrl" className={labelClass}>
          Cover Image URL
        </label>
        <input
          id="coverImageUrl"
          name="coverImageUrl"
          type="url"
          defaultValue={project.coverImageUrl}
          className={inputClass}
          placeholder="https://…"
        />
        <p className="text-xs text-ink/40 mt-1.5">
          A wide, high-resolution photo works best for the cinematic hero.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="musicUrl" className={labelClass}>
            Background Music URL <span className="text-ink/30 normal-case">(mp3)</span>
          </label>
          <input
            id="musicUrl"
            name="musicUrl"
            type="url"
            defaultValue={project.musicUrl}
            className={inputClass}
            placeholder="https://…/song.mp3"
          />
        </div>
        <div>
          <label htmlFor="giftDetails" className={labelClass}>
            Gift / Bank Details
          </label>
          <input
            id="giftDetails"
            name="giftDetails"
            defaultValue={project.giftDetails}
            className={inputClass}
            placeholder="Maybank 1234 5678 9012 (Name)"
          />
        </div>
      </div>

      {state.error && (
        <p className="text-red-600 text-sm rounded-lg bg-red-50 border border-red-200 px-4 py-3">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="text-emerald-700 text-sm rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3">
          Saved — your invitation has been updated.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-gold text-night px-8 py-3.5 font-medium hover:bg-gold-light transition-colors disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
