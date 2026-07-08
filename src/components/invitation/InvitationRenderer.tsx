import type { InvitationData } from "./types";
import { DarkGoldTheme } from "./themes/DarkGoldTheme";

/**
 * Picks the theme component for an invitation. All themes currently render
 * Dark Cinematic Gold — new themes register here as they are built.
 */
export function InvitationRenderer({ data }: { data: InvitationData }) {
  switch (data.themeSlug) {
    case "dark-cinematic-gold":
    default:
      return <DarkGoldTheme data={data} />;
  }
}
