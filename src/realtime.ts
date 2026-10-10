import * as signalR from '@microsoft/signalr';
import { HubConnectionState } from '@microsoft/signalr';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useConversationRealtime } from './friends/realtime/useConversationRealtime';

export const connection = new signalR.HubConnectionBuilder()
	.withUrl('/api/', {})
	.withAutomaticReconnect()
	.build();
//accessTokenFactory: () => getToken() 

export function useRealtime(): void {
	const qc = useQueryClient();

	useEffect(() => {
		connection.onreconnected((): void => { void qc.invalidateQueries(); });

		if (connection.state === HubConnectionState.Disconnected) { connection.start().catch(console.error); }
	}, [qc]);

	useConversationRealtime();
}
