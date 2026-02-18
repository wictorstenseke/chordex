import { useMemo, useState } from "react";

import {
  DndContext,
  closestCenter,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Play, Plus, Trash2 } from "lucide-react";

import { Link } from "@tanstack/react-router";


import { SongPicker } from "@/components/SongPicker";
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
  useSetlistQuery,
  useUpdateSetlistMutation,
} from "@/hooks/useSetlists";
import { useSongsQuery } from "@/hooks/useSongs";

interface SetlistDetailProps {
  setlistId: string;
}

function SortableSongItem({
  songId,
  title,
  artist,
  onRemove,
}: {
  songId: string;
  title: string;
  artist?: string;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: songId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 rounded-md border bg-card px-3 py-2 ${
        isDragging ? "opacity-50 shadow-md" : ""
      }`}
    >
      <button
        type="button"
        className="cursor-grab touch-none p-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <Link
        to="/songs/$songId"
        params={{ songId }}
        className="flex-1 min-w-0 truncate hover:underline"
      >
        <span className="font-medium">{title}</span>
        {artist && (
          <span className="text-muted-foreground text-sm"> – {artist}</span>
        )}
      </Link>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onRemove}
        aria-label={`Remove ${title} from setlist`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function SetlistDetail({ setlistId }: SetlistDetailProps) {
  const { user, isLoading: authLoading } = useAuth();
  const { data: setlist, isLoading } = useSetlistQuery(setlistId);
  const { data: songs } = useSongsQuery(user?.uid);
  const updateMutation = useUpdateSetlistMutation(user?.uid);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [notesDraft, setNotesDraft] = useState<string | null>(null);

  const songMap = useMemo(() => {
    const map = new Map<string | undefined, { title: string; artist?: string }>();
    (songs ?? []).forEach((s) => map.set(s.id, { title: s.title, artist: s.artist }));
    return map;
  }, [songs]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !setlist) return;

    const oldIndex = setlist.songIds.indexOf(active.id as string);
    const newIndex = setlist.songIds.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;

    const newOrder = arrayMove(setlist.songIds, oldIndex, newIndex);
    updateMutation.mutate({ setlistId, input: { songIds: newOrder } });
  };

  const handleAddSongs = (songIds: string[]) => {
    if (!setlist) return;
    const existing = new Set(setlist.songIds);
    const toAdd = songIds.filter((id) => !existing.has(id));
    if (toAdd.length === 0) return;
    updateMutation.mutate({
      setlistId,
      input: { songIds: [...setlist.songIds, ...toAdd] },
    });
    setPickerOpen(false);
  };

  const handleRemoveSong = (songId: string) => {
    if (!setlist) return;
    const newIds = setlist.songIds.filter((id) => id !== songId);
    updateMutation.mutate({ setlistId, input: { songIds: newIds } });
  };

  const handleNotesBlur = () => {
    if (notesDraft === null || !setlist) return;
    const trimmed = notesDraft.trim();
    if (trimmed !== (setlist.notes ?? "")) {
      updateMutation.mutate({ setlistId, input: { notes: trimmed || undefined } });
    }
    setNotesDraft(null);
  };

  const notesValue = notesDraft !== null ? notesDraft : (setlist?.notes ?? "");

  if (authLoading || isLoading) {
    return (
      <p className="text-muted-foreground py-12 text-center">Loading...</p>
    );
  }

  if (!setlist) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">Setlist not found.</p>
        <Button asChild>
          <Link to="/setlists">Back to setlists</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="scroll-m-20 text-3xl font-bold tracking-tight">
            {setlist.name}
          </h1>
          <p className="text-muted-foreground">
            {setlist.songIds.length} song
            {setlist.songIds.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link
              to="/setlists/$setlistId/player"
              params={{ setlistId }}
            >
              <Play className="mr-1.5 h-4 w-4" />
              Player mode
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/setlists">Back to setlists</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Songs</CardTitle>
              <CardDescription>
                Add, remove, or reorder songs. Drag to reorder.
              </CardDescription>
            </div>
            <Button onClick={() => setPickerOpen(true)} size="sm">
              <Plus className="mr-1.5 h-4 w-4" />
              Add songs
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {setlist.songIds.length === 0 ? (
            <p className="text-muted-foreground py-6 text-center">
              No songs in this setlist. Add songs to get started.
            </p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={setlist.songIds}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {setlist.songIds.map((songId) => {
                    const info = songMap.get(songId) ?? {
                      title: "(Unknown)",
                      artist: undefined,
                    };
                    return (
                      <SortableSongItem
                        key={songId}
                        songId={songId}
                        title={info.title}
                        artist={info.artist}
                        onRemove={() => handleRemoveSong(songId)}
                      />
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
          <CardDescription>
            Tempo, capo, or other notes for this setlist.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <textarea
            value={notesValue}
            onChange={(e) => setNotesDraft(e.target.value)}
            onBlur={handleNotesBlur}
            placeholder="e.g. All in C, capo 2..."
            rows={3}
            className="border-input w-full resize-y rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Setlist notes"
          />
        </CardContent>
      </Card>

      <SongPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={handleAddSongs}
        excludeIds={setlist.songIds}
        ownerId={user?.uid}
      />
    </div>
  );
}
