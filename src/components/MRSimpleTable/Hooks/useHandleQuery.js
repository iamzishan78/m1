import { useApolloClient } from '@apollo/client';
import { useEffect } from 'react';
import { simpleTableController } from 'hookstate/simpleTableController';
import { tableGlobalController } from 'hookstate/tableController';

const useHandleQuery = ({ tableRef, tableKey, tableState, tableStateValues }) => {
	const Controller = simpleTableController(tableKey);
	const client = useApolloClient();

	const { refetch } = tableGlobalController.useState(['refetch']);

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

		Controller.updateState({
			data: {
				rows: JSON.parse(JSON.stringify(rows).replaceAll(' \\u0000', '').replaceAll('\\u0000', '')),
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tableState.query, tableState.customProps, refetch]);

	return {};
};

export default useHandleQuery;
