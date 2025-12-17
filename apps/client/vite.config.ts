import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

const nativeModules = [
  "@resvg/resvg-js",
  "@resvg/resvg-js-darwin-arm64",
  "@resvg/resvg-js-darwin-x64",
  "@resvg/resvg-js-linux-x64-gnu",
  "@resvg/resvg-js-linux-x64-musl",
  "@resvg/resvg-js-win32-x64-msvc",
];

export default defineConfig({
  plugins: [
    nitro({
      preset: "bun",
      rollupConfig: {
        external: nativeModules,
      },
    }),
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart(),
    react(),
  ],
  optimizeDeps: {
    exclude: nativeModules,
    include: [
      "react",
      "react-dom",
      "@tanstack/react-query",
      "@tanstack/react-router",
    ],
  },
  ssr: {
    external: nativeModules,
    noExternal: [],
  },
});
