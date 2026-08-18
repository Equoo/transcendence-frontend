import { type ReactNode,useEffect, useState } from "react";

export default function BlobURL({
	blob,
	children,
}: {
	blob: Blob;
	children: (url: string) => ReactNode;
}): ReactNode {
	const [url, setUrl] = useState("");

	useEffect(() => {
		// eslint-disable-next-line @eslint-react/set-state-in-effect
		setUrl(URL.createObjectURL(blob));
		return (): void => {
			URL.revokeObjectURL(url);
		};
	}, []);
	return children(url);
}
