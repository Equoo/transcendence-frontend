import { type ReactNode, useEffect, useState } from "react";

export default function BlobURL({
	blob,
	children,
}: {
	blob: Blob;
	children: (url: string) => ReactNode;
}): ReactNode {
	const [url, setUrl] = useState<string>("");

	useEffect(() => {
		const objectUrl = URL.createObjectURL(blob);
		// eslint-disable-next-line @eslint-react/set-state-in-effect
		setUrl(objectUrl);
		return (): void => {
			URL.revokeObjectURL(objectUrl);
		};
	}, [blob]);
	return children(url);
}
