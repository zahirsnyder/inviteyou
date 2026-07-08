/* eslint-disable @next/next/no-img-element */
import QRCode from "qrcode";
import { getOwnedProject } from "@/lib/projects";
import { appUrl } from "@/lib/constants";
import { ProjectNav } from "@/components/dashboard/ProjectNav";
import { CopyLinkButton } from "@/components/dashboard/CopyLinkButton";

export const metadata = { title: "QR Code" };

export default async function QrPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getOwnedProject(id);

  // ?src=qr lets the invitation page count these visits as QR scans.
  const inviteUrl = appUrl(`/invite/${project.slug}?src=qr`);
  const qrDataUrl = await QRCode.toDataURL(inviteUrl, {
    width: 640,
    margin: 2,
    color: { dark: "#12100e", light: "#faf8f4" },
  });

  return (
    <div>
      <h1 className="font-serif text-4xl mb-6">QR Code</h1>
      <ProjectNav projectId={project.id} />

      <div className="grid sm:grid-cols-2 gap-10 items-start max-w-3xl">
        <div className="rounded-2xl border border-ink/10 bg-white p-8 flex items-center justify-center">
          <img src={qrDataUrl} alt="Invitation QR code" className="w-full max-w-xs rounded-lg" />
        </div>
        <div>
          <h2 className="font-serif text-2xl mb-3">Share your invitation</h2>
          <p className="text-ink/60 text-sm leading-relaxed mb-6">
            Print this QR code on your physical cards, display it at your venue, or share it
            digitally. When guests scan it, their visit is tracked as a QR scan in your
            analytics.
          </p>
          <p className="text-xs uppercase tracking-widest text-ink/40 mb-2">Invitation link</p>
          <p className="text-sm text-ink/70 break-all mb-6">{inviteUrl}</p>
          <div className="flex flex-wrap gap-3">
            <CopyLinkButton url={inviteUrl} />
            <a
              href={qrDataUrl}
              download={`inviteyou-qr-${project.slug}.png`}
              className="rounded-full bg-ink text-cream px-6 py-2 text-sm font-medium hover:bg-ink/80 transition-colors"
            >
              Download PNG
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
