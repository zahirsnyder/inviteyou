import Link from "next/link";
import Image from "next/image";
import { formatPrice, type TemplateView } from "@/lib/templates";

export function TemplateCard({ template }: { template: TemplateView }) {
  const price = formatPrice(template.priceCents, template.currency);

  return (
    <Link
      href={`/templates/${template.slug}`}
      className="group rounded-2xl border border-gold/15 bg-white/[0.03] overflow-hidden hover:border-gold/40 transition-colors"
    >
      <div className="relative aspect-[4/3] bg-night-soft">
        {template.previewImageUrl && (
          <Image
            src={template.previewImageUrl}
            alt={template.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="rounded-full bg-night/80 backdrop-blur-sm text-gold text-xs px-3 py-1 tracking-wide">
            {price}
          </span>
          {template.isPremium && (
            <span className="rounded-full bg-gold text-night text-xs px-3 py-1 tracking-wide">
              Premium
            </span>
          )}
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-serif text-2xl text-cream group-hover:text-gold-light transition-colors">
          {template.name}
        </h3>
        <p className="text-cream/55 text-sm mt-2 leading-relaxed">
          {template.tagline ?? template.description}
        </p>
        <span className="inline-block mt-4 text-xs uppercase tracking-[0.2em] text-gold">
          View template →
        </span>
      </div>
    </Link>
  );
}
