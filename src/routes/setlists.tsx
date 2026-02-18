import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/setlists")({
  component: SetlistsLayout,
});

function SetlistsLayout() {
  return <Outlet />;
}
