import type { JSX } from "react";
import { PiArrowLeft } from "react-icons/pi";
import { Link } from "react-router";

/** Back to the conversation list, only shown when the list and the content can't fit side by side. */
export default function BackToList(): JSX.Element {
	return (
		<Link
			to="/messages"
			title="Back"
			className="lg:hidden inline-flex items-center justify-center p-1.5 -ml-1.5 rounded-[12px] text-text2 hover:bg-hover hover:text-text duration-120"
		>
			<PiArrowLeft size={20} />
		</Link>
	);
}

/** Header padding leaving room for the main sidebar's drawer button on phones. */
export const HEADER_PADDING = "pl-12 pr-4 sm:px-5.5";
