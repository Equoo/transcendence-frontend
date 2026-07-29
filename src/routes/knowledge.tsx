import type { JSX } from "react";
import { fetchFiles } from "../files/api/files.api";
import type { Route } from "./+types/knowledge";
import { APIError } from "../api/problem_detail";
import APIFileList from "../files/components/APIFileList";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientLoader() {
	const res = await fetchFiles();

	if (!res.ok) {
		throw new APIError(res.prob);
	}
	return res.res;
}

export default function Knowledge({
	loaderData,
}: Route.ComponentProps): JSX.Element {
	return (
		<main className="flex-1">
			<APIFileList files={loaderData}></APIFileList>
		</main>
	);
}
