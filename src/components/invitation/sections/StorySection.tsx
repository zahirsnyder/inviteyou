"use client";

import type { InvitationData } from "../types";
import { Reveal, SectionHeading } from "../shared";

export function StorySection({ data }: { data: InvitationData }) {
  if (!data.quote && !data.story) return null;

  return (
    <section className="py-28 px-6 bg-gradient-to-b from-night to-night-soft">
      <div className="mx-auto max-w-3xl">
        {data.quote && (
          <Reveal className="text-center mb-24">
            <span className="font-serif text-6xl text-gold/40 leading-none">“</span>
            <p className="font-serif italic text-2xl sm:text-3xl leading-relaxed text-cream/85 -mt-4">
              {data.quote}
            </p>
            <div className="gold-divider max-w-[160px] mx-auto mt-10">
              <span className="text-sm">✦</span>
            </div>
          </Reveal>
        )}

        {data.story && (
          <>
            <SectionHeading eyebrow="How it began" title="Our Story" />
            <Reveal delay={0.15}>
              <p className="text-cream/70 leading-loose text-center text-base sm:text-lg whitespace-pre-line">
                {data.story}
              </p>
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
}
