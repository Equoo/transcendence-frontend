import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { PiArrowLeft } from "react-icons/pi";
import Markdown, { type Components } from "react-markdown";
import { Link, useNavigate } from "react-router";

import LanguageSwitcher from "../../components/LanguageSwitcher";

export type LegalDoc = "privacy" | "terms";

// Section keys, in display order. Content lives in translations under
// `legal.<doc>.sections.<key>` as { title, body } with a Markdown body.
const sections: Record<LegalDoc, string[]> = {
	privacy: [
		"intro",
		"controller",
		"collected",
		"usage",
		"assistant",
		"sharing",
		"retention",
		"security",
		"cookies",
		"rights",
		"changes",
		"contact",
	],
	terms: [
		"acceptance",
		"service",
		"account",
		"conduct",
		"content",
		"assistant",
		"moderation",
		"availability",
		"liability",
		"termination",
		"changes",
		"contact",
	],
};

const markdownComponents: Components = {
	// eslint-disable-next-line id-length
	p: ({ children }) => <p className="leading-relaxed">{children}</p>,
	ul: ({ children }) => (
		<ul className="list-disc pl-5 flex flex-col gap-1.5">{children}</ul>
	),
	strong: ({ children }) => (
		<strong className="font-semibold text-text">{children}</strong>
	),
	// eslint-disable-next-line id-length
	a: ({ href, children }) => (
		<Link to={href ?? "#"} className="text-accent hover:underline">
			{children}
		</Link>
	),
};

export default function LegalPage({ doc }: { doc: LegalDoc }): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const navigate = useNavigate();
	const other: LegalDoc = doc === "privacy" ? "terms" : "privacy";

	return (
		<div className="w-full h-full overflow-y-auto bg-back">
			<div className="max-w-3xl mx-auto px-4 sm:px-8 py-10 flex flex-col gap-8">
				<header className="flex flex-col gap-4">
					<div className="flex items-center justify-between gap-4">
						<button
							type="button"
							onClick={() => void navigate(-1)}
							className="flex items-center gap-1.5 text-text2 hover:text-text text-sm cursor-pointer"
						>
							<PiArrowLeft size={16} />
							{t("common.goBack")}
						</button>
						<div className="flex items-center gap-3">
							<LanguageSwitcher />
							<img
								src="/logo/icon-mono.svg"
								alt=""
								className="size-8 opacity-40"
							/>
						</div>
					</div>
					<h3 className="text-text2 font-bold tracking-tight uppercase text-sm">
						{t("legal.label")}
					</h3>
					<h1 className="text-4xl sm:text-5xl font-semibold font-head text-text tracking-tight">
						{t(`legal.${doc}.title`)}
						<span className="text-accent">.</span>
					</h1>
					<p className="text-sm text-muted">
						{t("legal.lastUpdated", {
							date: t("legal.updatedOn"),
						})}
					</p>
				</header>

				<div className="flex flex-col gap-6 bg-surface border border-border rounded-lg shadow-main p-6 sm:p-8">
					{sections[doc].map((key, index) => (
						<section
							key={key}
							id={key}
							className="flex flex-col gap-2 scroll-mt-6"
						>
							<h2 className="font-head font-semibold text-lg text-text tracking-tight">
								{index + 1}.{" "}
								{t(`legal.${doc}.sections.${key}.title`)}
							</h2>
							<div className="flex flex-col gap-2 text-text2 text-[15px]">
								<Markdown components={markdownComponents}>
									{t(`legal.${doc}.sections.${key}.body`)}
								</Markdown>
							</div>
						</section>
					))}
				</div>

				<footer className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-text2">
					<Link
						to={`/${other}`}
						className="text-accent hover:underline"
						viewTransition
					>
						{t(`legal.${other}.title`)}
					</Link>
					<Link to="/" className="hover:text-text" viewTransition>
						{t("common.home")}
					</Link>
				</footer>
			</div>
		</div>
	);
}

export function LegalLinks({
	className = "",
}: {
	className?: string;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();

	return (
		<div className={`flex gap-4 text-xs text-muted ${className}`}>
			<Link to="/privacy" className="hover:text-accent" viewTransition>
				{t("legal.privacy.title")}
			</Link>
			<Link to="/terms" className="hover:text-accent" viewTransition>
				{t("legal.terms.title")}
			</Link>
		</div>
	);
}
