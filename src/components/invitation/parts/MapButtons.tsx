/**
 * Renders a Google Maps link and/or a Waze link for a venue — whichever the
 * owner filled in. Each theme passes its own `linkClass` so the buttons match.
 */
export function MapButtons({
  mapUrl,
  wazeUrl,
  linkClass,
  wrapClass = "mt-4 flex flex-wrap items-center gap-3",
}: {
  mapUrl?: string | null;
  wazeUrl?: string | null;
  linkClass: string;
  wrapClass?: string;
}) {
  if (!mapUrl && !wazeUrl) return null;
  return (
    <div className={wrapClass}>
      {mapUrl && (
        <a href={mapUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
          Google Maps ↗
        </a>
      )}
      {wazeUrl && (
        <a href={wazeUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
          Waze ↗
        </a>
      )}
    </div>
  );
}
