// Own tests for the one-liner groan-off (dad joke) entry.
// Run: node --test test.mjs test-neg.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { ENTRY, screenEntry } from "./main.ts";

test("entry passes the screen", () => {
  assert.equal(screenEntry(ENTRY), null);
});

test("entry is within the 1..140 character gate", () => {
  const n = [...ENTRY].length;
  assert.ok(n >= 1 && n <= 140, `entry is ${n} characters`);
});

test("entry is one line, no trailing newline or whitespace", () => {
  assert.ok(!/[\r\n]/.test(ENTRY));
  assert.equal(ENTRY, ENTRY.trim());
});

test("program writes exactly the entry to entry.txt, deterministically", () => {
  const outs = [];
  for (let i = 0; i < 3; i++) {
    const dir = mkdtempSync(join(tmpdir(), "groan-off-out-"));
    const r = spawnSync(process.execPath, ["main.ts"], {
      cwd: import.meta.dirname,
      env: { ...process.env, MAKEFUN_OUTPUT_DIR: dir },
      encoding: "utf8",
    });
    assert.equal(r.status, 0, r.stderr);
    outs.push(readFileSync(join(dir, "entry.txt"), "utf8"));
  }
  assert.equal(outs[0], ENTRY);
  assert.equal(outs[1], ENTRY);
  assert.equal(outs[2], ENTRY);
});
