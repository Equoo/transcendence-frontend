export const upsert = <T extends { id: string }>(items: T[], item: T): T[] =>
	items.some((it) => it.id === item.id)
		? items.map((it) => (it.id === item.id ? { ...it, ...item } : it))
		: [...items, item];

export const without = <T extends { id: string }>(
	items: T[],
	id: string,
): T[] => items.filter((it) => it.id !== id);
