import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { PiArrowClockwise, PiHouse, PiWarningCircle } from "react-icons/pi";
import { Link } from "react-router";

import CheckButton from "@/components/Button/CheckButton";

import { describeError } from "./describeError";

export default function ErrorPage({
	error,
	onRetry,
	retrying = false,
}: {
	error: unknown;
	onRetry?: () => void;
	retrying?: boolean;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const { code, title, detail, trace } = describeError(error, t);

	return (
		<div className="flex h-full items-center justify-center w-full p-6 font-main bg-back">
			<div className="flex flex-col items-center gap-6 w-md max-w-full px-10 py-9 rounded-2xl bg-surface border border-border shadow-main text-center animate-in">
				<div className="flex items-center justify-center size-14 rounded-2xl bg-error-soft text-error">
					<PiWarningCircle size={30} />
				</div>

				<div className="flex flex-col items-center gap-1.5">
					{code !== null && (
						<span className="text-sm font-semibold text-muted tracking-wide">
							{t("errors.code", { code })}
						</span>
					)}
					<h1 className="text-2xl font-semibold font-head text-text tracking-tight">
						{title}
					</h1>
					<p className="text-sm text-text2">{detail}</p>
				</div>

				<div className="flex gap-3">
					<CheckButton
						active={false}
						onClick={
							onRetry ??
							((): void => {
								window.location.reload();
							})
						}
						disabled={retrying}
						pending={retrying}
					>
						<PiArrowClockwise size={18} />
						{t("common.retry")}
					</CheckButton>
					<Link to="/">
						<CheckButton active activeCheck={false}>
							<PiHouse size={18} />
							{t("common.home")}
						</CheckButton>
					</Link>
				</div>

				{trace !== null && (
					<span className="text-xs text-muted font-mono break-all">
						{t("errors.trace", { trace })}
					</span>
				)}
			</div>
		</div>
	);
}
