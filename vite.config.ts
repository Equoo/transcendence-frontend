import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

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
					rewrite: (path): string => path.replace(/^\/api/u, ""),
				},
			},
		},
		preview: {
			host: "0.0.0.0",
		},
	};
});
