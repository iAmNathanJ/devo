import { assert, assertEquals } from "./dev-deps.ts";
import { decode, delay } from "./deps.ts";
import { task, series, parallel } from "./runnable.ts";
import { setCustomRenderer } from "./render.ts";

let testLog: string[] = [];

setCustomRenderer((e: CustomEvent) => {
  testLog.push(decode(e.detail).trim());
});

const t1 = task("test-task", "echo 0");
const t2 = task("test-task", "echo 1");
const s = series("test-series", [t1, t2]);
const p = parallel("test-parallel", [t1, t2]);

Deno.test("task runs", async () => {
  testLog = [];
  await t1.run();
  await delay(1);
  assertEquals(testLog[0], "0");
});

Deno.test("series runs all tasks", async () => {
  testLog = [];
  await s.run();
  await delay(1);
  assertEquals(testLog[0], "0");
  assertEquals(testLog[1], "1");
});

Deno.test("parallel runs all tasks", async () => {
  testLog = [];
  await p.run();
  await delay(1);
  assert(testLog.includes("0"));
  assert(testLog.includes("1"));
});
