import { type JSX, useEffect, useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar/Sidebar";
import ChannelForm from "../components/Chat/ChannelForm";
import { fetchChannels, useChat } from "../models/chat"

export default function Dashboard(): JSX.Element {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		async function load_channels() {
			try {
				useChat.getState().setChannels(await fetchChannels());
			} catch (err) {
				console.error(err);
			} finally {
				setReady(true);
			}
		}

		load_channels();
	}, []);

	if (!ready) return <p>Loading..</p>; // TODO: Loading page

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
