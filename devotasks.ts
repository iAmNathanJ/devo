import { task, parallel, series } from "./mod.ts";

task("task1", "deno task-mock.ts");
task("task2", "deno task-mock.ts");
task("task3", "deno task-mock.ts");
task("task4", "deno task-mock.ts");
task("task5", "deno task-mock.ts");
task("task6", "deno task-mock.ts");

parallel("p1", ["task1", "task2", "task3", "task4", "task5", "task6"]);
parallel("p2", ["task1", "task2", "task3", "task4", "task5", "task6"]);

series("default", [
  "task1",
  "task2",
  parallel("sub1", [
    "task1",
    "task2",
    series("sub2", [
      "task1",
      "task2",
      "task3"
    ]),
    "task4",
    "task5",
    "task6"
  ]),
  "task4",
  "task5",
  "task6"
]);
