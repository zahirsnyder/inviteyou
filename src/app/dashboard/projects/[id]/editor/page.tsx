import { prisma } from "@/lib/prisma";
import { getOwnedProject } from "@/lib/projects";
import { getFeatures } from "@/lib/templateFeatures";
import { ProjectNav } from "@/components/dashboard/ProjectNav";
import { EditProjectForm } from "@/components/dashboard/EditProjectForm";
import { EventManager } from "@/components/dashboard/EventManager";
import { DeleteProjectButton } from "@/components/dashboard/DeleteProjectButton";

export const metadata = { title: "Editor" };

const dateFmt = new Intl.DateTimeFormat("en-MY", { dateStyle: "long" });

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getOwnedProject(id);
  const [events, theme] = await Promise.all([
    prisma.weddingEvent.findMany({ where: { projectId: id }, orderBy: { order: "asc" } }),
    project.themeId
      ? prisma.theme.findUnique({ where: { id: project.themeId }, select: { slug: true } })
      : null,
  ]);
  const features = getFeatures(theme?.slug ?? "");

  return (
    <div>
      <h1 className="font-serif text-4xl mb-6">Editor</h1>
      <ProjectNav projectId={project.id} />

      <div className="grid lg:grid-cols-2 gap-10">
        <section>
          <h2 className="font-serif text-2xl mb-5">Wedding Details</h2>
          <EditProjectForm
            locked={project.lockedAt !== null}
            showCover={features.cover}
            project={{
              id: project.id,
              groomName: project.groomName,
              brideName: project.brideName,
              weddingDate: project.weddingDate.toISOString().slice(0, 10),
              title: project.title ?? "",
              quote: project.quote ?? "",
              story: project.story ?? "",
              coverImageUrl: project.coverImageUrl ?? "",
              musicUrl: project.musicUrl ?? "",
              giftDetails: project.giftDetails ?? "",
              giftQrUrl: project.giftQrUrl ?? "",
              showGift: project.showGift,
              showGiftQr: project.showGiftQr,
              contactName1: project.contactName1 ?? "",
              contactPhone1: project.contactPhone1 ?? "",
              contactName2: project.contactName2 ?? "",
              contactPhone2: project.contactPhone2 ?? "",
              showContact: project.showContact,
            }}
          />
        </section>

        <section>
          <h2 className="font-serif text-2xl mb-5">Events &amp; Schedule</h2>
          <EventManager
            projectId={project.id}
            events={events.map((e) => ({
              id: e.id,
              title: e.title,
              description: e.description,
              eventDate: dateFmt.format(e.eventDate),
              eventDateValue: e.eventDate.toISOString().slice(0, 10),
              startTime: e.startTime,
              endTime: e.endTime,
              venueName: e.venueName,
              address: e.address,
              mapUrl: e.mapUrl,
              wazeUrl: e.wazeUrl,
            }))}
          />
        </section>
      </div>

      <div className="mt-16 pt-8 border-t border-red-200">
        <h2 className="font-serif text-xl text-red-700 mb-3">Danger Zone</h2>
        <DeleteProjectButton projectId={project.id} />
      </div>
    </div>
  );
}
