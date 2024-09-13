import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import ViteYaml from "@modyfi/vite-plugin-yaml";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), ViteYaml()],
	server: {
		watch: {
			usePolling: true,
		},
		host: true,
		// strictPort: true,
		port: 5173,
    open: true
	},
  preview:{
		host: true,
		// strictPort: true,
		port: 5173,
    open: false
  }
});
