import { redirect } from "react-router";
import type { Route } from "./+types/register";
import { UserContext } from "../api/users.api";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const clientMiddleware: Route.MiddlewareFunction[] = [
	// eslint-disable-next-line @typescript-eslint/consistent-return, @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
	({ context }) => {
		const user = context.get(UserContext);
		if (user) {
			return redirect("/");
		}
	},
];
