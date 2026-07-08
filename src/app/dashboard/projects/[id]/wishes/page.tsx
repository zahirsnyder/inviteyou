import { prisma } from "@/lib/prisma";
import { getOwnedProject } from "@/lib/projects";
import { ProjectNav } from "@/components/dashboard/ProjectNav";
import { WishVisibilityToggle } from "@/components/dashboard/WishVisibilityToggle";

export const metadata = { title: "Wishes" };

const dateFmt = new Intl.DateTimeFormat("en-MY", { dateStyle: "medium" });

export default async function WishesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getOwnedProject(id);
  const wishes = await prisma.guestWish.findMany({
    where: { projectId: id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-serif text-4xl mb-6">Guestbook Wishes</h1>
      <ProjectNav projectId={project.id} />

      {wishes.length === 0 ? (
        <p className="text-ink/50 text-sm rounded-xl border border-dashed border-ink/20 p-10 text-center">
          No wishes yet — messages from your guests will appear here.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {wishes.map((wish) => (
            <div
              key={wish.id}
              className={`rounded-xl border bg-white p-5 ${
                wish.isVisible ? "border-ink/10" : "border-amber-200 bg-amber-50/50 opacity-70"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-serif text-lg">{wish.name}</p>
                <span className="text-xs text-ink/40 whitespace-nowrap">
                  {dateFmt.format(wish.createdAt)}
                </span>
              </div>
              <p className="text-sm text-ink/70 mt-2 leading-relaxed">{wish.message}</p>
              <div className="mt-4">
                <WishVisibilityToggle
                  projectId={project.id}
                  wishId={wish.id}
                  isVisible={wish.isVisible}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
