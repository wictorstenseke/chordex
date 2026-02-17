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
import { useSongsQuery } from "@/hooks/useSongs";

export function SongsList() {
  const { user, signInMocked } = useAuth();
  const { data: songs, isLoading, error } = useSongsQuery(user?.uid);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <p className="text-muted-foreground">Firebase not configured</p>
        <Button onClick={signInMocked}>Sign in as mocked user</Button>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-destructive">
        Failed to load songs. {error instanceof Error ? error.message : String(error)}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="scroll-m-20 text-3xl font-bold tracking-tight">
            Songs
          </h1>
          <p className="text-muted-foreground">
            Your chord charts and song library
          </p>
        </div>
        <Button asChild>
          <Link to="/songs/new">New song</Link>
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading songs...</p>
      ) : !songs?.length ? (
        <Card>
          <CardHeader>
            <CardTitle>No songs yet</CardTitle>
            <CardDescription>
              Create your first chord chart to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/songs/new">Create first song</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {songs.map((song) => (
            <li key={song.id}>
              <Link
                to="/songs/$songId"
                params={{ songId: song.id }}
                className="block"
              >
                <Card className="transition-colors hover:bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{song.title}</CardTitle>
                    {song.artist && (
                      <CardDescription>{song.artist}</CardDescription>
                    )}
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
