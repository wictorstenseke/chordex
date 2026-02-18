import { createFileRoute } from "@tanstack/react-router";

import { SetlistsList } from "@/pages/SetlistsList";

export const Route = createFileRoute("/setlists/")({
  component: SetlistsList,
});
