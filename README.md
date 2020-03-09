# `devo`

Run tasks in [Deno]. Supports serial and parallel execution.

## CLI

### install

```sh
$ deno install -A devo https://denopkg.com/iamnathanj/devo@v1.5.0/cli.ts
```

### run
```sh
$ devo [taskname]
```

If no task name is provided, devo will look for a task named `default`. (see below)

## Usage

### Creating Tasks

Create a task file in the root of your project called `devo.ts`.

```ts
// devo.ts
import { task, parallel, series } from "https://denopkg.com/iamnathanj/devo@v1.5.0/mod.ts";

const JS = "rollup -c";
const CSS = "sass src/styles:dist/css --watch";
const SERVER = "deno --allow-net server.ts";

task("rollup", JS);
task("scss", CSS);
task("server", SERVER);

parallel("dev", ["server", "rollup", "scss"]);

series("default", ["dev"]);
```

### Composing Tasks

Tasks are composable in `series` or `parallel`. These methods are also composable with each other. This means you can build complex process chains.

```ts
import { task, parallel, series } from "https://denopkg.com/iamnathanj/devo@v1.5.0/mod.ts";

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

### Watching

Devo currently supports watching on `task`s only. Simply call `task(...).watch()` to recursively watch `Deno.cwd()` for changes to `.ts`, `.tsx`, and `.js` files.
Or, you can set explicit [WatchOptions].

```ts
task("server", SERVER).watch({
  batch: true,
  root: `${Deno.cwd()}/src`,
  walkOptions: {
    exts: [".ts", ".tsx", ".js", "jsx", "json"]
  }
});
```

### Deno (and node) Executables

Just like `npm` scripts, `devo` will augment your `PATH` to run executables. You can use `devo install` to install executables locally to `<project>/.deno/bin`. This way, you can invoke them from tasks without a global install.

```sh
$ devo install foo <https://module.url/foo.ts> [permissions]
```

```ts
// devo.ts
import { task } from "https://denopkg.com/iamnathanj/devo@v1.5.0/mod.ts";

task("run-foo", "foo");
```

Similarly, devo will add `<project>/node_modules/.bin` to your path if you want to run a node based task.

```sh
$ npm i -D @babel/core @babel/cli
```

```ts
// devo.ts
import { task } from "https://denopkg.com/iamnathanj/devo@v1.5.0/mod.ts";

task("js", "babel src -d dist");
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
[WatchOptions]: https://github.com/iAmNathanJ/fs-poll#options
[fs-poll]: https://github.com/iAmNathanJ/fs-poll
