import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tempo } from "tempo-devtools/dist/vite";

const conditionalPlugins: [string, Record<string, any>][] = [];

// @ts-ignore
if (process.env.TEMPO === "true") {
  conditionalPlugins.push(["tempo-devtools/swc", {}]);
}

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    base: command === "serve" ? "/" : "./",
    define: {
      "process.env.VITE_PUBLIC_URL": JSON.stringify(
        process.env.VITE_PUBLIC_URL,
      ),
      "process.env.VITE_TEMPO": JSON.stringify(process.env.TEMPO),
      "process.env.VITE_BASE_PATH": JSON.stringify(
        process.env.VITE_BASE_PATH || "/",
      ),
    },
    optimizeDeps: {
      entries: ["src/main.tsx", "src/tempobook/**/*"],
    },
    plugins: [
      react({
        plugins: conditionalPlugins,
      }),
      tempo(),
    ],
    resolve: {
      preserveSymlinks: true,
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      // @ts-ignore
      allowedHosts: process.env.TEMPO === "true" ? true : undefined,
      host: "0.0.0.0",
      port: 3000,
      strictPort: true,
    },
  };
});
