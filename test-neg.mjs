// Negative tests: the screen must reject invalid or off-topic lines.
// Run: node --test test.mjs test-neg.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { screenEntry, ENTRY } from "./main.ts";

const cases = [
  ["141 characters rejected", "x".repeat(141), "length"],
  ["140 characters exactly accepted", "Dad naps daily " + "groan ".repeat(20) + "groan", null],
  ["whitespace-only rejected", "   ", "whitespace"],
  ["empty rejected", "", "length"],
  ["multi-line rejected", "Dad naps daily\nthen he groans.", "single line"],
  ["trailing whitespace rejected", "Dad naps daily. ", "whitespace"],
  ["control character rejected", "Dad naps daily.\x07", "control"],
  ["invisible character rejected", "Dad\u200bnaps daily.", "invisible"],
  ["no letters rejected", "12345 !!!", "letters"],
  ["fewer than 5 words rejected", "Dad naps daily.", "5 words"],
  ["off-topic rejected", "The cat slept all afternoon on the warm windowsill.", "dad joke"],
  ["original entry accepted", ENTRY, null],
];

for (const [name, input, want] of cases) {
  test(name, () => {
    const problem = screenEntry(input);
    if (want === null) assert.equal(problem, null);
    else assert.ok(problem && problem.includes(want), `got: ${problem}`);
  });
}
