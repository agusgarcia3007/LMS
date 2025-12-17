import { Resvg, initWasm } from "@resvg/resvg-wasm";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";

let initialized = false;

async function getWasmPath(): Promise<string> {
  const require = createRequire(import.meta.url);
  const wasmPath = require.resolve("@resvg/resvg-wasm/index_bg.wasm");
  return wasmPath;
}

export async function initResvg() {
  if (initialized) return;
  const wasmPath = await getWasmPath();
  const wasmBuffer = await readFile(wasmPath);
  await initWasm(wasmBuffer);
  initialized = true;
}

export async function svgToPng(svg: string, width: number): Promise<Uint8Array> {
  await initResvg();
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: width },
  });
  const pngData = resvg.render();
  return pngData.asPng();
}
