import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { PiArrowLeft, PiHouse } from "react-icons/pi";
import { Link, useLocation, useNavigate } from "react-router";

import CheckButton from "@/components/Button/CheckButton";

export default function Page404(): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const navigate = useNavigate();
	const location = useLocation();

	// The first entry of the history has the "default" key: nothing to go back to.
	const canGoBack = location.key !== "default";

	return (
		<div className="relative flex items-center justify-center w-full h-full p-6 overflow-hidden bg-back2 font-main">
			<img
				src="/logo/icon-mono.svg"
				alt=""
				aria-hidden
				className="absolute -right-40 -bottom-40 w-[36rem] sm:w-[48rem] opacity-10 pointer-events-none select-none animate-spin [animation-duration:200s]"
			/>

			<div className="relative z-10 flex flex-col items-center gap-6 text-center animate-in">
				<span className="font-head font-bold text-accent leading-none tracking-tighter text-[120px] sm:text-[180px]">
					404
				</span>

				<div className="flex flex-col items-center gap-1.5 max-w-md">
					<h1 className="text-2xl sm:text-3xl font-semibold font-head text-text tracking-tight">
						{t("errors.pageNotFound")}
					</h1>
					<p className="text-sm sm:text-base text-text2">
						{t("errors.pageNotFoundDetail")}
					</p>
				</div>

				<div className="flex flex-wrap justify-center gap-3">
					{canGoBack && (
						<CheckButton
							onClick={() => {
								void navigate(-1);
							}}
						>
							<PiArrowLeft size={18} />
							{t("common.goBack")}
						</CheckButton>
					)}
					<Link to="/">
						<CheckButton active activeCheck={false}>
							<PiHouse size={18} />
							{t("common.home")}
						</CheckButton>
					</Link>
				</div>
			</div>
		</div>
	);
}
