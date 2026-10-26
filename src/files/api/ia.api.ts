import callApi from "@/tokens/callApi";

export type IaResult = { ok: true } | { ok: false };

export default async function fetchHealthCheckIa(): Promise<IaResult> {
	const res = await callApi("/api/ai/health/check", { method: "GET" });

	console.warn(res.ok);
	return { ok: res.ok };
}
