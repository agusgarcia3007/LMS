import { Resvg, initWasm } from "@resvg/resvg-wasm";

let initialized = false;

const WASM_URL = "https://unpkg.com/@resvg/resvg-wasm@2.6.2/index_bg.wasm";

export async function svgToPng(svg: string, width: number): Promise<Uint8Array> {
  if (!initialized) {
    await initWasm(fetch(WASM_URL));
    initialized = true;
  }
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: width } });
  return resvg.render().asPng();
}
