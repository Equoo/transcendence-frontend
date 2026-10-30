import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { PiArrowLeft } from "react-icons/pi";
import { Link } from "react-router";

export default function BackToList(): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();

	return (
		<Link
			to="/messages"
			title={t("friends.back")}
			className="lg:hidden inline-flex items-center justify-center p-1.5 -ml-1.5 rounded-[12px] text-text2 hover:bg-hover hover:text-text duration-120"
		>
			<PiArrowLeft size={20} />
		</Link>
	);
}

export const HEADER_PADDING = "pl-14 pr-4 lg:px-5.5 h-15";
