import { useState, useMemo } from "react";

import { Copy } from "lucide-react";

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
import { useAuth } from "@/hooks/useAuth";
import { useDuplicateSongMutation, useSongsQuery } from "@/hooks/useSongs";

import type { SongWithId } from "@/types/songbook";

const matchesSearch = (song: SongWithId, query: string): boolean => {
  const q = query.toLowerCase().trim();
  if (!q) return true;
  const titleMatch = song.title.toLowerCase().includes(q);
  const artistMatch = song.artist?.toLowerCase().includes(q);
  const tagsMatch = song.tags?.some((t) => t.toLowerCase().includes(q));
  return Boolean(titleMatch || artistMatch || tagsMatch);
};

export function SongsList() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { data: songs, isLoading, error } = useSongsQuery(user?.uid);
  const duplicateMutation = useDuplicateSongMutation(user?.uid);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredSongs = useMemo(() => {
    if (!songs) return [];
    return songs.filter((song) => matchesSearch(song, searchQuery));
  }, [songs, searchQuery]);

  const handleDuplicate = (songId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    duplicateMutation.mutate(songId, {
      onSuccess: (newId) => {
        navigate({ to: "/songs/$songId/edit", params: { songId: newId } });
      },
    });
  };

  if (authLoading) {
    return (
      <p className="text-muted-foreground py-12 text-center">Loading...</p>
    );
  }

  if (error) {
    return (
      <p className="text-destructive">
        Failed to load songs.{" "}
        {error instanceof Error ? error.message : String(error)}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

      {songs && songs.length > 0 && (
        <div className="space-y-2">
          <Input
            type="search"
            placeholder="Search by title, artist, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
            aria-label="Search songs"
          />
        </div>
      )}

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
      ) : !filteredSongs.length ? (
        <Card>
          <CardHeader>
            <CardTitle>No matching songs</CardTitle>
            <CardDescription>
              Try a different search term or clear the search.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={() => setSearchQuery("")}
            >
              Clear search
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSongs.map((song) => (
            <li key={song.id}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to="/songs/$songId"
                      params={{ songId: song.id }}
                      className="flex-1 min-w-0"
                    >
                      <CardTitle className="text-base truncate">
                        {song.title}
                      </CardTitle>
                      {song.artist && (
                        <CardDescription className="truncate">
                          {song.artist}
                        </CardDescription>
                      )}
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => handleDuplicate(song.id, e)}
                      disabled={
                        duplicateMutation.isPending &&
                        duplicateMutation.variables === song.id
                      }
                      aria-label={`Duplicate ${song.title}`}
                      className="shrink-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
