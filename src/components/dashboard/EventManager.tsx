"use client";

import { useActionState, useTransition } from "react";
import {
  addEventAction,
  deleteEventAction,
  type ActionState,
} from "@/app/actions/projects";

const inputClass =
  "w-full rounded-lg bg-white border border-ink/15 px-4 py-3 focus:border-gold-dark focus:outline-none transition-colors";
const labelClass = "block text-xs uppercase tracking-widest text-ink/50 mb-2";

export type EventData = {
  id: string;
  title: string;
  description: string | null;
  eventDate: string; // display string
  startTime: string | null;
  endTime: string | null;
  venueName: string;
  address: string;
  mapUrl: string | null;
};

function DeleteEventButton({ projectId, eventId }: { projectId: string; eventId: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      onClick={() => {
        if (confirm("Delete this event?")) {
          startTransition(() => deleteEventAction(projectId, eventId));
        }
      }}
      disabled={pending}
      className="text-xs text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}

export function EventManager({ projectId, events }: { projectId: string; events: EventData[] }) {
  const boundAction = addEventAction.bind(null, projectId);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(boundAction, {});

  return (
    <div className="space-y-8">
      {events.length === 0 ? (
        <p className="text-ink/50 text-sm rounded-xl border border-dashed border-ink/20 p-6 text-center">
          No events yet — add your Akad Nikah, reception, or dinner below.
        </p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
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
                <DeleteEventButton projectId={projectId} eventId={event.id} />
              </div>
            </li>
          ))}
        </ul>
      )}

      <form action={formAction} className="rounded-xl border border-ink/10 bg-white p-6 space-y-5">
        <h3 className="font-serif text-2xl">Add Event</h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="ev-title" className={labelClass}>
              Event Title
            </label>
            <input id="ev-title" name="title" required className={inputClass} placeholder="Akad Nikah" />
          </div>
          <div>
            <label htmlFor="ev-date" className={labelClass}>
              Date
            </label>
            <input id="ev-date" name="eventDate" type="date" required className={inputClass} />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="ev-start" className={labelClass}>
              Start Time
            </label>
            <input id="ev-start" name="startTime" className={inputClass} placeholder="11:00 AM" />
          </div>
          <div>
            <label htmlFor="ev-end" className={labelClass}>
              End Time
            </label>
            <input id="ev-end" name="endTime" className={inputClass} placeholder="1:00 PM" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="ev-venue" className={labelClass}>
              Venue Name
            </label>
            <input id="ev-venue" name="venueName" required className={inputClass} placeholder="The Glasshouse at Seputeh" />
          </div>
          <div>
            <label htmlFor="ev-map" className={labelClass}>
              Map URL <span className="text-ink/30 normal-case">(optional)</span>
            </label>
            <input id="ev-map" name="mapUrl" type="url" className={inputClass} placeholder="https://maps.google.com/…" />
          </div>
        </div>
        <div>
          <label htmlFor="ev-address" className={labelClass}>
            Address
          </label>
          <input id="ev-address" name="address" required className={inputClass} placeholder="Jalan Seputeh, 58000 Kuala Lumpur" />
        </div>
        <div>
          <label htmlFor="ev-desc" className={labelClass}>
            Description <span className="text-ink/30 normal-case">(optional)</span>
          </label>
          <textarea id="ev-desc" name="description" rows={2} className={inputClass} />
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
          {pending ? "Adding…" : "Add Event"}
        </button>
      </form>
    </div>
  );
}
