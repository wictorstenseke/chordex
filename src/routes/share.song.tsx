import { createFileRoute } from "@tanstack/react-router";

import { SharedSongView } from "@/pages/SharedSongView";

export const Route = createFileRoute("/share/song")({
  validateSearch: (params: { data?: string }): { data: string } => ({
    data: params.data ?? "",
  }),
  component: SharedSongRoute,
});

function SharedSongRoute() {
  const { data } = Route.useSearch();
  return <SharedSongView encodedData={data} />;
}
