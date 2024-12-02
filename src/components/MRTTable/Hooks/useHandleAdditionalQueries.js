import { useApolloClient } from '@apollo/client';
import { useEffect } from 'react';
import { tableController, tableGlobalController } from 'hookstate/tableController';
import { IFARECONTACTS } from 'graphQL/useQueryIfOwnersAreContacts';
import { globalStateController } from 'hookstate/globalStateController';
import { COMMENTSCOUNTER } from 'graphQL/useQueryCommentsCounter';
import { isEqual } from 'lodash';

const useHandleAdditionalQueries = ({ tableKey, tableState, tableStateValues }) => {
	const Controller = tableController(tableKey);
	const { stateValues } = Controller.useState(['alreadyCheckedOwnersLength']);
	const { stateValues: ownersStateValues } = Controller.useState(['ownersWhoAreContact']);
	const client = useApolloClient();
	const { refetchAdditionalQueries } = tableGlobalController.useState(['refetchAdditionalQueries']);

	const ownersArray = ownersStateValues?.ownersWhoAreContact ?? [];

	const callIfOwnersAreContactsQuery = async () => {
		const alreadyFetchedLength = stateValues?.alreadyCheckedOwnersLength ?? 0;
		if (!tableStateValues?.data?.rows?.length && alreadyFetchedLength <= tableStateValues?.data?.rows?.length) return;

		Controller.updateState({
			isLoading: true,
			isFetching: true,
			isError: false,
		});

		const rows = tableStateValues?.data?.rows.slice(stateValues?.alreadyCheckedOwnersLength ?? 0);

		const idsArray = rows.map(row => row.id);
		const res = await client.query({
			variables: { idsArray },
			query: IFARECONTACTS,
		});

		if (res?.data?.ifAreContacts) {
			Controller.updateState({
				ownersWhoAreContact: [...ownersArray, ...res?.data?.ifAreContacts],
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

		if (!ids || ids.length === 0) return;

		const res = await client.query({
			variables: {
				objectsIdsArray: ids,
				userId: user.mongoId,
			},
			query: COMMENTSCOUNTER,
		});

		const commentsCounter = res?.data?.commentsCounter;
		if (!isEqual(commentsCounterState, commentsCounter))
			Controller.updateState({
				commentsCounter,
				isLoading: false,
				isFetching: false,
				isError: false,
			});
	};

	useEffect(() => {
		const { additionalQueries } = tableStateValues;

		if (!additionalQueries || additionalQueries.length === 0) return;

		if (additionalQueries.includes('isContact')) callIfOwnersAreContactsQuery();
		if (additionalQueries.includes('comments')) callCommentsQuery();
	}, [tableState.data, tableState.additionalQueries, refetchAdditionalQueries]);
};

export default useHandleAdditionalQueries;
