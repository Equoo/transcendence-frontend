import { data } from "react-router";

import { APIError, type ProblemDetail } from "../../api/problem_detail";
import { createFile, deleteFile, updateFileName } from "../api/files.api";
import type { Route } from "./+types/files.route";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientAction({
	request,
	params,
}: Route.ClientActionArgs) {
	let res;
	if (request.method === "POST") {
		res = await createFile(await request.formData());
	} else if (request.method === "DELETE") {
		res = await deleteFile(params.key ?? "");
	} else if (request.method === "PATCH") {
		res = await updateFileName(
			params.key ?? "",
			(await request.formData()).get("Name") as string,
		);
	} else {
		throw new Error("Unexpected error during file action");
	}

	if (!res.ok) {
		if (res.status === 400) {
			return data(new APIError((await res.json()) as ProblemDetail));
		}
		throw new APIError((await res.json()) as ProblemDetail);
	}

	return data(res);
}
