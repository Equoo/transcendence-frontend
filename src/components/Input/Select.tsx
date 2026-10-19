import {
	type JSX,
	type KeyboardEvent,
	type ReactNode,
	useEffect,
	useId,
	useRef,
	useState,
} from "react";
import { TbChevronDown } from "react-icons/tb";

import { useClickOutside } from "@/hooks/useClickOutside";

export interface SelectOption {
	value: string;
	label: ReactNode;
}

interface SelectProps {
	options: SelectOption[];
	name?: string;
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	disabled?: boolean;
	ghost?: boolean;
	className?: string;
}

const OFFSET = 4;

export function Select({
	options,
	name,
	value,
	defaultValue,
	onChange,
	disabled,
	ghost,
	className,
}: SelectProps): JSX.Element {
	const [selected, setSelected] = useState(
		value ?? defaultValue ?? (options.length > 0 ? options[0].value : ""),
	);
	const [open, setOpen] = useState(false);
	const [active, setActive] = useState(0);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const listRef = useRef<HTMLUListElement>(null);
	const wrapperRef = useClickOutside<HTMLDivElement>(useRef(null), () => {
		setOpen(false);
	});
	const id = useId();

	useEffect(() => {
		if (typeof value === "string") {
			// eslint-disable-next-line @eslint-react/set-state-in-effect
			setSelected(value);
		}
	}, [value]);

	useEffect(() => {
		const list = listRef.current;
		const button = buttonRef.current;
		if (!list || !button) {
			return;
		}
		if (!open) {
			if (list.matches(":popover-open")) {
				list.hidePopover();
			}
			return;
		}

		const rect = button.getBoundingClientRect();
		list.style.minWidth = `${rect.width}px`;
		list.style.left = `${rect.left}px`;
		list.showPopover();

		const spaceBelow = window.innerHeight - rect.bottom;
		if (spaceBelow < list.offsetHeight + OFFSET && rect.top > spaceBelow) {
			list.style.top = `${rect.top - list.offsetHeight - OFFSET}px`;
		} else {
			list.style.top = `${rect.bottom + OFFSET}px`;
		}
	}, [open]);

	useEffect(() => {
		function close(): void {
			setOpen(false);
		}
		window.addEventListener("resize", close);
		window.addEventListener("scroll", close, true);
		return (): void => {
			window.removeEventListener("resize", close);
			window.removeEventListener("scroll", close, true);
		};
	}, []);

	function openList(): void {
		setActive(
			Math.max(
				0,
				options.findIndex((opt) => opt.value === selected),
			),
		);
		setOpen(true);
	}

	function choose(index: number): void {
		setOpen(false);
		if (index >= options.length || options[index].value === selected) {
			return;
		}
		setSelected(options[index].value);
		onChange?.(options[index].value);
	}

	function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
		if (!open) {
			if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
				event.preventDefault();
				openList();
			}
			return;
		}

		switch (event.key) {
			case "ArrowDown":
				event.preventDefault();
				setActive((idx) => Math.min(options.length - 1, idx + 1));
				break;
			case "ArrowUp":
				event.preventDefault();
				setActive((idx) => Math.max(0, idx - 1));
				break;
			case "Home":
				event.preventDefault();
				setActive(0);
				break;
			case "End":
				event.preventDefault();
				setActive(options.length - 1);
				break;
			case "Enter":
			case " ":
				event.preventDefault();
				choose(active);
				break;
			case "Escape":
			case "Tab":
				setOpen(false);
				break;
			default:
				break;
		}
	}

	const current = options.find((opt) => opt.value === selected);

	return (
		<div
			ref={wrapperRef}
			className={`relative inline-flex ${className ?? ""}`}
		>
			{Boolean(name) && (
				<input type="hidden" name={name} value={selected} />
			)}
			<button
				ref={buttonRef}
				type="button"
				role="combobox"
				aria-haspopup="listbox"
				aria-expanded={open}
				aria-controls={`${id}-list`}
				{...(open && { "aria-activedescendant": `${id}-${active}` })}
				disabled={disabled}
				onClick={() => {
					if (open) {
						setOpen(false);
					} else {
						openList();
					}
				}}
				onKeyDown={handleKeyDown}
				className={`w-full inline-flex items-center justify-between gap-2 min-h-8 px-2 py-1 rounded-md border
					font-main text-[15px] text-left outline-none transition-colors
					${
						ghost
							? "border-transparent bg-transparent enabled:hover:text-accent"
							: "bg-surface enabled:hover:bg-surface2"
					}
					${open ? "border-accent" : ghost ? "" : "border-border2 focus-visible:border-accent"}
					${disabled ? "text-text2 cursor-default" : "text-text cursor-pointer"}`}
			>
				<span className="truncate">{current?.label}</span>
				{!disabled && (
					<TbChevronDown
						size={16}
						className={`shrink-0 text-text2 transition-transform ${open ? "rotate-180" : ""}`}
					/>
				)}
			</button>
			<ul
				ref={listRef}
				id={`${id}-list`}
				role="listbox"
				popover="manual"
				className="fixed inset-auto m-0 max-h-64 overflow-y-auto py-1.5 px-2.5 bg-surface border border-border rounded-lg shadow-main font-main text-[15px] text-text animate-in"
			>
				{options.map((opt, idx) => (
					<li
						key={opt.value}
						id={`${id}-${idx}`}
						role="option"
						aria-selected={opt.value === selected}
						onMouseEnter={() => {
							setActive(idx);
						}}
						onMouseDown={(event) => {
							event.preventDefault();
						}}
						onClick={() => {
							choose(idx);
						}}
						className={`px-2 py-1.5 rounded-md cursor-pointer whitespace-nowrap
							${idx === active ? "bg-hover" : ""}
							${opt.value === selected ? "text-accent font-medium" : ""}`}
					>
						{opt.label}
					</li>
				))}
			</ul>
		</div>
	);
}
