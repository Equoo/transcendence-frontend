import {
	type ComponentProps,
	type JSX,
	type ReactNode,
	useEffect,
	useId,
	useState,
} from "react";
import { useTranslation } from "react-i18next";
import { TbCopy, TbCopyCheck, TbEye, TbEyeOff } from "react-icons/tb";

import type { ValidationErrors } from "../../api/problem_detail";
import { Field, fieldBox } from "./Field";
import { BARE_INPUT } from "./Slot";

export type InputProps = ComponentProps<"input"> & {
	name: string;
	label?: string;
	hint?: ReactNode;
	className?: string;
	children?: ReactNode;
	errors?: ValidationErrors;
	grayed?: boolean;
	copyable?: boolean;
	password?: boolean;
};

const ICON_BUTTON =
	"shrink-0 rounded-md p-0.5 text-muted duration-150 cursor-pointer hover:text-text";

function copyContent(content: string): void {
	const clipboard = new ClipboardItem({
		"text/plain": content,
	});

	void navigator.clipboard.write([clipboard]);
}

export function Input({
	name,
	label,
	hint,
	errors,
	className = "",
	children,
	grayed = false,
	copyable = false,
	password = false,
	value,
	onChange,
	...rest
}: InputProps): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const generatedId = useId();
	const id = rest.id ?? generatedId;
	const [internalValue, setInternalValue] = useState(value ?? "");
	const [hidden, setHidden] = useState(password);
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		// eslint-disable-next-line @eslint-react/set-state-in-effect
		setInternalValue(value ?? "");
	}, [value]);

	return (
		<Field
			name={name}
			label={label}
			htmlFor={id}
			hint={hint}
			required={rest.required}
			errors={errors}
		>
			<div
				className={`relative flex items-center gap-2 ${fieldBox({
					error: Boolean(errors?.[name]),
					grayed,
				})} ${className}`}
			>
				{children}
				<input
					className={`${BARE_INPUT} min-w-0 grow h-6 text-sm`}
					name={name}
					value={internalValue}
					{...rest}
					type={password ? (hidden ? "password" : "text") : rest.type}
					id={id}
					onChange={(ev) => {
						if (onChange) {
							onChange(ev);
						}
						setInternalValue(ev.target.value);
					}}
				/>
				{copyable && (
					<button
						type="button"
						aria-label={t("common.copy")}
						className={ICON_BUTTON}
						onClick={() => {
							copyContent(internalValue as string);
							setCopied(true);
						}}
					>
						{copied ? (
							<TbCopyCheck size={18} className="text-good" />
						) : (
							<TbCopy size={18} />
						)}
					</button>
				)}
				{password && (
					<button
						type="button"
						aria-label={
							hidden
								? t("common.showPassword")
								: t("common.hidePassword")
						}
						className={ICON_BUTTON}
						onClick={() => {
							setHidden(!hidden);
						}}
					>
						{hidden ? <TbEye size={18} /> : <TbEyeOff size={18} />}
					</button>
				)}
			</div>
		</Field>
	);
}
