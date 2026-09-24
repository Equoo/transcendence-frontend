import { data } from "react-router";

import { APIError, type ProblemDetail } from "../../api/problem_detail";
import {
	createFile,
	deleteFile,
	deleteFolder,
	renameFolder,
	updateFileName,
} from "../api/files.api";
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
		res = params.key
			? await deleteFile(params.key)
			: await deleteFolder(
					(await request.formData()).get("From") as string,
				);
	} else if (request.method === "PATCH") {
		const formData = await request.formData();
		const folder = (formData.get("Folder") as string | null) ?? "";
		const name = formData.get("Name") as string;
		res = params.key
			? await updateFileName(params.key, folder + name)
			: await renameFolder(
					formData.get("From") as string,
					`${folder}${name}/`,
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
