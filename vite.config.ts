import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  server: {
    port: 8000,
  },
  plugins: [
    /**
     * 提供VUE SFC支持
     * @see https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue
     */
    vue({ script: { defineModel: true } }),
  ],
});
