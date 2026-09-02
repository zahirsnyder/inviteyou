import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const project = await prisma.weddingProject.findFirst({
    where: { id, userId: user.id },
    select: { slug: true },
  });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const rsvps = await prisma.rsvp.findMany({
    where: { projectId: id },
    orderBy: { createdAt: "asc" },
  });

  const header = ["Name", "Phone", "Attendance", "Pax", "Message", "Received At"];
  const rows = rsvps.map((r) =>
    [
      r.name,
      r.phone ?? "",
      r.attendance,
      String(r.paxCount),
      r.message ?? "",
      r.createdAt.toISOString(),
    ]
      .map(csvEscape)
      .join(",")
  );
  const csv = [header.join(","), ...rows].join("\r\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="rsvp-${project.slug}.csv"`,
    },
  });
}
