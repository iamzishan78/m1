import { useApolloClient } from '@apollo/client';
import { debounce } from 'lodash';
import { useCallback, useEffect } from 'react';
import { simpleTableController } from 'hookstate/simpleTableController';

const useHandleQuery = ({ tableRef, tableKey, tableState, tableStateValues }) => {
	const Controller = simpleTableController(tableKey);
	const client = useApolloClient();

	const callQuery = async () => {
		const tableMeta = tableState.get({ noproxy: true });

		Controller.updateState({
			isLoading: true,
			isFetching: true,
			isError: false,
		});

		const res = await client.query({
			variables: tableMeta.getVariables(tableMeta),
			query: tableMeta.query,
		});

		const rows = tableMeta.getDataFromRes(res);

		console.log('🚀 ~ file: useHandleQuery.js:29 ~ callQuery ~ rows:', rows);
		Controller.updateState({
			data: {
				rows,
				total: rows.length,
			},
			isLoading: false,
			isFetching: false,
			isError: false,
		});
	};

	useEffect(() => {
		if (!tableState.query.get()) return;

		callQuery();
	}, [tableState.query]);

	const fetchMoreOnBottomReached = useCallback(
		debounce(containerRefElement => {
			if (!tableState?.isInFiniteScroll?.get()) return;

			if (!containerRefElement) return;

			if (tableState?.isFetching?.get()) return;

			const data = tableState?.data?.get({ noproxy: true });

			if (data?.rows?.length >= data?.total) return;

			const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
			// once the user has scrolled within 400px of the bottom of the table, fetch more data if we can
			if (scrollHeight - scrollTop - clientHeight < 200) {
				const tableMeta = tableState.get({ noproxy: true });

				if (!tableMeta) return;

				callQuery();
			}
		}, 10),
		[tableState?.isInFiniteScroll, tableState?.isFetching]
	);

	return { fetchMoreOnBottomReached };
};

export default useHandleQuery;
