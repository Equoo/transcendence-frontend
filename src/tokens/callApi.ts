import { queryClient } from "@/queryClient";

let refresh: Promise<Response> | null = null;

export default async function callApi(
	input: RequestInfo | URL,
	init?: RequestInit,
): Promise<Response> {
	let res = await fetch(input, init);

	if (res.status !== 401) {
		return res;
	}

	refresh ??= fetch("/api/auth/refresh").finally(() => {
		refresh = null;
	});

	const refreshResponse = await refresh;

	if (!refreshResponse.ok) {
		await queryClient.invalidateQueries({ queryKey: ["me"] });
		return res;
	}

	res = await fetch(input, init);
	if (!res.ok) {
		return res;
	}

	return res;
}
