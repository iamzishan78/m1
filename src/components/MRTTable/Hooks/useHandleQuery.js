import { useApolloClient } from '@apollo/client';
import { debounce, set, get } from 'lodash';
import { useCallback, useEffect, useRef } from 'react';
import { GET_ES_SIMPLE_SEARCH } from 'graphQL/useQueryESSimpleSearch';
import { tableController, tableGlobalController } from 'hookstate/tableController';
import { GET_ES_AGGS_LIST } from 'graphQL/useQueryESAggsList';
import { copy } from 'utils/helper';
import { layerFiltersController } from 'hookstate/layerFiltersController';
import { drawController } from 'hookstate/drawStateController';

const useHandleQuery = ({ tableRef, tableKey, tableState, tableStateValues }) => {
	const Controller = tableController(tableKey);
	const { refetch } = tableGlobalController.useState(['refetch']);
	const { drawStateValues } = drawController.useState(['selectedPolygonString', 'currentFeature'], 'drawStateValues');
	const resetPagination = useRef(false); // use to reset pagination in case of infinite scroll
	const previousPagination = useRef(); // use to reset pagination in case of infinite scroll
	const columnsType = useRef({}); // use to reset pagination in case of infinite scroll
	const client = useApolloClient();

	const callQuery = async _pagination => {
		const tableMeta = tableState.get({ noproxy: true });
		const pagination = _pagination || tableMeta.pagination;
		const { TableSchema, fetchDynamicSchema } = tableMeta;
		if (!TableSchema) return

		Controller.updateState({
			isLoading: true,
			isFetching: true,
			isError: false,
		});
		let metaField = {}
		if (tableStateValues.sorting.length) {
			metaField = TableSchema?.find(item => (item.accessorKey || item.id) === tableStateValues.sorting[0]?.id);
		}

		let sort = tableStateValues.sorting[0]
			? {
				field: (() => {
					const sortingId = tableStateValues.sorting[0].id;
					const matchingSchema = TableSchema.find(
						val => (val.accessorKey || val.id) === sortingId
					);

					if (matchingSchema?.isComposite) {
						return matchingSchema.name.split(',')[0];
					}

					return matchingSchema?.name;
				})(),
				order: tableStateValues.sorting[0].desc ? 'desc' : 'asc',
			}
			: tableState?.defaultSort?.get({ noproxy: true });
		if (metaField?.isCustom) {
			sort.unmapped_type = "keyword"
		}

		const filters = [...tableMeta?.defaultFilters || [], ...tableMeta?.filters || []];

		if (
			tableStateValues.geoKey &&
			drawStateValues.selectedPolygonString &&
			drawStateValues.currentFeature
		) {
			filters.push({
				type: 'geo_intersects',
				field: tableStateValues.geoKey,
				value: drawStateValues.currentFeature.geometry,
			});
		}

		let globalFilter = tableStateValues.globalFilter;

		if (tableStateValues.isGeneric && !tableStateValues.globalSearch)
			globalFilter = null;

		const variables = {
			index: tableStateValues.esIndex,
			pagination: { ...pagination, pageIndex: undefined, pageSize: undefined },
			search: {
				query: globalFilter ? `*${globalFilter}*` : '*',
				fields: tableMeta.searchFields,
				advanceSearch: tableStateValues.advanceSearch,
			},
			sort,
			filters,
			isDynamicAsset: !!fetchDynamicSchema?.tableName
		};


		if (tableStateValues.filterLayerType)
			layerFiltersController.setVariables(tableStateValues.filterLayerType, variables);

		const allSelectedRows = await client.query({
			variables,
			query: GET_ES_SIMPLE_SEARCH,
		});

		const data = allSelectedRows?.data?.getESSimpleSearch;
		let rows = copy(data.hits) || [];

		rows.forEach(row => {
			TableSchema?.forEach(column => {
				const accessorKey = column.id || column.accessorKey;
				if (!columnsType.current[accessorKey]) {
					const rowWithValue = rows.find(row => get(row, accessorKey) !== null && get(row, accessorKey) !== undefined);
					if (rowWithValue) columnsType.current[accessorKey] = typeof get(rowWithValue, accessorKey);
				}
				const defaultValue =
					!columnsType.current[accessorKey] || columnsType.current[accessorKey] === 'number' ? undefined : '';
				let value = get(row, accessorKey);
				if (value !== undefined && value !== null && !Array.isArray(value) && typeof value !== 'object') value = defaultValue === '' ? `${value}` : value;
				set(row, accessorKey, value || defaultValue, defaultValue);
			});
		});
		if (tableState?.isInFiniteScroll?.get() && !resetPagination.current) {
			const prevData = tableState?.data?.get({ noproxy: true }).rows || [];
			rows = [...prevData, ...rows];
		}
		resetPagination.current = false;
		previousPagination.current = pagination;
		Controller.updateState({
			data: {
				rows,
				total: data.total,
				pit: data.pit,
			},
			pagination,
			isLoading: false,
			isFetching: false,
			isError: false,
			...Controller.getGenericState(rows),
		});
	};

	async function fetchFooterAggregationData() {
		const tableMeta = tableState.get({ noproxy: true });
		const { TableSchema, defaultFilters, esIndex, filters } = tableMeta;
		if (!TableSchema) return

		const aggregationColumns = TableSchema?.filter(column => column.Aggregation)?.map(column => column.Aggregation);

		for (let i = 0; i < filters?.length; i++) {
			if (Number.isInteger(filters[i].value)) {
				filters[i].value = filters[i].value.toString();
			}
		}

		if (aggregationColumns?.length) {
			const result = await client.query({
				variables: {
					esIndex,
					filters: [...filters, ...defaultFilters],
					aggs: Object.assign({}, ...aggregationColumns),
				},
				query: GET_ES_AGGS_LIST,
			});

			Controller.updateState({
				footerProps: result?.data?.getESAggsList?.aggregations,
			});
		}
	}

	useEffect(() => {
		fetchFooterAggregationData();
	}, [refetch, tableState.filters]);

	useEffect(() => {
		resetPagination.current = true;
		if (tableStateValues?.data?.rows?.length > 0) tableRef?.current?.scrollToIndex?.(0);
	}, [tableState.filters, tableState.sorting, tableState.grouping, tableState.globalFilter, refetch]);

	useEffect(() => {
		if (tableStateValues?.isInFiniteScroll) return;
		if (tableStateValues?.data?.rows?.length > 0) {
			tableRef?.current?.scrollToIndex?.(0);

			const tableMeta = tableState.get({ noproxy: true });
			if (tableMeta.pagination?.pageIndex !== previousPagination.current?.pageIndex) {
				const pagination = {
					pit: tableMeta.data?.pit,
					...tableMeta.pagination,
					before:
						tableMeta.data.rows && tableMeta.pagination?.pageIndex < previousPagination.current.pageIndex
							? tableMeta.data.rows[0]?.sort
							: null,
					after:
						tableMeta.data.rows && tableMeta.pagination?.pageIndex > previousPagination.current.pageIndex
							? tableMeta.data.rows[tableMeta.data.rows.length - 1]?.sort
							: null,
					pageIndex: tableMeta.pagination?.pageIndex,
				};
				callQuery(pagination);
			}
		}
	}, [tableState.pagination]);

	useEffect(() => {
		const tableMeta = tableState.get({ noproxy: true });

		if (!tableMeta || tableMeta.isFetching) return;
		callQuery({
			pageIndex: 0,
			first: tableStateValues?.pageSize || 50,
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

				let pagination = {};
				if (!tableMeta?.pagination?.pageIndex)
					pagination = {
						pageIndex: 0,
						first: tableStateValues.pageSize,
						after: null,
					};

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
					const startIndex = Object.keys(tableStateValues.rowSelection).length
					const newstate = tableStateValues.rowSelection
					for (let i = startIndex; i < startIndex + 50; i++) {
						newstate[i] = true
					}
					Controller.setColumnCheck(newstate)
				}

				callQuery(pagination);
			}
		}, 10),
		[tableState?.isInFiniteScroll, tableState?.isFetching]
	);

	return { fetchMoreOnBottomReached };
};

export default useHandleQuery;
