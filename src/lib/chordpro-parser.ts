/** Token representing a chord+lyric pair within a line */
export interface ChordLyricPair {
  chord: string;
  lyric: string;
}

/** A line of lyrics with optional chords positioned above them */
export interface ContentLine {
  type: "line";
  pairs: ChordLyricPair[];
}

/** A section header such as Verse, Chorus, Bridge */
export interface SectionHeader {
  type: "section";
  label: string;
}

/** An empty line for spacing */
export interface EmptyLine {
  type: "empty";
}

export type ParsedLine = ContentLine | SectionHeader | EmptyLine;

/** Directives that mark the start of a section */
const SECTION_START_PATTERN =
  /^\{(?:start_of_(?:verse|chorus|bridge|tab)|so[cvbt])(?::?\s*(.+?))?\}$/i;

/** Directives that mark the end of a section */
const SECTION_END_PATTERN =
  /^\{(?:end_of_(?:verse|chorus|bridge|tab)|eo[cvbt])\}$/i;

/** Metadata directives to skip (title, artist, etc.) */
const META_DIRECTIVE_PATTERN =
  /^\{(?:title|t|subtitle|st|artist|key|capo|tempo|comment|c|ci|cb)(?::.*?)?\}$/i;

/** Comment line */
const COMMENT_PATTERN = /^#/;

/**
 * Parse a single ChordPro line into chord-lyric pairs.
 * E.g. "[G]Amazing [C]grace" → [{chord:"G", lyric:"Amazing "}, {chord:"C", lyric:"grace"}]
 */
export const parseChordProLine = (line: string): ChordLyricPair[] => {
  const pairs: ChordLyricPair[] = [];
  const regex = /\[([^\]]*)\]/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // Text before first chord
  match = regex.exec(line);
  if (!match) {
    // No chords in this line
    return [{ chord: "", lyric: line }];
  }

  if (match.index > 0) {
    pairs.push({ chord: "", lyric: line.slice(0, match.index) });
  }

  // Process each chord
  do {
    const chord = match[1];
    lastIndex = regex.lastIndex;
    const nextMatch = regex.exec(line);
    const lyric = nextMatch
      ? line.slice(lastIndex, nextMatch.index)
      : line.slice(lastIndex);
    pairs.push({ chord, lyric });
    match = nextMatch;
  } while (match);

  return pairs;
};

/**
 * Parse full ChordPro content into an array of structured lines.
 */
export const parseChordPro = (content: string): ParsedLine[] => {
  const lines = content.split("\n");
  const result: ParsedLine[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();

    // Skip comment lines
    if (COMMENT_PATTERN.test(line)) continue;

    // Skip end-of-section directives
    if (SECTION_END_PATTERN.test(line)) continue;

    // Skip metadata directives
    if (META_DIRECTIVE_PATTERN.test(line)) continue;

    // Section start directives → section header
    const sectionMatch = SECTION_START_PATTERN.exec(line);
    if (sectionMatch) {
      const directiveLower = line.toLowerCase();
      let label = sectionMatch[1]?.trim() ?? "";
      if (!label) {
        if (directiveLower.includes("chorus") || directiveLower.includes("soc"))
          label = "Chorus";
        else if (directiveLower.includes("verse") || directiveLower.includes("sov"))
          label = "Verse";
        else if (directiveLower.includes("bridge") || directiveLower.includes("sob"))
          label = "Bridge";
        else if (directiveLower.includes("tab") || directiveLower.includes("sot"))
          label = "Tab";
      }
      result.push({ type: "section", label });
      continue;
    }

    // Empty line
    if (line === "") {
      result.push({ type: "empty" });
      continue;
    }

    // Content line with potential chords
    result.push({ type: "line", pairs: parseChordProLine(line) });
  }

  return result;
};
