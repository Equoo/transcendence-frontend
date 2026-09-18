import "./index.css";

import type { JSX, ReactNode } from "react";
import {
	Links,
	Meta,
	Outlet,
	redirect,
	Scripts,
	ScrollRestoration,
} from "react-router";
import { ToastContainer } from "react-toastify";

import type { Route } from "./+types/root";
import { PermEnum } from "./admin/api/roles";
import HydratingScreen from "./components/HydratingScreen";
import { UserContext, userFetcher } from "./users/api/users.api";

const alertStyle = {
	success: "bg-good-soft text-good",
	error: "bg-error-soft text-error",
	info: "",
	warning: "",
	dark: "",
	default: "bg-bg",
};

export const clientMiddleware: Route.MiddlewareFunction[] = [
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type, @typescript-eslint/consistent-return
	async ({ context, url }, next) => {
		const user = await userFetcher();
		if (user) {
			context.set(UserContext, user);
			if (url.pathname === "/login" || url.pathname === "/register") {
				return redirect("/");
			}
			if (url.pathname === "/admin/roles") {
				// eslint-disable-next-line no-bitwise
				if (!(user.role.permission & PermEnum.HandleRoles)) {
					return redirect("/");
				}
			}
			if (url.pathname === "/admin/users") {
				// eslint-disable-next-line no-bitwise
				if (!(user.role.permission & PermEnum.HandleUsers)) {
					return redirect("/");
				}
			}
		} else if (url.pathname !== "/login" && url.pathname !== "/register") {
			return redirect("/login");
		}
		await next();
	},
];

export function Layout({ children }: { children: ReactNode }): JSX.Element {
	return (
		<html lang="en">
			<head>
				<meta charSet="UTF-8" />
				<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0"
				/>
				<title>KeepGrouped</title>
				<Meta />
				<Links />
			</head>
			<body>
				<ToastContainer
					position="top-center"
					newestOnTop
					pauseOnHover
					toastClassName={(context) =>
						`${
							alertStyle[context?.type ?? "default"]
						} relative flex px-4 gap-1 py-2 min-h-10 rounded-lg justify-between overflow-hidden cursor-pointer`
					}
				/>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App(): JSX.Element {
	return <Outlet />;
}

export function HydrateFallback(): JSX.Element {
	return <HydratingScreen />;
}
