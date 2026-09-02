"use client";

import { useTransition } from "react";
import { claimTemplateAction } from "@/app/actions/templates";

/**
 * Buys one invitation credit for a template, then the action redirects into the
 * wizard. Payment is a future integration — for now the credit is granted
 * instantly. One credit = one wedding.
 */
export function ClaimTemplateButton({
  slug,
  priceLabel,
  compact = false,
}: {
  slug: string;
  priceLabel: string;
  compact?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const isFree = priceLabel === "Free";
  const label = pending
    ? "Unlocking…"
    : isFree
      ? "Use this template"
      : `Get this template · ${priceLabel}`;

  if (compact) {
    return (
      <button
        onClick={() => startTransition(() => claimTemplateAction(slug))}
        disabled={pending}
        className="underline text-gold hover:text-gold-light disabled:opacity-60"
      >
        {pending ? "Unlocking…" : isFree ? "add another" : `buy another · ${priceLabel}`}
      </button>
    );
  }

  return (
    <div>
      <button
        onClick={() => startTransition(() => claimTemplateAction(slug))}
        disabled={pending}
        className="rounded-full bg-gold text-night px-10 py-4 font-medium tracking-wide hover:bg-gold-light transition-colors disabled:opacity-60"
      >
        {label}
      </button>
      {!isFree && (
        <p className="mt-3 text-xs text-cream/40">
          No card required yet — access is granted instantly while checkout is
          being finalised.
        </p>
      )}
    </div>
  );
}
