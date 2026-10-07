import {
	type JSX,
	type ReactNode,
	useEffect,
	useId,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";

const MARGIN = 8;

export default function Tooltip({
	content,
	children,
	className = "",
	onlyWhenTruncated = false,
}: {
	content: ReactNode;
	children: ReactNode;
	className?: string;
	onlyWhenTruncated?: boolean;
}): JSX.Element {
	const id = useId();
	const anchorRef = useRef<HTMLSpanElement>(null);
	const tooltipRef = useRef<HTMLDivElement>(null);
	const [isTruncated, setIsTruncated] = useState(false);
	const [open, setOpen] = useState(false);

	const enabled = !onlyWhenTruncated || isTruncated;

	useEffect(() => {
		const element = anchorRef.current;
		const observer = new ResizeObserver(() => {
			if (element) {
				setIsTruncated(
					element.scrollWidth > element.clientWidth ||
					element.scrollHeight > element.clientHeight,
				);
			}
		});
		if (onlyWhenTruncated && element) {
			observer.observe(element);
		}
		return (): void => {
			observer.disconnect();
		};
	}, [onlyWhenTruncated]);

	useEffect(() => {
		const close = (): void => {
			setOpen(false);
		};
		if (open) {
			window.addEventListener("scroll", close, true);
			window.addEventListener("resize", close);
		}
		return (): void => {
			window.removeEventListener("scroll", close, true);
			window.removeEventListener("resize", close);
		};
	}, [open]);

	useLayoutEffect(() => {
		const anchor = anchorRef.current;
		const tooltip = tooltipRef.current;
		if (open && anchor && tooltip) {
			const anchorRect = anchor.getBoundingClientRect();
			const tooltipRect = tooltip.getBoundingClientRect();

			let top = anchorRect.top - tooltipRect.height - MARGIN;
			if (top < MARGIN) {
				top = anchorRect.bottom + MARGIN;
			}
			const centered =
				anchorRect.left + anchorRect.width / 2 - tooltipRect.width / 2;
			const left = Math.min(
				Math.max(centered, MARGIN),
				window.innerWidth - tooltipRect.width - MARGIN,
			);
			tooltip.style.top = `${top}px`;
			tooltip.style.left = `${left}px`;
			tooltip.style.visibility = "visible";
		}
	}, [open]);

	const show = (): void => {
		if (enabled) {
			setOpen(true);
		}
	};
	const hide = (): void => {
		setOpen(false);
	};

	return (
		<>
			<span
				ref={anchorRef}
				className={className}
				tabIndex={enabled ? 0 : -1}
				{...(open && { "aria-describedby": id })}
				onMouseEnter={show}
				onMouseLeave={hide}
				onFocus={show}
				onBlur={hide}
			>
				{children}
			</span>
			{open &&
				createPortal(
					<div
						ref={tooltipRef}
						id={id}
						role="tooltip"
						style={{ top: 0, left: 0, visibility: "hidden" }}
						className="fixed z-50 max-w-[min(20rem,calc(100vw-1rem))] rounded-lg bg-text px-2.5 py-1.5 text-xs font-medium font-main text-surface shadow-main whitespace-normal wrap-break-word pointer-events-none"
					>
						{content}
					</div>,
					document.body,
				)}
		</>
	);
}
