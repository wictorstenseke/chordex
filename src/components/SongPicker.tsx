import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSongsQuery } from "@/hooks/useSongs";


interface SongPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (songIds: string[]) => void;
  excludeIds?: string[];
  ownerId: string | undefined;
}

export function SongPicker({
  open,
  onOpenChange,
  onSelect,
  excludeIds = [],
  ownerId,
}: SongPickerProps) {
  const { data: songs, isLoading } = useSongsQuery(ownerId);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  const availableSongs = (songs ?? []).filter(
    (s) => !excludeIds.includes(s.id)
  );

  const filteredSongs = availableSongs.filter((song) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      song.title.toLowerCase().includes(q) ||
      song.artist?.toLowerCase().includes(q) ||
      song.tags?.some((t) => t.toLowerCase().includes(q))
    );
  });

  const handleToggle = (songId: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(songId)) {
        next.delete(songId);
      } else {
        next.add(songId);
      }
      return next;
    });
  };

  const handleAdd = () => {
    onSelect(Array.from(selected));
    setSelected(new Set());
    onOpenChange(false);
  };

  const handleClose = () => {
    setSelected(new Set());
    setSearch("");
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          setSelected(new Set());
          setSearch("");
        }
        onOpenChange(o);
      }}
    >
      <DialogContent className="max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add songs</DialogTitle>
          <DialogDescription>
            Select songs from your library to add to the setlist.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 flex-1 min-h-0">
          <Input
            type="search"
            placeholder="Search songs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search songs"
          />
          <ScrollArea className="flex-1 min-h-0 rounded-md border">
            <div className="p-2 space-y-1">
              {isLoading ? (
                <p className="text-muted-foreground text-sm py-4 text-center">
                  Loading...
                </p>
              ) : filteredSongs.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4 text-center">
                  No songs to add.
                </p>
              ) : (
                filteredSongs.map((song) => (
                  <label
                    key={song.id}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(song.id)}
                      onChange={() => handleToggle(song.id)}
                      className="rounded"
                    />
                    <span className="text-sm truncate flex-1">
                      {song.title}
                      {song.artist && (
                        <span className="text-muted-foreground">
                          {" "}
                          – {song.artist}
                        </span>
                      )}
                    </span>
                  </label>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={selected.size === 0}
          >
            Add {selected.size > 0 ? `${selected.size} song(s)` : "songs"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
