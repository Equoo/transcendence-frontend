import { useQueryClient } from "@tanstack/react-query";
import { type Ref, useImperativeHandle, useRef, useState } from "react";
import type { JSX } from "react/jsx-runtime";
import { useTranslation } from "react-i18next";
import {
	PiArrowArcLeft,
	PiCopy,
	PiDotsThree,
	PiHash,
	PiPencil,
	PiTrash,
} from "react-icons/pi";

import { PermEnum } from "@/admin/api/roles";
import IconBtn from "@/components/Button/IconBtn";
import PopupList from "@/components/List/PopupList";
import { useUser } from "@/users/hooks/users";
import { toastError } from "@/utils/error.util";

import type { Message } from "../../api/chat.api";
import { findMessage } from "../../cache/chat.cache";
import { useChatContext } from "../ChatProvider";
import RemoveMessageModal from "./RemoveMessageModal";

export interface MessageActionBarHandles {
	show: (
		e: React.MouseEvent<HTMLDivElement> | React.FocusEvent<HTMLDivElement>,
	) => void;
	hide: () => void;
	openMenu: (row: HTMLDivElement) => void;
}

interface ActionBar {
	msg: Message;
	el: HTMLDivElement;
	top: number;
	left: number;
	menuOnly: boolean;
}

function MessageActionBar({
	ref,
	channelId,
}: {
	ref?: Ref<MessageActionBarHandles>;
	channelId: string;
}): JSX.Element {
	const qc = useQueryClient();
	// eslint-disable-next-line id-length
	const { t } = useTranslation();

	const [actionBar, setActionBar] = useState<ActionBar | null>(null);
	const [removeTarget, setRemoveTarget] = useState<Message | null>(null);
	const [showMenu, setShowMenu] = useState(false);
	const actionBarTimerRef = useRef<number | null>(null);
	const activeRowRef = useRef<HTMLDivElement | null>(null);

	const clearHideTimer = (): void => {
		if (actionBarTimerRef.current !== null) {
			clearTimeout(actionBarTimerRef.current);
			actionBarTimerRef.current = null;
		}
	};

	const select = (row: HTMLDivElement, menuOnly: boolean): void => {
		const msg = findMessage(qc, channelId, row.dataset.id ?? "");
		if (!msg) {
			return;
		}

		const top = row.offsetTop - (row.parentElement?.scrollTop ?? 0) - 20;
		const left = row.offsetLeft + row.offsetWidth / 2;

		if (activeRowRef.current) {
			activeRowRef.current.ariaSelected = "false";
		}
		row.ariaSelected = "true";
		activeRowRef.current = row;

		setShowMenu(menuOnly);
		setActionBar({ msg, el: row, top, left, menuOnly });
	};

	const deselect = (): void => {
		if (activeRowRef.current) {
			activeRowRef.current.ariaSelected = "false";
			activeRowRef.current = null;
		}
		setShowMenu(false);
		setActionBar(null);
	};

	useImperativeHandle(ref, () => ({
		show: (
			ev:
				| React.MouseEvent<HTMLDivElement>
				| React.FocusEvent<HTMLDivElement>,
		): void => {
			clearHideTimer();

			const row = ev.currentTarget;
			if (typeof row === "undefined" || row === activeRowRef.current) {
				return;
			}
			select(row, false);
		},
		hide: (): void => {
			if (actionBar?.menuOnly) {
				return;
			}
			clearHideTimer();
			actionBarTimerRef.current = setTimeout(() => {
				actionBarTimerRef.current = null;
				deselect();
			}, 80);
		},
		openMenu: (row: HTMLDivElement): void => {
			clearHideTimer();
			select(row, true);
		},
	}));

	const { composerRef } = useChatContext();
	const user = useUser();

	const removeModal = removeTarget && (
		<RemoveMessageModal
			channelId={channelId}
			message={removeTarget}
			onClose={() => {
				setRemoveTarget(null);
			}}
		/>
	);

	if (!actionBar) {
		return <>{removeModal}</>;
	}

	const isOwn = actionBar.msg.sender.id === user?.id;
	const canDelete =
		isOwn ||
		(user !== null &&
			(user.role.permission & PermEnum.ManageMessages) !== 0);
	const isSent = actionBar.el.dataset.pending === "false";

	const enterReply = (): void => {
		composerRef.current?.enterReplyMode(actionBar.msg, actionBar.el);
	};
	const enterEdit = (): void => {
		composerRef.current?.enterEditMode(actionBar.msg, actionBar.el);
	};
	const askRemove = (): void => {
		setRemoveTarget(actionBar.msg);
	};
	const copyText = (text: string): void => {
		navigator.clipboard.writeText(text).catch(toastError);
	};

	const menuRow = (
		Icon: typeof PiCopy,
		label: string,
		danger = false,
	): JSX.Element => (
		<div
			className={`flex items-center gap-2 text-sm ${danger ? "text-red-400" : ""}`}
		>
			<Icon size={16} />
			{label}
		</div>
	);

	const menuRows = [
		...(isSent
			? [
				{
					id: "reply",
					onClick: enterReply,
					content: menuRow(PiArrowArcLeft, t("chat.reply")),
				},
			]
			: []),
		...(isSent && isOwn
			? [
				{
					id: "edit",
					onClick: enterEdit,
					content: menuRow(PiPencil, t("chat.edit")),
				},
			]
			: []),
		{
			id: "copy",
			onClick: (): void => {
				copyText(actionBar.msg.content);
			},
			content: menuRow(PiCopy, t("chat.copyText")),
		},
		...(isSent
			? [
				{
					id: "copyId",
					onClick: (): void => {
						copyText(actionBar.msg.id);
					},
					content: menuRow(PiHash, t("chat.copyId")),
				},
			]
			: []),
		...(isSent && canDelete
			? [
				{
					id: "delete",
					onClick: askRemove,
					content: menuRow(
						PiTrash,
						t("chat.removeMessage"),
						true,
					),
				},
			]
			: []),
	];

	if (actionBar.menuOnly) {
		return (
			<>
				{showMenu && (
					<PopupList
						onClose={deselect}
						rows={menuRows}
					/>
				)}
				{removeModal}
			</>
		);
	}

	return (
		<>
			<div
				style={{ top: actionBar.top, left: actionBar.left }}
				onMouseEnter={clearHideTimer}
				className="absolute flex flex-row z-50 -translate-x-1/2"
			>
				{isSent && (
					<>
						{isOwn ? (
							<IconBtn
								icon={PiPencil}
								tooltip={t("chat.edit")}
								size={14}
								onClick={enterEdit}
							></IconBtn>
						) : (
							<IconBtn
								icon={PiArrowArcLeft}
								tooltip={t("chat.reply")}
								size={14}
								onClick={enterReply}
							></IconBtn>
						)}
						{canDelete && (
							<IconBtn
								icon={PiTrash}
								tooltip={t("chat.removeMessage")}
								className="text-red-400"
								size={14}
								onClick={askRemove}
							></IconBtn>
						)}
					</>
				)}
				<IconBtn
					icon={PiDotsThree}
					tooltip={t("chat.moreActions")}
					size={14}
					onClick={() => {
						setShowMenu((open) => !open);
					}}
				></IconBtn>
				{showMenu && (
					<PopupList
						className="top-full right-0 mt-1 bg-surface2 border border-border shadow-sm"
						onClose={() => {
							setShowMenu(false);
						}}
						rows={menuRows}
					/>
				)}
			</div>
			{removeModal}
		</>
	);
}

export default MessageActionBar;
