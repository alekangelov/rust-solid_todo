import solid from "solid-start/vite";
import { defineConfig } from "vite";
import solidSvg from "vite-plugin-solid-svg";

export default defineConfig({
  plugins: [
    solid({
      ssr: false,
    }),
    solidSvg(),
  ],
});
