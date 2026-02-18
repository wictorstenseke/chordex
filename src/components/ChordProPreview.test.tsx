import { describe, expect, it } from "vitest";

import { ChordProPreview } from "@/components/ChordProPreview";
import { render, screen } from "@/test/utils";

describe("ChordProPreview", () => {
  it("should render with aria-label", () => {
    render(<ChordProPreview content="" />);
    expect(screen.getByLabelText("ChordPro preview")).toBeInTheDocument();
  });

  it("should render lyrics text", () => {
    render(<ChordProPreview content="[G]Amazing [C]grace" />);
    expect(screen.getAllByText(/Amazing/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/grace/)[0]).toBeInTheDocument();
  });

  it("should render section headers", () => {
    const content = ["{start_of_verse}", "[G]Lyrics", "{end_of_verse}"].join(
      "\n"
    );
    render(<ChordProPreview content={content} />);
    expect(screen.getByText("Verse")).toBeInTheDocument();
  });

  it("should not render raw ChordPro directives as text", () => {
    const content = [
      "{title: My Song}",
      "{start_of_verse}",
      "[G]Lyrics",
      "{end_of_verse}",
    ].join("\n");
    render(<ChordProPreview content={content} />);
    expect(screen.queryByText("{title: My Song}")).not.toBeInTheDocument();
    expect(screen.queryByText("{start_of_verse}")).not.toBeInTheDocument();
    expect(screen.queryByText("{end_of_verse}")).not.toBeInTheDocument();
  });

  it("should render plain lyrics without chords", () => {
    render(<ChordProPreview content="Just plain lyrics" />);
    expect(screen.getAllByText("Just plain lyrics")[0]).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    render(<ChordProPreview content="[G]Test" className="custom-class" />);
    const preview = screen.getByLabelText("ChordPro preview");
    expect(preview.className).toContain("custom-class");
  });

  it("should render multiple sections", () => {
    const content = [
      "{start_of_verse}",
      "[G]Verse line",
      "{end_of_verse}",
      "{start_of_chorus}",
      "[C]Chorus line",
      "{end_of_chorus}",
    ].join("\n");

    render(<ChordProPreview content={content} />);
    expect(screen.getByText("Verse")).toBeInTheDocument();
    expect(screen.getByText("Chorus")).toBeInTheDocument();
  });
});
