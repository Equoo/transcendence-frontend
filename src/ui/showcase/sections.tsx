import { type JSX, type ReactNode, useState } from "react";
import {
	PiBell,
	PiCopy,
	PiDotsThreeBold,
	PiEnvelope,
	PiFunnel,
	PiPaperPlaneTilt,
	PiPencilSimple,
	PiPlus,
	PiPushPin,
	PiTrash,
	PiUsers,
} from "react-icons/pi";

import {
	Avatar,
	AvatarGroup,
	Badge,
	Button,
	Card,
	CardHeader,
	Chip,
	CountBadge,
	EmptyState,
	Field,
	IconButton,
	Input,
	Search,
	Segmented,
	Select,
	Skeleton,
	Spinner,
	Switch,
	TextArea,
} from "@/ui";

export function Section({
	id,
	title,
	children,
}: {
	id: string;
	title: string;
	children: ReactNode;
}): JSX.Element {
	return (
		<section id={id} className="scroll-mt-20">
			<Card>
				<CardHeader title={title} />
				<div className="flex flex-col gap-5">{children}</div>
			</Card>
		</section>
	);
}

export function Row({
	label,
	children,
}: {
	label: string;
	children: ReactNode;
}): JSX.Element {
	return (
		<div className="flex flex-col gap-2">
			<span className="text-ui-2xs font-bold tracking-wider text-muted uppercase">
				{label}
			</span>
			<div className="flex flex-wrap items-center gap-2">{children}</div>
		</div>
	);
}

export function ButtonsSection(): JSX.Element {
	const [pinned, setPinned] = useState(false);
	const [loading, setLoading] = useState(false);

	return (
		<Section id="buttons" title="Buttons">
			<Row label="Variants">
				<Button variant="primary">Primary</Button>
				<Button variant="soft">Soft</Button>
				<Button variant="secondary">Secondary</Button>
				<Button variant="ghost">Ghost</Button>
				<Button variant="danger">Danger</Button>
				<Button variant="danger-ghost">Danger ghost</Button>
			</Row>
			<Row label="Sizes & icons">
				<Button size="sm" leftIcon={PiPlus}>Small</Button>
				<Button leftIcon={PiPaperPlaneTilt} variant="primary">Medium</Button>
				<Button size="lg" rightIcon={PiPaperPlaneTilt}>Large</Button>
			</Row>
			<Row label="States">
				<Button
					variant="primary"
					loading={loading}
					onClick={() => {
						setLoading(true);
						setTimeout(() => {
							setLoading(false);
						}, 1500);
					}}
				>
					Click to load
				</Button>
				<Button disabled>Disabled</Button>
			</Row>
			<Row label="Full width">
				<Button variant="primary" fullWidth>Full width</Button>
			</Row>
			<Row label="Icon buttons">
				<IconButton icon={PiPencilSimple} label="Edit" />
				<IconButton icon={PiCopy} label="Copy" variant="secondary" />
				<IconButton icon={PiPaperPlaneTilt} label="Send" variant="primary" />
				<IconButton icon={PiPlus} label="Add" variant="soft" />
				<IconButton icon={PiTrash} label="Delete" variant="danger" />
				<IconButton
					icon={PiPushPin}
					label="Pin"
					pressed={pinned}
					onClick={() => {
						setPinned(!pinned);
					}}
				/>
				<IconButton icon={PiBell} label="Notifications" badge={<CountBadge count={3} />} />
				<IconButton icon={PiUsers} label="Small" size="sm" />
				<IconButton icon={PiUsers} label="Large" size="lg" />
				<IconButton icon={PiUsers} label="Loading" loading />
			</Row>
		</Section>
	);
}

const ROLES = [
	{ value: "member", label: "Member" },
	{ value: "officer", label: "Officer" },
	{ value: "admin", label: "Admin" },
	{ value: "owner", label: "Owner", disabled: true },
];

export function FormSection(): JSX.Element {
	const [query, setQuery] = useState("");
	const [view, setView] = useState<"month" | "week" | "list">("month");
	const [notify, setNotify] = useState(true);

	return (
		<Section id="forms" title="Forms">
			<div className="grid gap-4 md:grid-cols-2">
				<Field label="Email" hint="Never shown to other members" required>
					<Input type="email" leftIcon={PiEnvelope} placeholder="you@example.com" />
				</Field>
				<Field label="Password" errors={["At least 8 characters"]}>
					<Input type="password" defaultValue="short" />
				</Field>
				<Field label="Role">
					<Select options={ROLES} defaultValue="member" />
				</Field>
				<Field label="Channel" optionalLabel="optional">
					<Select options={ROLES} placeholder="Pick one…" />
				</Field>
				<Field label="Bio" className="md:col-span-2">
					<TextArea autoGrow rows={2} placeholder="Grows with its content…" />
				</Field>
				<Field label="Notifications" hint="Push and email" inline>
					<Switch checked={notify} onCheckedChange={setNotify} />
				</Field>
				<Field label="Disabled">
					<Input disabled defaultValue="Read only" />
				</Field>
			</div>
			<Row label="Search">
				<Search value={query} onValueChange={setQuery} wrapperClassName="max-w-sm" />
			</Row>
			<Row label="Segmented">
				<Segmented
					label="Calendar view"
					value={view}
					onChange={setView}
					options={[
						{ value: "month", label: "Month" },
						{ value: "week", label: "Week" },
						{ value: "list", label: "List" },
					]}
				/>
				<Segmented
					label="Calendar view"
					size="sm"
					value={view}
					onChange={setView}
					options={[
						{ value: "month", label: "Month" },
						{ value: "week", label: "Week" },
						{ value: "list", label: "List" },
					]}
				/>
			</Row>
		</Section>
	);
}

export function DisplaySection(): JSX.Element {
	const [filters, setFilters] = useState({ raid: true, training: true, outing: false });
	const [tags, setTags] = useState(["pvp", "weekly", "beginners"]);

	return (
		<Section id="display" title="Display">
			<Row label="Chips">
				<Chip>Neutral</Chip>
				<Chip tone="accent">Accent</Chip>
				<Chip tone="good">18/25 going</Chip>
				<Chip tone="warn">Maybe</Chip>
				<Chip tone="error">Full</Chip>
				<Chip size="sm" icon={PiFunnel}>Small</Chip>
			</Row>
			<Row label="Filter chips (toggle)">
				{(Object.keys(filters) as (keyof typeof filters)[]).map((key) => (
					<Chip
						key={key}
						dot={{ raid: "#c8607f", training: "#d98a2b", outing: "#3f9e8f" }[key]}
						selected={filters[key]}
						onClick={() => {
							setFilters({ ...filters, [key]: !filters[key] });
						}}
					>
						{key}
					</Chip>
				))}
			</Row>
			<Row label="Removable">
				{tags.map((tag) => (
					<Chip
						key={tag}
						onRemove={() => {
							setTags(tags.filter((item) => item !== tag));
						}}
					>
						#{tag}
					</Chip>
				))}
			</Row>
			<Row label="Badges">
				<Badge>Draft</Badge>
				<Badge tone="accent">RAG</Badge>
				<Badge tone="good" solid>Live</Badge>
				<CountBadge count={4} />
				<CountBadge count={240} />
			</Row>
			<Row label="Avatars">
				<Avatar name="Luna Park" size="xs" />
				<Avatar name="Max Ortega" size="sm" presence="online" />
				<Avatar name="Kenji Sato" presence="busy" />
				<Avatar name="Sam" presence="afk" />
				<Avatar name="Night Owls" size="lg" presence="offline" />
				<Avatar name="Inès Morel" size="lg" src="/broken.png" presence="online" />
				<Avatar name="Zoé Ravel" size="xl" />
				<AvatarGroup people={["Ana", "Ben", "Cleo", "Dan", "Eve", "Finn"].map((name) => ({ name }))} />
			</Row>
			<Row label="Loading">
				<Spinner />
				<div className="flex w-64 items-center gap-3">
					<Skeleton shape="circle" />
					<div className="flex flex-1 flex-col gap-2">
						<Skeleton className="w-3/4" />
						<Skeleton className="w-1/2" />
					</div>
				</div>
			</Row>
			<div className="grid gap-3 sm:grid-cols-2">
				<Card interactive padding="md" tabIndex={0}>
					<CardHeader title="Interactive card" subtitle="Hover lift" />
				</Card>
				<Card highlight padding="md">
					<CardHeader
						title="Highlighted card"
						subtitle="Selected state"
						action={<IconButton icon={PiDotsThreeBold} label="More" size="sm" />}
					/>
				</Card>
			</div>
			<EmptyState
				icon={PiUsers}
				title="No members yet"
				description="Invite people to start chatting."
				action={<Button variant="primary" leftIcon={PiPlus}>Invite</Button>}
			/>
		</Section>
	);
}
