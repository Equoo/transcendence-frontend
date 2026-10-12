import type { JSX } from "react";
import type { FallbackProps } from "react-error-boundary";
import { useTranslation } from "react-i18next";
import { PiArrowClockwise, PiWarningCircle } from "react-icons/pi";
import { useAsyncError, useRevalidator } from "react-router";

import CheckButton from "@/components/Button/CheckButton";
import { describeError } from "@/components/Error/describeError";

export function SidebarError({
	error,
	resetErrorBoundary,
}: FallbackProps): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const revalidator = useRevalidator();
	const { detail } = describeError(error, t);
	const retrying = revalidator.state === "loading";

	const retry = (): void => {
		void revalidator.revalidate().finally(() => {
			resetErrorBoundary();
		});
	};

	return (
		<>
			<button
				type="button"
				onClick={retry}
				disabled={retrying}
				aria-label={t("errors.sidebarFailed")}
				className="fixed z-39 top-1 left-1 sm:hidden inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error-soft text-error text-xs font-semibold font-main cursor-pointer"
			>
				<PiWarningCircle size={16} />
				{t("common.retry")}
			</button>

			<aside
				role="alert"
				className="fixed top-0 left-0 z-40 w-64 h-full hidden sm:flex flex-col items-center justify-center gap-4 px-5 border-e border-border bg-back2 font-main text-center"
			>
				<div className="flex items-center justify-center size-11 rounded-xl bg-error-soft text-error">
					<PiWarningCircle size={24} />
				</div>
				<div className="flex flex-col gap-1">
					<span className="text-sm font-semibold text-text">
						{t("errors.sidebarFailed")}
					</span>
					<span className="text-xs text-muted wrap-break-word">
						{detail}
					</span>
				</div>
				<CheckButton
					active={false}
					onClick={retry}
					disabled={retrying}
					pending={retrying}
				>
					<PiArrowClockwise size={16} />
					{t("common.retry")}
				</CheckButton>
			</aside>
		</>
	);
}

export function ChannelListError(): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const error = useAsyncError();
	const revalidator = useRevalidator();
	const { detail } = describeError(error, t);

	return (
		<li
			role="alert"
			className="flex flex-col gap-2 mx-1 my-2 px-3 py-2.5 rounded-lg bg-error-soft text-error text-xs"
		>
			<span className="flex items-center gap-1.5 font-semibold">
				<PiWarningCircle size={16} className="shrink-0" />
				{t("errors.channelsFailed")}
			</span>
			<span className="text-text2 wrap-break-word">{detail}</span>
			<button
				type="button"
				onClick={() => {
					void revalidator.revalidate();
				}}
				disabled={revalidator.state === "loading"}
				className="self-start inline-flex items-center gap-1 font-semibold hover:underline cursor-pointer disabled:opacity-60"
			>
				<PiArrowClockwise size={14} />
				{t("common.retry")}
			</button>
		</li>
	);
}
