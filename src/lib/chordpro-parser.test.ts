import { describe, expect, it } from "vitest";

import {
  parseChordPro,
  parseChordProLine,
  type ParsedLine,
} from "@/lib/chordpro-parser";

describe("parseChordProLine", () => {
  it("should parse a line with no chords", () => {
    expect(parseChordProLine("Amazing grace how sweet")).toEqual([
      { chord: "", lyric: "Amazing grace how sweet" },
    ]);
  });

  it("should parse a line with a single chord", () => {
    expect(parseChordProLine("[G]Amazing grace")).toEqual([
      { chord: "G", lyric: "Amazing grace" },
    ]);
  });

  it("should parse a line with multiple chords", () => {
    expect(parseChordProLine("[G]Amazing [C]grace [D]how sweet")).toEqual([
      { chord: "G", lyric: "Amazing " },
      { chord: "C", lyric: "grace " },
      { chord: "D", lyric: "how sweet" },
    ]);
  });

  it("should handle text before the first chord", () => {
    expect(parseChordProLine("Oh [G]Amazing grace")).toEqual([
      { chord: "", lyric: "Oh " },
      { chord: "G", lyric: "Amazing grace" },
    ]);
  });

  it("should handle a chord at end of line with no trailing text", () => {
    expect(parseChordProLine("[G]Amazing [C]")).toEqual([
      { chord: "G", lyric: "Amazing " },
      { chord: "C", lyric: "" },
    ]);
  });

  it("should handle an empty line", () => {
    expect(parseChordProLine("")).toEqual([{ chord: "", lyric: "" }]);
  });
});

describe("parseChordPro", () => {
  it("should parse an empty string", () => {
    expect(parseChordPro("")).toEqual([{ type: "empty" }]);
  });

  it("should parse a simple song with chords and lyrics", () => {
    const input = "[G]Amazing [C]grace\n[D]How sweet [G]the sound";
    const result = parseChordPro(input);
    expect(result).toEqual([
      {
        type: "line",
        pairs: [
          { chord: "G", lyric: "Amazing " },
          { chord: "C", lyric: "grace" },
        ],
      },
      {
        type: "line",
        pairs: [
          { chord: "D", lyric: "How sweet " },
          { chord: "G", lyric: "the sound" },
        ],
      },
    ]);
  });

  it("should parse section directives into section headers", () => {
    const input =
      "{start_of_verse}\n[G]Line one\n{end_of_verse}\n{start_of_chorus}\n[C]Chorus line\n{end_of_chorus}";
    const result = parseChordPro(input);

    expect(result).toEqual([
      { type: "section", label: "Verse" },
      { type: "line", pairs: [{ chord: "G", lyric: "Line one" }] },
      { type: "section", label: "Chorus" },
      { type: "line", pairs: [{ chord: "C", lyric: "Chorus line" }] },
    ]);
  });

  it("should parse named section directives", () => {
    const input = "{start_of_verse: Verse 2}\n[G]Second verse";
    const result = parseChordPro(input);

    expect(result).toEqual([
      { type: "section", label: "Verse 2" },
      { type: "line", pairs: [{ chord: "G", lyric: "Second verse" }] },
    ]);
  });

  it("should handle short-form section directives", () => {
    const input = "{soc}\n[C]Chorus\n{eoc}";
    const result = parseChordPro(input);

    expect(result).toEqual([
      { type: "section", label: "Chorus" },
      { type: "line", pairs: [{ chord: "C", lyric: "Chorus" }] },
    ]);
  });

  it("should skip metadata directives", () => {
    const input = "{title: Amazing Grace}\n{artist: John Newton}\n[G]Lyrics";
    const result = parseChordPro(input);

    expect(result).toEqual([
      { type: "line", pairs: [{ chord: "G", lyric: "Lyrics" }] },
    ]);
  });

  it("should skip comment lines", () => {
    const input = "# This is a comment\n[G]Lyrics";
    const result = parseChordPro(input);

    expect(result).toEqual([
      { type: "line", pairs: [{ chord: "G", lyric: "Lyrics" }] },
    ]);
  });

  it("should preserve empty lines", () => {
    const input = "[G]Line one\n\n[C]Line two";
    const result = parseChordPro(input);

    expect(result).toEqual<ParsedLine[]>([
      { type: "line", pairs: [{ chord: "G", lyric: "Line one" }] },
      { type: "empty" },
      { type: "line", pairs: [{ chord: "C", lyric: "Line two" }] },
    ]);
  });

  it("should handle bridge sections", () => {
    const input = "{start_of_bridge}\n[Am]Bridge line\n{end_of_bridge}";
    const result = parseChordPro(input);

    expect(result).toEqual([
      { type: "section", label: "Bridge" },
      { type: "line", pairs: [{ chord: "Am", lyric: "Bridge line" }] },
    ]);
  });

  it("should handle lines without any chords", () => {
    const input = "{start_of_verse}\nJust plain lyrics\n{end_of_verse}";
    const result = parseChordPro(input);

    expect(result).toEqual([
      { type: "section", label: "Verse" },
      {
        type: "line",
        pairs: [{ chord: "", lyric: "Just plain lyrics" }],
      },
    ]);
  });
});
