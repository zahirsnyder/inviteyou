import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export default async function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="bg-night text-cream min-h-screen">
      <header className="border-b border-gold/10">
        <nav className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl tracking-wide">
            Invite<span className="text-gold">You</span>
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/templates" className="text-cream/70 hover:text-gold transition-colors">
              Templates
            </Link>
            {user ? (
              <Link
                href="/dashboard"
                className="rounded-full border border-gold/50 px-5 py-2 text-gold hover:bg-gold hover:text-night transition-all"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-cream/70 hover:text-gold transition-colors">
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="rounded-full border border-gold/50 px-5 py-2 text-gold hover:bg-gold hover:text-night transition-all"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-16">{children}</main>
    </div>
  );
}
