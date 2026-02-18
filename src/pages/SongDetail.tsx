import { Link, useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useDeleteSongMutation, useSongQuery } from "@/hooks/useSongs";

interface SongDetailProps {
  songId: string;
}

export function SongDetail({ songId }: SongDetailProps) {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { data: song, isLoading } = useSongQuery(songId);
  const deleteMutation = useDeleteSongMutation(user?.uid);

  const handleDelete = () => {
    deleteMutation.mutate(songId, {
      onSuccess: () => {
        navigate({ to: "/songs" });
      },
    });
  };

  if (authLoading) {
    return <p className="text-muted-foreground py-12 text-center">Loading...</p>;
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
        <div className="flex gap-2">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
          <Button variant="outline" asChild>
            <Link to="/songs">Back to songs</Link>
          </Button>
        </div>
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
