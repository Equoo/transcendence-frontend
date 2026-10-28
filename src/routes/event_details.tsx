import { type JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiChevronLeft } from "react-icons/fi";
import {
	PiArrowBendUpRight,
	PiDotsThreeVerticalBold,
	PiTrash,
} from "react-icons/pi";
import { Link, useNavigate } from "react-router";

import ChannelChat from "@/chat/components/ChannelChat";
import { useChannel } from "@/chat/hooks/useChannels";
import { ModalList, ModalListItem } from "@/components/List/ModalList";
import ChoiceModal from "@/components/Modal/ChoiceModal";
import Modal from "@/components/Modal/Modal";
import ProfileLine from "@/components/Profile/ProfileLine";
import ProfilePic from "@/components/Profile/ProfilePic";
import UserLine from "@/components/Profile/UserLine";
import RoleChange from "@/events/components/RoleChange";
import UnregisterUser from "@/events/components/UnregisterUser";

import { PermEnum } from "../admin/api/roles";
import Badge from "../components/Badge";
import { fetchEventRoles } from "../events/api/event_roles.api";
import { fetchEvent, formatEventSize } from "../events/api/events.api";
import EventForm from "../events/components/EventForm";
import EventRegisterBtn from "../events/components/EventRegisterBtn";
import { fetchFiles } from "../files/api/files.api";
import { HEADER_PADDING } from "../friends/components/BackToList";
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
		roles: await fetchEventRoles(),
		files: fetchFiles(),
		user: context.get(UserContext),
	};
}

export default function EventDetails({
	loaderData: { event, roles, files, user },
}: Route.ComponentProps): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dateString: string = new Date(event.date).toLocaleString([], {
		hour: "2-digit",
		minute: "2-digit",
		month: "short",
		day: "2-digit",
		year: "numeric",
	});
	const [showConfirmation, setShowConfirmation] = useState(false);
	const [showRegistrations, setShowRegistrations] = useState(false);
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
					confirmLabel={t("common.delete")}
				/>
			)}
			<div
				className={`flex flex-wrap justify-center border-b border-border ${HEADER_PADDING}`}
			>
				<button
					type="button"
					aria-label={t("common.goBack")}
					className="shrink-0 -ml-1.5 p-1 rounded-xl text-muted hover:bg-hover hover:text-text cursor-pointer"
					onClick={() => {
						void navigate(-1);
					}}
				>
					<FiChevronLeft size={25} />
				</button>
				<div className="inline-flex items-center gap-4 min-w-0">
					<div className="flex flex-col min-w-0">
						<div className="font-head text-text font-semibold text-lg truncate">
							{event.name}
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
								className="shrink-0 hover:cursor-pointer"
								onClick={() => {
									setShowConfirmation(true);
								}}
							/>
						</>
					)}
				</div>
				<div className="flex flex-wrap items-center gap-2 ml-auto">
					{event.isRegistered && (
						<RoleChange
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							registration={event.registrations.find(
								(reg) => reg.user.id === user.id,
							)!}
							event={event}
						/>
					)}
					<EventRegisterBtn event={event} className="shrink-0" />
				</div>
			</div>
			<div className="flex flex-col lg:flex-row flex-1 min-h-0">
				<div className="flex flex-col flex-none gap-1 p-4 sm:p-6 max-h-[40%] overflow-y-auto border-b border-border lg:max-h-none lg:w-80 xl:w-96 lg:border-b-0 lg:border-r">
					<span className="font-bold text-muted text-xs w-full  ">
						{t("eventDetails.when")}
					</span>
					<span className="text-text ">{dateString}</span>
					<span className="font-bold text-muted text-xs overflow-clip mt-4 w-full">
						{t("eventDetails.where")}
					</span>
					<span className="wrap-anywhere text-text">
						{event.location}
					</span>
					{(event.description ?? "") && (
						<>
							<span className="font-bold text-muted text-xs wrap-anywhere mt-4">
								{t("eventDetails.description")}
							</span>
							<span className="wrap-anywhere text-text">
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
					<span className="font-bold text-muted text-xs tracking-wider mt-4 inline-flex items-center gap-2">
						{t("eventDetails.participants", {
							registered: event.registrations.length,
							size: formatEventSize(event.size),
						})}
						<PiDotsThreeVerticalBold
							size={18}
							className="hover:text-text hover:cursor-pointer"
							onClick={() => {
								setShowRegistrations(true);
							}}
						/>
					</span>
					{showRegistrations && (
						<Modal
							size="lg"
							title={t("eventDetails.registeredUsers")}
							subtitle={t("eventDetails.registeredCount", {
								registered: event.registrations.length,
								size: formatEventSize(event.size),
							})}
							onClose={() => {
								setShowRegistrations(false);
							}}
						>
							<ModalList
								className="max-h-96"
								message={
									event.registrations.length === 0 &&
									t("eventDetails.noRegistrations")
								}
							>
								{event.registrations.map((reg) => (
									<ModalListItem key={reg.user.id}>
										<UserLine
											user={reg.user}
											subtitle={reg.user.role.name}
										/>
										{Boolean(
											user.role.permission &
											PermEnum.HandleEvent,
										) && (
											<div className="inline-flex shrink-0 items-center gap-2">
												<RoleChange
													registration={reg}
													event={event}
												/>
												<UnregisterUser
													registration={reg}
													event={event}
												/>
											</div>
										)}
									</ModalListItem>
								))}
							</ModalList>
						</Modal>
					)}
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
					<div className="flex flex-col mt-1 items-center gap-1 w-full">
						{event.files.map((file) => (
							<div
								key={file.key}
								className={`w-full rounded p-2 hover:cursor-pointer bg-surface2 hover:bg-surface`}
							>
								<Link
									to={`/knowledge/${file.key}`}
									className="inline-flex items-center w-full"
								>
									<p className="text-sm mr-6 min-w-0 truncate">
										{file.name.slice(
											file.name.lastIndexOf("/") + 1,
										)}
									</p>
									<p className="text-xs ml-auto shrink-0">
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
