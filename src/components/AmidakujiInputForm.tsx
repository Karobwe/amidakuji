import { FormEvent } from "react";
import { LIMITS, Setup, shuffle, validateSetup } from "@/lib/ladder";

interface Props {
  setup: Setup;
  onChange: (setup: Setup) => void;
  onGenerate: () => void;
  hasDraw: boolean;
}

export default function AmidakujiInputForm({
  setup,
  onChange,
  onGenerate,
  hasDraw,
}: Props) {
  const error = validateSetup(setup);

  function resize(count: number) {
    onChange({
      ...setup,
      startPoints: Array.from(
        { length: count },
        (_, i) => setup.startPoints[i] ?? `Input ${i + 1}`,
      ),
      endPoints: Array.from(
        { length: count },
        (_, i) => setup.endPoints[i] ?? `Output ${i + 1}`,
      ),
    });
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!error) onGenerate();
  }

  return (
    <form
      onSubmit={submit}
      className="setup-panel"
      aria-labelledby="setup-title"
    >
      <div className="section-heading">
        <h2 id="setup-title">Set up your draw</h2>
        <p>One participant. One outcome. Let the ladder connect them.</p>
      </div>
      <div className="settings-row">
        <label htmlFor="count">
          Participants
          <select
            id="count"
            value={setup.startPoints.length}
            onChange={(event) => resize(Number(event.target.value))}
          >
            {Array.from({ length: LIMITS.maxPlayers - 1 }, (_, i) => i + 2).map(
              (count) => (
                <option key={count}>{count}</option>
              ),
            )}
          </select>
        </label>
        <label htmlFor="rungs">
          Minimum rungs
          <select
            id="rungs"
            aria-describedby="rungs-help"
            value={setup.minRungs}
            onChange={(event) =>
              onChange({ ...setup, minRungs: Number(event.target.value) })
            }
          >
            {Array.from({ length: LIMITS.maxRungs }, (_, i) => i + 1).map(
              (count) => (
                <option key={count}>{count}</option>
              ),
            )}
          </select>
        </label>
      </div>
      <p id="rungs-help" className="field-help">
        Rungs connect neighboring columns. Add more for longer paths.
      </p>
      <div className="entry-headings">
        <div>
          <h3>Start points</h3>
          <button
            className="text-button"
            type="button"
            aria-label="Shuffle start points"
            onClick={() =>
              onChange({ ...setup, startPoints: shuffle(setup.startPoints) })
            }
          >
            Shuffle
          </button>
        </div>
        <div>
          <h3>End points</h3>
          <button
            className="text-button"
            type="button"
            aria-label="Shuffle end points"
            onClick={() =>
              onChange({ ...setup, endPoints: shuffle(setup.endPoints) })
            }
          >
            Shuffle
          </button>
        </div>
      </div>
      <div className="entries">
        {setup.startPoints.map((_, index) => (
          <div className="entry-row" key={index}>
            {(["startPoints", "endPoints"] as const).map((field) => (
              <label className="entry-input" key={field}>
                <span className="sr-only">
                  {field === "startPoints" ? "Participant" : "Outcome"}{" "}
                  {index + 1}
                </span>
                <span className="entry-number" aria-hidden="true">
                  {index + 1}
                </span>
                <input
                  required
                  maxLength={LIMITS.labelLength}
                  value={setup[field][index]}
                  onChange={(event) =>
                    onChange({
                      ...setup,
                      [field]: setup[field].map((label, i) =>
                        i === index ? event.target.value : label,
                      ),
                    })
                  }
                />
              </label>
            ))}
          </div>
        ))}
      </div>
      <p className="field-help">These are column labels, not fixed pairings.</p>
      {error && (
        <p className="error-message" role="status" id="setup-error">
          {error}
        </p>
      )}
      <button
        className="button primary generate-button"
        type="submit"
        disabled={Boolean(error)}
        aria-describedby={error ? "setup-error" : undefined}
      >
        {hasDraw ? "Generate a new ladder" : "Generate ladder"}
      </button>
      <p className="field-help">
        Changes apply only when you generate a ladder.
      </p>
    </form>
  );
}
