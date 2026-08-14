import { data } from "react-router";
import { APIError, type ProblemDetail } from "../../api/problem_detail";
import { createFile } from "../api/files.api";
import type { Route } from "./+types/files.route";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientAction({ request }: Route.ClientActionArgs) {
	const res = await createFile(await request.formData());

	if (!res.ok) {
		throw new APIError((await res.json()) as ProblemDetail);
	}

	return data(res);
}
