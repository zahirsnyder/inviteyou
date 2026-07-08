import { prisma } from "@/lib/prisma";
import { getOwnedProject } from "@/lib/projects";
import { ProjectNav } from "@/components/dashboard/ProjectNav";
import { GalleryManager } from "@/components/dashboard/GalleryManager";

export const metadata = { title: "Gallery" };

export default async function GalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getOwnedProject(id);
  const images = await prisma.galleryImage.findMany({
    where: { projectId: id },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <h1 className="font-serif text-4xl mb-6">Gallery</h1>
      <ProjectNav projectId={project.id} />
      <GalleryManager
        projectId={project.id}
        images={images.map((i) => ({ id: i.id, imageUrl: i.imageUrl, caption: i.caption }))}
      />
    </div>
  );
}
