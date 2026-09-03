import Link from "next/link";
import type { InvitationData } from "./types";
import { CinematicJourneyTheme } from "./themes/CinematicJourneyTheme";
import { ClassicTheme } from "./themes/ClassicTheme";
import { RoyalMalayTheme } from "./themes/RoyalMalayTheme";
import { MinimalLuxuryTheme } from "./themes/MinimalLuxuryTheme";
import { GardenFloralTheme } from "./themes/GardenFloralTheme";
import { SunsetTerracottaTheme } from "./themes/SunsetTerracottaTheme";
import { MidnightSapphireTheme } from "./themes/MidnightSapphireTheme";

/**
 * Each template has its own renderer with a distinct layout and motion
 * language. `ClassicTheme` is the fallback for any unrecognised slug.
 */
export function InvitationRenderer({ data }: { data: InvitationData }) {
  let theme;
  switch (data.themeSlug) {
    case "dark-cinematic-gold":
      theme = <CinematicJourneyTheme data={data} />;
      break;
    case "royal-malay-classic":
      theme = <RoyalMalayTheme data={data} />;
      break;
    case "minimal-luxury-white":
      theme = <MinimalLuxuryTheme data={data} />;
      break;
    case "garden-floral":
      theme = <GardenFloralTheme data={data} />;
      break;
    case "sunset-terracotta":
      theme = <SunsetTerracottaTheme data={data} />;
      break;
    case "midnight-sapphire":
      theme = <MidnightSapphireTheme data={data} />;
      break;
    default:
      theme = <ClassicTheme data={data} />;
  }

  return (
    <>
      {theme}
      {data.watermark && (
        <Link
          href="/"
          className="fixed bottom-4 right-4 z-[80] rounded-full bg-black/70 backdrop-blur-sm px-4 py-2 text-[0.7rem] tracking-widest uppercase text-white/80 hover:text-white transition-colors"
        >
          Made with InviteYou
        </Link>
      )}
    </>
  );
}
