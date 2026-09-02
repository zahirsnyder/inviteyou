import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getTemplate, getUnusedCredit, listStartableTemplates } from "@/lib/templates";
import { InvitationWizard } from "@/components/dashboard/InvitationWizard";
import { TemplatePicker } from "@/components/dashboard/TemplatePicker";

export const metadata = { title: "New Invitation" };

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard/projects/new");

  const { template: templateSlug } = await searchParams;

  if (templateSlug) {
    const template = await getTemplate(templateSlug);
    if (!template || !template.isListed) redirect("/templates");
    const credit = await getUnusedCredit(user.id, template.id);
    if (!credit) redirect(`/templates/${template.slug}`);
    return (
      <div>
        <InvitationWizard templateSlug={template.slug} templateName={template.name} />
      </div>
    );
  }

  const startable = await listStartableTemplates(user.id);
  return (
    <div>
      <h1 className="font-serif text-4xl mb-2">Create a New Invitation</h1>
      <TemplatePicker templates={startable} />
    </div>
  );
}
