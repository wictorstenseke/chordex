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
import { useSongQuery } from "@/hooks/useSongs";

interface SongDetailProps {
  songId: string;
}

export function SongDetail({ songId }: SongDetailProps) {
  const { user, signInMocked } = useAuth();
  const { data: song, isLoading } = useSongQuery(songId);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <p className="text-muted-foreground">Firebase not configured</p>
        <Button onClick={signInMocked}>Sign in as mocked user</Button>
      </div>
    );
  }

  if (isLoading) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  if (!song && !isLoading) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">Song not found.</p>
        <Button asChild>
          <Link to="/songs">Back to songs</Link>
        </Button>
      </div>
    );
  }

  if (!song) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="scroll-m-20 text-3xl font-bold tracking-tight">
            {song.title}
          </h1>
          {song.artist && (
            <p className="text-muted-foreground">{song.artist}</p>
          )}
        </div>
        <Button variant="outline" asChild>
          <Link to="/songs">Back to songs</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ChordPro content</CardTitle>
          <CardDescription>
            Edit song user story will add full ChordPro editor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap rounded-md border bg-muted/50 p-4 font-mono text-sm">
            {song.content || "(No content yet)"}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
