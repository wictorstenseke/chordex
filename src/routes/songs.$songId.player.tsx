import { createFileRoute } from "@tanstack/react-router";

import { SongPlayer } from "@/pages/SongPlayer";

export const Route = createFileRoute("/songs/$songId/player")({
  component: SongPlayerRoute,
});

function SongPlayerRoute() {
  const { songId } = Route.useParams();
  return <SongPlayer songId={songId} />;
}
