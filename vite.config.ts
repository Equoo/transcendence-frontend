import path from "node:path";

import { reactRouter } from "@react-router/dev/vite";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(() => {
	const proxyTarget = `http://keepgrouped-back-dev:8080`;

	return {
		plugins: [
			reactRouter(),
			babel({ presets: [reactCompilerPreset()] }),
			tailwindcss(),
		],
		server: {
			watch: {
				usePolling: true,
			},
			allowedHosts: true,
			proxy: {
				"/api": {
					target: proxyTarget,
					changeOrigin: true,
					rewrite: (url): string => url.replace(/^\/api/u, ""),
					ws: true,
				},
			},
		},
		preview: {
			host: "0.0.0.0",
		},
		resolve: {
			alias: { "@": path.resolve(__dirname, "./src") },
		},
	};
});
