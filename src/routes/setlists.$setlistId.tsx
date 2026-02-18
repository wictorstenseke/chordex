import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/setlists/$setlistId")({
  component: SetlistLayout,
});

function SetlistLayout() {
  return <Outlet />;
}
