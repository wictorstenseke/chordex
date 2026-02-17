import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/songs")({
  component: SongsLayout,
});

function SongsLayout() {
  return <Outlet />;
}
