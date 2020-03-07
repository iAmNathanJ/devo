import { join } from "./deps.ts";

const DENO_DIR = join(Deno.cwd(), ".deno");
const DENO_BIN = join(DENO_DIR, "bin");
const NODE_BIN = join(Deno.cwd(), "node_modules/.bin");

function getPathKey() {
  let PATH = "PATH";

  // windows calls it's path 'Path' usually, but this is not guaranteed.
  if (Deno.build.os === "win") {
    PATH = "Path";
    Object.keys(Deno.env()).forEach(function(e) {
      if (e.match(/^PATH$/i)) {
        PATH = e;
      }
    });
  }
  return PATH;
}

function getPathSeparator() {
  return Deno.build.os === "win" ? ";" : ":";
}

function prepareEnv() {
  const PATH = getPathKey();
  const SEP = getPathSeparator();

  Deno.env()[PATH] = [DENO_BIN, NODE_BIN, Deno.env()[PATH]].join(SEP);
}

export { prepareEnv, DENO_BIN };
