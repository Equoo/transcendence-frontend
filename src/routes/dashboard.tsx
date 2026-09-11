import type { JSX } from "react";
import { Outlet } from "react-router";

import { useChatHub } from "@/chat/hooks/chatHub.hook";
import { UserReactContext } from "@/users/hooks/users.hooks";

import type { Route } from "../+types/root";
import Sidebar from "../components/Sidebar/Sidebar";
import { type User, UserContext } from "../users/api/users.api";


export function clientLoader({ context }: Route.ClientLoaderArgs): User | null {
	return context.get(UserContext);
}

export default function Dashboard({
	loaderData
}: Route.ComponentProps): JSX.Element {
	const connectChatHub = useChatHub((state) => state.connect);
	connectChatHub();

	return (
		<div className="relative w-full h-full overflow-hidden bg-back">
			<Sidebar />
			<div className="h-full sm:pl-64 flex flex-col w-full items-center overflow-y-scroll">
				<UserReactContext
					value={loaderData as unknown as User | null}
				>
					<Outlet />
				</UserReactContext>
			</div>
		</div>
	);
}
