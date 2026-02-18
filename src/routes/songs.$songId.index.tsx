import { createFileRoute } from "@tanstack/react-router";

import { SongDetail } from "@/pages/SongDetail";

export const Route = createFileRoute("/songs/$songId/")({
  component: SongDetailRoute,
});

function SongDetailRoute() {
  const { songId } = Route.useParams();
  return <SongDetail songId={songId} />;
}
