import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { JSX } from "react";
import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar/Sidebar";

const queryClient = new QueryClient();

export default function Dashboard(): JSX.Element {
	return (
		<QueryClientProvider client={queryClient}>
			<div className="flex flex-row w-screen h-screen bg-back">
				<Sidebar />
				<Outlet />
			</div>
		</QueryClientProvider>
	);
}
