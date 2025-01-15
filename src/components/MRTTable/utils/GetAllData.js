import { GET_DB_DATA } from 'graphQL/useQueryDbQuery';

export const getAllData = async (search, sorting, defaultSort, esIndex, filters, total, client) => {
	let sortOrder;
	if (sorting?.length > 0) {
		sortOrder = { field: sorting[0]?.id, order: sorting[0]?.desc ? 'desc' : 'asc' };
	} else {
		sortOrder = defaultSort;
	}

	const pageESVariables = {
		variables: {
			index: esIndex,
			search,
			pagination: {
				first: total > 10000 ? 10000 : total,
				after: null,
			},
			sort: sortOrder,
			filters,
		},
	};
	const queryPromises = [];
	let selectedData = [];
	const max = 10000;
	let iter = 0;

	do {
		const remainingTotal = total - max * iter;
		const first = remainingTotal > max ? max : remainingTotal;
		iter += 1;

		pageESVariables.variables.pagination = {
			first,
			after: selectedData[selectedData.length - 1]?.sort,
		};

		queryPromises.push(
			client.query({
				...pageESVariables,
				query: GET_DB_DATA,
			})
		);
	} while (iter * max < total);

	const queryResults = await Promise.all(queryPromises);

	queryResults.forEach(result => {
		const hits = result?.data?.getDbData?.hits || [];
		selectedData = [...selectedData, ...hits];
	});

	return selectedData;
};
