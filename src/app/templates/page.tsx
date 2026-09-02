import type { Metadata } from "next";
import { listTemplates } from "@/lib/templates";
import { TemplateCard } from "@/components/templates/TemplateCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Templates",
  description:
    "Browse InviteYou wedding invitation templates. Pick one, then fill in your names, story, events, and photos.",
};

export default async function TemplatesPage() {
  const templates = await listTemplates();

  return (
    <div>
      <div className="text-center mb-14">
        <p className="text-gold uppercase tracking-[0.3em] text-xs mb-4">Choose a design</p>
        <h1 className="font-serif text-4xl sm:text-5xl">Wedding invitation templates</h1>
        <p className="mt-5 text-cream/60 max-w-2xl mx-auto leading-relaxed">
          Pick the template you love. Unlock it, then a guided flow walks you
          through filling in every part — names, date, your story, the schedule,
          the gallery, and gift details.
        </p>
      </div>

      {templates.length === 0 ? (
        <p className="text-center text-cream/50">No templates available yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}
    </div>
  );
}
