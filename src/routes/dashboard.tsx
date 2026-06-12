import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { JSX } from "react";
import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar/Sidebar";

const queryClient = new QueryClient();

export default function Dashboard(): JSX.Element {
	return (
		<QueryClientProvider client={queryClient}>
			<div className="relative w-full h-full overflow-hidden bg-back">
				<Sidebar />
				<div className="h-full sm:pl-64">
					<div className="flex flex-col h-full min-w-0 min-h-0 items-center">
						<Outlet />
					</div>
				</div>
			</div>
		</QueryClientProvider>
	);
}
