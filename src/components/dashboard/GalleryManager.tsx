"use client";

import Image from "next/image";
import { useActionState, useTransition } from "react";
import {
  addGalleryImageAction,
  deleteGalleryImageAction,
  type ActionState,
} from "@/app/actions/projects";

const inputClass =
  "w-full rounded-lg bg-white border border-ink/15 px-4 py-3 focus:border-gold-dark focus:outline-none transition-colors";
const labelClass = "block text-xs uppercase tracking-widest text-ink/50 mb-2";

export type GalleryItem = { id: string; imageUrl: string; caption: string | null };

function DeleteImageButton({ projectId, imageId }: { projectId: string; imageId: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      onClick={() => startTransition(() => deleteGalleryImageAction(projectId, imageId))}
      disabled={pending}
      className="absolute top-2 right-2 rounded-full bg-black/60 text-white text-xs px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
    >
      {pending ? "…" : "Remove"}
    </button>
  );
}

export function GalleryManager({
  projectId,
  images,
}: {
  projectId: string;
  images: GalleryItem[];
}) {
  const boundAction = addGalleryImageAction.bind(null, projectId);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(boundAction, {});

  return (
    <div className="space-y-8">
      <form action={formAction} className="rounded-xl border border-ink/10 bg-white p-6 space-y-5 max-w-xl">
        <div>
          <label htmlFor="imageUrl" className={labelClass}>
            Image URL
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            required
            className={inputClass}
            placeholder="https://…/photo.jpg"
          />
          <p className="text-xs text-ink/40 mt-1.5">
            Paste a direct image link (file uploads arrive with the storage integration).
          </p>
        </div>
        <div>
          <label htmlFor="caption" className={labelClass}>
            Caption <span className="text-ink/30 normal-case">(optional)</span>
          </label>
          <input id="caption" name="caption" className={inputClass} placeholder="Golden hour" />
        </div>
        {state.error && (
          <p className="text-red-600 text-sm rounded-lg bg-red-50 border border-red-200 px-4 py-3">
            {state.error}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-ink text-cream px-6 py-3 text-sm font-medium hover:bg-ink/80 transition-colors disabled:opacity-60"
        >
          {pending ? "Adding…" : "Add Photo"}
        </button>
      </form>

      {images.length === 0 ? (
        <p className="text-ink/50 text-sm rounded-xl border border-dashed border-ink/20 p-10 text-center">
          No photos yet — add your engagement and pre-wedding photos above.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="group relative rounded-xl overflow-hidden aspect-[4/5] bg-ink/5">
              <Image
                src={img.imageUrl}
                alt={img.caption ?? "Gallery photo"}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover"
              />
              <DeleteImageButton projectId={projectId} imageId={img.id} />
              {img.caption && (
                <p className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent text-white text-xs p-3 pt-6">
                  {img.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
