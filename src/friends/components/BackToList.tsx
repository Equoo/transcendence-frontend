import type { JSX } from "react";
import { PiArrowLeft } from "react-icons/pi";
import { Link } from "react-router";

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

export const HEADER_PADDING = "pl-12 pr-4 sm:px-5.5";
