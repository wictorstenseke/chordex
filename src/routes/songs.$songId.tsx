import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/songs/$songId")({
  component: SongIdLayout,
});

function SongIdLayout() {
  return <Outlet />;
}
