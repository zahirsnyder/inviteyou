import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-[#faf8f4] text-ink">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-ink/10">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-serif text-2xl">
              Invite<span className="text-gold-dark">You</span>
            </Link>
            <nav className="hidden sm:flex items-center gap-6 text-sm text-ink/60">
              <Link href="/dashboard" className="hover:text-ink transition-colors">
                Projects
              </Link>
              <Link href="/invite/amir-aisyah" className="hover:text-ink transition-colors">
                Demo Invitation
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm text-ink/50">{user.name ?? user.email}</span>
            <form action={logoutAction}>
              <button className="text-sm rounded-full border border-ink/15 px-4 py-1.5 hover:border-ink/40 transition-colors">
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
