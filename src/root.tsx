import "./index.css";
import "./translation/i18n";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
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
import { useViewportHeight } from "./hooks/useViewportHeight";
import { queryClient } from "./queryClient";
import { fetchUser, UserContext } from "./users/api/users";

const alertStyle = {
	success: "bg-good-soft text-good",
	error: "bg-error-soft text-error",
	info: "",
	warning: "",
	dark: "",
	default: "bg-bg",
};

// Pages reachable without being logged in.
const publicPaths = ["/login", "/register", "/privacy", "/terms"];

export const clientMiddleware: Route.MiddlewareFunction[] = [
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type, @typescript-eslint/consistent-return
	async ({ context, request, url }, next) => {
		const user = await queryClient.query({
			queryKey: ["me"],
			queryFn: fetchUser,
			staleTime: 60 * 60_000,
		});
		console.warn(user);
		if (user) {
			context.set(UserContext, user);
			if (url.pathname === "/login" || url.pathname === "/register") {
				return redirect("/");
			}
			if (url.pathname.startsWith("/admin/roles")) {
				if (!(user.role.permission & PermEnum.HandleRoles)) {
					return redirect("*");
				}
			}
			if (url.pathname.startsWith("/admin/users")) {
				if (!(user.role.permission & PermEnum.HandleUsers)) {
					return redirect("*");
				}
			}
		} else {
			await queryClient.invalidateQueries({ queryKey: ["me"] });
			if (!publicPaths.includes(url.pathname)) {
				return redirect("/login");
			}
		}
		try {
			await next();
		} finally {
			if (request.method !== "GET" && url.pathname.startsWith("/me")) {
				await queryClient.invalidateQueries({ queryKey: ["me"] });
			}
		}
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
					content="width=device-width, initial-scale=1.0, interactive-widget=resizes-content"
				/>
				<title>KeepGrouped</title>
				<Meta />
				<Links />
			</head>
			<body className="w-screen h-(--app-height,100dvh) bg-back">
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
				<QueryClientProvider client={queryClient}>
					{children}
					<ReactQueryDevtools initialIsOpen={false} />
				</QueryClientProvider>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App(): JSX.Element {
	useViewportHeight();
	return <Outlet />;
}

export function HydrateFallback(): JSX.Element {
	return <HydratingScreen />;
}
