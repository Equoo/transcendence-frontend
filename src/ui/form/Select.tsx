import { type JSX, type KeyboardEvent, useId, useState } from "react";
import type { IconType } from "react-icons";
import { TbCheck, TbChevronDown } from "react-icons/tb";

import { cn } from "../lib/cn";
import { useBreakpoint } from "../lib/useBreakpoint";
import { useFloating } from "../lib/useFloating";
import { FLOATING_PANEL, useAnchoredPanel } from "../overlay/Popover";
import { controlClass, type ControlSize, useFieldControl } from "./Field";

export interface SelectOption {
	value: string;
	label: string;
	icon?: IconType;
	disabled?: boolean;
}

interface SelectProps {
	options: SelectOption[];
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	name?: string;
	placeholder?: string;
	disabled?: boolean;
	invalid?: boolean;
	size?: ControlSize;
	id?: string;
	className?: string;
}

const chevron = (
	<TbChevronDown size={16} aria-hidden className="pointer-events-none shrink-0 text-text2" />
);

function initialValue({ defaultValue, placeholder, options }: SelectProps): string {
	if (typeof defaultValue === "string") {
		return defaultValue;
	}
	return typeof placeholder === "string" ? "" : (options.at(0)?.value ?? "");
}

function NativeSelect(props: SelectProps): JSX.Element {
	const { options, value, onChange, name, placeholder, disabled, invalid, size, id, className } = props;
	const control = useFieldControl({ id, invalid });

	return (
		<div className={controlClass({ size, invalid: control["aria-invalid"], className: cn("relative", className) })}>
			<select
				{...control}
				name={name}
				disabled={disabled}
				{...(typeof value === "string" ? { value } : { defaultValue: initialValue(props) })}
				onChange={(ev) => {
					onChange?.(ev.target.value);
				}}
				className="absolute inset-0 size-full appearance-none bg-transparent pl-[inherit] pr-9 outline-none disabled:cursor-not-allowed"
			>
				{typeof placeholder === "string" && (
					<option value="" disabled>
						{placeholder}
					</option>
				)}
				{options.map((opt) => (
					<option key={opt.value} value={opt.value} disabled={opt.disabled}>
						{opt.label}
					</option>
				))}
			</select>
			<span className="ml-auto">{chevron}</span>
		</div>
	);
}

/** Next enabled index from `from` in `delta` direction, clamped */
function step(options: SelectOption[], from: number, delta: number): number {
	const indexes = [...options.keys()];
	const candidates = delta > 0 ? indexes.slice(from + 1) : indexes.slice(0, Math.max(0, from)).reverse();
	for (const idx of candidates) {
		if (options[idx].disabled !== true) {
			return idx;
		}
	}
	return from;
}

function ListboxSelect(props: SelectProps): JSX.Element {
	const { options, value, onChange, name, placeholder, disabled, invalid, size, id, className } = props;
	const listId = useId();
	const control = useFieldControl({ id, invalid });
	const { open, setOpen, close, trigger, setTrigger } = useAnchoredPanel("dialog");
	const [inner, setInner] = useState(() => initialValue(props));
	const [active, setActive] = useState(0);
	const selected = value ?? inner;
	const current = options.find((opt) => opt.value === selected);

	const setPanel = useFloating({ anchor: trigger, open, matchWidth: true, onClose: close });

	function openList(): void {
		setActive(Math.max(0, options.findIndex((opt) => opt.value === selected)));
		setOpen(true);
	}

	function choose(index: number): void {
		const opt = options.at(index);
		close();
		if (!opt || opt.disabled === true || opt.value === selected) {
			return;
		}
		setInner(opt.value);
		onChange?.(opt.value);
	}

	function onKeyDown(ev: KeyboardEvent<HTMLButtonElement>): void {
		if (!open) {
			if (["ArrowDown", "ArrowUp", "Enter", " "].includes(ev.key)) {
				ev.preventDefault();
				openList();
			}
			return;
		}
		switch (ev.key) {
			case "ArrowDown":
				setActive(step(options, active, 1));
				break;
			case "ArrowUp":
				setActive(step(options, active, -1));
				break;
			case "Home":
				setActive(step(options, -1, 1));
				break;
			case "End":
				setActive(step(options, options.length, -1));
				break;
			case "Enter":
			case " ":
				choose(active);
				break;
			case "Escape":
				close();
				break;
			case "Tab":
				close();
				return;
			default:
				return;
		}
		ev.preventDefault();
		ev.stopPropagation();
	}

	const CurrentIcon = current?.icon;

	return (
		<>
			{Boolean(name) && <input type="hidden" name={name} value={selected} />}
			<button
				{...control}
				ref={setTrigger}
				type="button"
				role="combobox"
				aria-haspopup="listbox"
				aria-expanded={open}
				aria-controls={listId}
				{...(open && { "aria-activedescendant": `${listId}-${active}` })}
				disabled={disabled}
				onClick={() => {
					if (open) {
						close();
					} else {
						openList();
					}
				}}
				onKeyDown={onKeyDown}
				className={controlClass({
					size,
					invalid: control["aria-invalid"],
					className: cn(
						"cursor-pointer text-left disabled:cursor-not-allowed",
						open && "border-accent ring-3 ring-accent/12",
						className,
					),
				})}
			>
				{CurrentIcon && <CurrentIcon size={16} aria-hidden className="shrink-0 text-text2" />}
				<span className={cn("flex-1 truncate", !current && "text-muted")}>
					{current?.label ?? placeholder}
				</span>
				<span className={cn("transition-transform", open && "rotate-180")}>{chevron}</span>
			</button>
			<ul
				ref={setPanel}
				id={listId}
				role="listbox"
				popover="manual"
				className={cn(FLOATING_PANEL, "max-h-72 overflow-y-auto text-ui-base")}
			>
				{options.map((opt, idx) => {
					const OptIcon = opt.icon;
					return (
						<li
							key={opt.value}
							id={`${listId}-${idx}`}
							role="option"
							aria-selected={opt.value === selected}
							aria-disabled={opt.disabled}
							onPointerEnter={() => {
								setActive(idx);
							}}
							onMouseDown={(ev) => {
								ev.preventDefault();
							}}
							onClick={() => {
								choose(idx);
							}}
							className={cn(
								"flex h-9 items-center gap-2.5 rounded-ui-sm px-2.5 whitespace-nowrap cursor-pointer",
								idx === active && "bg-hover",
								opt.value === selected && "font-semibold text-accent",
								opt.disabled === true && "cursor-not-allowed opacity-50",
							)}
						>
							{OptIcon && <OptIcon size={16} aria-hidden />}
							<span className="flex-1">{opt.label}</span>
							{opt.value === selected && <TbCheck size={16} aria-hidden />}
						</li>
					);
				})}
			</ul>
		</>
	);
}

/**
 * Single choice. Touch devices get the native picker (best UX on
 * phones / tablets); mouse & keyboard get a styled listbox.
 */
export function Select(props: SelectProps): JSX.Element {
	const { isTouch } = useBreakpoint();
	return isTouch ? <NativeSelect {...props} /> : <ListboxSelect {...props} />;
}
