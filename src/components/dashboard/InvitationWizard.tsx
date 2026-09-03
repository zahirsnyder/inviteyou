"use client";

import { useActionState, useMemo, useState } from "react";
import {
  createProjectFromTemplateAction,
  type ActionState,
} from "@/app/actions/projects";
import type { CreateFromTemplateInput } from "@/lib/validations";
import { getFeatures } from "@/lib/templateFeatures";
import { QrImageInput } from "./QrImageInput";

const inputClass =
  "w-full rounded-lg bg-white border border-ink/15 px-4 py-3 focus:border-gold-dark focus:outline-none transition-colors";
const labelClass = "block text-xs uppercase tracking-widest text-ink/50 mb-2";

type EventRow = {
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  venueName: string;
  address: string;
  mapUrl: string;
  wazeUrl: string;
};
type GalleryRow = { imageUrl: string; caption: string };

const emptyEvent = (): EventRow => ({
  title: "",
  description: "",
  eventDate: "",
  startTime: "",
  endTime: "",
  venueName: "",
  address: "",
  mapUrl: "",
  wazeUrl: "",
});
const emptyGallery = (): GalleryRow => ({ imageUrl: "", caption: "" });

type StepKey = "couple" | "story" | "events" | "gallery" | "gift" | "publish";
const STEP_LABEL: Record<StepKey, string> = {
  couple: "Couple & date",
  story: "Your story",
  events: "Events",
  gallery: "Gallery",
  gift: "Gifts & contact",
  publish: "Review & publish",
};

export function InvitationWizard({
  templateSlug,
  templateName,
}: {
  templateSlug: string;
  templateName: string;
}) {
  const features = useMemo(() => getFeatures(templateSlug), [templateSlug]);
  const steps = useMemo<StepKey[]>(() => {
    const s: StepKey[] = ["couple"];
    if (features.story) s.push("story");
    if (features.events) s.push("events");
    if (features.gallery) s.push("gallery");
    s.push("gift", "publish");
    return s;
  }, [features]);

  const [stepIdx, setStepIdx] = useState(0);
  const stepKey = steps[stepIdx];

  const [form, setForm] = useState({
    groomName: "",
    brideName: "",
    weddingDate: "",
    title: "",
    quote: "",
    story: "",
    coverImageUrl: "",
    musicUrl: "",
    giftDetails: "",
    giftQrUrl: "",
    showGiftQr: true,
    showGift: true,
    contactName1: "",
    contactPhone1: "",
    contactName2: "",
    contactPhone2: "",
    showContact: true,
    publish: true,
  });
  const [events, setEvents] = useState<EventRow[]>([emptyEvent()]);
  const [gallery, setGallery] = useState<GalleryRow[]>([emptyGallery()]);

  const [state, formAction, pending] = useActionState<ActionState, CreateFromTemplateInput>(
    createProjectFromTemplateAction,
    {},
  );

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const toggle = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.checked }));

  const step0Valid =
    form.groomName.trim() && form.brideName.trim() && form.weddingDate.trim();

  const payload = useMemo<CreateFromTemplateInput>(() => {
    const cleanEvents = features.events
      ? events
          .filter((ev) => ev.title.trim() || ev.venueName.trim() || ev.address.trim())
          .map((ev) => ({
            title: ev.title.trim(),
            description: ev.description.trim() || undefined,
            eventDate: ev.eventDate,
            startTime: ev.startTime.trim() || undefined,
            endTime: ev.endTime.trim() || undefined,
            venueName: ev.venueName.trim(),
            address: ev.address.trim(),
            mapUrl: ev.mapUrl.trim() || "",
            wazeUrl: ev.wazeUrl.trim() || "",
          }))
      : [];
    const cleanGallery = features.gallery
      ? gallery
          .filter((g) => g.imageUrl.trim())
          .map((g) => ({ imageUrl: g.imageUrl.trim(), caption: g.caption.trim() || undefined }))
      : [];

    return {
      templateSlug,
      groomName: form.groomName.trim(),
      brideName: form.brideName.trim(),
      weddingDate: form.weddingDate,
      title: form.title.trim() || undefined,
      quote: form.quote.trim() || undefined,
      story: features.story ? form.story.trim() || undefined : undefined,
      coverImageUrl: features.cover ? form.coverImageUrl.trim() || "" : "",
      musicUrl: features.music ? form.musicUrl.trim() || "" : "",
      giftQrUrl: form.giftQrUrl.trim() || "",
      giftDetails: form.giftDetails.trim() || undefined,
      showGift: form.showGift,
      showGiftQr: form.showGiftQr,
      contactName1: form.contactName1.trim() || undefined,
      contactPhone1: form.contactPhone1.trim() || undefined,
      contactName2: form.contactName2.trim() || undefined,
      contactPhone2: form.contactPhone2.trim() || undefined,
      showContact: form.showContact,
      events: cleanEvents,
      gallery: cleanGallery,
      publish: form.publish,
    };
  }, [templateSlug, form, events, gallery, features]);

  const updateEvent = (i: number, key: keyof EventRow, value: string) =>
    setEvents((rows) => rows.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)));
  const updateGallery = (i: number, key: keyof GalleryRow, value: string) =>
    setGallery((rows) => rows.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)));

  const isLast = stepIdx === steps.length - 1;

  return (
    <div className="max-w-2xl">
      <p className="text-xs uppercase tracking-widest text-ink/40">Template · {templateName}</p>
      <h1 className="font-serif text-4xl mt-1 mb-6">Fill in your invitation</h1>

      {/* Stepper */}
      <ol className="flex flex-wrap gap-x-5 gap-y-2 mb-10 text-sm">
        {steps.map((key, i) => (
          <li
            key={key}
            className={`flex items-center gap-2 ${
              i === stepIdx ? "text-ink" : i < stepIdx ? "text-gold-dark" : "text-ink/35"
            }`}
          >
            <span
              className={`h-6 w-6 rounded-full grid place-items-center text-xs border ${
                i === stepIdx
                  ? "border-ink bg-ink text-cream"
                  : i < stepIdx
                    ? "border-gold-dark bg-gold-dark text-cream"
                    : "border-ink/25"
              }`}
            >
              {i + 1}
            </span>
            {STEP_LABEL[key]}
          </li>
        ))}
      </ol>

      <div className="space-y-6">
        {stepKey === "couple" && (
          <>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Groom&apos;s name</label>
                <input className={inputClass} value={form.groomName} onChange={set("groomName")} placeholder="Zahir" />
              </div>
              <div>
                <label className={labelClass}>Bride&apos;s name</label>
                <input className={inputClass} value={form.brideName} onChange={set("brideName")} placeholder="Nisa" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Wedding date</label>
              <input type="date" className={inputClass} value={form.weddingDate} onChange={set("weddingDate")} />
            </div>
            <div>
              <label className={labelClass}>
                Invitation title <span className="text-ink/30 normal-case">(optional)</span>
              </label>
              <input className={inputClass} value={form.title} onChange={set("title")} placeholder="The Wedding of Zahir & Nisa" />
            </div>
            <div>
              <label className={labelClass}>
                Opening quote <span className="text-ink/30 normal-case">(optional)</span>
              </label>
              <textarea rows={3} className={inputClass} value={form.quote} onChange={set("quote")} placeholder="With hearts full of gratitude, we invite you to celebrate with us." />
            </div>
          </>
        )}

        {stepKey === "story" && (
          <>
            <div>
              <label className={labelClass}>
                Your story <span className="text-ink/30 normal-case">(optional)</span>
              </label>
              <textarea rows={6} className={inputClass} value={form.story} onChange={set("story")} placeholder="How you met, the proposal, the families…" />
            </div>
            {features.cover && (
              <div>
                <label className={labelClass}>
                  Cover image URL <span className="text-ink/30 normal-case">(optional)</span>
                </label>
                <input type="url" className={inputClass} value={form.coverImageUrl} onChange={set("coverImageUrl")} placeholder="https://…/cover.jpg" />
              </div>
            )}
            {features.music && (
              <div>
                <label className={labelClass}>
                  Background music URL <span className="text-ink/30 normal-case">(optional)</span>
                </label>
                <input type="url" className={inputClass} value={form.musicUrl} onChange={set("musicUrl")} placeholder="https://…/song.mp3" />
              </div>
            )}
          </>
        )}

        {stepKey === "events" && (
          <div className="space-y-6">
            <p className="text-sm text-ink/50">
              Add each event — akad nikah, reception, dinner. Leave a card blank to skip it.
            </p>
            {events.map((ev, i) => (
              <div key={i} className="rounded-xl border border-ink/10 bg-white p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-ink/40">Event {i + 1}</span>
                  {events.length > 1 && (
                    <button type="button" onClick={() => setEvents((r) => r.filter((_, idx) => idx !== i))} className="text-xs text-red-500 hover:text-red-700">
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input className={inputClass} placeholder="Title (e.g. Wedding Reception)" value={ev.title} onChange={(e) => updateEvent(i, "title", e.target.value)} />
                  <input type="date" className={inputClass} value={ev.eventDate} onChange={(e) => updateEvent(i, "eventDate", e.target.value)} />
                  <input className={inputClass} placeholder="Start time (11:00 AM)" value={ev.startTime} onChange={(e) => updateEvent(i, "startTime", e.target.value)} />
                  <input className={inputClass} placeholder="End time (4:00 PM)" value={ev.endTime} onChange={(e) => updateEvent(i, "endTime", e.target.value)} />
                  <input className={inputClass} placeholder="Venue name" value={ev.venueName} onChange={(e) => updateEvent(i, "venueName", e.target.value)} />
                  <input type="url" className={inputClass} placeholder="Google Maps URL (optional)" value={ev.mapUrl} onChange={(e) => updateEvent(i, "mapUrl", e.target.value)} />
                  <input type="url" className={inputClass} placeholder="Waze URL (optional)" value={ev.wazeUrl} onChange={(e) => updateEvent(i, "wazeUrl", e.target.value)} />
                </div>
                <input className={inputClass} placeholder="Full address" value={ev.address} onChange={(e) => updateEvent(i, "address", e.target.value)} />
                <input className={inputClass} placeholder="Short description (optional)" value={ev.description} onChange={(e) => updateEvent(i, "description", e.target.value)} />
              </div>
            ))}
            <button type="button" onClick={() => setEvents((r) => [...r, emptyEvent()])} className="text-sm rounded-full border border-ink/20 px-5 py-2 hover:border-ink/50 transition-colors">
              + Add another event
            </button>
          </div>
        )}

        {stepKey === "gallery" && (
          <div className="space-y-6">
            <p className="text-sm text-ink/50">
              Paste direct image links for your gallery. Rows without a link are ignored.
            </p>
            {gallery.map((g, i) => (
              <div key={i} className="rounded-xl border border-ink/10 bg-white p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-ink/40">Photo {i + 1}</span>
                  {gallery.length > 1 && (
                    <button type="button" onClick={() => setGallery((r) => r.filter((_, idx) => idx !== i))} className="text-xs text-red-500 hover:text-red-700">
                      Remove
                    </button>
                  )}
                </div>
                <input type="url" className={inputClass} placeholder="https://…/photo.jpg" value={g.imageUrl} onChange={(e) => updateGallery(i, "imageUrl", e.target.value)} />
                <input className={inputClass} placeholder="Caption (optional)" value={g.caption} onChange={(e) => updateGallery(i, "caption", e.target.value)} />
              </div>
            ))}
            <button type="button" onClick={() => setGallery((r) => [...r, emptyGallery()])} className="text-sm rounded-full border border-ink/20 px-5 py-2 hover:border-ink/50 transition-colors">
              + Add another photo
            </button>
          </div>
        )}

        {stepKey === "gift" && (
          <div className="space-y-8">
            {/* Gift / money */}
            <div className="rounded-xl border border-ink/10 bg-white p-5 space-y-4">
              <label className="flex items-center gap-3 text-sm font-medium">
                <input type="checkbox" checked={form.showGift} onChange={toggle("showGift")} className="h-4 w-4 accent-gold-dark" />
                Show a gift / money section
              </label>
              {form.showGift && (
                <>
                  <div>
                    <label className={labelClass}>
                      Bank / account details <span className="text-ink/30 normal-case">(shown as text, with a copy button)</span>
                    </label>
                    <textarea rows={3} className={inputClass} value={form.giftDetails} onChange={set("giftDetails")} placeholder="Maybank · 1234 5678 9012 · Zahir bin Zakariah" />
                  </div>
                  <div>
                    <span className={labelClass}>
                      Payment QR image <span className="text-ink/30 normal-case">(DuitNow / bank QR — upload &amp; crop, optional)</span>
                    </span>
                    <QrImageInput value={form.giftQrUrl} onChange={(v) => setForm((f) => ({ ...f, giftQrUrl: v }))} />
                  </div>
                  <label className="flex items-center gap-3 text-sm">
                    <input type="checkbox" checked={form.showGiftQr} onChange={toggle("showGiftQr")} disabled={!form.giftQrUrl.trim()} className="h-4 w-4 accent-gold-dark disabled:opacity-40" />
                    Show the payment QR on the invitation
                  </label>
                </>
              )}
            </div>

            {/* Contact */}
            <div className="rounded-xl border border-ink/10 bg-white p-5 space-y-4">
              <label className="flex items-center gap-3 text-sm font-medium">
                <input type="checkbox" checked={form.showContact} onChange={toggle("showContact")} className="h-4 w-4 accent-gold-dark" />
                Show a contact section (phone numbers)
              </label>
              {form.showContact && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <input className={inputClass} placeholder="Contact 1 name (e.g. Zahir)" value={form.contactName1} onChange={set("contactName1")} />
                  <input className={inputClass} placeholder="Contact 1 phone" value={form.contactPhone1} onChange={set("contactPhone1")} />
                  <input className={inputClass} placeholder="Contact 2 name (optional)" value={form.contactName2} onChange={set("contactName2")} />
                  <input className={inputClass} placeholder="Contact 2 phone (optional)" value={form.contactPhone2} onChange={set("contactPhone2")} />
                </div>
              )}
            </div>
          </div>
        )}

        {stepKey === "publish" && (
          <>
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" checked={form.publish} onChange={toggle("publish")} className="h-4 w-4 accent-gold-dark" />
              Publish immediately (guests can view it right away)
            </label>
            <div className="rounded-xl border border-ink/10 bg-white p-5 text-sm text-ink/60">
              <p className="font-medium text-ink mb-2">Review</p>
              <p>{payload.groomName || "—"} &amp; {payload.brideName || "—"} · {payload.weddingDate || "no date"}</p>
              <p>
                {features.events ? `${payload.events.length} event(s)` : "no events"} ·{" "}
                {features.gallery ? `${payload.gallery.length} photo(s)` : "no gallery"}
              </p>
              <p>
                Gift: {form.showGift ? "shown" : "hidden"} · QR: {form.showGiftQr && form.giftQrUrl ? "shown" : "hidden"} · Contact: {form.showContact ? "shown" : "hidden"}
              </p>
              <p>{form.publish ? "Will publish now" : "Saved as draft"}</p>
            </div>
          </>
        )}

        {state.error && (
          <p className="text-red-600 text-sm rounded-lg bg-red-50 border border-red-200 px-4 py-3">
            {state.error}
          </p>
        )}

        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={() => setStepIdx((s) => Math.max(0, s - 1))}
            disabled={stepIdx === 0 || pending}
            className="text-sm rounded-full border border-ink/20 px-6 py-3 hover:border-ink/50 transition-colors disabled:opacity-40"
          >
            Back
          </button>

          {!isLast ? (
            <button
              type="button"
              onClick={() => setStepIdx((s) => s + 1)}
              disabled={stepIdx === 0 && !step0Valid}
              className="text-sm rounded-full bg-ink text-cream px-8 py-3 font-medium hover:bg-ink/80 transition-colors disabled:opacity-40"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={() => formAction(payload)}
              disabled={pending || !step0Valid}
              className="rounded-full bg-gold text-night px-8 py-3.5 font-medium hover:bg-gold-light transition-colors disabled:opacity-60"
            >
              {pending ? "Creating…" : "Create invitation"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
