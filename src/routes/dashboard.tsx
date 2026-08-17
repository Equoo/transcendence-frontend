import { type JSX, useEffect, useState } from "react";
import { Outlet } from "react-router";

import { fetchChannels } from "@/chat/api/chat.api";
import { useChat } from "@/chat/hooks/chat.hook";

import ChannelForm from "../chat/components/ChannelForm";
import Sidebar from "../components/Sidebar/Sidebar";
import { UserContext } from "../users/api/users.api";
import type { Route } from "../+types/root";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function clientLoader({ context }: Route.LoaderArgs) {
	const user = context.get(UserContext);
	return user;
}

export default function Dashboard(): JSX.Element {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		async function loadChannels(): Promise<void> {
			try {
				useChat.getState().setChannels(await fetchChannels());
			} catch (err) {
				console.error(err);
			} finally {
				setReady(true);
			}
		}

		void loadChannels();
	}, []);

	if (!ready) {
		return <p>Loading..</p>;
	}

	return (
		<div className="relative w-full h-full overflow-hidden bg-back">
			<Sidebar />
			<div className="h-full sm:pl-64 flex flex-col w-full items-center overflow-y-scroll">
				<Outlet />
				<ChannelForm />
			</div>
		</div>
	);
}
