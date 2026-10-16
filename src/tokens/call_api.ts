let refresh: Promise<Response> | null = null;

export default async function callApi(
	input: RequestInfo | URL,
	init?: RequestInit,
): Promise<Response> {
	let res = await fetch(input, init);

	if (res.headers.get("Token-Expired") !== "True") {
		return res;
	}

	refresh ??= fetch("/api/auth/refresh").finally(() => {
		refresh = null;
	});

	const refreshResponse = await refresh;

	if (!refreshResponse.ok) {
		return res;
	}

	res = await fetch(input, init);
	if (!res.ok) {
		return res;
	}

	return res;
}
