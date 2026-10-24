"use client";

import { useRef, useState } from "react";
import Amidakuji from "@/components/Amidakuji";
import AmidakujiInputForm from "@/components/AmidakujiInputForm";
import DrawResults from "@/components/DrawResults";
import { createLadder, DEFAULT_SETUP, Ladder, Setup } from "@/lib/ladder";

interface Draw {
  ladder: Ladder;
  revealed: boolean;
  selected: number | null;
}

export default function Home() {
  const [setup, setSetup] = useState<Setup>(DEFAULT_SETUP);
  const [draw, setDraw] = useState<Draw | null>(null);
  const boardHeading = useRef<HTMLHeadingElement>(null);

  function generate() {
    setDraw({ ladder: createLadder(setup), revealed: false, selected: null });
    boardHeading.current?.focus();
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <div>
          <h1>Amidakuji Ladder Game</h1>
          <p>Create and solve your own Amidakuji ladders easily!</p>
        </div>
        <a href="#how-to-play">How to play</a>
      </header>
      <div className="workspace">
        <AmidakujiInputForm
          setup={setup}
          onChange={setSetup}
          onGenerate={generate}
          hasDraw={draw !== null}
        />
        <section className="board-panel" aria-labelledby="board-title">
          <div className="board-heading">
            <div>
              <h2 id="board-title" ref={boardHeading} tabIndex={-1}>
                Your ladder
              </h2>
              <p role="status">
                {draw
                  ? `${draw.ladder.startPoints.length} participants · ${draw.ladder.rungs.length} rungs · ${draw.revealed ? "Solution visible" : "Ready to reveal"}`
                  : "Your next draw starts here."}
              </p>
            </div>
            <button
              type="button"
              className="button secondary"
              disabled={!draw}
              aria-expanded={draw?.revealed ?? false}
              aria-controls="draw-content"
              onClick={() =>
                setDraw((current) =>
                  current
                    ? {
                        ...current,
                        revealed: !current.revealed,
                        selected: null,
                      }
                    : null,
                )
              }
            >
              {draw?.revealed ? "Hide solution" : "Show solution"}
            </button>
          </div>
          <div id="draw-content">
            {draw ? (
              <>
                <Amidakuji
                  ladder={draw.ladder}
                  revealed={draw.revealed}
                  selected={draw.selected}
                />
                {draw.revealed ? (
                  <DrawResults
                    ladder={draw.ladder}
                    selected={draw.selected}
                    onSelect={(selected) =>
                      setDraw((current) =>
                        current ? { ...current, selected } : null,
                      )
                    }
                  />
                ) : (
                  <p className="board-hint">
                    Follow a line, or show the solution to reveal every pairing.
                  </p>
                )}
              </>
            ) : (
              <div className="empty-board">
                <svg
                  viewBox="0 0 160 144"
                  width="160"
                  height="144"
                  aria-hidden="true"
                  fill="none"
                  strokeWidth="3"
                  strokeLinecap="round"
                >
                  <path
                    stroke="#c9cddc"
                    d="M24 12v120M80 12v120M136 12v120M24 42h56M80 76h56M24 106h56"
                  />
                  <path stroke="#4f46e5" d="M24 12v30h56v34h56v56" />
                  <circle cx="24" cy="12" r="5" fill="#4f46e5" stroke="none" />
                </svg>
                <h3>A few names. A little chance.</h3>
                <p>
                  Add participants and outcomes, then generate a ladder to make
                  your connections.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
      <details id="how-to-play" className="how-to-play">
        <summary>How does Amidakuji work?</summary>
        <p>
          Start at a name and follow its line downward. At every horizontal
          rung, cross to the neighboring line, then keep going down. The outcome
          at the bottom is yours. Each outcome connects to exactly one
          participant.
        </p>
        <p>
          Generate a new ladder for a new draw. Showing or hiding a solution
          keeps the current draw unchanged. For casual choices and games;
          outcomes are randomized, but all possible pairings are not guaranteed
          to be equally likely.
        </p>
      </details>
      <footer>Made for the moments when you just need to choose.</footer>
    </main>
  );
}
