"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Overview", segment: "" },
  { label: "Editor", segment: "/editor" },
  { label: "Gallery", segment: "/gallery" },
  { label: "RSVP", segment: "/rsvp" },
  { label: "Wishes", segment: "/wishes" },
  { label: "QR Code", segment: "/qr" },
];

export function ProjectNav({ projectId }: { projectId: string }) {
  const pathname = usePathname();
  const base = `/dashboard/projects/${projectId}`;

  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-ink/10 mb-8 -mx-1 px-1">
      {tabs.map((tab) => {
        const href = `${base}${tab.segment}`;
        const active = pathname === href;
        return (
          <Link
            key={tab.label}
            href={href}
            className={`whitespace-nowrap px-4 py-3 text-sm border-b-2 -mb-px transition-colors ${
              active
                ? "border-gold-dark text-ink font-medium"
                : "border-transparent text-ink/50 hover:text-ink"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
