import { useMutation, type UseMutationResult, useQuery, useQueryClient, type UseQueryResult } from "@tanstack/react-query";

import { fetchUsers, type User } from "@/users/api/users";
import { toastError } from "@/utils/error.util";

import {
	addFriend,
	blockUser,
	fetchRelationships,
	type Relationship,
	removeFriend,
	renameSomeone,
} from "../api/relationship.api";
import { friendsKeys, removeRelationship, upsertRelationship } from "../cache/friends.cache";

export function useRelationships(): UseQueryResult<Relationship[]> {
	return useQuery({
		queryKey: friendsKeys.relations,
		queryFn: fetchRelationships,
		staleTime: 15_000,
		refetchOnWindowFocus: true,
	});
}

export function useRelationship(userId: string | undefined): Relationship | undefined {
	const { data } = useRelationships();
	return data?.find((rel) => rel.user.id === userId);
}

export function useUsers(): UseQueryResult<User[]> {
	return useQuery({
		queryKey: friendsKeys.users,
		queryFn: fetchUsers,
	});
}

// Mutations

export function useAddFriend(): UseMutationResult<Relationship, Error, string> {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: addFriend,
		onSuccess: (rel) => { upsertRelationship(qc, rel); },
		onError: toastError,
	});
}

export function useRemoveFriend(): UseMutationResult<void, Error, string> {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: removeFriend,
		onSuccess: (__, userId) => { removeRelationship(qc, userId); },
		onError: toastError,
	});
}

export function useBlockUser(): UseMutationResult<Relationship, Error, string> {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: blockUser,
		onSuccess: (rel) => { upsertRelationship(qc, rel); },
		onError: toastError,
	});
}

export function useRenameFriend(): UseMutationResult<
	Relationship,
	Error,
	{ userId: string; nickname: string | null }
> {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({ userId, nickname }) => renameSomeone(userId, nickname),
		onSuccess: (rel) => { upsertRelationship(qc, rel); },
		onError: toastError,
	});
}
