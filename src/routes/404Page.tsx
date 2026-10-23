import type { JSX } from "react";
import { useTranslation } from "react-i18next";

export default function Page404(): JSX.Element {
    // eslint-disable-next-line id-length
    const { t } = useTranslation();
	return (
		<div className="w-full h-full flex justify-center items-center bg-back2">
			<h1 className="absolute z-1 text-accent-text mb-50 text-8xl sm:text-[150px] font-bold">
				{t("notFound.title")}
			</h1>
		</div>
	);
}
