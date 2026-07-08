"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import type { InvitationData } from "../types";
import { Reveal, SectionHeading } from "../shared";

export function GiftSection({ data }: { data: InvitationData }) {
  const [copied, setCopied] = useState(false);
  if (!data.giftDetails && !data.giftQrUrl) return null;

  return (
    <section className="py-28 px-6">
      <div className="mx-auto max-w-xl text-center">
        <SectionHeading eyebrow="With love" title="Wedding Gift" />
        <Reveal>
          <div className="rounded-3xl border border-gold/20 bg-white/[0.04] backdrop-blur-sm p-10">
            <p className="text-cream/60 text-sm leading-relaxed mb-8">
              Your presence is the greatest gift. Should you wish to bless us further, you may
              do so below.
            </p>
            {data.giftQrUrl && (
              <img
                src={data.giftQrUrl}
                alt="Gift QR code"
                className="mx-auto w-48 rounded-2xl mb-8 bg-white p-3"
              />
            )}
            {data.giftDetails && (
              <>
                <p className="font-serif text-lg text-gold-light">{data.giftDetails}</p>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(data.giftDetails ?? "");
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="mt-6 rounded-full border border-gold/50 px-8 py-3 text-gold text-xs uppercase tracking-[0.2em] hover:bg-gold hover:text-night transition-colors"
                >
                  {copied ? "Copied ✦" : "Copy Details"}
                </button>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
