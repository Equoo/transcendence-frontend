import { type Ref, useImperativeHandle, useRef, useState } from "react";
import type { JSX } from "react/jsx-runtime";
import { PiArrowArcLeft, PiDotsThree, PiPencil, PiTrash } from "react-icons/pi";

import CheckButton from "@/components/CheckButton";
import IconBtn from "@/components/IconBtn";
import Modal from "@/components/Modal";
import { useUser } from "@/users/hooks/users.hooks";

import { type Message, removeMessage } from "../api/chat.api";
import { useChat } from "../hooks/chat.hook";
import { useChatContext } from "./ChatProvider";

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
	const getMessage = useChat((state) => state.getMessage);

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
				const msg = getMessage(channelId, id);
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

	const removeMsg = useChat((state) => state.removeMsg);
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
										composerRef.current.enterEditMode(actionBar.msg);
									}
								}}
							></IconBtn>
						) : (
							<IconBtn icon={PiArrowArcLeft} size={14}
								onClick={() => {
									if (composerRef.current) {
										composerRef.current.enterReplyMode(actionBar.msg);
									}
								}}
							></IconBtn>
						)}
						<IconBtn
							icon={PiTrash}
							className="text-red-400"
							size={14}
							onClick={() => {
								setShowRemoveForm(true);
							}}
						></IconBtn>
					</>
				)}
				<IconBtn icon={PiDotsThree} size={14}></IconBtn>
			</div>
			{showRemoveForm && (
				<Modal
					title="Remove message"
					onClose={() => {
						setShowRemoveForm(false);
					}}
				>
					<p>Are you sure to remove this message ?</p>

					<div className="flex flex-row gap-4">
						<CheckButton
							active
							onClick={() => {
								removeMessage(channelId, actionBar.msg.id)
									.then(() => {
										removeMsg(channelId, actionBar.msg.id);
									})
									.catch(() => {
										// NOTE: replace by good error handling
										console.error(
											"Removing message failed",
										);
									});
								setShowRemoveForm(false);
							}}
						>
							Yes
						</CheckButton>
						<CheckButton
							onClick={() => {
								setShowRemoveForm(false);
							}}
						>
							No
						</CheckButton>
					</div>
				</Modal>
			)}
		</>
	);
}

export default MessageActionBar;
