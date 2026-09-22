import { type JSX, useEffect, useState } from "react";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { Link, useFetcher } from "react-router";

import CheckButton from "@/components/CheckButton";
import { Input } from "@/components/Input";
import Modal from "@/components/Modal";
import PopupList from "@/components/PopupList";

import { ListActions, ListCell, ListRow } from "../../components/List";
import type { AppFile } from "../api/files.api";
import type { clientAction } from "../routes/files.route";

export default function FileItem({ file }: { file: AppFile }): JSX.Element {
	const [showSelect, setShowSelect] = useState(false);
	const [showConfirmation, setShowConfirmation] = useState(false);
	const [showUpdate, setShowUpdate] = useState(false);
	const fetcher = useFetcher<typeof clientAction>();

	useEffect(() => {
		if (fetcher.data instanceof Response && fetcher.data.status < 300) {
			// eslint-disable-next-line @eslint-react/set-state-in-effect
			setShowUpdate(false);
		}
	}, [fetcher.data]);
	return (
		<>
			<ListRow>
				<ListCell rowHeader>
					<Link
						className="hover:underline focus-visible:outline-accent"
						to={`/knowledge/${file.key}`}
					>
						{file.name}
					</Link>
				</ListCell>
				<ListCell>{file.contentType}</ListCell>
				<ListCell>
					{file.length / 1000000 < 1
						? `${Math.floor(file.length / 1000)} Ko`
						: `${Math.floor(file.length / 1000000)} Mo`}
				</ListCell>
				<ListCell>
					<ListActions className="relative">
						<PiDotsThreeVerticalBold
							onClick={() => {
								setShowSelect(true);
							}}
							size={18}
							className="cursor-pointer hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
						/>
						{showSelect && (
							<PopupList
								className="right-5 mb-8"
								onClose={() => {
									setShowSelect(false);
								}}
								rows={[
									{
										id: "edit",
										onClick: (): void => {
											setShowUpdate(true);
										},
										content: <div>Rename</div>,
									},
									{
										id: "delete",
										onClick: (): void => {
											setShowConfirmation(true);
										},
										content: <div>Delete</div>,
									},
								]}
							/>
						)}
					</ListActions>
				</ListCell>
			</ListRow>
			{showUpdate && (
				<Modal
					title="Rename file"
					width="w-4/10"
					onClose={() => {
						setShowUpdate(false);
					}}
				>
					<fetcher.Form
						method="PATCH"
						action={`/files/${file.key}`}
						className="flex flex-col gap-4 w-7/10 items-center"
					>
						<Input name="Name" required />
						<CheckButton
							type="submit"
							active
							pending={fetcher.state !== "idle"}
						>
							Rename
						</CheckButton>
					</fetcher.Form>
				</Modal>
			)}
			{showConfirmation && (
				<Modal
					width="w-fit"
					title={`Delete this file ?`}
					onClose={() => {
						setShowConfirmation(false);
					}}
				>
					<p className="text-muted font-main font-light w-4/5 text-sm text-center">
						This cannot be cancelled.
					</p>
					<div className="inline-flex gap-8">
						<CheckButton
							pending={fetcher.state !== "idle"}
							onClick={() => {
								void fetcher.submit(null, {
									action: `/files/${file.key}`,
									method: "DELETE",
								});
							}}
						>
							Yes
						</CheckButton>
						<CheckButton
							active
							activeCheck={false}
							onClick={() => {
								setShowConfirmation(false);
							}}
						>
							No
						</CheckButton>
					</div>
				</Modal>
			)}
		</>
	);
}
