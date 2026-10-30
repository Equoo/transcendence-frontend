import "./index.css";
import "./translation/i18n";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { JSX, ReactNode } from "react";
import { type DefaultToastOptions, Toaster } from "react-hot-toast";
import {
	Links,
	Meta,
	Outlet,
	redirect,
	Scripts,
	ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import { PermEnum } from "./admin/api/roles";
import HydratingScreen from "./components/HydratingScreen";
import { useViewportHeight } from "./hooks/useViewportHeight";
import { queryClient } from "./queryClient";
import { fetchUser, UserContext } from "./users/api/users";

const toastOptions: DefaultToastOptions = {
	style: {
		maxWidth: 420,
		padding: "10px 14px",
		gap: 2,
		borderRadius: "var(--radius-base)",
		border: "1px solid var(--color-border)",
		background: "var(--color-surface)",
		color: "var(--color-text)",
		boxShadow: "var(--shadow-main)",
		fontFamily: "var(--font-main)",
		fontSize: "0.875rem",
		lineHeight: 1.4,
	},
	success: {
		iconTheme: {
			primary: "var(--color-good)",
			secondary: "var(--color-surface)",
		},
		style: { borderColor: "var(--color-good-soft)" },
	},
	error: {
		duration: 5000,
		iconTheme: {
			primary: "var(--color-error)",
			secondary: "var(--color-surface)",
		},
		style: { borderColor: "var(--color-error-soft)" },
	},
	loading: {
		iconTheme: {
			primary: "var(--color-accent)",
			secondary: "var(--color-border)",
		},
	},
};

const publicPaths = ["/login", "/register", "/privacy", "/terms"];

export const clientMiddleware: Route.MiddlewareFunction[] = [
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type, @typescript-eslint/consistent-return
	async ({ context, request, url }, next) => {
		const user = await queryClient.query({
			queryKey: ["me"],
			queryFn: fetchUser,
			staleTime: 60 * 60_000,
		});
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
				<Toaster position="top-center" toastOptions={toastOptions} />
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
