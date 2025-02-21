import { useCallback, useEffect, useRef } from 'react';

import { useApolloClient } from '@apollo/client';
import { debounce, set, get, isNumber } from 'lodash';

import { mergeArrays } from 'components/Shared/functions';

import { drawController } from 'controllers/drawStateController';
import { layerFiltersController } from 'controllers/layerFiltersController';
import { tableController, tableGlobalController } from 'controllers/tableController';

import { GET_DB_AGGS, GET_DB_DATA_TOTAL, GET_DB_DATA } from 'graphQL/useQueryDbQuery';

import { copy } from 'utils/helper';

const PAGE_SIZE = 50;

// Custom hook to handle queries for MRTTable
const useHandleQuery = ({ tableRef, tableKey, tableState, tableStateValues }) => {
	// Get table controller instance
	const Controller = tableController(tableKey);
	// Get refetch function from global table controller
	const { refetch } = tableGlobalController.useState(['refetch']);
	// Get draw state values from draw controller
	const { drawStateValues } = drawController.useState(['selectedPolygonString', 'currentFeature'], 'drawStateValues');

	// Refs to manage pagination state for infinite scroll
	const resetPagination = useRef(false); // Flag to reset pagination
	const previousPagination = useRef(); // Store previous pagination values
	const columnsType = useRef({}); // Store column types

	// Apollo client instance
	const client = useApolloClient();

	// Destructure table state values
	const { isClientSide, modelName } = tableStateValues;

	// Function to execute query based on client-side or server-side querying
	const callQuery = async _pagination => {
		// Handle client-side query
		if (isClientSide) {
			const tableMeta = tableState;

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

			if (tableMeta?.FooterKeys?.length) {
				const footerProps = {};
				tableMeta.FooterKeys.forEach(key => {
					footerProps[key] = rows.reduce((acc, row) => acc + row[key], 0);
				});

				Controller.updateState({
					footerProps,
				});
			}

			Controller.updateState({
				data: {
					rows: JSON.parse(JSON.stringify(rows).replaceAll(' \\u0000', '').replaceAll('\\u0000', '')),
					total: rows.length,
				},
				isLoading: false,
				isFetching: false,
				isError: false,
			});

			return;
		}

		// Handle server-side query
		const resetPaginationVal = resetPagination.current;

		const tableMeta = tableState;
		const pagination = _pagination || tableMeta.pagination;
		const { TableSchema, fetchDynamicSchema } = tableMeta;
		const isElasticIndex = tableStateValues?.esIndex?.includes('platformData:');

		if (!TableSchema) {
			return;
		}

		Controller.updateState({
			isLoading: !tableStateValues.data?.rows?.length,
			isFetching: true,
			isError: false,
		});

		// Determine sort field and order
		let metaField = {};
		if (tableStateValues.sorting.length) {
			metaField = TableSchema?.find(item => (item.accessorKey || item.id) === tableStateValues.sorting[0]?.id);
		}

		let sort = tableStateValues.sorting[0]
			? {
					field: (() => {
						if (tableStateValues.sorting[0].field) {
							return tableStateValues.sorting[0].field;
						}

						const sortingId = tableStateValues.sorting[0].id;
						const matchingSchema = TableSchema.find(val => (val.accessorKey || val.id) === sortingId);

						if (matchingSchema?.isComposite) {
							return matchingSchema.name.split(',')[0];
						}

						return matchingSchema?.name;
					})(),
					order: tableStateValues.sorting[0].desc ? 'desc' : 'asc',
				}
			: tableState?.defaultSort;

		if (metaField?.isCustom) {
			sort.unmapped_type = 'keyword';
		}

		// Prepare filters
		const filters = [...(tableMeta?.defaultFilters || []), ...(tableMeta?.filters || [])];

		let globalFilter = tableStateValues.globalFilter;

		if (tableStateValues.isGeneric && !tableStateValues.globalSearch) {
			globalFilter = null;
		}

		// Prepare query variables
		const variables = {
			index: tableStateValues.esIndex,
			modelName,
			pagination: { ...pagination, pageIndex: undefined, pageSize: undefined },
			search: {
				query: globalFilter ? `${globalFilter}` : '',
				fields: tableMeta.searchFields,
				advanceSearch: tableStateValues.advanceSearch,
			},
			sort,
			filters,
			parent: tableStateValues.tableKey,
			isDynamicAsset: !!fetchDynamicSchema?.name,
		};

		// Update layer filters if filter layer type is defined
		if (tableStateValues.filterLayerType) {
			layerFiltersController.setVariables(tableStateValues.filterLayerType, variables);
		}

		// Fetch total count for non-elastic indices
		let total = tableStateValues?.data?.total;
		if (pagination.pageIndex === 0 && !isElasticIndex) {
			(async () => {
				const dbDataTotal = await client.query({
					variables,
					query: GET_DB_DATA_TOTAL,
				});

				if (isNumber(dbDataTotal?.data?.getDbDataTotal?.data)) {
					total = dbDataTotal.data.getDbDataTotal.data;

					Controller.updateState({
						data: {
							...Controller.getValue('data'),
							total,
						},
					});
				}
			})();
		}

		// Fetch data using ES simple search query
		const allSelectedRows = await client.query({
			variables,
			query: GET_DB_DATA,
		});

		const data = allSelectedRows?.data?.getDbData;
		if (isElasticIndex) {
			total = data.total;
		}

		let rows = copy(data.hits) || [];

		// Process and format row data
		rows.forEach(row => {
			TableSchema?.forEach(column => {
				const accessorKey = column.id || column.accessorKey;

				// Determine column type
				if (!columnsType.current[accessorKey]) {
					const rowWithValue = rows.find(row => get(row, accessorKey) !== null && get(row, accessorKey) !== undefined);
					if (rowWithValue) {
						columnsType.current[accessorKey] = typeof get(rowWithValue, accessorKey);
					}
				}

				// Set default value based on column type
				const defaultValue =
					!columnsType.current[accessorKey] || columnsType.current[accessorKey] === 'number' ? undefined : '';
				let value = get(row, accessorKey);

				// Convert value to string if not an object or array
				if (value !== undefined && value !== null && !Array.isArray(value) && typeof value !== 'object') {
					value = defaultValue === '' ? `${value}` : value;
				}

				set(row, accessorKey, value, defaultValue);
			});
		});

		// Merge rows for infinite scroll
		if (tableState?.isInFiniteScroll && !resetPaginationVal) {
			const prevData = tableState?.data?.rows || [];
			rows = mergeArrays(prevData, rows, '_id');
		}

		// Update table state with fetched data and pagination
		resetPagination.current = false;
		previousPagination.current = pagination;
		Controller.updateState({
			data: {
				rows,
				total: total ?? data.total,
				pit: data.pit,
			},
			pagination,
			isLoading: false,
			isFetching: false,
			isError: false,
			...Controller.getGenericState(rows),
		});
	};

	// Function to fetch footer aggregation data
	async function fetchFooterAggregationData() {
		const tableMeta = tableState;
		const { TableSchema, defaultFilters, esIndex, filters } = tableMeta;

		if (!TableSchema) {
			return;
		}

		const aggregationColumns = TableSchema?.filter(column => column.Aggregation)?.map(column => column.Aggregation);

		// Convert integer filter values to strings
		for (let i = 0; i < filters?.length; i++) {
			if (Number.isInteger(filters[i].value)) {
				filters[i].value = filters[i].value.toString();
			}
		}

		if (aggregationColumns?.length) {
			const result = await client.query({
				variables: {
					index: esIndex,
					modelName,
					filters: [...filters, ...defaultFilters],
					aggs: Object.assign({}, ...aggregationColumns),
				},
				query: GET_DB_AGGS,
			});

			Controller.updateState({
				footerProps: result?.data?.getDbAggs?.aggregations,
			});
		}
	}

	// Effect to handle geo filters based on draw state
	useEffect(() => {
		if (isClientSide) {
			return;
		}

		if (!tableStateValues.geoKey) {
			return;
		}

		if (!drawStateValues.selectedPolygonString) {
			Controller.clearFilter(tableStateValues.geoKey);
			return;
		}

		if (drawStateValues.selectedPolygonString && drawStateValues.currentFeature) {
			Controller.setFilter({
				type: 'geo_intersects',
				field: tableStateValues.geoKey,
				value: drawStateValues.currentFeature.geometry,
			});
			return;
		}
	}, [drawStateValues.selectedPolygonString]);

	// Effect to fetch footer aggregation data and refetch data
	useEffect(() => {
		if (isClientSide) {
			return;
		}

		fetchFooterAggregationData();
	}, [refetch, tableState.filters]);

	// Effect to reset pagination and scroll to top when filters, sorting, grouping, or global filter change
	useEffect(() => {
		if (isClientSide) {
			return;
		}

		resetPagination.current = true;
		if (tableStateValues?.data?.rows?.length > 0) {
			tableRef?.current?.scrollToIndex?.(0);
		}
	}, [tableState.filters, tableState.sorting, tableState.grouping, tableState.globalFilter, refetch]);

	// Effect to call query when client-side and query changes
	useEffect(() => {
		if (!isClientSide) {
			return;
		}

		if (!tableState.query) {
			return;
		}

		callQuery();
	}, [tableState.query, tableState.customProps, refetch]);

	// Effect to handle pagination changes for non-infinite scroll tables
	useEffect(() => {
		if (isClientSide) {
			return;
		}

		if (tableStateValues?.isInFiniteScroll) {
			return;
		}

		if (tableStateValues?.data?.rows?.length > 0) {
			tableRef?.current?.scrollToIndex?.(0);

			const tableMeta = tableState;

			if (tableMeta.pagination?.pageIndex !== previousPagination.current?.pageIndex) {
				const pagination = {
					pit: tableMeta.data?.pit,
					...tableMeta.pagination,
					before:
						tableMeta.data.rows && tableMeta.pagination?.pageIndex < previousPagination?.current?.pageIndex
							? tableMeta.data.rows[0]?.sort
							: null,
					after:
						tableMeta.data.rows && tableMeta.pagination?.pageIndex > previousPagination?.current?.pageIndex
							? tableMeta.data.rows[tableMeta.data.rows.length - 1]?.sort
							: null,
					pageIndex: tableMeta.pagination?.pageIndex,
				};

				callQuery(pagination);
			}
		}
	}, [tableState.pagination]);

	// Effect to call query initially with default pagination
	useEffect(() => {
		if (isClientSide) {
			return;
		}

		const tableMeta = tableState;

		if (!tableMeta) {
			return;
		}

		resetPagination.current = true;

		callQuery({
			pageIndex: 0,
			first: tableStateValues?.pageSize || PAGE_SIZE,
			after: null,
		});
	}, [
		tableState.filters,
		tableState.searchFields,
		tableState.sorting,
		tableState.grouping,
		tableState.globalFilter,
		tableState.defaultFilters,
		tableState.advanceSearch,
		refetch,
	]);

	// Callback function to fetch more data when scrolling near the bottom for infinite scroll
	const fetchMoreOnBottomReached = useCallback(
		debounce(containerRefElement => {
			if (isClientSide) {
				return;
			}

			if (!tableState?.isInFiniteScroll) {
				return;
			}

			if (!containerRefElement) {
				return;
			}

			if (tableState?.isFetching) {
				return;
			}

			const data = tableState?.data;

			if (data?.rows?.length >= data?.total) {
				return;
			}

			const { scrollHeight, scrollTop, clientHeight } = containerRefElement;

			const REFETCH_BUFFER = 200;

			if (scrollHeight - scrollTop - clientHeight < REFETCH_BUFFER) {
				const tableMeta = tableState;

				if (!tableMeta) {
					return;
				}

				let pagination = {};

				if (!tableMeta?.pagination?.pageIndex) {
					pagination = {
						pageIndex: 0,
						first: tableStateValues.pageSize,
						after: null,
					};
				}

				if (tableMeta.data?.pit && tableMeta?.pagination?.pageIndex !== undefined) {
					const pageIndex = (tableMeta?.pagination?.pageIndex || 0) + 1;
					pagination = {
						pit: tableMeta.data?.pit,
						...tableMeta.pagination,
						before:
							tableMeta.data.rows && pageIndex < tableMeta.pagination?.pageIndex ? tableMeta.data.rows[0]?.sort : null,
						after:
							tableMeta.data.rows && pageIndex > tableMeta.pagination?.pageIndex
								? tableMeta.data.rows[tableMeta.data.rows.length - 1]?.sort
								: null,
						pageIndex,
					};
				}

				if (tableStateValues.onScrollCheck) {
					const startIndex = Object.keys(tableStateValues.rowSelection).length;
					const newstate = tableStateValues.rowSelection;
					for (let i = startIndex; i < startIndex + PAGE_SIZE; i++) {
						newstate[i] = true;
					}
					Controller.setColumnCheck(newstate);
				}

				callQuery(pagination);
			}
		}, 10),
		[tableState?.isInFiniteScroll, tableState?.isFetching]
	);

	return { fetchMoreOnBottomReached };
};

export default useHandleQuery;
