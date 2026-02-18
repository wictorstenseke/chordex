import { parseChordPro, type ParsedLine } from "@/lib/chordpro-parser";
import { cn } from "@/lib/utils";

interface ChordProPreviewProps {
  content: string;
  className?: string;
}

export const ChordProPreview = ({
  content,
  className,
}: ChordProPreviewProps) => {
  const lines = parseChordPro(content);

  return (
    <div
      className={cn("space-y-0.5 font-mono text-sm", className)}
      aria-label="ChordPro preview"
    >
      {lines.map((line, index) => (
        <PreviewLine key={index} line={line} />
      ))}
    </div>
  );
};

const PreviewLine = ({ line }: { line: ParsedLine }) => {
  if (line.type === "empty") {
    return <div className="h-4" aria-hidden="true" />;
  }

  if (line.type === "section") {
    return (
      <h3 className="text-muted-foreground mt-4 mb-1 text-xs font-semibold uppercase tracking-wide">
        {line.label}
      </h3>
    );
  }

  const hasChords = line.pairs.some((pair) => pair.chord !== "");

  return (
    <div className="leading-tight">
      {hasChords && (
        <div className="text-primary font-bold" aria-hidden="true">
          {line.pairs.map((pair, i) => (
            <span key={i} className="inline-block">
              {pair.chord ? (
                <span>{pair.chord}</span>
              ) : null}
              {pair.lyric ? (
                <span className="invisible whitespace-pre">
                  {pair.lyric}
                </span>
              ) : (
                <span className="invisible whitespace-pre"> </span>
              )}
            </span>
          ))}
        </div>
      )}
      <div>
        {line.pairs.map((pair, i) => (
          <span key={i} className="inline-block">
            {pair.chord ? (
              <span className="invisible font-bold">{pair.chord}</span>
            ) : null}
            <span className="whitespace-pre">{pair.lyric}</span>
          </span>
        ))}
      </div>
    </div>
  );
};
