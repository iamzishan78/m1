import { useEffect } from 'react';

import { useApolloClient } from '@apollo/client';
import { isEqual } from 'lodash';

import { globalStateController } from 'controllers/globalStateController';
import { tableGlobalController } from 'controllers/tableController';

import { COMMENTSCOUNTER } from 'graphQL/useQueryCommentsCounter';
import { IFARECONTACTS } from 'graphQL/useQueryIfOwnersAreContacts';
import { TAGSAMPLES } from 'graphQL/useQueryTagSamples';
import { IS_TRACKED_BY_IDS } from 'graphQL/useQueryTrackByObjectId';

const useHandleAdditionalQueries = ({ Controller, tableState, tableStateValues }) => {
	const { stateValues } = Controller.useState(['alreadyCheckedOwnersLength']);
	const { stateValues: ownersStateValues } = Controller.useState(['ownersWhoAreContact']);
	const client = useApolloClient();
	const { refetchAdditionalQueries } = tableGlobalController.useState(['refetchAdditionalQueries']);

	const ownersArray = ownersStateValues?.ownersWhoAreContact ?? [];

	const callIfOwnersAreContactsQuery = async () => {
		const alreadyFetchedLength = stateValues?.alreadyCheckedOwnersLength ?? 0;
		if (!tableStateValues?.data?.rows?.length && alreadyFetchedLength <= tableStateValues?.data?.rows?.length) {
			return;
		}

		const rows = tableStateValues?.data?.rows.slice(stateValues?.alreadyCheckedOwnersLength ?? 0);

		const idsArray = rows.map(row => row.globalOwnerId);

		if (!idsArray || idsArray.length === 0) {
			return;
		}

		Controller.updateState({
			isFetching: true,
			isError: false,
		});

		const res = await client.query({
			variables: { idsArray },
			query: IFARECONTACTS,
		});

		if (res?.data?.ifAreContacts) {
			Controller.updateState({
				ownersWhoAreContact: [...ownersArray, ...res.data.ifAreContacts],
				alreadyCheckedOwnersLength: tableStateValues?.data?.rows?.length,
				isLoading: false,
				isFetching: false,
				isError: false,
			});
			return;
		}

		Controller.updateState({
			isLoading: false,
			isFetching: false,
			isError: false,
		});
	};

	const callCommentsQuery = async () => {
		const user = globalStateController.getValue('user');
		const commentsCounterState = Controller.getValue('commentsCounter');

		const ids = tableStateValues.getIdsFromRows?.(tableStateValues.data.rows);

		if (!ids || ids.length === 0) {
			return;
		}

		const res = await client.query({
			variables: {
				objectsIdsArray: ids,
				userId: user.mongoId,
			},
			query: COMMENTSCOUNTER,
		});

		const commentsCounter = res?.data?.commentsCounter;
		if (!isEqual(commentsCounterState, commentsCounter)) {
			Controller.updateState({
				commentsCounter,
				isLoading: false,
				isFetching: false,
				isError: false,
			});
		}
	};

	const callTagsQuery = async () => {
		const user = globalStateController.getValue('user');
		const tagsListState = Controller.getValue('tagsList');

		const ids = tableStateValues.getIdsFromRows?.(tableStateValues.data.rows);

		if (!ids || ids.length === 0) {
			return;
		}

		const res = await client.query({
			variables: {
				objectsIdsArray: ids,
				userId: user.mongoId,
			},
			query: TAGSAMPLES,
		});

		const tagsList = res?.data.tagSamples;

		if (!isEqual(tagsListState, tagsList)) {
			Controller.updateState({ tagsList });
		}
	};

	const callIsTrackedQuery = async () => {
		const user = globalStateController.getValue('user');
		const isTrackedListState = Controller.getValue('isTrackedList');

		const ids = tableStateValues.getIdsFromRows?.(tableStateValues.data.rows);

		if (!ids || ids.length === 0) {
			return;
		}

		const res = await client.query({
			variables: {
				ids,
				userId: user.mongoId,
			},
			query: IS_TRACKED_BY_IDS,
		});

		const isTrackedList = res?.data?.isTrackedByIds?.data;

		if (!isEqual(isTrackedListState, isTrackedList)) {
			Controller.updateState({ isTrackedList });
		}
	};

	useEffect(() => {
		const { additionalQueries } = tableStateValues;

		if (!additionalQueries || additionalQueries.length === 0) {
			return;
		}

		if (additionalQueries.includes('isContact')) {
			callIfOwnersAreContactsQuery();
		}
		if (additionalQueries.includes('comments')) {
			callCommentsQuery();
		}
		if (additionalQueries.includes('tags')) {
			callTagsQuery();
		}
		if (additionalQueries.includes('isTracked')) {
			callIsTrackedQuery();
		}
	}, [tableState.data, tableState.additionalQueries, refetchAdditionalQueries]);
};

export default useHandleAdditionalQueries;
