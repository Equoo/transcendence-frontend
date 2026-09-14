
const WHITESPACE = /\s+/gu;
const FORBIDDEN = /[$%^&*()+|~={}[\]:;<>?,./\\`´'"!@#]/gu;
const DASH_RUNS = /-{2,}/gu;
const EDGE_DASHES = /^-+|-+$/gu;

export function sanitizeChannelSlug(input?: string | null): string {
	if (!input?.trim()) { return ""; }

	return input
		.toLowerCase()
		.replace(WHITESPACE, "-")
		.replace(FORBIDDEN, "")
		.replace(DASH_RUNS, "-")
		.replace(EDGE_DASHES, "");
}
