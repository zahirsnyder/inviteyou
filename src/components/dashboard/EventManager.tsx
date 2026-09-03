"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import {
  addEventAction,
  updateEventAction,
  deleteEventAction,
  moveEventAction,
  type ActionState,
} from "@/app/actions/projects";

const inputClass =
  "w-full rounded-lg bg-white border border-ink/15 px-4 py-3 focus:border-gold-dark focus:outline-none transition-colors";
const labelClass = "block text-xs uppercase tracking-widest text-ink/50 mb-2";

/** Common Malay wedding session names, offered as one-tap shortcuts so the
 * couple doesn't have to type each session title from scratch. */
const SESSION_PRESETS = [
  "Akad Nikah",
  "Persandingan / Bersanding",
  "Majlis Makan Beradab",
  "Solemnization",
  "Wedding Reception",
  "Doa Selamat",
];

export type EventData = {
  id: string;
  title: string;
  description: string | null;
  eventDate: string; // display string
  eventDateValue: string; // yyyy-mm-dd, for the date input
  startTime: string | null;
  endTime: string | null;
  venueName: string;
  address: string;
  mapUrl: string | null;
  wazeUrl: string | null;
};

/** The shared field grid used by both the add form and each edit form. */
function EventFields({ event }: { event?: EventData }) {
  return (
    <>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Session / Event Title</label>
          <input name="title" required defaultValue={event?.title} className={inputClass} placeholder="Akad Nikah" />
        </div>
        <div>
          <label className={labelClass}>Date</label>
          <input name="eventDate" type="date" required defaultValue={event?.eventDateValue} className={inputClass} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Start Time</label>
          <input name="startTime" defaultValue={event?.startTime ?? ""} className={inputClass} placeholder="11:00 AM" />
        </div>
        <div>
          <label className={labelClass}>End Time</label>
          <input name="endTime" defaultValue={event?.endTime ?? ""} className={inputClass} placeholder="1:00 PM" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Venue Name</label>
          <input name="venueName" required defaultValue={event?.venueName} className={inputClass} placeholder="The Glasshouse at Seputeh" />
        </div>
        <div>
          <label className={labelClass}>
            Google Maps URL <span className="text-ink/30 normal-case">(optional)</span>
          </label>
          <input name="mapUrl" type="url" defaultValue={event?.mapUrl ?? ""} className={inputClass} placeholder="https://maps.google.com/…" />
        </div>
        <div>
          <label className={labelClass}>
            Waze URL <span className="text-ink/30 normal-case">(optional)</span>
          </label>
          <input name="wazeUrl" type="url" defaultValue={event?.wazeUrl ?? ""} className={inputClass} placeholder="https://waze.com/ul?…" />
        </div>
      </div>
      <div>
        <label className={labelClass}>Address</label>
        <input name="address" required defaultValue={event?.address} className={inputClass} placeholder="Jalan Seputeh, 58000 Kuala Lumpur" />
      </div>
      <div>
        <label className={labelClass}>
          Description <span className="text-ink/30 normal-case">(optional)</span>
        </label>
        <textarea name="description" rows={2} defaultValue={event?.description ?? ""} className={inputClass} />
      </div>
    </>
  );
}

function EditEventForm({
  projectId,
  event,
  onDone,
}: {
  projectId: string;
  event: EventData;
  onDone: () => void;
}) {
  const bound = updateEventAction.bind(null, projectId, event.id);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(bound, {});

  useEffect(() => {
    if (state.success) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);

  return (
    <form action={formAction} className="mt-4 space-y-5 border-t border-ink/10 pt-4">
      <EventFields event={event} />
      {state.error && (
        <p className="text-red-600 text-sm rounded-lg bg-red-50 border border-red-200 px-4 py-3">{state.error}</p>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-ink text-cream px-6 py-2.5 text-sm font-medium hover:bg-ink/80 transition-colors disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save Changes"}
        </button>
        <button type="button" onClick={onDone} className="rounded-full border border-ink/20 px-5 py-2.5 text-sm hover:border-ink/50 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

function RowControls({
  projectId,
  event,
  first,
  last,
  onEdit,
}: {
  projectId: string;
  event: EventData;
  first: boolean;
  last: boolean;
  onEdit: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const move = (dir: "up" | "down") => startTransition(() => moveEventAction(projectId, event.id, dir));
  const del = () => {
    if (confirm("Delete this session?")) startTransition(() => deleteEventAction(projectId, event.id));
  };
  return (
    <div className="flex items-center gap-3 text-xs">
      <button onClick={() => move("up")} disabled={first || pending} className="text-ink/40 hover:text-ink disabled:opacity-30" aria-label="Move up">
        ↑
      </button>
      <button onClick={() => move("down")} disabled={last || pending} className="text-ink/40 hover:text-ink disabled:opacity-30" aria-label="Move down">
        ↓
      </button>
      <button onClick={onEdit} className="text-gold-dark hover:underline">Edit</button>
      <button onClick={del} disabled={pending} className="text-red-500 hover:text-red-700 disabled:opacity-50">
        Delete
      </button>
    </div>
  );
}

export function EventManager({ projectId, events }: { projectId: string; events: EventData[] }) {
  const boundAdd = addEventAction.bind(null, projectId);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(boundAdd, {});
  const [editingId, setEditingId] = useState<string | null>(null);
  // Start expanded when there's nothing yet, collapsed once sessions exist —
  // so the list doesn't get crowded by an always-open form.
  const [showAddForm, setShowAddForm] = useState(events.length === 0);
  const addFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      // Clear the fields but keep the form open — adding a run of sessions
      // (Akad Nikah, then Bersanding, then Reception…) shouldn't need a
      // re-open click each time.
      addFormRef.current?.reset();
      addFormRef.current?.querySelector<HTMLInputElement>('[name="title"]')?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);

  /** Opens the add form (if collapsed) and pre-fills the title from a preset. */
  function applyPreset(name: string) {
    setShowAddForm(true);
    requestAnimationFrame(() => {
      const el = addFormRef.current?.querySelector<HTMLInputElement>('[name="title"]');
      if (el) {
        el.value = name;
        el.focus();
      }
    });
  }

  return (
    <div className="space-y-8">
      <p className="text-sm text-ink/50">
        Add one session per part of the day — Akad Nikah, Bersanding, reception, dinner — each
        with its own date, time and venue. They show in this order on the invitation.
      </p>

      {events.length === 0 ? (
        <p className="text-ink/50 text-sm rounded-xl border border-dashed border-ink/20 p-6 text-center">
          No sessions yet — add your first below.
        </p>
      ) : (
        <ul className="space-y-4">
          {events.map((event, i) => (
            <li key={event.id} className="rounded-xl border border-ink/10 bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-serif text-xl">{event.title}</p>
                  <p className="text-sm text-ink/50 mt-1">
                    {event.eventDate}
                    {event.startTime && ` · ${event.startTime}`}
                    {event.endTime && ` – ${event.endTime}`}
                  </p>
                  <p className="text-sm text-ink/60 mt-1">
                    {event.venueName} — {event.address}
                  </p>
                </div>
                <RowControls
                  projectId={projectId}
                  event={event}
                  first={i === 0}
                  last={i === events.length - 1}
                  onEdit={() => setEditingId(editingId === event.id ? null : event.id)}
                />
              </div>
              {editingId === event.id && (
                <EditEventForm projectId={projectId} event={event} onDone={() => setEditingId(null)} />
              )}
            </li>
          ))}
        </ul>
      )}

      <div>
        <p className={labelClass}>Quick add a session</p>
        <div className="flex flex-wrap gap-2">
          {SESSION_PRESETS.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => applyPreset(name)}
              className="rounded-full border border-ink/15 bg-white px-4 py-2 text-sm hover:border-gold-dark hover:text-gold-dark transition-colors"
            >
              + {name}
            </button>
          ))}
        </div>
      </div>

      {showAddForm ? (
        <form ref={addFormRef} action={formAction} className="rounded-xl border border-ink/10 bg-white p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl">Add a Session</h3>
            {events.length > 0 && (
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-sm text-ink/40 hover:text-ink"
              >
                Collapse
              </button>
            )}
          </div>
          <EventFields />
          {state.error && (
            <p className="text-red-600 text-sm rounded-lg bg-red-50 border border-red-200 px-4 py-3">{state.error}</p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-ink text-cream px-6 py-3 text-sm font-medium hover:bg-ink/80 transition-colors disabled:opacity-60"
          >
            {pending ? "Adding…" : "Add Session"}
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="w-full rounded-xl border border-dashed border-ink/20 p-6 text-center text-ink/50 hover:border-gold-dark hover:text-gold-dark transition-colors"
        >
          + Add Another Session
        </button>
      )}
    </div>
  );
}
