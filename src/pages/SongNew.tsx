import { useState } from "react";

import { useNavigate } from "@tanstack/react-router";

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
import { useCreateSongMutation } from "@/hooks/useSongs";

import type { SongInput } from "@/types/songbook";

export function SongNew() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createMutation = useCreateSongMutation(user?.uid);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [artist, setArtist] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid || !title.trim()) return;

    const input: SongInput = {
      title: title.trim(),
      content: content.trim() || "\n",
    };
    if (artist.trim()) input.artist = artist.trim();

    createMutation.mutate(input, {
      onSuccess: (songId) => {
        navigate({ to: "/songs/$songId", params: { songId } });
      },
    });
  };

  if (!user) {
    return (
      <p className="text-muted-foreground">Signing in...</p>
    );
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>New song</CardTitle>
        <CardDescription>
          Create a chord chart in ChordPro format. You can add more metadata
          when editing.
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
              ChordPro format. Leave empty to add later.
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create song"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/songs" })}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
