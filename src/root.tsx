import "./index.css";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { ToastContainer } from "react-toastify";
import { UserContext, userFetcher } from "./users/api/users.api";
import type { Route } from "./+types/root";
import { useContext, type JSX, type ReactNode } from "react";

const alertStyle = {
	success: "bg-good-soft text-good",
	error: "bg-error-soft text-error",
	info: "",
	warning: "",
	dark: "",
	default: "bg-bg",
};

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
	async ({ context }, next) => {
		const res = await userFetcher();

		if (res.ok) {
			context.set(UserContext, res.res);
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
