import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import type { Role } from "@/admin/api/roles";
import type { ValidationErrors } from "@/api/problem_detail";
import ChipPicker from "@/components/Input/ChipPicker";
import { Field } from "@/components/Input/Field";
import HiddenValues from "@/components/Input/HiddenValues";
import Promisable from "@/components/Promisable";

export default function RolesField({
	roles,
	selected,
	onChange,
	disabled = false,
	errors,
}: {
	roles: Promise<Role[]>;
	selected: string[];
	onChange: (selected: string[]) => void;
	disabled?: boolean;
	errors?: ValidationErrors;
}): JSX.Element {
	// eslint-disable-next-line id-length
	const { t } = useTranslation();

	return (
		<Field
			name="Roles"
			label={t("chat.whitelistedRoles")}
			hint={t("chat.whitelistHint")}
			errors={errors}
		>
			<Promisable
				data={roles}
				skeleton={<div className="h-7 rounded-full slot-skeleton" />}
			>
				{(list) => (
					<ChipPicker
						options={list.map((role) => role.name)}
						selected={selected}
						disabled={disabled}
						onChange={onChange}
					/>
				)}
			</Promisable>
			<HiddenValues name="Roles" values={selected} />
		</Field>
	);
}
