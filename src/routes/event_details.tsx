import { type JSX, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiChevronLeft } from "react-icons/fi";
import { PiArrowBendUpRight, PiTrash } from "react-icons/pi";
import { Link, useFetcher, useNavigate } from "react-router";

import ChannelChat from "@/chat/components/ChannelChat";
import { useChannel } from "@/chat/hooks/useChannels";
import ChoiceModal from "@/components/Modal/ChoiceModal";
import ProfileLine from "@/components/Profile/ProfileLine";
import ProfilePic from "@/components/Profile/ProfilePic";

import { PermEnum } from "../admin/api/roles";
import Badge from "../components/Badge";
import { fetchEventRoles } from "../events/api/event_roles.api";
import { fetchEvent } from "../events/api/events.api";
import EventForm from "../events/components/EventForm";
import EventRegisterBtn from "../events/components/EventRegisterBtn";
import type { clientAction } from "../events/routes/events.route";
import { fetchFiles } from "../files/api/files.api";
import { UserContext } from "../users/api/users";
import type { Route } from "./+types/event_details";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function clientLoader({
	params,
	context,
}: Route.ClientLoaderArgs) {
	const res = await fetchEvent(params.eventId);

	return {
		event: res,
		roles: fetchEventRoles(),
		files: fetchFiles(),
		user: context.get(UserContext),
	};
}

export default function EventDetails({
	loaderData: { event, roles, files, user },
}: Route.ComponentProps): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
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
	}, [fetcher.data, navigate]);

	const { data: channel } = useChannel(event.channel.id);

	return (
		<div className="flex flex-col w-full h-full">
			{showConfirmation && (
				<ChoiceModal
					action={`/events/${event.id}`}
					method="DELETE"
					onClose={() => {
						setShowConfirmation(false);
					}}
					title={t("eventDetails.deleteTitle", {
						name: event.name,
					})}
					desc={t("common.irreversible")}
					fetcher={fetcher}
				/>
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
					{Boolean(user.role.permission & PermEnum.HandleEvent) && (
						<>
							<EventForm
								edit
								roles={roles}
								files={files}
								event={event}
							/>
							<PiTrash
								size={26}
								color="var(--color-text2)"
								className="hover:cursor-pointer"
								onClick={() => {
									setShowConfirmation(true);
								}}
							/>
						</>
					)}
				</div>
				<EventRegisterBtn event={event} className="ml-auto shrink-0" />
			</div>
			<div className="flex h-full">
				<div className="flex flex-col gap-1 border-r border-border w-1/5 p-6">
					<span className="font-bold text-muted text-xs tracking-wider">
						{t("eventDetails.when")}
					</span>
					<span className="text-text">{dateString}</span>
					<span className="font-bold text-muted text-xs tracking-wider mt-4">
						{t("eventDetails.where")}
					</span>
					<span className="text-text">{event.location}</span>
					{(event.description ?? "") && (
						<>
							<span className="font-bold text-muted text-xs tracking-wider mt-4">
								{t("eventDetails.description")}
							</span>
							<span className="text-text">
								{event.description}
							</span>
						</>
					)}
					{event.tags.length > 0 && (
						<>
							<span className="font-bold text-muted text-xs tracking-wider mt-4">
								{t("eventDetails.tags")}
							</span>
							<div className="flex flex-wrap gap-1">
								{event.tags.map((tag) => (
									<Badge key={tag}>{tag}</Badge>
								))}
							</div>
						</>
					)}
					<span className="font-bold text-muted text-xs tracking-wider mt-4">
						{t("eventDetails.participants", {
							registered: event.registrations.length,
							size: event.size,
						})}
					</span>
					<div className="min-h-10 flex">
						{event.registrations.map((reg, idx) => (
							<ProfilePic
								key={reg.registeredAt}
								user={reg.user}
								idx={idx}
								status
								// eslint-disable-next-line no-negated-condition
								className={idx !== 0 ? "-ml-3" : ""}
							/>
						))}
					</div>
					<span className="font-bold text-muted text-xs tracking-wider mt-4">
						{t("eventDetails.organizedBy")}
					</span>
					<ProfileLine user={event.organizer} status />
					<span className="font-bold text-muted text-xs tracking-wider mt-4">
						{t("eventDetails.resources")} - {event.files.length}
					</span>
					<div className="flex flex-col mt-1 items-center gap-1 w-fit">
						{event.files.map((file) => (
							<div
								key={file.key}
								className={`w-full rounded p-2 hover:cursor-pointer bg-surface2 hover:bg-surface`}
							>
								<Link
									to={`/knowledge/${file.key}`}
									className="inline-flex items-center w-full"
								>
									<p className={`text-sm mr-6`}>
										{file.name.slice(
											file.name.lastIndexOf("/") + 1,
										)}
									</p>
									<p className="text-xs ml-auto">
										{file.length / 1000000 < 1
											? t("files.sizeKb", {
													size: Math.floor(
														file.length / 1000,
													),
												})
											: t("files.sizeMb", {
													size: Math.floor(
														file.length / 1000000,
													),
												})}
									</p>
									<PiArrowBendUpRight
										className="ml-2 pb-1"
										size={18}
									/>
								</Link>
							</div>
						))}
					</div>
				</div>
				{channel && <ChannelChat channel={channel}></ChannelChat>}
			</div>
		</div>
	);
}
