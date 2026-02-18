import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useSetlistsQuery } from "@/hooks/useSetlists";

export function SetlistsList() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: setlists, isLoading, error } = useSetlistsQuery(user?.uid);

  if (authLoading) {
    return (
      <p className="text-muted-foreground py-12 text-center">Loading...</p>
    );
  }

  if (error) {
    return (
      <p className="text-destructive">
        Failed to load setlists.{" "}
        {error instanceof Error ? error.message : String(error)}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="scroll-m-20 text-3xl font-bold tracking-tight">
            Setlists
          </h1>
          <p className="text-muted-foreground">
            Group songs for practice or performance
          </p>
        </div>
        <Button asChild>
          <Link to="/setlists/new">New setlist</Link>
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading setlists...</p>
      ) : !setlists?.length ? (
        <Card>
          <CardHeader>
            <CardTitle>No setlists yet</CardTitle>
            <CardDescription>
              Create a setlist to group songs for practice or gigs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/setlists/new">Create first setlist</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {setlists.map((setlist) => (
            <li key={setlist.id}>
              <Link
                to="/setlists/$setlistId"
                params={{ setlistId: setlist.id }}
                className="block"
              >
                <Card className="transition-colors hover:bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{setlist.name}</CardTitle>
                    <CardDescription>
                      {setlist.songIds.length} song
                      {setlist.songIds.length !== 1 ? "s" : ""}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
