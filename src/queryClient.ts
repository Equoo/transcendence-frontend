import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// data counts as "fresh" for 10 min → no refetch on navigation
			staleTime: 10 * 60_000,
			// unused cache entries are kept 30 min before garbage collection
			gcTime: 30 * 60_000,
		},
	},
});
