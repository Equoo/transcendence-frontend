import { type JSX, useEffect, useState } from "react";
import {
	PiChatCircle,
	PiCursorClick,
	PiDesktop,
	PiDeviceMobile,
	PiGear,
	PiHashStraight,
	PiListBullets,
	PiMoon,
	PiShapes,
	PiSidebarSimple,
	PiSun,
	PiTextbox,
} from "react-icons/pi";
import { data, useSearchParams } from "react-router";
import { toast } from "react-toastify";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
	AppShell,
	Avatar,
	IconButton,
	MembersPanel,
	NavItem,
	Page,
	PageHeader,
	Segmented,
	SidePanel,
	type ThemePreference,
} from "@/ui";

import { useChannelsDemo } from "./channels";
import { DEMO_MEMBERS, memberActions } from "./members";
import { ListsSection, OverlaysSection } from "./overlays";
import { DevicePreview } from "./preview";
import { ButtonsSection, DisplaySection, FormSection, Section } from "./sections";

// Dev-only page: 404 in production builds
export function clientLoader(): null {
	if (!import.meta.env.DEV) {
		// eslint-disable-next-line @typescript-eslint/only-throw-error
		throw data(null, { status: 404 });
	}
	return null;
}

const SECTIONS = [
	{ id: "buttons", label: "Buttons", icon: PiCursorClick },
	{ id: "forms", label: "Forms", icon: PiTextbox },
	{ id: "display", label: "Display", icon: PiShapes },
	{ id: "overlays", label: "Overlays", icon: PiChatCircle },
	{ id: "lists", label: "List items", icon: PiListBullets },
	{ id: "channels", label: "Channels", icon: PiHashStraight },
	{ id: "preview", label: "Device preview", icon: PiDeviceMobile },
];

const EMBED_SECTIONS = SECTIONS.filter((section) => section.id !== "preview");

// Applies the theme for this page only, restoring the app's on leave
function usePreviewTheme(pref: ThemePreference): void {
	const systemDark = useMediaQuery("(prefers-color-scheme: dark)");
	useEffect(() => {
		const root = document.documentElement;
		const previous = root.dataset.theme;
		root.dataset.theme = pref === "system" ? (systemDark ? "dark" : "light") : pref;
		return (): void => {
			if (typeof previous === "string") {
				root.dataset.theme = previous;
			} else {
				delete root.dataset.theme;
			}
		};
	}, [pref, systemDark]);
}

export default function Showcase(): JSX.Element {
	const [theme, setTheme] = useState<ThemePreference>("light");
	const [current, setCurrent] = useState("buttons");
	const [asideOpen, setAsideOpen] = useState(false);
	usePreviewTheme(theme);

	const [params] = useSearchParams();
	const embedded = params.has("embed");
	const channels = useChannelsDemo();

	const nav = (
		<SidePanel
			header={
				<div className="flex items-center gap-3 px-1">
					<Avatar name="Kit UI" size="md" />
					<div className="min-w-0">
						<p className="font-head text-ui-lg font-semibold text-text">KeepGrouped</p>
						<p className="text-ui-sm text-muted">UI kit</p>
					</div>
				</div>
			}
			compactHeader={<Avatar name="Kit UI" size="md" />}
			footer={<NavItem label="Settings" icon={PiGear} />}
			compactFooter={<NavItem label="Settings" icon={PiGear} />}
		>
			{(embedded ? EMBED_SECTIONS : SECTIONS).map((section) => (
				<NavItem
					key={section.id}
					label={section.label}
					icon={section.icon}
					active={current === section.id}
					onClick={() => {
						setCurrent(section.id);
						document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" });
					}}
				/>
			))}
			{channels.tree}
		</SidePanel>
	);

	const aside = (
		<MembersPanel
			members={DEMO_MEMBERS}
			memberActions={memberActions}
			onClose={() => {
				setAsideOpen(false);
			}}
			onMessage={(member) => {
				toast.info(`Chat with ${member.name}`);
			}}
		/>
	);

	return (
		<AppShell
			nav={nav}
			aside={aside}
			asideLabel="Members"
			asideOpen={asideOpen}
			onAsideOpenChange={setAsideOpen}
		>
			<Page
				width="wide"
				header={
					<PageHeader
						title="UI kit"
						subtitle="Every component, every state"
						actions={
							<>
								<Segmented
									label="Theme"
									size="sm"
									iconOnlyOnPhone
									value={theme}
									onChange={setTheme}
									options={[
										{ value: "light", label: "Light", icon: PiSun },
										{ value: "dark", label: "Dark", icon: PiMoon },
										{ value: "system", label: "System", icon: PiDesktop },
									]}
								/>
								<IconButton
									icon={PiSidebarSimple}
									label="Members panel"
									pressed={asideOpen}
									onClick={() => {
										setAsideOpen(!asideOpen);
									}}
								/>
							</>
						}
					/>
				}
			>
				<ButtonsSection />
				<FormSection />
				<DisplaySection />
				<OverlaysSection />
				<ListsSection />
				<Section id="channels" title="Channels">
					<p className="text-ui-sm text-text2">
						Same components as the sidebar. Tap opens the channel. Long-press a channel or a category (touch),
						right click it, or use the ⋯ / + buttons on hover, to open its settings: mark read, mute,
						copy link, edit, add a channel, delete…
					</p>
					<div className="max-w-xs rounded-ui-md bg-back2 px-3 pb-3">{channels.tree}</div>
				</Section>
				{!embedded && <DevicePreview />}
				{channels.dialogs}
			</Page>
		</AppShell>
	);
}
