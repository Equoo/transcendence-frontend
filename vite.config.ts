import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");

	const proxyTarget = `http://${env.BACKEND_IP}:8080`;
	return {
		plugins: [react()],
		server: {
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
