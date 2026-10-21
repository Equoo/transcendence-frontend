import type { JSX } from "react";

import { Field } from "@/components/Input/Field";
import { Select } from "@/components/Input/Select";

export default function FolderPicker({
	label,
	folders,
	value,
	onChange,
	name = "Folder",
}: {
	label: string;
	folders: string[];
	value: string;
	onChange: (folder: string) => void;
	name?: string;
}): JSX.Element {
	return (
		<Field name={name} label={label}>
			<Select
				name={name}
				value={value}
				className="w-full"
				options={folders.map((folder) => ({
					value: folder,
					label: folder,
				}))}
				onChange={onChange}
			/>
		</Field>
	);
}
