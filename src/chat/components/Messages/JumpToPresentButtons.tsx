import { useState } from "react";
import type { JSX } from "react/jsx-runtime";
import { useTranslation } from "react-i18next";
import { PiArrowDown } from "react-icons/pi";

const SCROLLED_UP_PX = 300;

export function useScrolledUp(): [
	boolean,
	(ev: React.UIEvent<HTMLDivElement>) => void,
] {
	const [isScrolledUp, setIsScrolledUp] = useState(false);

	const track = (ev: React.UIEvent<HTMLDivElement>): void => {
		const el = ev.currentTarget;
		const scrolledUp =
			el.scrollHeight - el.scrollTop - el.clientHeight > SCROLLED_UP_PX;
		if (scrolledUp !== isScrolledUp) {
			setIsScrolledUp(scrolledUp);
		}
	};

	return [isScrolledUp, track];
}

function JumpToPresentButtons({
	isDetached,
	isScrolledUp,
	onClick,
}: {
	isDetached: boolean;
	isScrolledUp: boolean;
	onClick: () => void;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	return (
		<>
			{isDetached && (
				<button
					type="button"
					onClick={onClick}
					className="absolute bottom-4 left-1/2 z-40 hidden -translate-x-1/2 items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-[13px] font-medium text-white shadow-main lg:flex"
				>
					{t("chat.jumpToPresent")}
					<PiArrowDown size={14} />
				</button>
			)}
			{(isDetached || isScrolledUp) && (
				<button
					type="button"
					onClick={onClick}
					aria-label={t("chat.jumpToPresent")}
					className="absolute bottom-4 right-4 z-40 flex size-11 items-center justify-center rounded-full bg-accent text-white shadow-main lg:hidden"
				>
					<PiArrowDown size={20} />
				</button>
			)}
		</>
	);
}

export default JumpToPresentButtons;
