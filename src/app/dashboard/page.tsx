import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Dashboard" };

const dateFmt = new Intl.DateTimeFormat("en-MY", { dateStyle: "long" });

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const projects = await prisma.weddingProject.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { rsvps: true, wishes: true, analytics: true } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-4xl">Your Weddings</h1>
          <p className="text-ink/50 mt-1 text-sm">Manage your invitation projects</p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="rounded-full bg-ink text-cream px-6 py-3 text-sm font-medium hover:bg-ink/80 transition-colors"
        >
          + New Invitation
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink/20 bg-white p-16 text-center">
          <p className="font-serif text-3xl mb-3">No invitations yet</p>
          <p className="text-ink/50 mb-8 max-w-md mx-auto">
            Create your first wedding invitation — add your names, date, and story, then share
            a beautiful animated page with your guests.
          </p>
          <Link
            href="/dashboard/projects/new"
            className="inline-block rounded-full bg-gold text-night px-8 py-3 font-medium hover:bg-gold-light transition-colors"
          >
            Create Your Invitation
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              className="group rounded-2xl border border-ink/10 bg-white p-8 hover:border-gold-dark/50 hover:shadow-lg hover:shadow-gold/5 transition-all"
            >
              <div className="flex items-start justify-between">
                <h2 className="font-serif text-2xl group-hover:text-gold-dark transition-colors">
                  {project.groomName} &amp; {project.brideName}
                </h2>
                <span
                  className={`text-xs rounded-full px-3 py-1 ${
                    project.isPublished
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {project.isPublished ? "Published" : "Draft"}
                </span>
              </div>
              <p className="text-ink/50 text-sm mt-2">{dateFmt.format(project.weddingDate)}</p>
              <p className="text-ink/40 text-xs mt-1">/invite/{project.slug}</p>
              <div className="flex gap-6 mt-6 pt-6 border-t border-ink/5 text-sm">
                <span>
                  <strong className="font-medium">{project._count.rsvps}</strong>{" "}
                  <span className="text-ink/50">RSVPs</span>
                </span>
                <span>
                  <strong className="font-medium">{project._count.wishes}</strong>{" "}
                  <span className="text-ink/50">Wishes</span>
                </span>
                <span>
                  <strong className="font-medium">{project._count.analytics}</strong>{" "}
                  <span className="text-ink/50">Visits</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
