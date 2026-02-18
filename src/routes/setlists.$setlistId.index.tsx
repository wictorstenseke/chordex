import { createFileRoute } from "@tanstack/react-router";

import { SetlistDetail } from "@/pages/SetlistDetail";

export const Route = createFileRoute("/setlists/$setlistId/")({
  component: SetlistDetailPage,
});

function SetlistDetailPage() {
  const { setlistId } = Route.useParams();
  return <SetlistDetail setlistId={setlistId} />;
}
