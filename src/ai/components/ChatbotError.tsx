import type { JSX } from "react";
import type { FallbackProps } from "react-error-boundary";
import { useTranslation } from "react-i18next";
import {
	PiArrowClockwise,
	PiNotePencil,
	PiSparkle,
	PiWarningCircle,
	PiX,
} from "react-icons/pi";

import CheckButton from "@/components/Button/CheckButton";
import IconBtn from "@/components/Button/IconBtn";
import { describeError } from "@/components/Error/describeError";

import { useChatbot } from "../hooks/chatbot.hook";

export default function ChatbotError({
	error,
	resetErrorBoundary,
	onClose,
	className = "",
}: FallbackProps & {
	onClose?: () => void;
	className?: string;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const { abort, clear } = useChatbot();
	const { detail } = describeError(error, t);

	return (
		<section
			className={`flex flex-col overflow-hidden bg-surface ${className}`}
			aria-label={t("knowledge.assistant")}
		>
			<header className="flex flex-none items-center gap-2.5 border-b border-border px-4.5 py-3.75">
				<PiSparkle size={18} className="text-accent" />
				<span className="font-head font-[650]">Keepy</span>
				<div className="ml-auto" />
				{onClose && (
					<IconBtn
						discrete
						icon={PiX}
						size={18}
						aria-label={t("assistant.close")}
						onClick={onClose}
						className="p-1.5!"
					/>
				)}
			</header>

			<div
				role="alert"
				className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center font-main"
			>
				<div className="flex items-center justify-center size-11 rounded-xl bg-error-soft text-error">
					<PiWarningCircle size={24} />
				</div>
				<div className="flex flex-col gap-1">
					<span className="text-sm font-semibold text-text">
						{t("assistant.crashed")}
					</span>
					<span className="text-xs text-muted wrap-break-word">
						{detail}
					</span>
				</div>
				<div className="flex gap-3">
					<CheckButton active={false} onClick={resetErrorBoundary}>
						<PiArrowClockwise size={16} />
						{t("common.retry")}
					</CheckButton>

					<CheckButton
						active
						activeCheck={false}
						onClick={() => {
							abort();
							clear();
							resetErrorBoundary();
						}}
					>
						<PiNotePencil size={16} />
						{t("assistant.newConversation")}
					</CheckButton>
				</div>
			</div>
		</section>
	);
}
