import { type JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiCaretDown } from "react-icons/pi";

import PopupList from "./List/PopupList";

const languages = [
	{ code: "fr", flag: "🇫🇷", label: "Francais" },
	{ code: "en", flag: "🇬🇧", label: "English" },
	{ code: "tc", flag: "🇹🇼", label: "汉语" },
];

// Language picker for pages shown without a logged-in user. The choice is only
// kept in the browser, the dashboard then applies the user's own language.
export default function LanguageSwitcher({
	className = "relative",
}: {
	className?: string;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t, i18n } = useTranslation();
	const [open, setOpen] = useState(false);
	const current =
		languages.find((lng) => lng.code === i18n.language) ?? languages[1];

	return (
		<div className={className}>
			<button
				type="button"
				aria-label={t("profile.language")}
				aria-haspopup="listbox"
				aria-expanded={open}
				onClick={() => {
					setOpen(true);
				}}
				className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-text2 hover:text-text hover:bg-hover cursor-pointer"
			>
				<span>{current.flag}</span>
				{current.label}
				<PiCaretDown size={12} />
			</button>
			{open && (
				<PopupList
					className="right-0 top-full mt-1 bg-surface2 border border-border"
					onClose={() => {
						setOpen(false);
					}}
					rows={languages.map((lng) => ({
						id: lng.code,
						onClick: (): void => {
							void i18n.changeLanguage(lng.code);
						},
						content: (
							<span>
								{lng.flag} | {lng.label}
							</span>
						),
					}))}
				/>
			)}
		</div>
	);
}
