import { APIError, type ProblemDetail } from "@/api/problem_detail";
import callApi from "@/tokens/callApi";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function request(
	url: string,
	method: HttpMethod = "GET",
	body?: unknown,
): Promise<Response> {
	const init: RequestInit = { method };
	if (typeof body !== "undefined") {
		init.headers = { "Content-Type": "application/json" };
		init.body = JSON.stringify(body);
	}

	const response = await callApi(url, init);
	if (!response.ok) {
		throw new APIError((await response.json()) as ProblemDetail);
	}

	return response;
}

export async function requestJson<T>(
	url: string,
	method?: HttpMethod,
	body?: unknown,
): Promise<T> {
	const response = await request(url, method, body);
	return (await response.json()) as T;
}
