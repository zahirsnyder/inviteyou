import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getOwnedProject } from "@/lib/projects";
import { appUrl } from "@/lib/constants";
import { ProjectNav } from "@/components/dashboard/ProjectNav";
import { PublishToggle } from "@/components/dashboard/PublishToggle";
import { CopyLinkButton } from "@/components/dashboard/CopyLinkButton";

export const metadata = { title: "Project Overview" };

const dateFmt = new Intl.DateTimeFormat("en-MY", { dateStyle: "long" });

export default async function ProjectOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getOwnedProject(id);

  const [rsvpGroups, wishCount, visitCount, qrScanCount] = await Promise.all([
    prisma.rsvp.groupBy({
      by: ["attendance"],
      where: { projectId: id },
      _count: true,
      _sum: { paxCount: true },
    }),
    prisma.guestWish.count({ where: { projectId: id } }),
    prisma.analyticsEvent.count({ where: { projectId: id, eventType: "VISIT" } }),
    prisma.analyticsEvent.count({ where: { projectId: id, eventType: "QR_SCAN" } }),
  ]);

  const attending = rsvpGroups.find((g) => g.attendance === "ATTENDING");
  const notAttending = rsvpGroups.find((g) => g.attendance === "NOT_ATTENDING");
  const maybe = rsvpGroups.find((g) => g.attendance === "MAYBE");
  const totalRsvp = rsvpGroups.reduce((sum, g) => sum + g._count, 0);

  const stats = [
    { label: "Total Visits", value: visitCount },
    { label: "QR Scans", value: qrScanCount },
    { label: "RSVPs Received", value: totalRsvp },
    { label: "Attending", value: attending?._count ?? 0, sub: `${attending?._sum.paxCount ?? 0} pax` },
    { label: "Not Attending", value: notAttending?._count ?? 0 },
    { label: "Maybe", value: maybe?._count ?? 0 },
    { label: "Guestbook Wishes", value: wishCount },
  ];

  const inviteUrl = appUrl(`/invite/${project.slug}`);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-4xl">
            {project.groomName} &amp; {project.brideName}
          </h1>
          <p className="text-ink/50 text-sm mt-1">{dateFmt.format(project.weddingDate)}</p>
        </div>
        <PublishToggle projectId={project.id} isPublished={project.isPublished} />
      </div>

      <ProjectNav projectId={project.id} />

      <div
        className={`rounded-2xl border p-6 mb-8 flex flex-wrap items-center justify-between gap-4 ${
          project.isPublished
            ? "border-emerald-200 bg-emerald-50"
            : "border-amber-200 bg-amber-50"
        }`}
      >
        <div>
          <p className="text-sm font-medium">
            {project.isPublished ? "Your invitation is live" : "Your invitation is a draft"}
          </p>
          <p className="text-sm text-ink/50 mt-0.5 break-all">{inviteUrl}</p>
        </div>
        <div className="flex gap-3">
          <CopyLinkButton url={inviteUrl} />
          <Link
            href={`/invite/${project.slug}`}
            target="_blank"
            className={`rounded-full px-5 py-2 text-sm border transition-colors ${
              project.isPublished
                ? "border-emerald-300 hover:bg-emerald-100"
                : "border-amber-300 hover:bg-amber-100"
            }`}
          >
            {project.isPublished ? "View Live" : "Preview"}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-ink/10 bg-white p-6">
            <p className="text-3xl font-serif">{stat.value}</p>
            <p className="text-xs uppercase tracking-widest text-ink/40 mt-2">{stat.label}</p>
            {stat.sub && <p className="text-xs text-gold-dark mt-1">{stat.sub}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
