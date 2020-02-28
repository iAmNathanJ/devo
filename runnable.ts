import { Process, WatchOptions } from "./deps.ts";
import { render } from "./render.ts";

export type Runnable = {
  type: string;
  name: string;
  run(): Promise<any>;
};

export type Task = Runnable & {
  cmd: string;
  watch(opts?: Partial<WatchOptions>): any;
};

const cache = new Map<string, Runnable>();

function task(name: string, cmd: string): Task {
  const proc = new Process({ name, cmd });
  const run = async () => runProcess(proc);
  const watch = (opts?: WatchOptions) => {
    proc.watch(opts);
    return { run };
  };

  const runnable = { type: "task", name, cmd, run, watch };
  cache.set(name, runnable);

  return runnable;
}

function series(name: string, runnables: (Runnable | string)[]) {
  const run = async () => {
    for (const r of runnables) {
      await getRunnable(r).run();
    }
  };

  const runnable = { type: "series", name, run };
  cache.set(name, runnable);

  return runnable;
}

function parallel(name: string, runnables: (Runnable | string)[]) {
  const run = async () => {
    return Promise.all(runnables.map(r => {
      return getRunnable(r).run();
    }));
  };

  const runnable = { type: "parallel", name, run };
  cache.set(name, runnable);

  return runnable;
}

async function runProcess(process: Process) {
  await process
    .on("stdout", render)
    .on("stderr", render)
    .start()
    .complete();
}

function getRunnable(r: Runnable | string): Runnable {
  return (
    cache.get(r as string) ||
    r as Runnable
  );
}

export { task, series, parallel, cache };
