import { useEffect, useState, type JSX } from "react";
import type { Route } from "./+types/event_details";
import { fetchEvent } from "../events/api/events.api";
import { FiChevronLeft } from "react-icons/fi";
import { Link, useFetcher, useNavigate } from "react-router";
import EventRegisterBtn from "../events/components/EventRegisterBtn";
import ProfilePic from "../components/ProfilePic";
import EventBadge from "../components/Badge";
import EventForm from "../events/components/EventForm";
import { fetchEventRoles } from "../events/api/event_roles.api";
import { fetchFiles } from "../files/api/files.api";
import { PiTrash } from "react-icons/pi";
import type { clientAction } from "../events/routes/events.route";
import Modal from "../components/Modal";
import CheckButton from "../components/CheckButton";
import ProfileLine from "../components/ProfileLine";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const res = await fetchEvent(params.eventId);

	return {
		event: res,
		roles: fetchEventRoles(),
		files: fetchFiles(),
	};
}

export default function EventDetails({
	loaderData: { event, roles, files },
}: Route.ComponentProps): JSX.Element {
	const fetcher = useFetcher<typeof clientAction>();
	const navigate = useNavigate();
	const dateString: string = new Date(event.date).toLocaleString([], {
		hour: "2-digit",
		minute: "2-digit",
		month: "short",
		day: "2-digit",
		year: "numeric",
	});
	const [showConfirmation, setShowConfirmation] = useState(false);

	useEffect(() => {
		if (fetcher.data) {
			if (
				fetcher.data instanceof Response &&
				fetcher.data.status === 204
			) {
				void navigate("/");
			}
		}
	}, [fetcher.data]);
	return (
		<div className="flex flex-col w-full h-full">
			{showConfirmation && (
				<Modal
					title={`Delete the event ${event.name} ?`}
					onClose={() => {
						setShowConfirmation(false);
					}}
				>
					<p className="text-muted font-main font-light w-4/5 text-sm text-center">
						This cannot be cancelled.
					</p>
					<div className="inline-flex gap-8">
						<CheckButton
							pending={fetcher.state !== "idle"}
							onClick={() => {
								void fetcher.submit(null, {
									action: `/events/${event.id}`,
									method: "DELETE",
								});
							}}
						>
							Yes
						</CheckButton>
						<CheckButton
							active
							activeCheck={false}
							onClick={() => {
								setShowConfirmation(false);
							}}
						>
							No
						</CheckButton>
					</div>
				</Modal>
			)}
			<div className="flex px-4 py-4 gap-4 items-center border-b border-border">
				<FiChevronLeft
					size={25}
					color="#9c9384"
					onClick={() => {
						void navigate(-1);
					}}
					className="cursor-pointer"
				/>
				<div className="inline-flex items-center gap-4">
					<div className="flex flex-col">
						<div className="font-head text-text font-semibold text-lg">
							{event.name}
						</div>
						<div className="font-main text-muted text-sm font-light">
							{dateString}
						</div>
					</div>
					<EventForm edit roles={roles} files={files} event={event} />
					<PiTrash
						size={26}
						color="var(--color-text2)"
						className="hover:cursor-pointer"
						onClick={() => {
							setShowConfirmation(true);
						}}
					/>
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
								user={reg.user}
								idx={idx}
								// eslint-disable-next-line no-negated-condition
								className={idx !== 0 ? "-ml-3" : ""}
							/>
						))}
					</div>
					<span className="font-bold text-muted text-xs tracking-wider mt-4">
						ORGANIZED BY
					</span>
					<ProfileLine user={event.organizer} />
					<span className="font-bold text-muted text-xs tracking-wider mt-4">
						RESOURCES
					</span>
					<div className="flex mt-1 items-center gap-3">
						{event.files.map((file) => (
							<Link key={file.key} to={`/knowledge/${file.key}`}>
								<div
									className={`inline-flex items-center gap-2 rounded p-2 hover:cursor-pointer bg-surface2 hover:bg-surface`}
								>
									<p className={`text-lg font-medium`}>
										{file.name}
									</p>
								</div>
							</Link>
						))}
					</div>
				</div>
				<div className=""></div>
			</div>
		</div>
	);
}
