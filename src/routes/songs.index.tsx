import { createFileRoute } from "@tanstack/react-router";

import { SongsList } from "@/pages/SongsList";

export const Route = createFileRoute("/songs/")({
  component: SongsList,
});
