const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  createLadder,
  tracePath,
  shuffle,
  validateSetup,
  DEFAULT_SETUP,
} = require("../.test-build/ladder.js");

function seeded(seed) {
  return () => (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 2 ** 32;
}

test("every supported size and density terminates and assigns each outcome exactly once", () => {
  for (let count = 2; count <= 12; count++) {
    for (let minRungs = 1; minRungs <= 6; minRungs++) {
      for (let seed = 1; seed <= 40; seed++) {
        const labels = Array.from({ length: count }, (_, i) => String(i));
        const ladder = createLadder(
          { startPoints: labels, endPoints: labels, minRungs },
          seeded(seed),
        );
        for (let gap = 0; gap < count - 1; gap++) {
          const rungs = ladder.rungs.filter((left) => left === gap).length;
          assert.ok(rungs >= minRungs && rungs <= minRungs + 1);
        }
        const destinations = labels.map((_, start) =>
          tracePath(ladder.rungs, start).at(-1),
        );
        assert.deepEqual(
          destinations.sort((a, b) => a - b),
          labels.map(Number),
        );
      }
    }
  }
});

test("traces horizontal crossings at their exact level", () => {
  assert.deepEqual(tracePath([0, 1, 0], 0), [0, 1, 2, 2]);
  assert.deepEqual(tracePath([0, 1, 0], 1), [1, 0, 0, 1]);
  assert.deepEqual(tracePath([0, 1, 0], 2), [2, 2, 1, 0]);
});

test("constant random source cannot cause an infinite retry loop", () => {
  const labels = Array.from({ length: 12 }, (_, i) => String(i));
  assert.equal(
    createLadder(
      { startPoints: labels, endPoints: labels, minRungs: 6 },
      () => 0,
    ).rungs.length,
    66,
  );
});

test("rejects invalid boundaries before generation", () => {
  for (const minRungs of [NaN, Infinity, -1, 0, 1.5, 7]) {
    assert.throws(() => createLadder({ ...DEFAULT_SETUP, minRungs }));
  }
  for (const count of [0, 1, 13]) {
    assert.throws(() =>
      createLadder({
        ...DEFAULT_SETUP,
        startPoints: Array(count).fill("A"),
        endPoints: Array(count).fill("B"),
      }),
    );
  }
  assert.throws(() => createLadder({ ...DEFAULT_SETUP, endPoints: ["A"] }));
  assert.throws(() =>
    createLadder({ ...DEFAULT_SETUP, startPoints: ["", "B", "C", "D"] }),
  );
  assert.throws(() =>
    createLadder({
      ...DEFAULT_SETUP,
      startPoints: ["A".repeat(41), "B", "C", "D"],
    }),
  );
  assert.equal(validateSetup(DEFAULT_SETUP), null);
});

test("draw is an independent snapshot; tracing and shuffling do not mutate inputs", () => {
  const setup = structuredClone(DEFAULT_SETUP);
  setup.startPoints[0] = "  Ana  ";
  const draw = createLadder(setup, seeded(1));
  const original = structuredClone(draw);
  setup.startPoints[0] = "Changed";
  tracePath(draw.rungs, 0);
  shuffle(draw.rungs, seeded(2));
  assert.deepEqual(draw, original);
  assert.equal(draw.startPoints[0], "Ana");
});
