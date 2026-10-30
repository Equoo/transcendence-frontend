import { useEffect } from 'react';

import { getConnection } from '@/realtime';

import { type ActivityEnum, useActivity } from '../hooks/activity.hook';

export function useActivityRealtime(): void {
	useEffect(() => {
		const connection = getConnection();
		const onOtherActivityUpdated = (userId: string, activity: ActivityEnum): void => {
			useActivity.getState().setOtherActivity(userId, activity);
		};
		const onReportActivityTo = (userId: string): void => {
			useActivity.getState().reportActivityTo(userId);
		};

		connection.on('OtherActivityUpdated', onOtherActivityUpdated);
		connection.on('ReportActivityTo', onReportActivityTo);

		return (): void => {
			connection.off('OtherActivityUpdated', onOtherActivityUpdated);
			connection.off('ReportActivityTo', onReportActivityTo);
		};
	}, []);
}
