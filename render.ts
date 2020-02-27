import { colors, encode, decode, Process } from "./deps.ts";

const { blue, dim } = colors;

let customRenderer: (e: CustomEvent) => void;

function basicRenderer(e: CustomEvent) {
  const { target, detail } = e;
  const msg = `${blue("›")} ${dim((target as Process).name)} ${decode(
    detail
  )}`;
  Deno.stdout.writeSync(encode(msg));
}

function setCustomRenderer(fn: (e: CustomEvent) => void) {
  customRenderer = fn;
}

function render(e: CustomEvent) {
  if (typeof customRenderer === "function") {
    customRenderer(e);
    return;
  }
  basicRenderer(e);
}

export { render, setCustomRenderer };
