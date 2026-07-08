import Link from "next/link";

export default function InvitationNotFound() {
  return (
    <div className="min-h-screen bg-night text-cream flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-gold uppercase tracking-[0.35em] text-xs mb-6">InviteYou</p>
        <h1 className="font-serif text-4xl mb-4">Invitation not found</h1>
        <p className="text-cream/60 text-sm leading-relaxed mb-10">
          This invitation doesn&apos;t exist or hasn&apos;t been published yet. Please check the
          link with the couple.
        </p>
        <Link
          href="/"
          className="inline-block rounded-full border border-gold/50 px-8 py-3 text-gold text-xs uppercase tracking-[0.2em] hover:bg-gold hover:text-night transition-colors"
        >
          Go to InviteYou
        </Link>
      </div>
    </div>
  );
}
