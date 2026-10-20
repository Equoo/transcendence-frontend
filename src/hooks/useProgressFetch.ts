import { useCallback, useRef, useState } from "react";
import { useRevalidator } from "react-router";

interface Init {
	method?: string;
	headers?: Record<string, string>;
	body?: XMLHttpRequestBodyInit;
}

export default function usePogressFetch(): {
	progress: number;
	total: number;
	doFetch: (endpoint: string, init?: Init) => Promise<Response>;
	abort: () => void;
} {
	const [progress, setProgress] = useState(0);
	const [total, setTotal] = useState(0);
	const revalidator = useRevalidator();
	const controllerRef = useRef<AbortController>(new AbortController());

	function abort(): void {
		controllerRef.current.abort();
	}

	const doFetch = useCallback(
		async (url: string, init: Init = {}) => {
			controllerRef.current.abort();
			controllerRef.current = new AbortController();
			const { signal } = controllerRef.current;

			await fetch("/api/me");
			return new Promise<Response>((resolve, reject) => {
				const req = new XMLHttpRequest();

				req.open(init.method ?? "GET", url);
				req.responseType = "blob";

				for (const [key, value] of Object.entries(init.headers ?? {})) {
					req.setRequestHeader(key, value);
				}

				req.upload.onprogress = (ev): void => {
					setProgress(ev.loaded);
					setTotal(ev.total);
				};

				req.onload = (): void => {
					const headers = new Headers();

					for (const line of req
						.getAllResponseHeaders()
						.split(`\r\n`)) {
						const idx = line.indexOf(":");

						if (idx > 0) {
							headers.append(
								line.slice(0, idx).trim(),
								line.slice(idx + 1).trim(),
							);
						}
					}
					resolve(
						new Response(req.response as BodyInit, {
							status: req.status,
							statusText: req.statusText,
							headers,
						}),
					);
				};
				req.onerror = (): void => {
					reject(new TypeError("Network request failed"));
				};
				req.onabort = (): void => {
					reject(new DOMException("Request aborted", "AbortError"));
				};
				signal.addEventListener("abort", () => {
					req.abort();
				});
				setTotal(0);
				setProgress(0);
				req.send(init.body);
			}).then(async (res) => {
				await revalidator.revalidate();
				return res;
			});
		},
		[revalidator],
	);
	return { progress, total, doFetch, abort };
}
