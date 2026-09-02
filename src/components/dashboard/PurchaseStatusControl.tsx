"use client";

import { useTransition } from "react";
import { setPurchaseStatusAction } from "@/app/actions/templates";

const STATUSES = ["PENDING", "PAID", "REFUNDED"] as const;

export function PurchaseStatusControl({
  purchaseId,
  status,
}: {
  purchaseId: string;
  status: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex gap-1.5">
      {STATUSES.map((s) => (
        <button
          key={s}
          disabled={pending || s === status}
          onClick={() => startTransition(() => setPurchaseStatusAction(purchaseId, s))}
          className={`text-xs rounded-full px-3 py-1 border transition-colors disabled:opacity-100 ${
            s === status
              ? "border-ink bg-ink text-cream"
              : "border-ink/20 text-ink/60 hover:border-ink/50 disabled:opacity-40"
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
