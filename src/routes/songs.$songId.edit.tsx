import { createFileRoute } from "@tanstack/react-router";

import { SongEdit } from "@/pages/SongEdit";

export const Route = createFileRoute("/songs/$songId/edit")({
  component: SongEditRoute,
});

function SongEditRoute() {
  const { songId } = Route.useParams();
  return <SongEdit songId={songId} />;
}
