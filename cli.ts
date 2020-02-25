import { join, parse } from "./deps.ts";
import { cache } from "./task.ts";

await import(join(Deno.cwd(), "devotasks.ts"));

const { _: [task = "default"] } = parse(Deno.args);

if (!cache.has(task) || !cache.has("default")) {
  console.log(`task not found: ${task}`);
  Deno.exit();
}

cache.get(task)?.run();
