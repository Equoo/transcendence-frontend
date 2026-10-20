import { useQueryClient } from "@tanstack/react-query";
import { type Ref, useImperativeHandle, useRef, useState } from "react";
import type { JSX } from "react/jsx-runtime";
import { useTranslation } from "react-i18next";
import { PiArrowArcLeft, PiDotsThree, PiPencil, PiTrash } from "react-icons/pi";

import { PermEnum } from "@/admin/api/roles";
import IconBtn from "@/components/Button/IconBtn";
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
	const actionBarTimerRef = useRef<number | null>(null);

	useImperativeHandle(ref, () => ({
		show: (
			ev:
				| React.MouseEvent<HTMLDivElement>
				| React.FocusEvent<HTMLDivElement>,
		): void => {
			if (actionBarTimerRef.current) {
				clearTimeout(actionBarTimerRef.current);
			}

			const row = ev.currentTarget;
			if (typeof row === "undefined") {
				return;
			}
			row.ariaSelected = "true";

			setActionBar((prev) => {
				if (prev && prev.el !== row) {
					prev.el.ariaSelected = "false";
				}
				const id = row.dataset.id ?? "undefined";
				const msg = findMessage(qc, channelId, id);
				if (!msg) {
					return prev;
				}

				return {
					msg,
					el: row,
					top:
						row.offsetTop -
						(row.parentElement?.scrollTop ?? 0) -
						20,
					left: row.offsetLeft + row.offsetWidth / 2,
				};
			});
		},
		hide: (): void => {
			actionBarTimerRef.current = setTimeout(() => {
				setActionBar((prev) => {
					if (prev) {
						prev.el.ariaSelected = "false";
					}
					return null;
				});
			}, 80);
		},
	}));

	const { composerRef } = useChatContext();
	const user = useUser();

	if (!actionBar) {
		return <div></div>;
	}
	return (
		<>
			<div
				style={{ top: actionBar.top, left: actionBar.left }}
				onMouseEnter={() => {
					actionBarTimerRef.current &&
						clearTimeout(actionBarTimerRef.current);
				}}
				className="absolute flex flex-row z-50 -translate-x-1/2"
			>
				{actionBar.el.dataset.pending === "false" && (
					<>
						{actionBar.msg.sender.id === user?.id ? (
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
						{(actionBar.msg.sender.id === user?.id ||
							(user &&
								(user.role.permission &
									PermEnum.ManageMessages) !==
									0)) && (
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
				<IconBtn icon={PiDotsThree} size={14}></IconBtn>
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
