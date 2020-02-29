import { join, parse, colors } from "./deps.ts";
import { prepareEnv } from "./env.ts";
import { installLocal } from "./install.ts";
import { cache } from "./runnable.ts";

if (import.meta.main) {
  prepareEnv();
  await cli();
}

async function cli() {
  const args = parse(Deno.args);
  const { _: [command, ...subCommands] } = args;

  switch (command) {
    case undefined:
      await runTask("default");
      break;
    case "install":
      const [name, url] = subCommands;
      const denoInstallArgs = Deno.args.slice(3);
      await installLocal({ name, url, denoInstallArgs });
      break;
    default:
      await runTask(command);
      break;
  }
}

async function runTask(task: string) {
  await import(join(Deno.cwd(), "devo.ts")).catch(e => {
    console.error(colors.red("Error loading devo.ts file"));
    console.error(e);
  });

  if (!cache.has(task) && !cache.has("default")) {
    console.log(`task not found: ${task}`);
    Deno.exit();
  }

  cache.get(task)?.run();
}
