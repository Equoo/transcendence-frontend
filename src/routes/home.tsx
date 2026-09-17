import { type JSX,useState } from "react";

import { ActivityEnum, useActivity } from "@/activity/hooks/activity.hook";
import Modal from "@/components/Modal";
import ProfileLine from "@/components/ProfileLine";
import Promisable from "@/components/Promisable";
import { fetchUsers, type User } from "@/users/api/users.api";

import { type EventRole, fetchEventRoles } from "../events/api/event_roles.api";
import { type EventSummary, fetchEvents } from "../events/api/events.api";
import EventForm from "../events/components/EventForm";
import EventList from "../events/components/EventList";
import { type AppFile, fetchFiles } from "../files/api/files.api";
import type { Route } from "./+types/home";

export function clientLoader(): {
	events: Promise<EventSummary[]>;
	roles: Promise<EventRole[]>;
	files: Promise<AppFile[]>;
	users: Promise<User[]>;
} {
	return {
		events: fetchEvents(),
		roles: fetchEventRoles(),
		files: fetchFiles(),
		users: fetchUsers(),
	};
}

export default function Home({
	loaderData: { events, roles, files, users },
}: Route.ComponentProps): JSX.Element {
	const [showOnline, setShowOnline] = useState(false);
	const activity = useActivity();
	return (
		<>
			<div className="w-full flex flex-row px-6 py-4 justify-between items-center">
				<h1 className="font-semibold tracking-tight text-xl inline-flex gap-4 items-center">
					Accueil
					<Promisable data={users}>
						{(data) => (
							<>
								{showOnline && (
									<Modal
										align="start"
										title="Users Online"
										onClose={() => {
											setShowOnline(false);
										}}
									>
										{data
											.filter(
												(user) =>
													activity.getActivity(
														user.id,
													) !== ActivityEnum.Offline,
											)
											.map((user) => (
												<ProfileLine
													status
													user={user}
													key={user.id}
												/>
											))}
									</Modal>
								)}
								<p
									className="font-medium text-sm text-success cursor-pointer"
									onClick={() => {
										setShowOnline(true);
									}}
								>
									{activity.getOnlineUsers().length}/
									{data.length} Online
								</p>
							</>
						)}
					</Promisable>
				</h1>
				<EventForm roles={roles} files={files} />
			</div>
			<EventList events={events} />
		</>
	);
}
