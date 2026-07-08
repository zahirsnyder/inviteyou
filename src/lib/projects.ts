import "server-only";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/** Loads a project for dashboard pages; redirects to login or 404s if not owned. */
export async function getOwnedProject(projectId: string) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const project = await prisma.weddingProject.findFirst({
    where: { id: projectId, userId: user.id },
  });
  if (!project) notFound();
  return project;
}
