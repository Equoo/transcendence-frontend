import type { JSX } from "react/jsx-runtime";
import { useTranslation } from "react-i18next";

function NewMessagesDivider(): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	return (
		<div className="border-b-2 border-accent mt-4 text-text2 text-center">
			{t("chat.newMessages")}
		</div>
	);
}

export default NewMessagesDivider;
