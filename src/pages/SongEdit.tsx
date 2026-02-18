import { useState } from "react";

import { Link, useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useSongQuery, useUpdateSongMutation } from "@/hooks/useSongs";

import type { SongInput, SongWithId } from "@/types/songbook";

interface SongEditProps {
  songId: string;
}

export function SongEdit({ songId }: SongEditProps) {
  const { user, isLoading: authLoading } = useAuth();
  const { data: song, isLoading } = useSongQuery(songId);

  if (authLoading || isLoading) {
    return (
      <p className="text-muted-foreground py-12 text-center">Loading...</p>
    );
  }

  if (!song) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">Song not found.</p>
        <Button asChild>
          <Link to="/songs">Back to songs</Link>
        </Button>
      </div>
    );
  }

  return <SongEditForm songId={songId} song={song} ownerId={user?.uid} />;
}

interface SongEditFormProps {
  songId: string;
  song: SongWithId;
  ownerId: string | undefined;
}

function SongEditForm({ songId, song, ownerId }: SongEditFormProps) {
  const navigate = useNavigate();
  const updateMutation = useUpdateSongMutation(ownerId);

  const [title, setTitle] = useState(song.title);
  const [content, setContent] = useState(song.content);
  const [artist, setArtist] = useState(song.artist ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const input: SongInput = {
      title: title.trim(),
      content: content.trim() || "\n",
    };
    if (artist.trim()) input.artist = artist.trim();

    updateMutation.mutate(
      { songId, input },
      {
        onSuccess: () => {
          navigate({ to: "/songs/$songId", params: { songId } });
        },
      }
    );
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Edit song</CardTitle>
        <CardDescription>
          Update the song details and ChordPro content.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title (required)</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Amazing Grace"
              required
              autoFocus
              aria-required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="artist">Artist</Label>
            <Input
              id="artist"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="e.g. John Newton"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">ChordPro content</Label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="[Verse 1]\n[C]Amazing grace..."
              rows={8}
              className="border-input w-full resize-y rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-describedby="content-hint"
            />
            <p id="content-hint" className="text-muted-foreground text-xs">
              ChordPro format.
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save changes"}
            </Button>
            <Button variant="outline" asChild>
              <Link to="/songs/$songId" params={{ songId }}>
                Cancel
              </Link>
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
