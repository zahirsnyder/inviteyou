import { NewProjectForm } from "@/components/dashboard/NewProjectForm";

export const metadata = { title: "New Invitation" };

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="font-serif text-4xl mb-2">Create a New Invitation</h1>
      <p className="text-ink/50 text-sm mb-10">
        Start with the essentials — you can add your story, photos, and events after.
      </p>
      <NewProjectForm />
    </div>
  );
}
