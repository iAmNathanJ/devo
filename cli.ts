import { join, parse, colors } from "./deps.ts";
import { cache } from "./runnable.ts";

if (import.meta.main) {
  cli();
}

async function cli() {
  await import(join(Deno.cwd(), "devo.ts")).catch(e => {
    console.error(colors.red("Error loading devo.ts file"));
    console.error(e);
  });

  const { _: [task = "default"] } = parse(Deno.args);

  if (!cache.has(task) && !cache.has("default")) {
    console.log(`task not found: ${task}`);
    Deno.exit();
  }

  cache.get(task)?.run();
}
