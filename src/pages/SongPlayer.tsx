import { useState, useCallback, useRef, useEffect } from "react";

import { ChevronLeft } from "lucide-react";

import { Link } from "@tanstack/react-router";

import { ChordProPreview } from "@/components/ChordProPreview";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSongQuery } from "@/hooks/useSongs";

interface SongPlayerProps {
  songId: string;
}

export function SongPlayer({ songId }: SongPlayerProps) {
  const { data: song, isLoading } = useSongQuery(songId);
  const [autoscroll, setAutoscroll] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const toggleAutoscroll = useCallback(() => {
    setAutoscroll((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!autoscroll || !scrollContainerRef.current) return;
    const viewport = scrollContainerRef.current.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLElement | null;
    if (!viewport) return;

    let rafId: number;
    const startTime = Date.now();
    const scrollDuration = 60000;
    const startScroll = viewport.scrollTop;
    const maxScroll = viewport.scrollHeight - viewport.clientHeight || 1;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / scrollDuration, 1);
      viewport.scrollTop = startScroll + progress * maxScroll;
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [autoscroll, song?.content]);

  if (isLoading) {
    return (
      <p className="text-muted-foreground py-12 text-center">Loading...</p>
    );
  }

  if (!song) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12">
        <p className="text-muted-foreground text-center">Song not found.</p>
        <Button asChild>
          <Link to="/songs">Back to songs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-background"
      role="application"
      aria-label="Song player"
    >
      <header className="flex shrink-0 items-center justify-between border-b px-4 py-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/songs/$songId" params={{ songId }}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Exit
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant={autoscroll ? "secondary" : "ghost"}
            size="sm"
            onClick={toggleAutoscroll}
            aria-pressed={autoscroll}
            aria-label={autoscroll ? "Disable autoscroll" : "Enable autoscroll"}
          >
            {autoscroll ? "Autoscroll on" : "Autoscroll"}
          </Button>
          <ModeToggle />
        </div>
      </header>

      <main className="flex flex-1 min-h-0" ref={scrollContainerRef}>
        <ScrollArea className="flex-1 px-4 py-6">
          <div className="mx-auto max-w-3xl">
            <div className="space-y-4">
              <h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">
                {song.title}
              </h1>
              {(song.artist || song.key) && (
                <p className="text-muted-foreground text-lg">
                  {[song.artist, song.key && `Key: ${song.key}`]
                    .filter(Boolean)
                    .join(" • ")}
                </p>
              )}
              <ChordProPreview
                content={song.content}
                className="text-lg md:text-xl lg:text-2xl xl:text-3xl leading-relaxed"
              />
            </div>
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
