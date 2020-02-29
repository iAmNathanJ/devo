import { DENO_BIN } from "./env.ts";

type InstallOptions = {
  name: string;
  url: string;
  denoInstallArgs?: string[];
};

const argsMap = {
  "d": "--dir",
  "dir": "--dir"
};

async function installLocal({
  name,
  url,
  denoInstallArgs = []
}: InstallOptions) {
  await Deno.mkdir(DENO_BIN, { recursive: true });
  await Deno.run({
    args: ["deno", "install", "--dir", DENO_BIN, ...denoInstallArgs, name, url]
  }).status();
}

export { installLocal };
