import { encodeSongForShare, type ShareableSong } from "./share";

const getBaseUrl = (): string => {
  const base = (import.meta.env.BASE_URL ?? "/").replace(/^\/|\/$/g, "");
  return base
    ? `${window.location.origin}/${base}`
    : window.location.origin;
};

export const buildShareSongUrl = (song: ShareableSong): string => {
  const encoded = encodeSongForShare(song);
  return `${getBaseUrl()}/share/song?data=${encodeURIComponent(encoded)}`;
};
