import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(() => {
	const proxyTarget = `http://keepgrouped-back-dev:8080`;

	return {
		plugins: [react(), tailwindcss()],
		server: {
			allowedHosts: true,
			proxy: {
				"/api": {
					target: proxyTarget,
					changeOrigin: true,
					rewrite: (path): string => path.replace(/^\/api/u, ""),
				},
			},
		},
	};
});
