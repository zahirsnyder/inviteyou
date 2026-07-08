"use client";

import Image from "next/image";
import type { InvitationData } from "../types";
import { Reveal } from "../shared";

export function ClosingSection({ data }: { data: InvitationData }) {
  return (
    <section className="relative py-40 px-6 overflow-hidden">
      {data.coverImageUrl && (
        <Image src={data.coverImageUrl} alt="" fill className="object-cover opacity-20" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-night via-night/70 to-night" />

      <Reveal className="relative z-10 text-center max-w-2xl mx-auto">
        <p className="uppercase tracking-[0.35em] text-gold text-[0.65rem] sm:text-xs mb-8">
          With gratitude
        </p>
        <p className="font-serif italic text-2xl sm:text-3xl text-cream/85 leading-relaxed mb-10">
          Thank you for being part of our journey. Your love, prayers, and presence mean
          everything to us.
        </p>
        <p className="font-signature text-5xl sm:text-6xl text-gold-light">
          {data.groomName} &amp; {data.brideName}
        </p>
        <div className="gold-divider max-w-[160px] mx-auto mt-12">
          <span className="text-sm">✦</span>
        </div>
        <p className="mt-10 text-cream/30 text-xs tracking-widest">
          Crafted with <span className="text-gold/60">InviteYou</span>
        </p>
      </Reveal>
    </section>
  );
}
