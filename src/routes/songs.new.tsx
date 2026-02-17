import { createFileRoute } from "@tanstack/react-router";

import { SongNew } from "@/pages/SongNew";

export const Route = createFileRoute("/songs/new")({
  component: SongNew,
});
