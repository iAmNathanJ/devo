import { join, colors } from "./deps.ts";
import { DENO_BIN } from "./env.ts";

const { build, mkdir, writeFile } = Deno;

async function runDenoInstaller() {
  // todo: handle dynamic regex construction to enable -v --version arg
  // current match will find the latest version from release page
  console.log("fetching deno releases");

  const releasePage = await fetch("https://github.com/denoland/deno/releases")
    .then(r => r.text())
    .catch(e => {
      console.error("error fetching deno releases", e);
      Deno.exit(1);
    });

  const releaseRegex = /"\/denoland\/deno\/releases\/tag\/(?<version>.*)"/g;
  const match = releaseRegex.exec(releasePage);

  if (!match?.groups?.version) {
    console.error("not found: latest deno version");
    Deno.exit(1);
  }

  const { version } = match.groups;
  const os = build.os === "mac" ? "osx" : build.os;
  const ext = build.os === "win" ? "zip" : "gz";
  const resource =
    `https://github.com/denoland/deno/releases/download/${version}/deno_${os}_x64.${ext}`;

  console.log(`installing ${version}`);

  const dwnld = await fetch(resource)
    .then(r => r.arrayBuffer())
    .catch(e => {
      console.error(`error fetching deno release ${version}`);
      console.error(e);
      Deno.exit(1);
    });

  const archive = join(DENO_BIN, "deno.gz");
  await mkdir(DENO_BIN, { recursive: true });
  await writeFile(archive, new Uint8Array(dwnld));

  // todo: unzip for windows
  console.log("extracting");

  const exe = join(DENO_BIN, "deno");
  const extract = Deno.run({
    args: ["gunzip", "-df", archive]
  });
  await extract.status();
  await Deno.chmod(exe, 0o755);

  console.log(colors.dim("==="));
  console.log(colors.green(`deno ${version} `) + colors.dim(`${exe}`));
}

export { runDenoInstaller };
