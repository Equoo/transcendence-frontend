import type { JSX } from "react";
import type { Route } from "./+types/event_details";
import { fetchEvent, type EventData } from "../models/events";
import { FiChevronLeft } from "react-icons/fi";
import { redirect, useNavigate } from "react-router";
import EventRegisterBtn from "../components/Events/EventRegisterBtn";
import { toast } from "react-toastify";
import Alert from "../components/Alert";
import ProfilePic from "../components/ProfilePic";
import EventBadge from "../components/Events/EventBadge";

export async function clientLoader({
	params,
}: Route.ClientLoaderArgs): Promise<EventData | Response> {
	const res = await fetchEvent(params.eventId);

	if (!res.ok) {
		toast.error(Alert, { data: { ...res.error } });
		return redirect("/");
	}
	return res.event;
}

export default function EventDetails({
	loaderData: event,
}: Route.ComponentProps): JSX.Element {
	const dateString: string = new Date(event.date).toLocaleString([], {
		hour: "2-digit",
		minute: "2-digit",
		month: "short",
		day: "2-digit",
		year: "numeric",
	});
	const navigate = useNavigate();

	return (
		<div className="flex flex-col w-full h-full">
			<div className="flex px-4 py-4 gap-4 items-center border-b border-border">
				<FiChevronLeft
					size={25}
					color="#9c9384"
					onClick={() => {
						void navigate(-1);
					}}
					className="cursor-pointer"
				/>
				<div className="flex flex-col">
					<div className="font-head text-text font-semibold text-lg">
						{event.name}
					</div>
					<div className="font-main text-muted text-sm font-light">
						{dateString}
					</div>
				</div>
				<EventRegisterBtn event={event} className="ml-auto shrink-0" />
			</div>
			<div className="flex h-full">
				<div className="flex flex-col gap-1 border-r border-border w-1/3 p-6">
					<span className="font-bold text-muted text-xs tracking-wider">
						WHEN
					</span>
					<span className="text-text">{dateString}</span>
					<span className="font-bold text-muted text-xs tracking-wider mt-4">
						WHERE
					</span>
					<span className="text-text">{event.location}</span>
					{(event.description ?? "") && (
						<>
							<span className="font-bold text-muted text-xs tracking-wider mt-4">
								DESCRIPTION
							</span>
							<span className="text-text">
								{event.description}
							</span>
						</>
					)}
					{event.tags.length > 0 && (
						<>
							<span className="font-bold text-muted text-xs tracking-wider mt-4">
								TAGS
							</span>
							<div className="flex flex-wrap gap-1">
								{event.tags.map((tag) => (
									<EventBadge key={tag}>{tag}</EventBadge>
								))}
							</div>
						</>
					)}
					<span className="font-bold text-muted text-xs tracking-wider mt-4">
						PARTICIPANTS - {event.registrations.length}/{event.size}
					</span>
					<div className="min-h-10 flex">
						{event.registrations.map((reg, idx) => (
							<ProfilePic
								key={reg.registeredAt}
								name={reg.user.userName}
								idx={idx}
							/>
						))}
					</div>
					<span className="font-bold text-muted text-xs tracking-wider mt-4">
						ORGANIZED BY
					</span>
					<div className="flex mt-1 items-center gap-2">
						<ProfilePic name={event.organizer.userName} />
						<span className="text-lg font-medium text-text">
							{event.organizer.userName}
						</span>
					</div>
					<span className="font-bold text-muted text-xs tracking-wider mt-4">
						RESOURCES
					</span>
					<div className="flex mt-1 items-center gap-3"></div>
				</div>
				<div className=""></div>
			</div>
		</div>
	);
}
