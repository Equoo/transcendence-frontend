import { type ComponentProps, type JSX, type ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import type { IconType } from "react-icons";
import { PiEye, PiEyeSlash, PiMagnifyingGlass, PiX } from "react-icons/pi";

import { cn } from "../lib/cn";
import { controlClass, type ControlSize, useFieldControl } from "./Field";

type InputProps = Omit<ComponentProps<"input">, "size"> & {
	size?: ControlSize;
	invalid?: boolean;
	pill?: boolean;
	leftIcon?: IconType;
	/** Content at the end of the box (unit, button…) */
	trailing?: ReactNode;
	wrapperClassName?: string;
};

/** Text input. Password inputs get a show / hide toggle. */
export function Input({
	size = "md",
	invalid,
	pill = false,
	leftIcon: LeftIcon,
	trailing,
	wrapperClassName,
	className,
	type = "text",
	id,
	required,
	...rest
}: InputProps): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const control = useFieldControl({ id, invalid, required });
	const [revealed, setRevealed] = useState(false);
	const isPassword = type === "password";

	return (
		<div
			className={controlClass({
				size,
				invalid: control["aria-invalid"],
				pill,
				className: wrapperClassName,
			})}
		>
			{LeftIcon && (
				<LeftIcon size={17} aria-hidden className="shrink-0 text-muted" />
			)}
			<input
				type={isPassword && revealed ? "text" : type}
				{...control}
				{...rest}
				className={cn(
					"min-w-0 flex-1 bg-transparent py-1.5 outline-none placeholder:text-muted disabled:cursor-not-allowed",
					className,
				)}
			/>
			{isPassword && (
				<button
					type="button"
					aria-label={t(
						revealed ? "common.hidePassword" : "common.showPassword",
					)}
					aria-pressed={revealed}
					onClick={() => {
						setRevealed((value) => !value);
					}}
					className="tap -mr-1.5 grid size-8 shrink-0 place-items-center rounded-ui-xs text-text2 cursor-pointer hover:bg-hover hover:text-text"
				>
					{revealed ? <PiEyeSlash size={17} /> : <PiEye size={17} />}
				</button>
			)}
			{trailing}
		</div>
	);
}

/** Pill search field with a clear button */
export function Search({
	value,
	onValueChange,
	placeholder,
	size = "md",
	className,
	...rest
}: Omit<InputProps, "value" | "onChange" | "type" | "pill" | "leftIcon"> & {
	value: string;
	onValueChange: (value: string) => void;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();

	return (
		<Input
			type="search"
			role="searchbox"
			enterKeyHint="search"
			autoComplete="off"
			pill
			size={size}
			leftIcon={PiMagnifyingGlass}
			value={value}
			placeholder={placeholder ?? t("ui.search")}
			onChange={(ev) => {
				onValueChange(ev.target.value);
			}}
			onKeyDown={(ev) => {
				if (ev.key === "Escape" && value !== "") {
					ev.preventDefault();
					onValueChange("");
				}
			}}
			className={cn("[&::-webkit-search-cancel-button]:hidden", className)}
			trailing={
				value !== "" && (
					<button
						type="button"
						aria-label={t("ui.clear")}
						onClick={() => {
							onValueChange("");
						}}
						className="tap -mr-1 grid size-7 shrink-0 place-items-center rounded-full text-text2 cursor-pointer hover:bg-hover hover:text-text"
					>
						<PiX size={14} />
					</button>
				)
			}
			{...rest}
		/>
	);
}
