import { useState } from "react";

import { Copy, Eye, FileText } from "lucide-react";

import { Link, useNavigate } from "@tanstack/react-router";

import { ChordProPreview } from "@/components/ChordProPreview";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import {
  useDeleteSongMutation,
  useDuplicateSongMutation,
  useSongQuery,
} from "@/hooks/useSongs";

interface SongDetailProps {
  songId: string;
}

export function SongDetail({ songId }: SongDetailProps) {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { data: song, isLoading } = useSongQuery(songId);
  const deleteMutation = useDeleteSongMutation(user?.uid);
  const duplicateMutation = useDuplicateSongMutation(user?.uid);
  const [isPreview, setIsPreview] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(songId, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        navigate({ to: "/songs" });
      },
    });
  };

  const handleDuplicate = () => {
    duplicateMutation.mutate(songId, {
      onSuccess: (newId) => {
        navigate({ to: "/songs/$songId/edit", params: { songId: newId } });
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
          <Button asChild>
            <Link to="/songs/$songId/edit" params={{ songId }}>
              Edit
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDuplicate}
            disabled={duplicateMutation.isPending}
          >
            <Copy className="mr-1.5 h-4 w-4" />
            {duplicateMutation.isPending ? "Duplicating..." : "Duplicate"}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteClick}
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {isPreview ? "Preview" : "ChordPro content"}
              </CardTitle>
              <CardDescription>
                {isPreview
                  ? "Performance-friendly view"
                  : "Song content in ChordPro format"}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreview((prev) => !prev)}
              aria-label={isPreview ? "Show raw ChordPro" : "Show preview"}
            >
              {isPreview ? (
                <>
                  <FileText className="mr-1.5 h-4 w-4" />
                  Edit view
                </>
              ) : (
                <>
                  <Eye className="mr-1.5 h-4 w-4" />
                  Preview
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isPreview ? (
            <ChordProPreview
              content={song.content}
              className="rounded-md border bg-muted/50 p-4"
            />
          ) : (
            <pre className="whitespace-pre-wrap rounded-md border bg-muted/50 p-4 font-mono text-sm">
              {song.content || "(No content yet)"}
            </pre>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete song?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{song.title}". This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
