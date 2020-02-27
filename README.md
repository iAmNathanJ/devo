# `devo`

A task runner for [Deno].

## Install / Import

```sh
$ deno install --allow-run --allow-read devo https://cdn.jsdelivr.net/gh/iamnathanj/devo@v1.0.0/cli.ts
```

```ts
import { task, parallel, series } from "https://cdn.jsdelivr.net/gh/iamnathanj/devo@v1.0.0/mod.ts";
```

## Usage

Create a task file in the root of your project called `devo.ts`.

```ts
// devo.ts

task("rollup", "npx rollup -cw");
task("scss", "npx sass src/styles:dist/css --watch --color");
task("server", "deno --allow-net --allow-read server.ts");

parallel("dev", ["server", "rollup", "scss"]);

series("default", ["dev"]);
```

```sh
$ devo [taskname]
```

If no task name is provided, devo will look for a task named `deafult`. Given the manifest file above, this will run the default task.

### Composing Tasks

Tasks are composablea in `series` or `parallel`. These methods are also composable with each other. This means you can build complex process chains.

```ts
task("task1", "echo 1");
task("task2", "echo 2");
task("task3", "echo 3");

parallel("parallel-task1", ["task1", "task2", "task3"]);
parallel("parallel-task2", ["task1", "task2", "task3"]);

series("composed-task", ["parallel-task1", "parallel-task2"]);
```

Tasks can be referenced by string name (as shown above), but can also be written inline.

```ts
series("composed", [
  parallel("parallel-task1", [
    task("task1", "echo 1"),
    task("task2", "echo 2")
  ]),

  task("delay", "sleep 3"),

  parallel("parallel-task2", [
    task("task3", "echo 3"),
    task("task4", "echo 4")
  ])
]);
```

### Manually Running Tasks

If you install the `devo` executable, then it will take care of running tasks from your `devo.ts` file. If you prefer, you can call `.run` on any of the devo exports. This means you can use any file name you want or create your own runner.

```ts
task("task1", "echo 1");
task("task2", "echo 2");
task("task3", "echo 3");
task("sleep", "sleep 3");

// you can call run on `task`, `series`, or `parallel`
await parallel("parallel-task", ["task1", "task2", "task3"]).run();

// or assign it to a variable and run it later
const composed = series("composed-task", [
  "sleep",
  "parallel-task",
  "sleep",
  "parallel-task"
]);

await composed.run();
```

[Deno]: https://deno.land/
