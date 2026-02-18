import { createFileRoute } from "@tanstack/react-router";

import { SetlistNew } from "@/pages/SetlistNew";

export const Route = createFileRoute("/setlists/new")({
  component: SetlistNew,
});
