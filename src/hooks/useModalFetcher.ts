import { useEffect, useRef } from "react";
import { type FetcherWithComponents, useFetcher } from "react-router";
import { toast } from "react-toastify";

/**
 * Fetcher owned by a modal: once a submission settles, an error returned by
 * the action is toasted and the modal stays open, otherwise `then` is called
 * with the action data and the modal is closed.
 */
export function useModalFetcher({
	onClose,
	then,
}: {
	onClose: () => void;
	then?: (data?: unknown) => void;
}): FetcherWithComponents<unknown> {
	const fetcher = useFetcher();
	const submittedRef = useRef(false);
	const callbacksRef = useRef({ onClose, then });

	useEffect(() => {
		callbacksRef.current = { onClose, then };
	});

	useEffect(() => {
		if (fetcher.state !== "idle") {
			submittedRef.current = true;
			return;
		}
		if (!submittedRef.current) {
			return;
		}
		submittedRef.current = false;

		if (fetcher.data instanceof Error) {
			toast.error(fetcher.data.message);
			return;
		}
		callbacksRef.current.then?.(fetcher.data);
		callbacksRef.current.onClose();
	}, [fetcher.state, fetcher.data]);

	useEffect(
		() => (): void => {
			if (submittedRef.current) {
				callbacksRef.current.then?.();
				callbacksRef.current.onClose();
			}
		},
		[],
	);

	return fetcher;
}
