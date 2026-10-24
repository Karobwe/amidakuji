export const LIMITS = {
  minPlayers: 2,
  maxPlayers: 12,
  minRungs: 1,
  maxRungs: 6,
  labelLength: 40,
} as const;

export interface Setup {
  startPoints: string[];
  endPoints: string[];
  minRungs: number;
}

export interface Ladder extends Setup {
  /** Each entry connects column n to n + 1, in top-to-bottom order. */
  rungs: number[];
}

export const DEFAULT_SETUP: Setup = {
  startPoints: ["Ana", "Max", "Sam", "Tom"],
  endPoints: ["Pen", "Ruler", "Book", "Bag"],
  minRungs: 2,
};

export function shuffle<T>(items: readonly T[], random = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function validateSetup(setup: Setup): string | null {
  const count = setup.startPoints.length;
  if (
    count < LIMITS.minPlayers ||
    count > LIMITS.maxPlayers ||
    count !== setup.endPoints.length
  ) {
    return "Choose between 2 and 12 participants, with one outcome for each person.";
  }
  if (
    !Number.isInteger(setup.minRungs) ||
    setup.minRungs < LIMITS.minRungs ||
    setup.minRungs > LIMITS.maxRungs
  ) {
    return "Choose between 1 and 6 minimum rungs per column.";
  }
  if (
    [...setup.startPoints, ...setup.endPoints].some(
      (label) => !label.trim() || label.trim().length > LIMITS.labelLength,
    )
  ) {
    return "Give every participant and outcome a name of 1 to 40 characters.";
  }
  return null;
}

export function createLadder(setup: Setup, random = Math.random): Ladder {
  const error = validateSetup(setup);
  if (error) throw new Error(error);
  // Allocate a distinct level to every rung: no collision retries or fixed level ceiling.
  // An optional extra rung per gap avoids a fixed permutation parity.
  const rungs = setup.startPoints
    .slice(1)
    .flatMap((_, column) =>
      Array<number>(setup.minRungs + Math.floor(random() * 2)).fill(column),
    );
  return {
    startPoints: setup.startPoints.map((label) => label.trim()),
    endPoints: setup.endPoints.map((label) => label.trim()),
    minRungs: setup.minRungs,
    rungs: shuffle(rungs, random),
  };
}

/** Column after each rung; shared by the SVG path and the results list. */
export function tracePath(rungs: readonly number[], start: number): number[] {
  const path = [start];
  for (const left of rungs) {
    const column = path[path.length - 1];
    path.push(
      column === left ? column + 1 : column === left + 1 ? column - 1 : column,
    );
  }
  return path;
}
