import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

const srcDir = path.resolve(__dirname, "./src");
const supabasePath = path.join(srcDir, "lib/supabase.ts");
console.log("[DEBUG] __dirname type:", typeof __dirname);
console.log("[DEBUG] cwd:", process.cwd());
console.log("[DEBUG] srcDir:", srcDir);
console.log("[DEBUG] supabase.ts exists:", fs.existsSync(supabasePath));
console.log("[DEBUG] supabase.ts content:", fs.readFileSync(supabasePath, "utf-8").substring(0, 200));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": srcDir,
    },
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
