import React, { useContext, useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useLazyQuery } from "@apollo/client";
import { Button, Tooltip, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { useHistory } from "react-router-dom";
import { isEmpty } from "lodash";

import { AppContext } from "AppContext";

import { copy, setStateIfDeepEqual } from "components/Shared/functions";
import { TAGSAMPLES } from "graphQL/useQueryTagSamples";
import { COMMENTSCOUNTER } from "graphQL/useQueryCommentsCounter";
import { IFARECONTACTS } from "graphQL/useQueryIfOwnersAreContacts";
import { TRACKSBYOBJECTTYPE } from "graphQL/useQueryTracksByObjectType";

import { GET_ES_SIMPLE_SEARCH } from "graphQL/useQueryESSimpleSearch";
import { AutoCompleteFilter } from "./AutoCompleteFilter";
import { GET_ES_SIMPLE_FILTER } from "graphQL/useQueryESSimpleFilter";
import TableHeader from "components/Table/constants/agreements-header-schema";

import { get } from "lodash";

import { usetableStyles } from "./Styles";
import { updateUserGridViewSettingAction, updateUserGridViewFiltersAction } from "store/actions/sessionActions";
import { handleSelectedGridChange, setColumnDisplayAndFilter } from "./helpers";
import { GET_META_DATA } from "graphQL/useQueryGetMetaData";
import { GET_GRID_VIEWS } from "graphQL/useQueryGetGridViews";
import { findInFunction, formattingGridView, sortColumns } from "utils/helper";
import moment from "moment";

import GlobalSettings from "..//..//GlobalSettings.js";

export const TableESHOC = (Component, shouldGridViewSort = true) => {
    const hocWithDefaultProps = function HOC(props) {
        const dispatch = useDispatch();
        const { loadMore } = props
        const [tableMeta, setTableMeta] = useState([]);
        const isFiniteScroll = props?.loadMore?.type === "infiniteScroll"
        // const classes = usetableStyles({ isCheckboxSticky: props.isCheckboxSticky, isHideFooter: isFiniteScroll && true })
        const classes = usetableStyles({ isCheckboxSticky: props.isCheckboxSticky, infScrollHeight: loadMore?.height })


        const [columns, Columns] = useState([]);
        const [filters, setFilters] = useState([]);
        const [changePage, isPageChanged] = useState(false);
        const [page, setPage] = useState(0)
        const setColumns = (newState) => { setStateIfDeepEqual(Columns, newState); };
        const [, setTotalLength] = useState(0);

        const [addToTable, setAddToTable] = useState('')
        const [openDialog, setOpenDialog] = useState(null);
        const [clickedRow, setClickedRow] = useState();

        const [gridViews, setGridViews] = useState(null);
        const [metaDatas, setMetaDatas] = useState(null);
        const [stateApp, setStateApp] = useContext(AppContext);

        const selectedFilters = useRef([]);

        const [rows, setRows] = useState([]);
        // const [rows, Rows] = useState([]);
        // const setRows = (newState) => { 
        //     setStateIfDeepEqual(Rows, newState) 
        // };
        const [searchedRows, setSearchedRows] = useState([])

        const [selectedRows, setSelectedRows] = useState([]);
        const [initialFilters, setInitialFilters] = useState([]);

        const [loading, Loading] = useState(true);
        const setLoading = (newState) => { setStateIfDeepEqual(Loading, newState) };

        const [dataTracksIds, DataTracksIds] = useState(null);
        const setDataTracksIds = (newState) => { setStateIfDeepEqual(DataTracksIds, newState) };

        const [dataTracks, DataTracks] = useState(null);
        const setDataTracks = (newState) => { setStateIfDeepEqual(DataTracks, newState) };

        const [getESSimpleSearch, { data: elasticData }] = useLazyQuery(GET_ES_SIMPLE_SEARCH, {
            fetchPolicy: "no-cache", onCompleted: () => {
                setLoading(false);
            }
        });

        // have to use refs because callbacks aren't guaranteed to get current state
        const [tracksByObjectType, { data: constDataTracks }] = useLazyQuery(TRACKSBYOBJECTTYPE, { fetchPolicy: "cache-and-network", });
        const dataTracksRef = useRef();
        dataTracksRef.current = dataTracks;
        const [getCommentsCounter, { data: dataCommentsCounter }] = useLazyQuery(COMMENTSCOUNTER, { fetchPolicy: "cache-and-network", });
        const dataCommentsCounterRef = useRef();
        dataCommentsCounterRef.current = dataCommentsCounter;
        const [getTagSamples, { data: dataTagSamples }] = useLazyQuery(TAGSAMPLES, { fetchPolicy: "cache-and-network", });
        const dataTagSamplesRef = useRef();
        dataTagSamplesRef.current = dataTagSamples;
        const [checkIfOwnersAreContacts, { data: checkIfOwnersAreContactsData }] = useLazyQuery(IFARECONTACTS, { fetchPolicy: "cache-and-network", });
        const checkIfOwnersAreContactsDataRef = useRef();
        checkIfOwnersAreContactsDataRef.current = checkIfOwnersAreContactsData;

        //Get Meta data to update Gridview for add custom fields
        const [getMetaData, { data: metaDataRes }] = useLazyQuery(GET_META_DATA);
        const [getGridViews, { data: gridViewsData }] = useLazyQuery(GET_GRID_VIEWS);

        const activeSearchRef = useRef();
        const activeFiltersRef = useRef();
        const tableStateRef = useRef();

        const [dependencyUpdate, SetDependencyUpdate] = useState(false);

        const history = useHistory();

        const tableData = elasticData?.getESSimpleSearch || {}
        useEffect(() => {
            if (tableMeta?.selectedGridView) {
                const category = tableMeta?.typeKeyword?.metaModule
                getMetaData({
                    variables: {
                        user: stateApp.user?.mongoId,
                        category,
                    },
                });
            }
        }, [getMetaData, getGridViews, tableMeta]);

        useEffect(() => {
            if (gridViewsData?.getGridViews?.gridViews) {
                setGridViews(gridViewsData.getGridViews.gridViews);

            }
        }, [gridViewsData]);

        useEffect(() => {
            if (metaDataRes?.getMetaData?.metaData) {
                setMetaDatas(metaDataRes?.getMetaData?.metaData);

            }
        }, [metaDataRes]);

        useEffect(() => {
            const { selectedGridView } = tableMeta

            if (selectedGridView && metaDatas) {
                Columns((cols) => {
                    if (cols?.length > 0) {
                        const selectedData = JSON.parse(JSON.stringify(selectedGridView));
                        setStateApp((state) => ({ ...state, selectedView: selectedData }));

                        let filterColumns = cols.filter((col) => !col._id && !props.actionColumns.includes(col.label));
                        let actionColumns = cols.filter((col) => props.actionColumns.includes(col.label));

                        // Excluding actionColumns from veiw Columns 
                        actionColumns = actionColumns.map(aC => ({ ...aC, options: { ...aC.options, viewColumns: false } }))

                        let columnsData = [...filterColumns, ...copy(metaDatas), ...actionColumns]

                        let view = JSON.parse(JSON.stringify(selectedData));
                        if (view.columns) {
                            let viewColumns = view.columns.filter((col) => !actionColumns.find((aC) => aC.name === col.name));
                            let viewActionColumns = view.columns.filter((col) => actionColumns.find((aC) => aC.name === col.name));
                            // if (viewActionColumns.length === 0) {
                            //     actionColumns.forEach((aC) => {
                            //         viewActionColumns.push({ name: aC.name, display: true })
                            //     })
                            // }
                            // viewActionColumns.forEach((vAC) => (vAC.display = true))
                            view.columns = [...viewColumns, ...viewActionColumns]
                        }
                        if (!isEmpty(view)) {
                            view = formattingGridView(JSON.parse(JSON.stringify(view)));
                            columnsData = handleSelectedGridChange(TableHeader(), view, columnsData);
                        }
                        if (shouldGridViewSort) {
                            columnsData = sortColumns(columnsData, view);
                        }
                        setColumnsData(columnsData)
                        // clearInterval(interval);

                    }

                    return cols
                })
            }
        }, [tableMeta.selectedGridView, columns.length, metaDatas]);

        const updateColumnSorting = (value) => {
            dispatch(
                updateUserGridViewSettingAction.STARTED({
                    userGridViewSetting: {
                        module: tableMeta?.typeKeyword?.gridViewCategory,
                        gridView: tableMeta.selectedGridView._id,
                        gridViewPatch: {
                            filters: selectedFilters.current,
                            columns: value.map((col) => ({ name: col.name, display: col.display === "true" })),
                        },
                        user: stateApp.user?.mongoId,
                    },
                })
            );
        };

        ////////Grid View Code ended
        useEffect(() => {
            if (constDataTracks?.tracksByObjectType) {
                const tracksIdArray = constDataTracks.tracksByObjectType.map((track) => track.trackOn);
                setDataTracksIds(tracksIdArray);
                setDataTracks(constDataTracks);
            }
        }, [constDataTracks])

        useEffect(() => {
            setSearchedRows(rows)
        }, [rows])

        useEffect(() => {
            if (
                props.targetLabel &&
                stateApp.user &&
                stateApp.user.mongoId &&
                props.showTracks &&
                props.targetLabel !== "contact" &&
                !dataTracks
            ) {
                tracksByObjectType({
                    variables: {
                        objectType:
                            props.targetLabel === "Parcel Interest"
                                ? "Parcel Ownership"
                                : props.targetLabel,
                    }
                })
            }
        }, [stateApp.user, props.targetLabel, props.showTracks]);

        useEffect(() => {
            SetDependencyUpdate(!dependencyUpdate)
        }, [dataCommentsCounter, dataTagSamples, checkIfOwnersAreContactsData, constDataTracks])

        useEffect(() => {
            if (tableMeta?.esIndex) {

                if (tableMeta.modifySelectedGridView) {
                    tableMeta.modifySelectedGridView(tableMeta.selectedGridView)
                }
                setPage(0)
                setLoading(true);
                getESSimpleSearch({
                    variables: {
                        index: tableMeta.esIndex,
                        pagination: {
                            first: tableMeta.startPaginationAt,
                            after: null
                        },
                        search: {
                            query: tableMeta.extendSearchQuery,
                            fields: tableMeta.searchFields
                        },
                        sort: tableMeta.defaultSort,
                        filters: handleMultiFieldFilter([
                            ...(initialFilters ? initialFilters : []),
                            ...(tableMeta.filters ? tableMeta.filters : []),
                            ...(tableMeta?.selectedGridView?.filters ? tableMeta?.selectedGridView?.filters : []),
                            ...(tableMeta.polygon) ? [tableMeta.polygon] : []
                        ])
                    }
                });
                if (tableMeta.selectedGridView)
                    handleSelectedGridChange(tableMeta.TableHeader, { ...tableMeta.selectedGridView, filters: (tableMeta.selectedGridView.filters || []).concat(tableMeta.filters || []) }, columns, true)
            }
            // eslint-disable-next-line
        }, [tableMeta]);


        useEffect(() => {
            if (tableData?.hits?.length > 0 && tableMeta?.initializeGenericData?.actions) {
                const objectsIdsArray = tableData?.hits?.map((hit) => get(hit, tableMeta?.initializeGenericData?.key));
                initializeGenericData(objectsIdsArray, tableMeta.initializeGenericData.actions);
            }
        }, [tableData]);

        useEffect(() => {
            if (tableData?.hits?.length > 0) {
                setTotalLength(tableData?.total)
                let { TableHeader, formatColumns, formatHits } = tableMeta

                TableHeader = columns.length > 0 ? columns : TableHeader;
                let hits = tableData?.hits
                if (formatHits)
                    hits = formatHits(hits)

                if (isFiniteScroll && changePage) {
                    const rowIndex = rows.length - 5
                    setRows(rows.concat(tableData?.hits));
                    document.getElementById(`waypoint-${rowIndex}`)?.scrollIntoView();
                    isPageChanged(false)
                }
                else
                    setRows(hits);

                if (formatColumns)
                    TableHeader = formatColumns(TableHeader, hits)

                setColumnsData(copy(TableHeader));
                setLoading(false);
            }
            else if (tableData?.hits?.length === 0) {
                let { formatHits } = tableMeta;

                if (formatHits)
                    formatHits([]);
                setRows([]);
                setColumnsData(copy(tableMeta.TableHeader));
                setLoading(false);
            }
        }, [tableData, dependencyUpdate]);

        const setColumnsData = (tableCols) => {
            let { TableHeader, extendSearchQuery, esIndex, filters } = tableMeta
            let appliedFilters = initialFilters;
            if (filters && filters.length > 0) {
                appliedFilters = [...initialFilters, ...filters]
            }

            tableCols.forEach((column, index) => {
                // Update global setting of sticky column in case of infinite scroll
                const setCellProps = column.options?.setCellProps

                /// apply global settings unless ignored
                if (column?.options?.ignoreGlobal) {
                    column.options = {
                        ...column.options,
                    };
                } else {
                    column.options = {
                        ...GlobalSettings.muiGridStandardOptions,
                        ...column.options,
                    }
                }

                if (column?.options?.filter) {
                    const custom = column.custom;
                    column.options = {
                        ...column.options,
                        sortThirdClickReset: column.options.sort === false ? false : true,
                        filter: true,
                        filterType: "custom",
                        filterList: undefined,
                        customFilterListOptions: {
                            render: v => v.map(l => l === "true" && column?.options?.forceFilter ? "Yes" : l === "false" && column?.options?.forceFilter ? "No" : l),
                        },
                        filterOptions: {
                            display: (filterList, onChange, index, column) => {
                                if (!TableHeader.find((el) => el.name === column.name)) {
                                    column.filterKey = `${tableMeta.customDataESKey}.${column.name}.keyword`
                                } else
                                    column.filterKey = TableHeader.find((el) => el.name === column.name)?.esKey;
                                return (
                                    <AutoCompleteFilter
                                        esIndex={esIndex}
                                        setFilters={setFilters}
                                        filterList={filterList}
                                        column={column}
                                        index={index}
                                        onChange={onChange}
                                        query={GET_ES_SIMPLE_FILTER}
                                        searchFields={tableMeta.searchFields}
                                        filters={appliedFilters}
                                        extendSearchQuery={extendSearchQuery}
                                        custom={custom}
                                    />
                                );
                            },
                        }
                    };
                } else {
                    column.options = {
                        ...column.options,
                        filterList: undefined,
                    }
                }
            });

            const allFilters = (tableMeta.selectedGridView?.filters || []).concat(initialFilters)
            if (allFilters) {
                tableCols.forEach((column, index) => {
                    setColumnDisplayAndFilter(TableHeader, tableMeta.selectedGridView, column);
                    let value
                    if (Array.isArray(column.esKey)) value = get(allFilters.find((filter) => { return column.esKey.includes(filter.field) }), "value", "");
                    else value = get(allFilters.find((filter) => { return JSON.stringify(filter.field) === JSON.stringify(column.esKey) }), "value", "");

                    let filterList = Array.isArray(column.esKey) ? [] : [];
                    if (value && typeof value !== "object") {
                        if (column.custom?.isDate && columns?.length) {
                            if (value !== "")
                                value = moment(new Date(value)).format("MM/DD/YYYY")
                        }
                        if (column.custom?.isDateTime && columns?.length) {
                            if (value !== "")
                                value = moment(new Date(value)).format("MM/DD/YYYY HH:mm:ss.SSS")
                        }
                        filterList = [value];
                    }
                    if (column?.options?.filter) {
                        column.options.filterList = filterList;
                    }
                });
            }
            else {
                tableCols.forEach((column, index) => {
                    setColumnDisplayAndFilter(TableHeader, tableMeta.selectedGridView, column);
                    if (column.options) {
                        column.options.filterList = Array.isArray(column.esKey) ? undefined : [];
                    }
                });
            }

            // shift _id and sticky Colums to the first Place
            let stickyColumns = tableCols.filter(cD => cD.name === '_id' || cD?.options?.stickyColumn)
            tableCols = tableCols.filter(cD => cD.name !== "_id" && !cD.options?.stickyColumn);
            tableCols.unshift(...stickyColumns);

            setColumns(tableCols);
        };

        const initializeGenericData = useCallback((ids, actions) => {
            if (actions.includes("comments")) {
                getCommentsCounter({
                    query: COMMENTSCOUNTER,
                    variables: {
                        objectsIdsArray: ids,
                        userId: stateApp.user.mongoId,
                    },
                })
            }

            if (actions.includes("tags")) {
                getTagSamples({
                    query: TAGSAMPLES,
                    variables: {
                        objectsIdsArray: ids,
                        userId: stateApp.user.mongoId,
                    },
                })
            }
            if (actions.includes("ifAreContacts")) {
                checkIfOwnersAreContacts({
                    query: IFARECONTACTS,
                    variables: {
                        idsArray: ids
                    },
                })
            }
        }, [stateApp?.user?.mongoId, getCommentsCounter, getTagSamples, checkIfOwnersAreContacts])

        const ifAreContacts = (ids) => {
            checkIfOwnersAreContacts({
                query: IFARECONTACTS,
                variables: {
                    idsArray: ids
                },
            })
        };

        const setGenricData = useCallback((data, id, actions, genericDataActions) => {
            if (actions.includes('tracks')) {
                data.isTracked = false;
                const tracks = dataTracksRef?.current?.tracksByObjectType || [];
                for (let i = 0; i < tracks?.length; i++) {
                    if (id === tracks[i].trackOn) {
                        data.isTracked = true;
                        break;
                    }
                }
            }
            if (actions.includes('comments')) {
                data.commentsCounter = !genericDataActions?.includes('comments')
                    ? data.comments?.length
                    : (() => {
                        const comments = dataCommentsCounterRef?.current?.commentsCounter || []
                        let commentsCounter = 0
                        for (let i = 0; i < comments.length; i++) {
                            if (id === comments[i]._id) {
                                commentsCounter = comments[i].total;
                                break;
                            }
                        }
                        return commentsCounter
                    })();
            }
            if (actions.includes('tags')) {
                data.tags = !genericDataActions?.includes('tags')
                    ? data?.tags && data?.tags?.[0] && data?.tags?.[0].tag &&
                    [data.tags.map(t => (t.tag)), data.tags.length]
                    : (() => {
                        const tags = dataTagSamplesRef?.current?.tagSamples || []
                        let newTags = [[], 0];
                        for (let i = 0; i < tags.length; i++) {
                            if (id === tags[i]._id) {
                                newTags = [tags[i].tags, tags[i].total];
                                break;
                            }
                        }
                        return newTags
                    })();
            }


            if (actions.includes('ifAreContacts')) {
                const ifAreContacs = checkIfOwnersAreContactsDataRef?.current?.ifAreContacts || []
                if (ifAreContacs.length > 0) {
                    let contact;
                    if (!data.contactId)
                        contact = ifAreContacs.find((ifc) => {
                            if (ifc.globalOwner?.replace(/-/g, "") === data.id?.replace(/-/g, "") || ifc.globalOwner?.replace(/-/g, "") === data.globalOwnerId?.replace(/-/g, ""))
                                return true;
                            return false;
                        });
                    else {
                        contact = ifAreContacs.find((ifc) => ifc._id === data.contactId);
                    }
                    if (contact) {
                        data.isContact = contact.isContact;
                        data.entity = contact._id;
                    }
                }
            }
            return data
        }, []);

        const handleMultiFieldFilter = (esFilter) => {
            const filters = []
            const filterHistory = {}
            if (esFilter) {
                esFilter.forEach((filter) => {
                    if (typeof filter?.field === 'string') {
                        if (!filterHistory[filter.field])
                            filters.push(filter)
                        filterHistory[filter.field] = true
                    } else {
                        filter?.field?.forEach((_, index) => {
                            if (!filterHistory[filter.field])
                                filters.push({ field: filter.field[index], value: filter.value })
                            filterHistory[filter.field] = true
                        })
                    }
                })
            }
            return filters
        }

        const initializeTableActions = (tableState, meta, tableData, columns, gqlQuery, selectedGridView = {}) => {
            let pageESVariables = {
                variables: {
                    index: tableMeta.esIndex,
                    search: {
                        query: typeof tableMeta.extendSearchQuery !== 'undefined' ? tableMeta.extendSearchQuery : tableState.searchText,
                        fields: tableMeta.searchFields
                    },
                    pagination: {
                        // pit: tableData?.before_pit,
                        first: tableState.rowsPerPage,
                        after: null,
                    },
                    ...(!isEmpty(tableState.sortOrder) && tableState.sortOrder.direction !== 'none') ? {
                        sort: (() => {
                            let field = columns.find(el => el.name === tableState.sortOrder?.name)?.esKey ||
                                columns.find(el => el.name === tableState.sortOrder?.name)?.name;
                            return {
                                field: Array.isArray(field) ? field[0] : field,
                                order: tableState.sortOrder?.direction
                            }

                        })()
                    } : { sort: tableMeta.defaultSort },

                    filters: tableState.filters ? [...tableState.filters] : [],
                    customFilters: []
                },
            };

            const manageAppliedFilter = (value, index) => {
                const gridViewfilters = selectedGridView.filters
                const gridViewEsKey = gridViewfilters && gridViewfilters.find(filter => filter.value === value)?.field

                const columnEsKey = columns[index].esKey

                let field
                if (tableState.columns[index]?.activeFilterKey) field = tableState.columns[index]?.activeFilterKey
                else if (Array.isArray(columnEsKey) && gridViewEsKey) field = gridViewEsKey
                else field = columnEsKey

                return { field: field, value: value }
            }

            tableState.filterList.forEach((val, index) => {
                if (val.length > 0 && columns[index]) {
                    if (columns[index].custom?.isDate || columns[index].custom?.isDateTime) {
                        const filterData = stateApp.filtersData[columns[index].name];
                        if (filterData) {
                            const data = filterData.find(f => f.key === val[0] || f.key_as_string === val[0])
                            pageESVariables.variables.filters.push({ field: columns[index].esKey, value: data.key_as_string });
                        }
                    } else if (columns[index].custom?.filterOptions?.length > 0) {
                        pageESVariables.variables.customFilters.push({ field: columns[index].esKey, value: val[0] })
                    } else if (columns[index].custom?.formatedFilterOptions?.length > 0) {
                        let value = val[0];
                        const filterData = columns[index].custom?.formatedFilterOptions;
                        const data = filterData.find(f => f.label === value)
                        if (data) {
                            value = data.value
                        }
                        pageESVariables.variables.filters.push({ field: columns[index].esKey, value })
                    } else if (columns[index].custom?.formatedFilterOptions?.length > 0 && columns[index].custom?.isPurchased) {
                        let value = val[0];
                        const filterData = columns[index].custom?.formatedFilterOptions;
                        const data = filterData.find(f => f.label === value)
                        pageESVariables.variables.filters.push({ field: columns[index].esKey, value: data.key_as_string })
                    } else {
                        pageESVariables.variables.filters.push(manageAppliedFilter(val[0], index))
                    }

                }
            })
            // if (selectedGridView?.filters && selectedGridView.type === 'Default') {

            //     selectedGridView.filters.forEach(filter => {
            //         pageESVariables.variables.filters.push(filter)
            //     })
            // }
            if (tableState.polygon) {
                pageESVariables.variables.filters.push(tableState.polygon)
            }
            return {
                pageESVariables,
                genericESAction: () => {
                    setLoading(true);
                    setPage(0)
                    tableState.page = 0;
                    meta.setPageInd(tableState.page);
                    meta.setRowsPerPage(tableState.rowsPerPage);
                    gqlQuery({
                        ...pageESVariables,
                        variables: {
                            ...pageESVariables.variables,
                            filters: handleMultiFieldFilter(pageESVariables.variables.filters.concat(tableMeta.filters))
                        },
                    });
                },
                changeESPage: () => {
                    setLoading(true);

                    let afterSort = rows && tableState.page > page ? rows[rows.length - 1]?.sort : null
                    let beforeSort = tableState.page === 0 ? null : rows && tableState.page < page ? rows[0]?.sort : null

                    gqlQuery({
                        ...pageESVariables,
                        variables: {
                            ...pageESVariables.variables,
                            pagination: {
                                pit: tableData?.pit,
                                ...pageESVariables.variables.pagination,
                                before: isFiniteScroll ? beforeSort : rows && tableState.page < meta.pageInd ? rows[0]?.sort : null,
                                after: isFiniteScroll ? afterSort : rows && tableState.page > meta.pageInd ? rows[rows.length - 1]?.sort : null,
                            },
                            filters: handleMultiFieldFilter(pageESVariables.variables.filters.concat(tableMeta.filters))
                        },
                    });
                    setPage(tableState.page)
                }
            }
        }

        const updateGridViewRedux = (tableState) => {
            setTableMeta((tableMeta) => {
                if (tableMeta?.selectedGridView) {

                    dispatch(updateUserGridViewSettingAction.STARTED({
                        userGridViewSetting: {
                            module: tableMeta?.typeKeyword?.gridViewCategory,
                            gridView: tableMeta.selectedGridView._id,
                            gridViewPatch: {
                                filters: activeFiltersRef.current,
                                columns: tableState.columns.map((col) => ({ name: col.name, display: col.display === 'true' })),
                            },
                            user: stateApp.user?.mongoId,
                        }
                    }));
                }
                let filters = activeFiltersRef.current;
                if (props.targetLabel === "well") {
                    filters = filters.filter(f => f.type !== "geo_intersects");
                }
                dispatch(updateUserGridViewFiltersAction(filters));

                return tableMeta
            })
        }

        const viewColumnProps = {
            selectedGridView: tableMeta.selectedGridView,
            // updateColumnSorting
            updateColumnSorting: (columns) => updateGridViewRedux({ columns }),
        };

        const onTableChange = (action, tableState, rows, meta) => {
            tableState.esIndex = tableMeta.esIndex;
            // tableState.filters = tableMeta.filters ? tableMeta.filters : [];
            tableState.polygon = tableMeta.polygon ? tableMeta.polygon : undefined;
            const selectedGridView = tableMeta.selectedGridView
            const tableActions = initializeTableActions(tableState, meta, tableData, columns, getESSimpleSearch, selectedGridView)
            activeSearchRef.current = tableActions.pageESVariables.variables.search;
            activeFiltersRef.current = handleMultiFieldFilter(tableActions.pageESVariables.variables.filters.concat(tableMeta.filters));
            selectedFilters.current = tableActions?.pageESVariables?.variables?.filters;
            tableStateRef.current = tableState


            if (action === 'filterChange' && tableMeta.setAppliedFilters) {
                // tableMeta.setAppliedFilters(activeFiltersRef.current);
            }
            if (['filterChange', 'resetFilters'].includes(action)) {
                if (isFiniteScroll) {
                    tableStateRef.current.sortOrder = {}
                    tableState.sortOrder = {}
                }
                updateGridViewRedux(tableState)
            }
            if (action === 'filterChange') {
                setInitialFilters(activeFiltersRef.current);
            }

            switch (action) {
                case "search":
                case "sort":
                case "filterChange":
                case "resetFilters":
                case "changeRowsPerPage":
                    // updateGridViewRedux(tableState)
                    if (isFiniteScroll) {
                        const tableClass = document.querySelectorAll("[class*=MUIDataTable-responsiveBase]")
                        if (tableClass.length > 0) tableClass[0].scrollTop = 0;
                    }
                    tableActions.genericESAction();
                    break;
                case "rowSelectionChange":
                    setSelectedRows(tableState.selectedRows.data)
                    break;
                case "changePage":
                    isPageChanged(true)
                    tableActions.changeESPage();
                    break;
                case "viewColumnsChange":
                    updateGridViewRedux(tableState)
                    viewColumnsChange(tableState.columns);
                    break;
                default:
            }
        }

        const viewColumnsChange = (tableColumns) => {
            for (let i = 0; i < tableColumns.length; i++) {

                if (columns[i]) {
                    if ((tableColumns[i].display === "true" || tableColumns[i].display === true) && tableColumns[i].display !== false) {
                        columns[i].options.display = true;
                        if (columns[i].esKey && !columns[i].noFilter) {
                            columns[i].options.filter = true;
                        }

                    } else {
                        columns[i].options.display = false;
                        columns[i].options.filter = false;
                        delete columns[i]?.options.filterOptions;

                    }
                }
            }

            setColumnsData(columns);
        };

        const count = tableData?.total || 0

        const options = {
            rowsPerPageOptions: [10, 25, 50, 100],
            count: count,
            serverSide: true,
            searchable: true,
            // rowsSelected: selectedRows.map((sR => sR.dataIndex)),
            // filter: true,
            searchText: tableMeta.extendSearchQuery || undefined,
            searchFields: tableMeta.searchFields,
            customToolbar: (tableMeta.addBtnText || tableMeta.addableName) ? () => {
                return <div style={{ display: "inline", "float": "left", marginRight: "15px", marginTop: "5px" }}>
                    {
                        tableMeta.addWithInput ?
                            <Button
                                color="secondary"
                                className={classes.multiSelectionTopBarButtons}
                                onClick={() => {
                                    if (tableMeta.inputModeType === "revenueStatementDetails")
                                        history.push(`/revenue/statement/${window.location.search.replace('?id=', '')}/line-item`);
                                }}
                            >
                                {tableMeta.addBtnText}
                            </Button>
                            :
                            <Button
                                color="secondary"
                                className={classes.multiSelectionTopBarButtons}
                                onClick={() => { setAddToTable('add'); setClickedRow(null) }}
                            >
                                {tableMeta.addBtnText ?
                                    `+ ADD ${tableMeta.addBtnText}` :
                                    `+ ADD ${tableMeta.addableName} To ${tableMeta.shapeType?.toUpperCase()}`}
                            </Button>
                    }

                </div>
            } : undefined,
            customToolbarSelect: ({ data }) => {
                return props.targetLabel !== "well"
                    && props.targetLabel !== "unit"
                    && props.targetLabel !== "operator"
                    && props.targetLabel !== "owner"
                    && (
                        <div style={{ height: "48px", display: "flex" }}>
                            <div style={{ marginTop: "6px", height: "35px", display: "flex", }}>
                                <Tooltip title={"Delete"}>
                                    <IconButton size="medium" style={{ margin: "0 5px" }} aria-label="delete" onClick={(e) => { setOpenDialog("delete"); }}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </div>
                    )
            },
            onRowClick: (rowData, { dataIndex, rowIndex }) => {
                setAddToTable('update')
                setClickedRow({ ...rows[dataIndex] })
            }
        }
        options.page = page

        const onInfiniteScroll = () => {
            let finalLength

            setTotalLength(length => {
                finalLength = length
                return length
            })

            setRows(state => {
                if (state.length < finalLength)
                    document.getElementById('pagination-next').click()

                return state
            })
        }

        const esHocProps = React.useMemo(() => {
            const esPropObj = {}
            esPropObj.onInfiniteScroll = isFiniteScroll ? onInfiniteScroll : null
            return esPropObj
        }, []);

        return (
            <span className={`${classes.ESHOCContainer} ${isFiniteScroll && classes.ESHOCInfScroll}`}>
                <Component
                    {...props}
                    rows={rows}
                    searchedRows={searchedRows}
                    setSearchedRows={setSearchedRows}
                    total={tableData?.total}
                    loading={loading}
                    dataTracks={dataTracksIds}
                    onInfiniteScroll={onInfiniteScroll}
                    setRows={setRows}
                    setLoading={setLoading}
                    initializeGenericData={initializeGenericData}
                    ifAreContacts={ifAreContacts}
                    setGenricData={setGenricData}
                    dependencyUpdate={dependencyUpdate}
                    initializeTableActions={initializeTableActions}

                    tableMeta={tableMeta}
                    setTableMeta={setTableMeta}
                    setFilters={setFilters}
                    options={options}
                    clickedRow={clickedRow}

                    addToTable={addToTable}
                    setAddToTable={setAddToTable}

                    openDialog={openDialog}
                    setOpenDialog={setOpenDialog}

                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}

                    onTableChange={onTableChange}
                    columns={columns}
                    setColumns={setColumns}

                    updateColumnSorting={updateColumnSorting}
                    viewColumnProps={viewColumnProps}

                    activeSearchRef={activeSearchRef}
                    activeFiltersRef={activeFiltersRef}
                    selectedFilters={selectedFilters}

                    initialFilters={initialFilters}
                    setInitialFilters={setInitialFilters}
                    esHocProps={esHocProps}
                />
            </span>
        );
    };
    hocWithDefaultProps.defaultProps = {
        actionColumns: [" ", "Tags", "Comments"]
    }
    return hocWithDefaultProps
};

export default TableESHOC;
