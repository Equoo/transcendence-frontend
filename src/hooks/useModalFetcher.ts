import { useEffect, useRef } from "react";
import { type FetcherWithComponents, useFetcher } from "react-router";
import { toast } from "react-toastify";

import { APIError } from "@/api/problem_detail";

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
			if (!(
				fetcher.data instanceof APIError && fetcher.data.problem.errors
			)) {
				toast.error(fetcher.data.message || fetcher.data.name);
			}
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
