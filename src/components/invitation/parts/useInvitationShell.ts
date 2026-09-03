"use client";

import { useRef, useState } from "react";

/** Shared open-gate + background-music plumbing for the bespoke templates. */
export function useInvitationShell(musicUrl: string | null) {
  const [opened, setOpened] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const open = () => {
    setOpened(true);
    if (musicUrl && audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().then(() => setMusicPlaying(true)).catch(() => {});
    }
  };

  const toggleMusic = () => {
    const a = audioRef.current;
    if (!a) return;
    if (musicPlaying) {
      a.pause();
      setMusicPlaying(false);
    } else {
      a.play().then(() => setMusicPlaying(true)).catch(() => {});
    }
  };

  return { opened, open, audioRef, musicPlaying, toggleMusic };
}
