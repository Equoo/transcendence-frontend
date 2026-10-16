import { skipToken, useQuery, type UseQueryResult } from "@tanstack/react-query";

import { useUser } from "@/users/hooks/users";

import { type Channel, type ChannelCategory, fetchCategories, fetchChannels } from "../api/chat.api";
import { chatKeys } from "../cache/chat.cache";

export function useChannels(): UseQueryResult<Channel[]> {
	return useQuery({
		queryKey: chatKeys.channels,
		queryFn: fetchChannels,
	});
}

export function useChannel(channelId: string): UseQueryResult<Channel | null> {
	return useQuery({
		queryKey: chatKeys.channels,
		queryFn: fetchChannels,
		select: (channels) => channels.find((ch) => ch.id === channelId) ?? null,
	});
}

export function useCategories(): UseQueryResult<ChannelCategory[]> {
	return useQuery({
		queryKey: chatKeys.categories,
		queryFn: fetchCategories,
	});
}

export function useAckTime(channelId: string): Date | null {
	const user = useUser();

	const { data } = useQuery({
		queryKey: chatKeys.ack(channelId),
		queryFn: skipToken,
		initialData: () => user?.channelsAckMsg.get(channelId) ?? null,
		staleTime: Infinity,
	});
	return data ?? null;
}
