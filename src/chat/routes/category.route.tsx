import { data } from "react-router";

import { APIError } from "@/api/problem_detail";
import { queryClient } from "@/queryClient";

import { type CategoryBody, createCategory, deleteCategory, updateCategory } from "../api/chat.api";
import { removeCategory, upsertCategory } from "../cache/chat.cache";
import type { Route } from "./+types/category.route";

function categoryBodyFromForm(formData: FormData): CategoryBody {
	return {
		name: formData.get("Name") as string,
		whitelistRoles: formData.getAll("Roles") as string[],
	};
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientAction({ request }: Route.ClientActionArgs) {
	let res;

	try {
		const formdata = await request.formData();
		const category = categoryBodyFromForm(formdata);
		const id = formdata.get("id") as string | null;

		if (request.method === "DELETE") {
			if (!id) {
				throw new Error("Channel ID is required for deletion");
			}
			await deleteCategory(id);

			removeCategory(queryClient, id);
		} else if (request.method === "POST") {
			res = await createCategory(category);

			upsertCategory(queryClient, res);

		} else if (request.method === "PUT") {
			if (!id) {
				throw new Error("Channel ID is required for update");
			}
			res = await updateCategory(id, category);

			upsertCategory(queryClient, res);
		}
	} catch (err) {
		if (err instanceof APIError) {
			if (err.problem.status > 400) {
				return data(err);
			}
		}
		throw err;
	}
	return data(res);
}
