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
import ConfirmModal from "@/components/Modal/ConfirmModal";
import { useUser } from "@/users/hooks/users";
import { toastError } from "@/utils/error.util";

import { deleteMessage, type Message } from "../../api/chat.api";
import { findMessage, removeMessage } from "../../cache/chat.cache";
import { useChatContext } from "../ChatProvider";
import MessageRow from "./MessageRow";

export interface MessageActionBarHandles {
	show: (
		e: React.MouseEvent<HTMLDivElement> | React.FocusEvent<HTMLDivElement>,
	) => void;
	hide: () => void;
}

interface ActionBar {
	msg: Message;
	el: HTMLDivElement;
	top: number;
	left: number;
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
	const [showRemoveForm, setShowRemoveForm] = useState(false);
	const [showMenu, setShowMenu] = useState(false);
	const actionBarTimerRef = useRef<number | null>(null);
	const activeRowRef = useRef<HTMLDivElement | null>(null);

	const clearHideTimer = (): void => {
		if (actionBarTimerRef.current !== null) {
			clearTimeout(actionBarTimerRef.current);
			actionBarTimerRef.current = null;
		}
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

			const msg = findMessage(qc, channelId, row.dataset.id ?? "");
			if (!msg) {
				return;
			}

			const top =
				row.offsetTop - (row.parentElement?.scrollTop ?? 0) - 20;
			const left = row.offsetLeft + row.offsetWidth / 2;

			if (activeRowRef.current) {
				activeRowRef.current.ariaSelected = "false";
			}
			row.ariaSelected = "true";
			activeRowRef.current = row;

			setShowMenu(false);
			setActionBar({ msg, el: row, top, left });
		},
		hide: (): void => {
			clearHideTimer();
			actionBarTimerRef.current = setTimeout(() => {
				actionBarTimerRef.current = null;
				if (activeRowRef.current) {
					activeRowRef.current.ariaSelected = "false";
					activeRowRef.current = null;
				}
				setShowMenu(false);
				setActionBar(null);
			}, 80);
		},
	}));

	const { composerRef } = useChatContext();
	const user = useUser();

	if (!actionBar) {
		return <div></div>;
	}

	const isOwn = actionBar.msg.sender.id === user?.id;
	const canDelete =
		isOwn ||
		(user !== null &&
			(user.role.permission & PermEnum.ManageMessages) !== 0);
	const isSent = actionBar.el.dataset.pending === "false";

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
						onClick: (): void => {
							composerRef.current?.enterReplyMode(
								actionBar.msg,
								actionBar.el,
							);
						},
						content: menuRow(PiArrowArcLeft, t("chat.reply")),
					},
				]
			: []),
		...(isSent && isOwn
			? [
					{
						id: "edit",
						onClick: (): void => {
							composerRef.current?.enterEditMode(
								actionBar.msg,
								actionBar.el,
							);
						},
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
						onClick: (): void => {
							setShowRemoveForm(true);
						},
						content: menuRow(
							PiTrash,
							t("chat.removeMessage"),
							true,
						),
					},
				]
			: []),
	];
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
								size={14}
								onClick={() => {
									if (composerRef.current) {
										composerRef.current.enterEditMode(
											actionBar.msg,
											actionBar.el,
										);
									}
								}}
							></IconBtn>
						) : (
							<IconBtn
								icon={PiArrowArcLeft}
								size={14}
								onClick={() => {
									if (composerRef.current) {
										composerRef.current.enterReplyMode(
											actionBar.msg,
											actionBar.el,
										);
									}
								}}
							></IconBtn>
						)}
						{canDelete && (
							<IconBtn
								icon={PiTrash}
								className="text-red-400"
								size={14}
								onClick={() => {
									setShowRemoveForm(true);
								}}
							></IconBtn>
						)}
					</>
				)}
				<IconBtn
					icon={PiDotsThree}
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
			{showRemoveForm && (
				<ConfirmModal
					title={t("chat.removeMessage")}
					description={t("chat.removeMessageConfirm")}
					confirmLabel={t("common.delete")}
					danger
					onClose={() => {
						setShowRemoveForm(false);
					}}
					onConfirm={() => {
						deleteMessage(channelId, actionBar.msg.id)
							.then(() => {
								removeMessage(qc, channelId, actionBar.msg.id);
							})
							.catch(toastError);
						setShowRemoveForm(false);
					}}
				>
					<div className="max-h-48 overflow-y-auto rounded-2xl border border-border bg-surface2">
						<MessageRow
							message={actionBar.msg}
							showHeader
							className="mt-0! px-3 py-2.5 hover:bg-transparent"
						/>
					</div>
				</ConfirmModal>
			)}
		</>
	);
}

export default MessageActionBar;
