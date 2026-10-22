import { PiAt, PiChatCircleDots, PiProhibit, PiUser, PiUserMinus } from "react-icons/pi";
import { toast } from "react-toastify";

import type { Member, MenuEntry } from "@/ui";

export const DEMO_MEMBERS: Member[] = [
	{ id: "u-luna", name: "Luna Park", presence: "online", role: { name: "Raid lead", color: "#d9480f" }, isSelf: true },
	{ id: "u-max", name: "Max Ortega", presence: "online", role: { name: "Healer" }, status: "Raiding tonight 🔥" },
	{ id: "u-ines", name: "Inès Morel", presence: "online", role: { name: "Tank" } },
	{ id: "u-kenji", name: "Kenji Sato", presence: "busy", role: { name: "Officer", color: "#2f9e44" }, status: "In a meeting" },
	{ id: "u-sam", name: "Sam", presence: "afk", role: { name: "Member" } },
	{ id: "u-zoe", name: "Zoé Ravel", presence: "afk", status: "Back in 10" },
	{ id: "u-ada", name: "Ada Quinn", presence: "offline", role: { name: "Member" } },
	{ id: "u-bram", name: "Bram de Vries", presence: "offline" },
	{ id: "u-cleo", name: "Cléo Martin", presence: "offline", role: { name: "Recruit" } },
];

export function memberActions(member: Member): MenuEntry[] {
	const profile: MenuEntry = {
		id: "profile",
		label: "View profile",
		icon: PiUser,
		onSelect: (): void => {
			toast.info(`${member.name}'s profile`);
		},
	};
	if (member.isSelf === true) {
		return [profile];
	}
	return [
		profile,
		{
			id: "message",
			label: "Send a message",
			icon: PiChatCircleDots,
			onSelect: (): void => {
				toast.info(`Chat with ${member.name}`);
			},
		},
		{
			id: "mention",
			label: "Mention",
			icon: PiAt,
			onSelect: (): void => {
				toast.info(`@${member.name}`);
			},
		},
		{ id: "sep", separator: true },
		{
			id: "kick",
			label: "Remove from group",
			icon: PiUserMinus,
			danger: true,
			onSelect: (): void => {
				toast.warn(`${member.name} removed`);
			},
		},
		{
			id: "ban",
			label: "Ban",
			icon: PiProhibit,
			danger: true,
			onSelect: (): void => {
				toast.error(`${member.name} banned`);
			},
		},
	];
}
