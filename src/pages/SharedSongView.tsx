import { useState, useEffect } from "react";

import { Link, useNavigate } from "@tanstack/react-router";

import { ChordProPreview } from "@/components/ChordProPreview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { createSong, getSongBySource } from "@/lib/songs";
import type { SongWithId } from "@/types/songbook";
import { decodeSongFromShare } from "@/lib/share";

interface SharedSongViewProps {
  encodedData: string;
}

export function SharedSongView({ encodedData }: SharedSongViewProps) {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [existingCopy, setExistingCopy] = useState<SongWithId | null>(null);

  const song = encodedData ? decodeSongFromShare(encodedData) : null;

  useEffect(() => {
    if (!user?.uid || !song?.sourceSongId || !song?.sourceOwnerId) return;
    void getSongBySource(user.uid, song.sourceSongId, song.sourceOwnerId).then(
      setExistingCopy
    );
  }, [user?.uid, song?.sourceSongId, song?.sourceOwnerId]);

  const handleSaveToMySongs = async () => {
    if (!song || !user?.uid || isSaving) return;
    setIsSaving(true);
    try {
      const newId = await createSong(user.uid, {
        title: song.title,
        artist: song.artist,
        key: song.key,
        capo: song.capo,
        tempo: song.tempo,
        tags: song.tags,
        content: song.content,
        source: song.sourceSongId
          ? {
              songId: song.sourceSongId,
              ownerId: song.sourceOwnerId ?? "",
              importedAt: new Date(),
            }
          : undefined,
      });
      navigate({ to: "/songs/$songId/edit", params: { songId: newId } });
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) {
    return (
      <p className="text-muted-foreground py-12 text-center">Loading...</p>
    );
  }

  if (!song) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Invalid or missing shared song data.
        </p>
        <Button asChild>
          <Link to="/songs">Back to songs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-muted/50 px-4 py-3">
        <p className="text-sm font-medium">Shared song – read-only</p>
        <p className="text-muted-foreground text-sm">
          You can view this chord chart and save a copy to your library.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div>
            <h1 className="scroll-m-20 text-3xl font-bold tracking-tight">
              {song.title}
            </h1>
            {song.artist && (
              <p className="text-muted-foreground">{song.artist}</p>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ChordProPreview
            content={song.content}
            className="rounded-md border bg-muted/50 p-4"
          />
          <div className="flex flex-wrap gap-2 pt-4">
            {user?.uid ? (
              existingCopy ? (
                <Button asChild>
                  <Link to="/songs/$songId" params={{ songId: existingCopy.id }}>
                    Open My Copy
                  </Link>
                </Button>
              ) : (
                <Button
                  onClick={handleSaveToMySongs}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save to My Songs"}
                </Button>
              )
            ) : (
              <p className="text-muted-foreground text-sm">
                Sign in to save this song to your library.
              </p>
            )}
            <Button variant="outline" asChild>
              <Link to="/songs">Back to songs</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
