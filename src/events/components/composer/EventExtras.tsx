import { type JSX, type ReactNode, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import {
	PiCheckBold,
	PiPaperclip,
	PiPlusBold,
	PiTextAlignLeft,
	PiUsersThree,
	PiX,
} from "react-icons/pi";

import Promisable from "@/components/Promisable";

import { type AppFile, splitFileName } from "../../../files/api/files.api";
import { FileIcon } from "../../../files/components/FileIcon";
import FilePickerModal from "../../../files/components/FilePickerModal";
import { BARE_INPUT, FieldErrors } from "./Slot";
import { MAX_CHIP_LENGTH } from "./TagsSlot";

export function Tile({
	icon,
	title,
	aside,
	children,
}: {
	icon: ReactNode;
	title: string;
	aside?: ReactNode;
	children: ReactNode;
}): JSX.Element {
	return (
		<section className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 duration-200 focus-within:border-border2 focus-within:shadow-main">
			<header className="flex items-center gap-2.5 text-text">
				<span className="flex items-center justify-center size-7 shrink-0 rounded-lg bg-accent-soft text-accent">
					{icon}
				</span>
				<h4 className="font-head font-semibold text-[15px]">{title}</h4>
				<span className="flex-1" />
				{aside}
			</header>
			{children}
		</section>
	);
}

function Count({ value }: { value: number }): JSX.Element | null {
	if (value === 0) {
		return null;
	}
	return (
		<span className="rounded-full bg-hover px-2 py-0.5 text-xs font-semibold tabular-nums text-text2 animate-pop">
			{value}
		</span>
	);
}

export function DescriptionTile({
	value,
	onChange,
	errors,
}: {
	value: string;
	onChange: (value: string) => void;
	errors?: string[];
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();

	return (
		<Tile icon={<PiTextAlignLeft />} title={t("events.description")}>
			<textarea
				value={value}
				rows={3}
				placeholder={t("events.composer.descriptionPlaceholder")}
				aria-label={t("events.description")}
				className={`${BARE_INPUT} w-full resize-none field-sizing-content min-h-16 max-h-72 text-sm leading-relaxed text-text`}
				onChange={(ev) => {
					onChange(ev.target.value);
				}}
			/>
			<FieldErrors errors={errors} />
		</Tile>
	);
}

export function RolesTile({
	available,
	selected,
	onChange,
	errors,
}: {
	available: string[];
	selected: string[];
	onChange: (selected: string[]) => void;
	errors?: string[];
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const [draft, setDraft] = useState("");

	const query = draft.trim().toLowerCase();
	const created = selected.filter((role) => !available.includes(role));
	const shown = [...available, ...created].filter((role) =>
		role.toLowerCase().includes(query),
	);
	const exact =
		[...available, ...created].find(
			(role) => role.toLowerCase() === query,
		) ?? null;

	function toggle(role: string): void {
		onChange(
			selected.includes(role)
				? selected.filter((other) => other !== role)
				: [...selected, role],
		);
	}

	function commit(): void {
		if (!query) {
			return;
		}
		if (exact === null) {
			onChange([...selected, draft.trim()]);
		} else if (!selected.includes(exact)) {
			onChange([...selected, exact]);
		}
		setDraft("");
	}

	return (
		<Tile
			icon={<PiUsersThree />}
			title={t("events.roles")}
			aside={<Count value={selected.length} />}
		>
			<p className="-mt-1 text-xs text-muted">
				{t("events.composer.rolesHint")}
			</p>
			<div className="flex flex-wrap gap-2">
				{shown.map((role) => {
					const isSelected = selected.includes(role);

					return (
						<button
							key={role}
							type="button"
							aria-pressed={isSelected}
							className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold duration-150 cursor-pointer
								${isSelected ? "border-accent bg-accent text-accent-text" : "border-border2 text-text2 hover:border-accent hover:text-accent"}`}
							onClick={() => {
								toggle(role);
							}}
						>
							{isSelected && (
								<PiCheckBold
									size={10}
									className="animate-pop"
								/>
							)}
							{role}
						</button>
					);
				})}
				{query && exact === null && (
					<button
						type="button"
						className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-accent px-2.5 py-1 text-xs font-semibold text-accent cursor-pointer animate-pop hover:bg-accent-soft"
						onClick={commit}
					>
						<PiPlusBold size={10} />
						{t("events.composer.createRole", {
							name: draft.trim(),
						})}
					</button>
				)}
			</div>
			<input
				value={draft}
				maxLength={MAX_CHIP_LENGTH}
				placeholder={t("events.composer.rolePlaceholder")}
				aria-label={t("events.composer.rolePlaceholder")}
				className="w-full rounded-xl border border-border bg-surface2 px-3 py-1.5 text-sm text-text placeholder:text-muted focus:border-accent focus:ring-0"
				onChange={(ev) => {
					setDraft(ev.target.value);
				}}
				onKeyDown={(ev) => {
					if (ev.key === "Enter") {
						ev.preventDefault();
						commit();
					}
				}}
			/>
			<FieldErrors errors={errors} />
		</Tile>
	);
}

export function FilesTile({
	files: filesInput,
	selected,
	onToggle,
	errors,
}: {
	files: AppFile[] | Promise<AppFile[]>;
	selected: string[];
	onToggle: (fileKey: string) => void;
	errors?: string[];
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();
	const [picking, setPicking] = useState(false);

	return (
		<Tile
			icon={<PiPaperclip />}
			title={t("files.files")}
			aside={<Count value={selected.length} />}
		>
			<Promisable
				data={filesInput}
				skeleton={<div className="h-9 rounded-xl slot-skeleton" />}
			>
				{(files) => (
					<>
						{selected.length > 0 && (
							<ul className="flex flex-col gap-1.5">
								{selected.map((fileKey) => {
									const file = files.find(
										(other) => other.key === fileKey,
									);

									return (
										<li
											key={fileKey}
											className="flex items-center gap-2 rounded-xl bg-surface2 py-1.5 pl-2 pr-1 animate-pop"
										>
											<FileIcon
												contentType={
													file?.contentType ?? ""
												}
											/>
											<span className="flex-1 min-w-0 truncate text-sm text-text">
												{file
													? splitFileName(file.name)
															.baseName
													: fileKey}
											</span>
											<button
												type="button"
												aria-label={t("common.delete")}
												className="flex items-center justify-center size-6 rounded-full text-muted hover:bg-hover hover:text-text cursor-pointer"
												onClick={() => {
													onToggle(fileKey);
												}}
											>
												<PiX size={12} />
											</button>
										</li>
									);
								})}
							</ul>
						)}
						<button
							type="button"
							className="inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-border2 py-2 text-sm font-semibold text-text2 duration-150 cursor-pointer hover:border-accent hover:text-accent"
							onClick={() => {
								setPicking(true);
							}}
						>
							<PiPlusBold size={12} />
							{t("events.composer.attachFiles")}
						</button>
						{picking &&
							createPortal(
								<FilePickerModal
									files={files}
									selectedKeys={selected}
									onToggle={onToggle}
									onClose={() => {
										setPicking(false);
									}}
								/>,
								document.body,
							)}
					</>
				)}
			</Promisable>
			<FieldErrors errors={errors} />
		</Tile>
	);
}
