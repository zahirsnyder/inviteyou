"use client";

import type { InvitationEvent } from "../types";
import { Reveal, SectionHeading } from "../shared";

const dateFmt = new Intl.DateTimeFormat("en-MY", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function EventsSection({ events }: { events: InvitationEvent[] }) {
  if (events.length === 0) return null;

  return (
    <section className="py-28 px-6">
      <div className="mx-auto max-w-4xl">
        <SectionHeading eyebrow="When & where" title="Wedding Events" />
        <div className="space-y-8">
          {events.map((event, i) => (
            <Reveal key={event.id} delay={i * 0.12}>
              <div className="rounded-3xl border border-gold/20 bg-white/[0.04] backdrop-blur-sm p-8 sm:p-12 text-center">
                <p className="uppercase tracking-[0.3em] text-gold text-[0.65rem] sm:text-xs mb-4">
                  {dateFmt.format(new Date(event.eventDateISO))}
                </p>
                <h3 className="font-serif text-3xl sm:text-4xl text-cream mb-3">{event.title}</h3>
                {(event.startTime || event.endTime) && (
                  <p className="text-gold-light font-serif text-lg mb-5">
                    {event.startTime}
                    {event.endTime && ` — ${event.endTime}`}
                  </p>
                )}
                {event.description && (
                  <p className="text-cream/60 text-sm leading-relaxed max-w-lg mx-auto mb-6">
                    {event.description}
                  </p>
                )}
                <div className="gold-divider max-w-[120px] mx-auto mb-6">
                  <span className="text-xs">✦</span>
                </div>
                <p className="font-serif text-xl text-cream/90">{event.venueName}</p>
                <p className="text-cream/50 text-sm mt-1 mb-6">{event.address}</p>
                {event.mapUrl && (
                  <a
                    href={event.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-full border border-gold/50 px-8 py-3 text-gold text-xs uppercase tracking-[0.2em] hover:bg-gold hover:text-night transition-colors"
                  >
                    Open Map
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
