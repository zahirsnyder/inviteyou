import Link from "next/link";
import Image from "next/image";
import { formatPrice, type TemplateView } from "@/lib/templates";

type StartableTemplate = TemplateView & { credits: number };

export function TemplatePicker({ templates }: { templates: StartableTemplate[] }) {
  if (templates.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink/20 bg-white p-16 text-center">
        <p className="font-serif text-3xl mb-3">No invitation credits yet</p>
        <p className="text-ink/50 mb-8 max-w-md mx-auto">
          Each invitation is built from a template you&apos;ve unlocked. One
          purchase covers one wedding. Browse the collection to get started.
        </p>
        <Link
          href="/templates"
          className="inline-block rounded-full bg-gold text-night px-8 py-3 font-medium hover:bg-gold-light transition-colors"
        >
          Browse templates
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="text-ink/50 text-sm mb-8">
        Pick a template you have a credit for. Need a different look?{" "}
        <Link href="/templates" className="text-gold-dark underline">
          Browse more templates
        </Link>
        .
      </p>
      <div className="grid sm:grid-cols-2 gap-6">
        {templates.map((t) => (
          <Link
            key={t.id}
            href={`/dashboard/projects/new?template=${t.slug}`}
            className="group rounded-2xl border border-ink/10 bg-white overflow-hidden hover:border-gold-dark/50 hover:shadow-lg hover:shadow-gold/5 transition-all"
          >
            <div className="relative aspect-[16/9] bg-ink/5">
              {t.previewImageUrl && (
                <Image
                  src={t.previewImageUrl}
                  alt={t.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
              )}
              <span className="absolute top-3 left-3 rounded-full bg-white/90 text-ink text-xs px-3 py-1">
                {t.credits} credit{t.credits > 1 ? "s" : ""} · {formatPrice(t.priceCents, t.currency)}
              </span>
            </div>
            <div className="p-6">
              <h3 className="font-serif text-2xl group-hover:text-gold-dark transition-colors">
                {t.name}
              </h3>
              <p className="text-ink/50 text-sm mt-2">{t.tagline ?? t.description}</p>
              <span className="inline-block mt-4 text-xs uppercase tracking-[0.2em] text-gold-dark">
                Start with this →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
