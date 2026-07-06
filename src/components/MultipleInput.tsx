import {
	type ComponentProps,
	type JSX,
	type KeyboardEventHandler,
	useState,
} from "react";
import EventBadge from "./Events/EventBadge";

export default function MultipleInput({
	suggestions,
	className,
	name,
	placeholder,
	...rest
}: { suggestions?: string[] } & ComponentProps<"input">): JSX.Element {
	const [values, setValues] = useState<string[]>([]);
	const [draft, setDraft] = useState("");
	const [selected, setSelected] = useState(0);

	function addValue(val: string): void {
		setValues((prev) => (prev.includes(val) ? prev : [...prev, val]));
		setDraft("");
	}

	function getSuggestions(): string[] | undefined {
		return suggestions
			?.filter((el) => !values.includes(el))
			.filter((el) => el.startsWith(draft));
	}

	const inputType: KeyboardEventHandler<HTMLInputElement> = (ev) => {
		const sugg = getSuggestions();

		if (sugg && sugg.length > 0) {
			if (ev.key === "ArrowUp") {
				ev.preventDefault();
				if (selected === 0) {
					setSelected(sugg.length - 1);
				} else {
					setSelected((prev) => prev - 1);
				}
			}
			if (ev.key === "ArrowDown") {
				ev.preventDefault();
				if (selected === sugg.length - 1) {
					setSelected(0);
				} else {
					setSelected((prev) => prev + 1);
				}
			}
			if (ev.key === "ArrowRight") {
				ev.preventDefault();
				addValue(sugg[selected]);
				setSelected(0);
			}
		}
		if (ev.key === "Backspace" && draft.length === 0) {
			setValues((prev) => prev.slice(0, -1));
		}
		if (ev.key === " ") {
			ev.preventDefault();
			if (draft.length > 0) {
				addValue(draft);
			}
		}
	};
	return (
		<>
			<div className={`relative flex flex-wrap gap-1 ${className}`}>
				{values.map((value) => (
					<EventBadge key={value}>
						{value}
						<button
							type="button"
							className="font-bold text-text cursor-pointer"
							onClick={() => {
								setValues((prev) =>
									prev.filter((val) => val !== value),
								);
							}}
						>
							x
						</button>
					</EventBadge>
				))}
				<input
					{...rest}
					value={draft}
					className="bg-transparent focus:outline-0 w-10 grow peer"
					onKeyDown={inputType}
					placeholder={values.length > 0 ? "" : placeholder}
					onChange={(ev) => {
						setDraft(ev.target.value);
					}}
				/>
				<div
					className="absolute top-full left-0 w-full peer-focus:flex hidden flex-col
				border-l border-r bg-surface2 border-border rounded-b-md"
				>
					{getSuggestions()?.map((val, idx) => (
						<button
							type="button"
							key={val}
							className={`px-2 py-0.5 text-text border-t border-border hover:bg-surface
								hover:cursor-pointer text-left last:border-b last:rounded-b-md
								${idx === selected ? "bg-surface" : ""}`}
							onMouseDown={(ev) => {
								ev.preventDefault();
							}}
							onMouseEnter={() => {
								setSelected(idx);
							}}
							onClick={() => {
								addValue(val);
							}}
						>
							{val}
						</button>
					))}
				</div>
			</div>
			<input type="hidden" name={name} value={values.join(" ")} />
		</>
	);
}
