import { createFileRoute } from "@tanstack/react-router";

import { SetlistPlayer } from "@/pages/SetlistPlayer";

export const Route = createFileRoute("/setlists/$setlistId/player")({
  component: SetlistPlayerPage,
});

function SetlistPlayerPage() {
  const { setlistId } = Route.useParams();
  return <SetlistPlayer setlistId={setlistId} />;
}
