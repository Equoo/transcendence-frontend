import { useEffect, useRef } from "react";

export function usePrevious(value: unknown): unknown {
	const ref = useRef<unknown>(null);
	useEffect(() => {
		ref.current = value;
	});
	// eslint-disable-next-line react-hooks/refs, @eslint-react/refs
	return ref.current;
}
