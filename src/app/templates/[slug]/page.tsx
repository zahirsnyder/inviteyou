import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { countUnusedCredits, formatPrice, getTemplate } from "@/lib/templates";
import { ClaimTemplateButton } from "@/components/templates/ClaimTemplateButton";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const template = await getTemplate(slug);
  if (!template) return { title: "Template" };
  return {
    title: template.name,
    description: template.description ?? template.tagline ?? undefined,
  };
}

export default async function TemplateDetailPage({ params }: Props) {
  const { slug } = await params;
  const template = await getTemplate(slug);
  if (!template || !template.isListed) notFound();

  const user = await getCurrentUser();
  const credits = user ? await countUnusedCredits(user.id, template.id) : 0;
  const priceLabel = formatPrice(template.priceCents, template.currency);
  const demoUrl = template.previewUrl ?? "/invite/zahir-nisa";

  const cfg = template.parsedConfig;
  const chips = [
    cfg.fontHeading && { label: "Heading", value: cfg.fontHeading },
    cfg.fontBody && { label: "Body", value: cfg.fontBody },
    cfg.animationStyle && { label: "Motion", value: cfg.animationStyle },
    cfg.background && { label: "Mood", value: cfg.background },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-start">
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-gold/15 bg-night-soft">
        {template.previewImageUrl && (
          <Image
            src={template.previewImageUrl}
            alt={template.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        )}
      </div>

      <div>
        <Link href="/templates" className="text-xs uppercase tracking-[0.2em] text-cream/40 hover:text-gold">
          ← All templates
        </Link>

        <div className="mt-4 flex items-center gap-3">
          <span className="rounded-full bg-white/[0.06] text-gold text-sm px-4 py-1.5">{priceLabel}</span>
          {template.isPremium && (
            <span className="rounded-full bg-gold text-night text-sm px-4 py-1.5">Premium</span>
          )}
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl mt-4">{template.name}</h1>
        {template.tagline && <p className="text-gold-light mt-3 text-lg">{template.tagline}</p>}
        {template.description && (
          <p className="text-cream/65 mt-5 leading-relaxed">{template.description}</p>
        )}

        {chips.length > 0 && (
          <dl className="mt-7 grid grid-cols-2 gap-3 max-w-md">
            {chips.map((chip) => (
              <div key={chip.label} className="rounded-xl border border-gold/10 bg-white/[0.03] px-4 py-3">
                <dt className="text-[0.65rem] uppercase tracking-[0.2em] text-cream/40">{chip.label}</dt>
                <dd className="text-sm text-cream/80 mt-1 capitalize">{chip.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <p className="mt-8 text-sm text-cream/45">
          {priceLabel === "Free" ? "Free" : `${priceLabel} per invitation.`} One
          purchase covers one wedding — names and date lock in once you publish.
        </p>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4">
          {!user ? (
            <Link
              href={`/login?next=${encodeURIComponent(`/templates/${template.slug}`)}`}
              className="rounded-full bg-gold text-night px-10 py-4 font-medium tracking-wide hover:bg-gold-light transition-colors"
            >
              Sign in to continue
            </Link>
          ) : credits > 0 ? (
            <Link
              href={`/dashboard/projects/new?template=${template.slug}`}
              className="rounded-full bg-gold text-night px-10 py-4 font-medium tracking-wide hover:bg-gold-light transition-colors"
            >
              Create your invitation
            </Link>
          ) : (
            <ClaimTemplateButton slug={template.slug} priceLabel={priceLabel} />
          )}

          <Link
            href={demoUrl}
            className="rounded-full border border-cream/25 px-10 py-4 text-cream/80 hover:border-gold hover:text-gold transition-all text-center"
          >
            View live demo
          </Link>
        </div>

        {credits > 0 && (
          <div className="mt-4 text-sm text-emerald-300/80">
            <p>
              ✓ You have {credits} unused invitation{credits > 1 ? "s" : ""} on this template.
            </p>
            <p className="mt-2 text-cream/45">
              Planning another wedding?{" "}
              <span className="inline-block align-middle">
                <ClaimTemplateButton slug={template.slug} priceLabel={priceLabel} compact />
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
