"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import type { InvitationData } from "../types";

function waLink(phone: string) {
  const digits = phone.replace(/[^\d]/g, "");
  const intl = digits.startsWith("0") ? `6${digits}` : digits;
  return `https://wa.me/${intl}`;
}

/**
 * Shared "gift / money" + "contact" block. Every template can offer a payment QR
 * and/or bank-transfer details, and up to two contact people. The owner toggles
 * the QR and the contact block on or off; this component just renders whatever
 * `data` says is visible. Colours follow the active theme's CSS variables.
 */
export function GiftContact({
  data,
  variant = "panel",
}: {
  data: InvitationData;
  variant?: "panel" | "bare";
}) {
  const [copied, setCopied] = useState(false);

  const showGift =
    data.features.gift && data.showGift && !!(data.giftDetails || (data.showGiftQr && data.giftQrUrl));
  const showQr = data.showGiftQr && !!data.giftQrUrl;
  const showContacts = data.features.contact && data.contacts.length > 0;

  if (!showGift && !showContacts) return null;

  const card =
    variant === "bare"
      ? "space-y-6"
      : "rounded-3xl border border-gold/20 bg-cream/[0.04] backdrop-blur-sm p-8 sm:p-10 space-y-6";

  return (
    <div className="space-y-10">
      {showGift && (
        <div className={card}>
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-gold">A Gift for the Couple</p>
          <p className="text-sm text-cream/60 leading-relaxed">
            Your presence is the greatest gift. If you wish to bless us further, you may send a
            gift by QR or bank transfer.
          </p>

          {showQr && (
            <div className="flex flex-col items-center gap-3">
              <img
                src={data.giftQrUrl!}
                alt="Payment QR code"
                className="w-52 rounded-2xl bg-white p-3"
              />
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-cream/40">
                Scan with your banking app
              </p>
            </div>
          )}

          {data.giftDetails && (
            <div className="rounded-xl border border-cream/12 bg-night/40 p-5 text-center">
              <p className="whitespace-pre-line font-serif text-lg text-cream/90">{data.giftDetails}</p>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(data.giftDetails ?? "");
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  } catch {
                    /* clipboard blocked — ignore */
                  }
                }}
                className="mt-4 rounded-full border border-gold/50 px-7 py-2.5 text-[0.65rem] uppercase tracking-[0.2em] text-gold hover:bg-gold hover:text-[color:var(--inv-onaccent)] transition-colors"
              >
                {copied ? "Copied ✦" : "Copy Account Details"}
              </button>
            </div>
          )}
        </div>
      )}

      {showContacts && (
        <div className={card}>
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-gold">Contact Us</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {data.contacts.map((c, i) => (
              <div key={i} className="rounded-xl border border-cream/12 bg-night/40 p-5">
                <p className="font-serif text-lg text-cream/90">{c.name}</p>
                <p className="text-sm text-cream/50">{c.phone}</p>
                <div className="mt-3 flex gap-2">
                  <a
                    href={waLink(c.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded-lg border border-gold/40 py-2 text-center text-[0.65rem] uppercase tracking-[0.15em] text-gold hover:bg-gold hover:text-[color:var(--inv-onaccent)] transition-colors"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`tel:${c.phone.replace(/\s/g, "")}`}
                    className="flex-1 rounded-lg border border-cream/20 py-2 text-center text-[0.65rem] uppercase tracking-[0.15em] text-cream/70 hover:border-cream/50 transition-colors"
                  >
                    Call
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
