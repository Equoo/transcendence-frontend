import { type JSX, useState } from "react";
import { PiGear } from "react-icons/pi";
import { NavLink, useFetcher } from "react-router";

import type { Channel } from "@/chat/api/chat.api";

import CheckButton from "../CheckButton";
import Modal from "../Modal";


function ItemChannel({ channel }: { channel: Channel }): JSX.Element {
	const fetcher = useFetcher<Channel>();
	const [showSettings, setShowSettings] = useState(false);
	const [prevFetcherState, setPrevFetcherState] = useState(fetcher.state);

	if (prevFetcherState !== fetcher.state) {
		setPrevFetcherState(fetcher.state);
		if (fetcher.state === "idle" && prevFetcherState !== "idle") {
			setShowSettings(false);
		}
	}

	return (
		<li>
			{showSettings && (
				<Modal title="Channel settings" onClose={() => { setShowSettings(false); }}>
					<fetcher.Form
						action="/channels"
						method="post"
						className="flex flex-col items-center w-4/5 gap-5 mb-4"
					>
						<div className="inline-flex flex-col w-full bg-sur">
							<div className="text-red-500">
								<label
									className="text-text font-main font-medium"
									htmlFor="channelform-name"
								>
									Name
								</label>
								*
							</div>
							<input
								id="channelform-name"
								name="name"
								required
								className="w-full bg-white border rounded-md border-border2 inset-shadow-xs px-2 py-1 font-main text-text"
								placeholder="Channel Name"
							/>
						</div>
						<div className="inline-flex flex-col w-full bg-sur">
							<div className="text-red-500">
								<label
									className="text-text font-main font-medium"
									htmlFor="channelform-topic"
								>
									Topic
								</label>
								*
							</div>
							<input
								id="channelform-topic"
								name="topic"
								required
								className="w-full bg-white border rounded-md border-border2 inset-shadow-xs px-2 py-1 font-main text-text"
								placeholder="Channel Topic"
							/>
						</div>
						<CheckButton
							active
							type="submit"
							pending={fetcher.state !== "idle"}
						>
							Create
						</CheckButton>
					</fetcher.Form>
				</Modal>
			)}
			<NavLink
				to={`/channels/${channel.id}`}
				className={({ isActive }) =>
					[
						"flex items-center px-2 py-1.5 text-[14.5px] rounded-base group duration-120",
						isActive
							? "bg-accent-soft text-text"
							: "hover:bg-hover hover:text-text",
					].join(" ")
				}
			>
				{({ isActive }) => (
					<>
						<span
							className={`text-[18px] font-semibold ${isActive ? "text-accent" : "text-muted"}`}
						>
							#
						</span>
						<span className="ms-2">{channel.name}</span>
						<button type="button" className="ml-auto p-0.5 cursor-pointer text-muted hover:text-text"
							onClick={() => { setShowSettings(true); }}>
							<PiGear size={18}></PiGear>
						</button>
					</>
				)}
			</NavLink>
		</li >
	);
}

export default ItemChannel;
