import { prisma } from "@/lib/prisma";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Builds "groom-bride" slug, appending -2, -3… if already taken. */
export async function generateProjectSlug(groomName: string, brideName: string): Promise<string> {
  const base = slugify(`${groomName} ${brideName}`) || "wedding";
  let slug = base;
  let counter = 2;
  while (await prisma.weddingProject.findUnique({ where: { slug }, select: { id: true } })) {
    slug = `${base}-${counter++}`;
  }
  return slug;
}
