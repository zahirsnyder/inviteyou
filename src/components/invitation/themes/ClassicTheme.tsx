"use client";

import { useRef, useState } from "react";
import type { InvitationData } from "../types";
import { getPreset, presetCssVars } from "./presets";
import { OpeningScreen } from "../sections/OpeningScreen";
import { HeroSection } from "../sections/HeroSection";
import { CountdownSection } from "../sections/CountdownSection";
import { StorySection } from "../sections/StorySection";
import { EventsSection } from "../sections/EventsSection";
import { GallerySection } from "../sections/GallerySection";
import { RsvpSection } from "../sections/RsvpSection";
import { GuestbookSection } from "../sections/GuestbookSection";
import { ClosingSection } from "../sections/ClosingSection";
import { GiftContact } from "../parts/GiftContact";

/**
 * The section-based invitation renderer, re-skinned per template. The visual
 * identity (palette, display face) comes entirely from a preset applied as CSS
 * custom properties on the wrapper — the section components read the same
 * Tailwind tokens for every template.
 */
export function ClassicTheme({ data }: { data: InvitationData }) {
  const preset = getPreset(data.themeSlug);
  const [opened, setOpened] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleOpen = () => {
    setOpened(true);
    if (data.musicUrl && audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current
        .play()
        .then(() => setMusicPlaying(true))
        .catch(() => {});
    }
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicPlaying) {
      audio.pause();
      setMusicPlaying(false);
    } else {
      audio.play().then(() => setMusicPlaying(true)).catch(() => {});
    }
  };

  return (
    <div
      style={presetCssVars(preset)}
      data-scheme={preset.scheme}
      className="bg-night text-cream min-h-screen invitation-scroll"
    >
      {data.musicUrl && <audio ref={audioRef} src={data.musicUrl} loop preload="none" />}

      {!opened && <OpeningScreen data={data} onOpen={handleOpen} />}

      {opened && (
        <>
          {data.musicUrl && (
            <button
              onClick={toggleMusic}
              aria-label={musicPlaying ? "Pause music" : "Play music"}
              className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full border border-gold/40 bg-night/80 backdrop-blur-sm text-gold flex items-center justify-center hover:bg-gold hover:text-[color:var(--inv-onaccent)] transition-all"
            >
              {musicPlaying ? "❚❚" : "♪"}
            </button>
          )}

          <HeroSection data={data} />
          <CountdownSection weddingDateISO={data.weddingDateISO} />
          <StorySection data={data} />
          <EventsSection events={data.events} />
          {data.features.gallery && <GallerySection gallery={data.gallery} />}
          <RsvpSection slug={data.slug} />
          <GuestbookSection slug={data.slug} wishes={data.wishes} />
          <section className="py-24 px-6">
            <div className="mx-auto max-w-xl">
              <GiftContact data={data} variant="panel" />
            </div>
          </section>
          <ClosingSection data={data} />
        </>
      )}
    </div>
  );
}
