import { type JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import type { IconType } from "react-icons";

import type { Channel, ChannelCategory } from "@/chat/api/chat.api";
import { CategoryModal } from "@/chat/components/CategoryForm";
import { ChannelModal } from "@/chat/components/ChannelForm";
import PopupList from "@/components/List/PopupList";
import ChoiceModal from "@/components/Modal/ChoiceModal";
import { useLongPress } from "@/hooks/useLongPress";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export type SidebarAction =
	| { kind: "createChannel"; category?: string }
	| { kind: "editChannel"; channel: Channel; category?: string }
	| { kind: "deleteChannel"; channel: Channel }
	| { kind: "createCategory" }
	| { kind: "editCategory"; category: ChannelCategory }
	| { kind: "deleteCategory"; category: ChannelCategory };

export interface SidebarMenuRow {
	icon: IconType;
	label: string;
	action: SidebarAction;
	danger?: boolean;
}

/**
 * Long press menu of a sidebar item, on touch devices only: desktop keeps
 * the hover buttons. Spread `pressProps` and add `pressClass` on the
 * (positioned) pressed element.
 */
export function useSidebarMenu(enabled: boolean): {
	active: boolean;
	pressProps: ReturnType<typeof useLongPress> | null;
	pressClass: string;
	open: boolean;
	setOpen: (open: boolean) => void;
	action: SidebarAction | null;
	setAction: (action: SidebarAction | null) => void;
} {
	const isTouch = useMediaQuery("(pointer: coarse)");
	const active = enabled && isTouch;
	const [open, setOpen] = useState(false);
	const [action, setAction] = useState<SidebarAction | null>(null);
	const longPress = useLongPress(
		() => {
			setOpen(true);
		},
		{ disabled: !active },
	);

	return {
		active,
		pressProps: active ? longPress : null,
		pressClass: active ? "hold-fill no-callout" : "",
		open,
		setOpen,
		action,
		setAction,
	};
}

function SidebarActionModal({
	action,
	onClose,
}: {
	action: SidebarAction;
	onClose: () => void;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();

	switch (action.kind) {
		case "createChannel":
			return <ChannelModal category={action.category} onClose={onClose} />;
		case "editChannel":
			return (
				<ChannelModal
					edit={action.channel}
					category={action.category}
					onClose={onClose}
				/>
			);
		case "deleteChannel":
			return (
				<ChoiceModal
					title={t("chat.deleteChannelTitle", {
						name: action.channel.name,
					})}
					desc={t("common.irreversible")}
					confirmLabel={t("common.delete")}
					action="/channels"
					method="DELETE"
					id={action.channel.id}
					onClose={onClose}
				/>
			);
		case "createCategory":
			return <CategoryModal onClose={onClose} />;
		case "editCategory":
			return <CategoryModal edit={action.category} onClose={onClose} />;
		case "deleteCategory":
		default:
			return (
				<ChoiceModal
					title={t("chat.deleteCategoryTitle", {
						name: action.category.name,
					})}
					desc={t("common.irreversible")}
					confirmLabel={t("common.delete")}
					action="/category"
					method="DELETE"
					id={action.category.id}
					onClose={onClose}
				/>
			);
	}
}

export default function SidebarMenu({
	menu,
	rows,
}: {
	menu: ReturnType<typeof useSidebarMenu>;
	rows: SidebarMenuRow[];
}): JSX.Element {
	return (
		<>
			{menu.open && (
				<PopupList
					onClose={() => {
						menu.setOpen(false);
					}}
					rows={rows.map((row) => ({
						id: row.action.kind,
						onClick: (): void => {
							menu.setAction(row.action);
						},
						content: (
							<div
								className={`flex items-center gap-2 text-sm ${row.danger === true ? "text-error" : ""}`}
							>
								<row.icon size={16} />
								{row.label}
							</div>
						),
					}))}
				/>
			)}
			{menu.action && (
				<SidebarActionModal
					action={menu.action}
					onClose={() => {
						menu.setAction(null);
					}}
				/>
			)}
		</>
	);
}
