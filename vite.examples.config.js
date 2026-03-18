import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "examples",
  base: "/animate-graph/media/examples/", // For GitHub pages deployment
  build: {
    outDir: "../docs/media/examples",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "examples/index.html"),
        static: resolve(__dirname, "examples/static.html"),
        animation: resolve(__dirname, "examples/animation.html"),
        "import-umd": resolve(__dirname, "examples/import/umd.html"),
        "import-src": resolve(__dirname, "examples/import/src.html"),
        backpropagation: resolve(__dirname, "examples/backpropagation/index.html"),
        "neural-network": resolve(__dirname, "examples/neural-network/index.html"),
        bfs: resolve(__dirname, "examples/algorithms/bfs.html"),
        dfs: resolve(__dirname, "examples/algorithms/dfs.html"),
        dijkstra: resolve(__dirname, "examples/algorithms/dijkstra.html"),
      },
    },
  },
  resolve: {
    alias: {
      "@veehz/animate-graph": resolve(__dirname, "src/index.ts"),
    },
  },
});
