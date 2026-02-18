import { useState, useMemo } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Link } from "@tanstack/react-router";

import { ChordProPreview } from "@/components/ChordProPreview";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { useSetlistQuery } from "@/hooks/useSetlists";
import { useSongsQuery } from "@/hooks/useSongs";

interface SetlistPlayerProps {
  setlistId: string;
}

export function SetlistPlayer({ setlistId }: SetlistPlayerProps) {
  const { user } = useAuth();
  const { data: setlist, isLoading } = useSetlistQuery(setlistId);
  const { data: songs } = useSongsQuery(user?.uid);
  const [currentIndex, setCurrentIndex] = useState(0);

  const songMap = useMemo(() => {
    const map = new Map<string, { title: string; content: string }>();
    (songs ?? []).forEach((s) =>
      map.set(s.id, { title: s.title, content: s.content })
    );
    return map;
  }, [songs]);

  const currentSongIds = setlist?.songIds ?? [];
  const currentSongId = currentSongIds[currentIndex];
  const currentSong = currentSongId
    ? songMap.get(currentSongId)
    : undefined;

  const handlePrevious = () => {
    setCurrentIndex((i) => Math.max(0, i - 1));
  };

  const handleNext = () => {
    setCurrentIndex((i) =>
      Math.min(currentSongIds.length - 1, i + 1)
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrevious();
    else if (e.key === "ArrowRight") handleNext();
  };

  if (isLoading || !setlist) {
    return (
      <p className="text-muted-foreground py-12 text-center">Loading...</p>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-background"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="application"
      aria-label="Setlist player"
    >
      <header className="flex shrink-0 items-center justify-between border-b px-4 py-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/setlists/$setlistId" params={{ setlistId }}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Exit
          </Link>
        </Button>
        <div className="text-center">
          <span className="text-sm font-medium">
            {currentIndex + 1} / {Math.max(1, currentSongIds.length)}
          </span>
        </div>
        <div className="w-20" />
      </header>

      <main className="flex flex-1 flex-col min-h-0">
        {currentSongIds.length === 0 ? (
          <div className="flex flex-1 items-center justify-center p-8">
            <p className="text-muted-foreground text-center">
              No songs in this setlist. Add songs to use player mode.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-1 min-h-0">
              <Button
                variant="ghost"
                size="icon-lg"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="shrink-0"
                aria-label="Previous song"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>

              <ScrollArea className="flex-1 px-4 py-6">
                <div className="mx-auto max-w-3xl">
                  {currentSong ? (
                    <div className="space-y-4">
                      <h1 className="text-2xl font-bold md:text-3xl">
                        {currentSong.title}
                      </h1>
                      <ChordProPreview
                        content={currentSong.content}
                        className="text-lg md:text-xl lg:text-2xl"
                      />
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Song not found in library.
                    </p>
                  )}
                </div>
              </ScrollArea>

              <Button
                variant="ghost"
                size="icon-lg"
                onClick={handleNext}
                disabled={currentIndex >= currentSongIds.length - 1}
                className="shrink-0"
                aria-label="Next song"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </div>

            {setlist.notes && (
              <aside className="border-t px-4 py-3">
                <p className="text-muted-foreground text-sm">
                  <span className="font-semibold">Notes:</span> {setlist.notes}
                </p>
              </aside>
            )}
          </>
        )}
      </main>
    </div>
  );
}
