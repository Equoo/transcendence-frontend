import { data, redirect } from "react-router";

import { APIError } from "@/api/problem_detail";
import { useChat } from "@/chat/hooks/chat.hook";

import { createCategory, deleteCategory, updateCategory } from "../api/chat.api";
import type { Route } from "./+types/channel.route";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientAction({ request }: Route.ClientActionArgs) {
	let res;

	try {
		const formdata = await request.formData();

		if (request.method === "DELETE") {
			if (!formdata.get("id")) {
				throw new Error("Channel ID is required for deletion");
			}
			await deleteCategory(formdata.get("id") as string);

			useChat.getState().removeCategory(formdata.get("id") as string);
		} else if (request.method === "POST") {
			res = await createCategory(formdata);

			useChat.getState().addCategory(res);

			return redirect(`/channels/${res.id}`);
		} else if (request.method === "PUT") {
			if (!formdata.get("id")) {
				throw new Error("Channel ID is required for update");
			}
			res = await updateCategory(formdata);

			useChat.getState().updateCategory(res.id, res);
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
