function render(e: CustomEvent) {
  Deno.stdout.writeSync(e.detail);
}

export { render };
