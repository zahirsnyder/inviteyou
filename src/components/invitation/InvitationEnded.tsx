import Link from "next/link";

/** Shown to guests when a published invitation has passed its expiry date. */
export function InvitationEnded({
  groomName,
  brideName,
}: {
  groomName: string;
  brideName: string;
}) {
  return (
    <div className="min-h-screen bg-night text-cream flex items-center justify-center px-6 text-center">
      <div className="max-w-md">
        <p className="text-gold uppercase tracking-[0.35em] text-xs mb-6">With love and thanks</p>
        <h1 className="font-serif text-4xl sm:text-5xl leading-tight">
          {groomName} &amp; {brideName}
        </h1>
        <p className="mt-6 text-cream/60 leading-relaxed">
          This invitation has now closed. Thank you to everyone who celebrated with us.
        </p>
        <Link
          href="/"
          className="inline-block mt-10 rounded-full border border-gold/40 px-8 py-3 text-gold hover:bg-gold hover:text-night transition-all"
        >
          Create your own with InviteYou
        </Link>
      </div>
    </div>
  );
}
