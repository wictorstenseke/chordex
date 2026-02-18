import { useState } from "react";

import { Eye, FileText } from "lucide-react";

import { Link, useNavigate } from "@tanstack/react-router";

import { ChordProPreview } from "@/components/ChordProPreview";
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
  const [key, setKey] = useState(song.key ?? "");
  const [capo, setCapo] = useState(
    song.capo !== undefined ? String(song.capo) : ""
  );
  const [tempo, setTempo] = useState(
    song.tempo !== undefined ? String(song.tempo) : ""
  );
  const [tags, setTags] = useState<string[]>(song.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [showPreview, setShowPreview] = useState(true);

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const input: SongInput = {
      title: title.trim(),
      content: content.trim() || "\n",
    };
    if (artist.trim()) input.artist = artist.trim();
    if (key.trim()) input.key = key.trim();
    const capoNum = parseInt(capo, 10);
    if (!Number.isNaN(capoNum) && capoNum >= 0) input.capo = capoNum;
    const tempoNum = parseInt(tempo, 10);
    if (!Number.isNaN(tempoNum) && tempoNum > 0) input.tempo = tempoNum;
    if (tags.length > 0) input.tags = tags;

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
    <div className="space-y-6">
      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle>Edit song</CardTitle>
          <CardDescription>
            Update the song details and ChordPro content.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
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
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="key">Key</Label>
                <Input
                  id="key"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="e.g. C"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capo">Capo</Label>
                <Input
                  id="capo"
                  type="number"
                  min={0}
                  value={capo}
                  onChange={(e) => setCapo(e.target.value)}
                  placeholder="e.g. 2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tempo">Tempo</Label>
                <Input
                  id="tempo"
                  value={tempo}
                  onChange={(e) => setTempo(e.target.value)}
                  placeholder="e.g. 120 BPM"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-destructive focus:text-destructive rounded p-0.5 focus:outline-none focus:ring-2 focus:ring-ring"
                      aria-label={`Remove tag ${tag}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
                <div className="flex gap-1">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    onBlur={handleAddTag}
                    placeholder="Add tag..."
                    className="w-32"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddTag}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="content">ChordPro content</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPreview((p) => !p)}
                    aria-label={showPreview ? "Hide preview" : "Show preview"}
                  >
                    {showPreview ? (
                      <>
                        <FileText className="mr-1.5 h-4 w-4" />
                        Hide preview
                      </>
                    ) : (
                      <>
                        <Eye className="mr-1.5 h-4 w-4" />
                        Show preview
                      </>
                    )}
                  </Button>
                </div>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="[Verse 1]\n[C]Amazing grace..."
                  rows={12}
                  className="border-input w-full resize-y rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-describedby="content-hint"
                />
                <p id="content-hint" className="text-muted-foreground text-xs">
                  ChordPro format.
                </p>
              </div>
              {showPreview && (
                <div className="space-y-2">
                  <Label>Live preview</Label>
                  <div className="rounded-md border bg-muted/50 p-4">
                    <ChordProPreview content={content} className="text-sm" />
                  </div>
                </div>
              )}
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
    </div>
  );
}
