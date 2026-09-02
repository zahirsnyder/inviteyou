import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, listStartableTemplates } from "@/lib/templates";
import { PurchaseStatusControl } from "@/components/dashboard/PurchaseStatusControl";

export const metadata = { title: "My Templates" };

const dateFmt = new Intl.DateTimeFormat("en-MY", { dateStyle: "medium" });

export default async function MyTemplatesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard/templates");

  const startable = await listStartableTemplates(user.id);
  const purchases =
    user.role === "ADMIN"
      ? await prisma.templatePurchase.findMany({
          orderBy: { createdAt: "desc" },
          include: {
            theme: { select: { name: true } },
            user: { select: { email: true } },
            project: { select: { slug: true } },
          },
        })
      : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-4xl">My Templates</h1>
          <p className="text-ink/50 mt-1 text-sm">
            Unused invitation credits — one credit builds one wedding
          </p>
        </div>
        <Link
          href="/templates"
          className="rounded-full bg-ink text-cream px-6 py-3 text-sm font-medium hover:bg-ink/80 transition-colors"
        >
          Browse templates
        </Link>
      </div>

      {startable.length === 0 ? (
        <p className="text-ink/50 text-sm rounded-2xl border border-dashed border-ink/20 bg-white p-10 text-center">
          No unused credits. <Link href="/templates" className="text-gold-dark underline">Browse templates</Link> to get one.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {startable.map((t) => (
            <div key={t.id} className="rounded-2xl border border-ink/10 bg-white p-6">
              <div className="flex items-start justify-between">
                <h2 className="font-serif text-2xl">{t.name}</h2>
                <span className="text-xs rounded-full bg-emerald-100 text-emerald-800 px-3 py-1">
                  {t.credits} credit{t.credits > 1 ? "s" : ""}
                </span>
              </div>
              <p className="text-ink/50 text-sm mt-2">{t.tagline ?? t.description}</p>
              <Link
                href={`/dashboard/projects/new?template=${t.slug}`}
                className="inline-block mt-5 rounded-full bg-gold text-night px-6 py-2.5 text-sm font-medium hover:bg-gold-light transition-colors"
              >
                Create invitation
              </Link>
            </div>
          ))}
        </div>
      )}

      {user.role === "ADMIN" && (
        <div className="mt-16">
          <h2 className="font-serif text-2xl mb-4">All purchases (admin)</h2>
          {purchases.length === 0 ? (
            <p className="text-ink/50 text-sm">No purchases yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white">
              <table className="w-full text-sm">
                <thead className="text-ink/50 text-xs uppercase tracking-wider">
                  <tr className="border-b border-ink/10">
                    <th className="text-left font-medium px-5 py-3">User</th>
                    <th className="text-left font-medium px-5 py-3">Template</th>
                    <th className="text-left font-medium px-5 py-3">Amount</th>
                    <th className="text-left font-medium px-5 py-3">Date</th>
                    <th className="text-left font-medium px-5 py-3">Used for</th>
                    <th className="text-left font-medium px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((p) => (
                    <tr key={p.id} className="border-b border-ink/5 last:border-0">
                      <td className="px-5 py-3">{p.user.email}</td>
                      <td className="px-5 py-3">{p.theme.name}</td>
                      <td className="px-5 py-3">{formatPrice(p.amountCents, p.currency)}</td>
                      <td className="px-5 py-3 text-ink/60">{dateFmt.format(p.createdAt)}</td>
                      <td className="px-5 py-3 text-ink/60">
                        {p.project ? `/invite/${p.project.slug}` : "— unused"}
                      </td>
                      <td className="px-5 py-3">
                        <PurchaseStatusControl purchaseId={p.id} status={p.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
