import { Process, ProcessParams } from "./deps.ts";
import { render } from "./render.ts";

export type Runnable = {
  type: string;
  name: string;
  cmd?: string;
  run(): Promise<any>;
};

const cache = new Map<string, Runnable>();

function task(name: string, cmd: string): Runnable {
  const task = {
    name,
    cmd,
    type: "task",
    run: async () => runProcess({ name, cmd })
  };
  cache.set(name, task);
  return task;
}

function series(name: string, runnables: (Runnable | string)[]) {
  const s = {
    name,
    type: "series",
    run: async () => {
      for (const r of runnables) {
        await (
          cache.get(r as string) ||
          r as Runnable
        ).run();
      }
    }
  };
  cache.set(name, s);
  return s;
}

function parallel(name: string, runnables: (Runnable | string)[]) {
  const p = {
    name,
    type: "parallel",
    run: async () => {
      return Promise.all(runnables.map(r => {
        return (
          cache.get(r as string) ||
          r as Runnable
        ).run();
      }));
    }
  };
  cache.set(name, p);
  return p;
}

async function runProcess(process: ProcessParams) {
  const proc = new Process(process);
  await proc
    .on("stdout", render)
    .start()
    .complete();
  proc.off("stdout", render);
}

export { task, series, parallel, cache };
