import type { JSX } from "react";
import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar/Sidebar";

export default function Dashboard(): JSX.Element {
	return (
		<div className="relative w-full h-full overflow-hidden bg-back">
			<Sidebar />
			<div className="h-full sm:pl-64 flex flex-col w-full items-center overflow-y-scroll">
				<Outlet />
			</div>
		</div>
	);
}
