import { useState } from "react";
import { Ladder, tracePath } from "@/lib/ladder";
import { PATH_COLORS } from "./Amidakuji";

interface Props {
  ladder: Ladder;
  selected: number | null;
  onSelect: (index: number | null) => void;
}

export default function DrawResults({ ladder, selected, onSelect }: Props) {
  const [copyStatus, setCopyStatus] = useState("");
  const results = ladder.startPoints.map((name, index) => {
    const columns = tracePath(ladder.rungs, index);
    return { name, outcome: ladder.endPoints[columns[columns.length - 1]] };
  });

  async function copyResults() {
    try {
      await navigator.clipboard.writeText(
        results
          .map(({ name, outcome }, i) => `${i + 1}. ${name} → ${outcome}`)
          .join("\n"),
      );
      setCopyStatus("Results copied.");
    } catch {
      setCopyStatus("Copy unavailable. Select and copy the results below.");
    }
  }

  return (
    <section className="results" aria-labelledby="results-title">
      <div className="results-heading">
        <h3 id="results-title">Your results</h3>
        <button type="button" className="text-button" onClick={copyResults}>
          Copy results
        </button>
      </div>
      <p className="field-help">
        Select a result to follow its path. Select it again to see all paths.
      </p>
      <ol className="result-list">
        {results.map(({ name, outcome }, i) => (
          <li key={i}>
            <button
              type="button"
              className="result-row"
              aria-pressed={selected === i}
              onClick={() => onSelect(selected === i ? null : i)}
            >
              <span className="result-number" style={{ color: PATH_COLORS[i] }}>
                {i + 1}
              </span>
              <span>{name}</span>
              <span aria-hidden="true">→</span>
              <strong>{outcome}</strong>
            </button>
          </li>
        ))}
      </ol>
      <p role="status" className="field-help">
        {copyStatus}
      </p>
    </section>
  );
}
