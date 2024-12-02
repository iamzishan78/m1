import { useApolloClient } from '@apollo/client';
import { useEffect } from 'react';
import { simpleTableController, simpleTableGlobalController } from 'hookstate/simpleTableController';
import { COMMENTSCOUNTER } from 'graphQL/useQueryCommentsCounter';
import { TAGSAMPLES } from 'graphQL/useQueryTagSamples';
import { globalStateController } from 'hookstate/globalStateController';
import { isEqual } from 'lodash';

const useHandleAdditionalQueries = ({ tableKey, tableState, tableStateValues }) => {
	const Controller = simpleTableController(tableKey);
	const client = useApolloClient();

	const { refetchAdditionalQueries } = simpleTableGlobalController.useState(['refetchAdditionalQueries']);

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

		if (!isEqual(commentsCounterState, commentsCounter)) Controller.updateState({ commentsCounter });
	};

	const callTagsQuery = async () => {
		const user = globalStateController.getValue('user');
		const tagsListState = Controller.getValue('tagsList');

		const ids = tableStateValues.getIdsFromRows?.(tableStateValues.data.rows);

		if (!ids || ids.length === 0) return;

		const res = await client.query({
			variables: {
				objectsIdsArray: ids,
				userId: user.mongoId,
			},
			query: TAGSAMPLES,
		});

		const tagsList = res?.data.tagSamples;

		if (!isEqual(tagsListState, tagsList)) Controller.updateState({ tagsList });
	};

	useEffect(() => {
		const { additionalQueries } = tableStateValues;

		if (!additionalQueries || additionalQueries.length === 0) return;

		if (additionalQueries.includes('comments')) callCommentsQuery();
		if (additionalQueries.includes('tags')) callTagsQuery();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tableState.data, tableState.additionalQueries, refetchAdditionalQueries]);
};

export default useHandleAdditionalQueries;
