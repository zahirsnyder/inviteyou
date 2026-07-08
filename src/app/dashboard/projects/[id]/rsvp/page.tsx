import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getOwnedProject } from "@/lib/projects";
import { ProjectNav } from "@/components/dashboard/ProjectNav";

export const metadata = { title: "RSVP" };

const dateFmt = new Intl.DateTimeFormat("en-MY", { dateStyle: "medium", timeStyle: "short" });

const attendanceStyles: Record<string, string> = {
  ATTENDING: "bg-emerald-100 text-emerald-800",
  NOT_ATTENDING: "bg-red-100 text-red-700",
  MAYBE: "bg-amber-100 text-amber-800",
};

const attendanceLabels: Record<string, string> = {
  ATTENDING: "Attending",
  NOT_ATTENDING: "Not attending",
  MAYBE: "Maybe",
};

export default async function RsvpPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getOwnedProject(id);
  const rsvps = await prisma.rsvp.findMany({
    where: { projectId: id },
    orderBy: { createdAt: "desc" },
  });

  const totalPax = rsvps
    .filter((r) => r.attendance === "ATTENDING")
    .reduce((sum, r) => sum + r.paxCount, 0);

  return (
    <div>
      <h1 className="font-serif text-4xl mb-6">RSVP Responses</h1>
      <ProjectNav projectId={project.id} />

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <p className="text-sm text-ink/60">
          <strong className="font-medium text-ink">{rsvps.length}</strong> responses ·{" "}
          <strong className="font-medium text-ink">{totalPax}</strong> attending pax
        </p>
        {rsvps.length > 0 && (
          <Link
            href={`/dashboard/projects/${project.id}/rsvp/export`}
            className="rounded-full border border-ink/20 px-5 py-2 text-sm hover:border-ink/50 transition-colors"
          >
            Export CSV
          </Link>
        )}
      </div>

      {rsvps.length === 0 ? (
        <p className="text-ink/50 text-sm rounded-xl border border-dashed border-ink/20 p-10 text-center">
          No RSVPs yet — share your invitation link and responses will appear here.
        </p>
      ) : (
        <div className="rounded-2xl border border-ink/10 bg-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-left text-xs uppercase tracking-widest text-ink/40">
                <th className="px-5 py-4 font-medium">Guest</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium">Pax</th>
                <th className="px-5 py-4 font-medium">Meal</th>
                <th className="px-5 py-4 font-medium">Message</th>
                <th className="px-5 py-4 font-medium">Received</th>
              </tr>
            </thead>
            <tbody>
              {rsvps.map((rsvp) => (
                <tr key={rsvp.id} className="border-b border-ink/5 last:border-0">
                  <td className="px-5 py-4">
                    <p className="font-medium">{rsvp.name}</p>
                    {rsvp.phone && <p className="text-ink/50 text-xs mt-0.5">{rsvp.phone}</p>}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${attendanceStyles[rsvp.attendance] ?? ""}`}
                    >
                      {attendanceLabels[rsvp.attendance] ?? rsvp.attendance}
                    </span>
                  </td>
                  <td className="px-5 py-4">{rsvp.paxCount}</td>
                  <td className="px-5 py-4 text-ink/60">{rsvp.mealPreference ?? "—"}</td>
                  <td className="px-5 py-4 text-ink/60 max-w-xs">
                    {rsvp.message ? <span className="line-clamp-2">{rsvp.message}</span> : "—"}
                  </td>
                  <td className="px-5 py-4 text-ink/50 whitespace-nowrap">
                    {dateFmt.format(rsvp.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
