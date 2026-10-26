import callApi from "@/tokens/callApi";

export type IaResult = { ok: true } | { ok: false };

export default async function fetchHealthCheckIa(): Promise<IaResult> {
	const res = await callApi("/api/ai/health/check", { method: "GET" });
    
	return { ok: res.ok };
}
