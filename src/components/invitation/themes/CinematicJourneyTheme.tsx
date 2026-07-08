"use client";

import { useRef, useState } from "react";
import type { InvitationData } from "../types";
import { CinematicProvider } from "../cinematic/core/CinematicProvider";
import { OpeningScreen } from "../sections/OpeningScreen";
import { OpeningScene } from "../cinematic/scenes/OpeningScene";
import { InvitationRevealScene } from "../cinematic/scenes/InvitationRevealScene";
import { StoryScene } from "../cinematic/scenes/StoryScene";
import { EventsScene } from "../cinematic/scenes/EventsScene";
import { GalleryScene } from "../cinematic/scenes/GalleryScene";
import { RsvpScene } from "../cinematic/scenes/RsvpScene";
import { FinalScene } from "../cinematic/scenes/FinalScene";
import { GuestbookSection } from "../sections/GuestbookSection";
import { GiftSection } from "../sections/GiftSection";

/**
 * Dark Cinematic Gold — scroll-storytelling edition. The guest clicks open
 * the invitation (which also unlocks music autoplay), then scrolls through
 * a camera journey: opening shot → invitation card → story → celebration →
 * gallery travel → RSVP → wishes & gift → final farewell.
 */
export function CinematicJourneyTheme({ data }: { data: InvitationData }) {
  const [opened, setOpened] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleOpen = () => {
    setOpened(true);
    window.scrollTo(0, 0);
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
    <div className="bg-night text-cream min-h-screen invitation-scroll">
      {data.musicUrl && <audio ref={audioRef} src={data.musicUrl} loop preload="none" />}

      {!opened && <OpeningScreen data={data} onOpen={handleOpen} />}

      {opened && (
        <CinematicProvider>
          {data.musicUrl && (
            <button
              onClick={toggleMusic}
              aria-label={musicPlaying ? "Pause music" : "Play music"}
              className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full border border-gold/40 bg-night/80 backdrop-blur-sm text-gold flex items-center justify-center hover:bg-gold hover:text-night transition-all"
            >
              {musicPlaying ? "❚❚" : "♪"}
            </button>
          )}

          <OpeningScene data={data} />
          <InvitationRevealScene data={data} />
          <StoryScene data={data} />
          <EventsScene data={data} />
          <GalleryScene gallery={data.gallery} />
          <RsvpScene slug={data.slug} />
          <GuestbookSection slug={data.slug} wishes={data.wishes} />
          <GiftSection data={data} />
          <FinalScene data={data} />
        </CinematicProvider>
      )}
    </div>
  );
}
