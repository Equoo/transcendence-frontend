import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getConnection } from '@/realtime';

import { normalizeRelationship, type Relationship } from '../api/relationship.api';
import { removeRelationship, upsertRelationship } from '../cache/friends.cache';

export function useRelationshipRealtime(): void {
	const qc = useQueryClient();

	useEffect(() => {
		const connection = getConnection();
		const onUpsertRelationship = (rel: Relationship): void => {
			upsertRelationship(qc, normalizeRelationship(rel));
		};
		const onRemoveRelationship = (userId: string): void => {
			removeRelationship(qc, userId);
		};

		connection.on('UpsertRelationship', onUpsertRelationship);
		connection.on('RemoveRelationship', onRemoveRelationship);

		return (): void => {
			connection.off('UpsertRelationship', onUpsertRelationship);
			connection.off('RemoveRelationship', onRemoveRelationship);
		};
	}, [qc]);
}
