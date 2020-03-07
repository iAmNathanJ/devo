import { DENO_BIN } from "./env.ts";
import { runDenoInstaller } from "./deno-installer.ts";

type InstallOptions = {
  name: string;
  url: string;
  denoInstallArgs?: string[];
};

async function installLocal({
  name,
  url,
  denoInstallArgs = []
}: InstallOptions) {
  if (name === "deno") {
    return runDenoInstaller();
  }
  return installModule({ name, url, denoInstallArgs });
}

async function installModule({
  name,
  url,
  denoInstallArgs = []
}: InstallOptions) {
  await Deno.mkdir(DENO_BIN, { recursive: true });
  await Deno.run({
    args: ["deno", "install", ...denoInstallArgs, "--dir", DENO_BIN, name, url]
  }).status();
}

export { installLocal };
