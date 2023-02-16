import React, { useContext, useState, useEffect, useCallback, useRef, useMemo, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useApolloClient, useLazyQuery } from "@apollo/client";
import { Button, Tooltip, IconButton, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import DeleteIcon from "@material-ui/icons/Delete";
import { useHistory } from "react-router-dom";
import { filter, isEmpty, unionWith, isEqual, uniqWith } from "lodash";

import { AppContext } from "AppContext";

import { copy, deepEqual, getSearchFields, setStateIfDeepEqual } from "components/Shared/functions";
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
import { updateUserGridViewSettingAction } from "store/actions/sessionActions";
import { handleSelectedGridChange, setColumnDisplayAndFilter } from "./helpers";
import { GET_META_DATA } from "graphQL/useQueryGetMetaData";
import { findInFunction, formattingGridView, sortColumns } from "utils/helper";
import { DrawerContext } from "components/Land/components/Agreements/detailComponents/DrawerContext";
import moment from "moment";

import GlobalSettings from "..//..//GlobalSettings.js";
import { SimpleAutoCompleteFilter } from "./SimpleAutoComplete";


export const TableESHOC = (Component) => {
    const HocWithDefaultProps = function HOC(props) {
        const { stateApp, setStateApp, loadMore } = props
        const [drawer, setDrawer] = useContext(DrawerContext);
        const dispatch = useDispatch();
        const client = useApolloClient();
        const [tableMeta, setTableMeta] = useState([]);
        const isFiniteScroll = props?.loadMore?.type === "infiniteScroll"
        const classes = usetableStyles({ isCheckboxSticky: props.isCheckboxSticky, infScrollHeight: loadMore?.height })

        const [search, setSearch] = useState(null);
        const [columns, Columns] = useState([]);
        const [changePage, isPageChanged] = useState(false);
        const [page, setPage] = useState(0)
        const setColumns = (newState) => { setStateIfDeepEqual(Columns, newState); };
        const [currentRowsLength, setCurrentRowsLength] = useState(0);

        const [addToTable, setAddToTable] = useState('')
        const [openDialog, setOpenDialog] = useState(null);
        const [clickedRow, setClickedRow] = useState();

        const [rows, setRows] = useState([]);
        const [searchedRows, setSearchedRows] = useState([])

        const [selectedRows, setSelectedRows] = useState([]);
        const [allRowsSelected, setAllRowsSelected] = useState(false);
        const [initialFilters, setInitialFilters] = useState([]);

        const [selectedGridView, setSelectedGridView] = useState();

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

        const activeSearchRef = useRef();
        const activeFiltersRef = useRef();
        const tableStateRef = useRef();
        const selectedFilters = useRef([]);
        const metaDataRef = useRef();

        const [dependencyUpdate, SetDependencyUpdate] = useState(false);

        const history = useHistory();

        const tableData = elasticData?.getESSimpleSearch || {}

        const updateColumnsOnGridViewChange = (metaDatas) => {
            Columns((cols) => {
                if (cols?.length > 0) {
                    console.log('Inside Columns', cols)
                    const selectedData = JSON.parse(JSON.stringify(selectedGridView));
                    setStateApp((state) => ({ ...state, selectedView: selectedData }));

                    let filterColumns = cols.filter((col) => !col._id && !props.actionColumns.includes(col.label) && !props.actionColumns.includes(col.name));
                    let actionColumns = cols.filter((col) => props.actionColumns.includes(col.label) || props.actionColumns.includes(col.name));

                    // Excluding actionColumns from veiw Columns
                    actionColumns = actionColumns.map(aC => ({ ...aC, options: { ...aC.options, viewColumns: false } }))

                    let columnsData = [...filterColumns, ...copy(metaDatas), ...actionColumns]

                    let view = JSON.parse(JSON.stringify(selectedData));
                    if (view.columns) {
                        let viewColumns = view.columns.filter((col) => !actionColumns.find((aC) => aC.name === col.name));
                        let viewActionColumns = view.columns.filter((col) => actionColumns.find((aC) => aC.name === col.name));
                        view.columns = [...viewColumns, ...viewActionColumns]
                    }
                    if (!isEmpty(view)) {
                        view = formattingGridView(JSON.parse(JSON.stringify(view)));
                        columnsData = handleSelectedGridChange(TableHeader(), view, columnsData);
                    }
                    columnsData = sortColumns(columnsData, view);
                    setColumnsData(columnsData)
                }
                return cols
            })
        }
        useEffect(() => {
            if (selectedGridView) {
                updateColumnsOnGridViewChange(metaDataRef.current || [])

                client.query({
                    query: GET_META_DATA, variables: { user: stateApp.user?.mongoId, category: tableMeta?.typeKeyword?.metaModule },
                }).then(({ data: metaDataRes }) => {
                    const metaDatas = metaDataRes?.getMetaData?.metaData || []
                    if (!deepEqual(metaDatas, metaDataRef.current)) {
                        metaDataRef.current = metaDatas
                        updateColumnsOnGridViewChange(metaDatas)
                    }
                });
            }
        }, [selectedGridView]);


        const updateColumnSorting = (value) => {
            dispatch(
                updateUserGridViewSettingAction.STARTED({
                    userGridViewSetting: {
                        module: tableMeta?.typeKeyword?.gridViewCategory,
                        gridView: selectedGridView._id,
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
            SetDependencyUpdate(!dependencyUpdate);
        }, [dataCommentsCounter, dataTagSamples, checkIfOwnersAreContactsData, constDataTracks])

        useEffect(() => {
            // New code added to only search on table related fields to avoid api crash
            if (!tableMeta.searchFields && tableMeta.TableHeader) tableMeta.searchFields = getSearchFields(tableMeta.TableHeader)

            if (tableMeta?.esIndex) {
                if (tableMeta.modifySelectedGridView) {
                    tableMeta.modifySelectedGridView(selectedGridView)
                }

                let searchQuery = tableMeta.extendSearchQuery || search;
                if (props.useWildeCard)
                    searchQuery = searchQuery?.length > 0 ? `*${searchQuery}*` : searchQuery;

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
                            query: searchQuery,
                            fields: tableMeta.searchFields,
                            advanceSearch: tableMeta.advanceSearch,
                        },
                        sort: tableMeta.defaultSort,
                        filters: handleMultiFieldFilter([
                            ...(initialFilters ? initialFilters : []),
                            ...(tableMeta.filters ? tableMeta.filters : []),
                            ...(selectedGridView?.filters ? selectedGridView?.filters : []),
                            ...(tableMeta.polygon) ? [tableMeta.polygon] : []
                        ])
                    }
                });
                if (selectedGridView)
                    handleSelectedGridChange(tableMeta.TableHeader, { ...selectedGridView, filters: (selectedGridView.filters || []).concat(tableMeta.filters || []) }, columns, true)
            }
            // eslint-disable-next-line
        }, [tableMeta, search]);


        useEffect(() => {
            if (tableData?.hits?.length > 0 && tableMeta?.initializeGenericData?.actions) {
                const objectsIdsArray = tableData?.hits?.map((hit) => get(hit, tableMeta?.initializeGenericData?.key));
                initializeGenericData(objectsIdsArray, tableMeta.initializeGenericData.actions);
            }
        }, [tableData]);

        useEffect(() => {
            if (tableData?.hits?.length > 0) {
                currentRowsLength === 0 && setCurrentRowsLength(tableData?.total)
                let { TableHeader, formatColumns, formatHits } = tableMeta

                TableHeader = columns.length > 0 ? columns : TableHeader;
                let hits = tableData?.hits
                if (formatHits)
                    hits = formatHits(hits)

                if (isFiniteScroll && changePage) {
                    const rowIndex = rows.length - 5
                    setRows(rows.concat(hits));
                    document.getElementById(`waypoint-${rowIndex}`)?.scrollIntoView();
                    isPageChanged(false)
                }
                else
                    setRows(hits);

                if (formatColumns) {
                    TableHeader = formatColumns(TableHeader, hits)
                    tableMeta.TableHeader = TableHeader
                }
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
                /// apply global settings unless ignored

                /// apply global settings unless ignored
                if (column?.options?.ignoreGlobal || props.actionColumns.includes(column.label) || props.actionColumns.includes(column.name)) {
                    column.options = {
                        ...column.options,
                    };
                }
                else {
                    column.options = {
                        ...GlobalSettings.muiGridStandardOptions,
                        ...column.options,
                    }
                }
                /// apply global settings unless ignored
                if (column?.options?.ignoreGlobal || props.actionColumns.includes(column.label) || props.actionColumns.includes(column.name)) {
                    column.options = {
                        ...column.options,
                    };
                }

                if (column?.options?.filter) {
                    const custom = column.custom;
                    column.options = {
                        ...column.options,
                        sortThirdClickReset: column.options.sort === false ? false : true,
                        filter: true,
                        filterList: undefined,
                        filterType: "custom",
                            customFilterListOptions: {
                                render: v => v.map(l => {
                                    if(custom?.formatedFilterOptions?.length > 0){
                                        return custom?.formatedFilterOptions.find(f => f.value === l)?.label || l
                                    }
                                    return l === "true" && column?.options?.forceFilter ? "Yes" : l === "false" && column?.options?.forceFilter ? "No" : l
                                }),
                            },
                            filterOptions: {
                                display: (filterList, onChange, index, column) => {
                                    if (!TableHeader.find((el) => el.name === column.name) && tableMeta.customDataESKey) {
                                        column.filterKey = `${tableMeta.customDataESKey}.${column.name}.keyword`
                                    } else
                                        column.filterKey = TableHeader.find((el) => el.name === column.name)?.esKey;
    
                                    if (!column.filterKey && column.esKey) column.filterKey = column.esKey
    
                                    return (
                                        <AutoCompleteFilter
                                            esIndex={esIndex}
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
            const allFilters = (selectedGridView?.filters || []).concat(initialFilters)
            if (allFilters) {
                tableCols.forEach((column, index) => {

                    // only required if table have selectedGridView
                    if (selectedGridView)
                        setColumnDisplayAndFilter(TableHeader, selectedGridView, column);
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
                    // if (column?.options?.filter) {
                    column.options.filterList = filterList;
                    // }
                });
            }
            else {
                tableCols.forEach((column, index) => {
                    setColumnDisplayAndFilter(TableHeader, selectedGridView, column);
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
            // const filterHistory = {}
            if (esFilter) {
                esFilter.forEach((filter) => {
                    if (typeof filter?.field === 'string') {
                        // if (!filterHistory[filter.field])
                        filters.push(filter)
                        // filterHistory[filter.field] = true
                    } else {
                        filter?.field?.forEach((_, index) => {
                            // if (!filterHistory[filter.field])
                            filters.push({ field: filter.field[index], value: filter.value })
                            // filterHistory[filter.field] = true
                        })
                    }
                })
            }
            return uniqWith(filters, isEqual);
        }

        const initializeTableActions = (tableState, meta, tableData, columns, gqlQuery, selectedGridView = {}) => {
            debugger
            let searchQuery = typeof tableMeta.extendSearchQuery !== 'undefined' ? tableMeta.extendSearchQuery : tableState.searchText;
            if (props.useWildeCard)
                searchQuery = searchQuery?.length > 0 ? `*${searchQuery}*` : searchQuery;

            let pageESVariables = {
                variables: {
                    index: tableMeta.esIndex,
                    search: {
                        query: searchQuery,
                        fields: tableMeta.searchFields,
                        advanceSearch: tableMeta.advanceSearch,
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

            // temporary patch
            if(tableState?.filterList?.[2]?.includes("Expiration") || tableState?.filterList?.[2]?.includes("Option to Extend")) {
                tableState.filterList[2] = []
            }
            // Patch end

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

        const updateGridViewRedux = useCallback((tableState) => {
            setTableMeta((tableMeta) => {
                if (selectedGridView) {
                    dispatch(updateUserGridViewSettingAction.STARTED({
                        userGridViewSetting: {
                            module: tableMeta?.typeKeyword?.gridViewCategory,
                            gridView: selectedGridView._id,
                            gridViewPatch: {
                                filters: activeFiltersRef.current,
                                columns: tableState.columns.map((col) => ({ name: col.name, display: col.display === 'true' })),
                            },
                            user: stateApp.user?.mongoId,
                        }
                    }));
                }
                return tableMeta
            })
        }, [setTableMeta, dispatch, selectedGridView, stateApp.user])

        const viewColumnProps = useMemo(() => ({
            selectedGridView,
            updateColumnSorting: (columns) => updateGridViewRedux({ columns }),
        }), [selectedGridView, updateGridViewRedux])

        const getCSVData = (data, sampleCsv) => {
            let csv = ''
            for (let i = 0; i < sampleCsv.length; i++) {
                csv = `${i !== 0 ? csv + ',' : ''}${sampleCsv[i].label}`
            }
            csv = `${csv}\n`;

            for (let i = 0; i < data?.length; i++) {
                for (let j = 0; j < sampleCsv.length; j++) {
                    let updatedData = get(data[i], sampleCsv[j].name, '')
                    if (typeof updatedData === 'string') {
                        if (typeof updatedData === 'string' && updatedData?.includes(',')) {
                            updatedData = updatedData.replace(',', ' ')
                        }
                    } else if (sampleCsv[j].name === 'tags' && Array.isArray(updatedData)) {
                        const tags = updatedData[0].map(d => d).toString().replace(',', ' ')
                        updatedData = tags
                    }
                    csv = `${j !== 0 ? csv + ',' : csv}${updatedData}`
                }
                csv = `${csv}\n`;
            }
            return csv
        }

        const onDownload = async () => {
            let searchQuery = typeof tableMeta.extendSearchQuery !== 'undefined' ? tableMeta.extendSearchQuery : tableStateRef.current.searchText;
            if (props.useWildeCard)
                searchQuery = searchQuery?.length > 0 ? `*${searchQuery}*` : searchQuery;

            const pageESVariables = {
                variables: {
                    index: tableMeta.esIndex,
                    search: {
                        query: searchQuery,
                        fields: tableMeta.searchFields,
                        advanceSearch: tableMeta.advanceSearch,
                    },
                    pagination: {
                        first: tableStateRef.current.count,
                        after: null,
                    },
                    ...(!isEmpty(tableStateRef.current.sortOrder) && tableStateRef.current.sortOrder.direction !== 'none') ? {
                        sort: (() => {
                            let field = columns.find(el => el.name === tableStateRef.current.sortOrder?.name)?.esKey ||
                                columns.find(el => el.name === tableStateRef.current.sortOrder?.name)?.name;
                            return {
                                field: Array.isArray(field) ? field[0] : field,
                                order: tableStateRef.current.sortOrder?.direction
                            }

                        })()
                    } : { sort: tableMeta.defaultSort },

                    filters: selectedFilters.current ? [...selectedFilters.current] : [],
                    customFilters: []
                },
            }
            const allSelectedRows = await client.query({
                ...pageESVariables,
                variables: {
                    ...pageESVariables.variables,
                    filters: handleMultiFieldFilter(pageESVariables.variables.filters.concat(tableMeta.filters))
                },
                query: GET_ES_SIMPLE_SEARCH,
            });

            const hits = tableMeta.formatHits(copy(allSelectedRows.data.getESSimpleSearch.hits))
            const csvData = getCSVData(hits, columns.filter(c => c.options.display !== false && c.label !== " "))

            var blob = new Blob([csvData]);
            var url = URL.createObjectURL(blob);

            // Create a link to download it
            var pom = document.createElement('a');
            pom.href = url;
            pom.setAttribute('download', 'tableData.csv');
            pom.click();
        }

        const onTableChange = async (action, tableState, rows, meta) => {
            tableState.esIndex = tableMeta.esIndex;
            // tableState.filters = tableMeta.filters ? tableMeta.filters : [];
            tableState.polygon = tableMeta.polygon ? tableMeta.polygon : undefined;
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
                    if (action === "search") setSearch(tableState.searchText);
                    if (isFiniteScroll) {
                        const tableClass = document.querySelectorAll("[class*=MUIDataTable-responsiveBase]")
                        if (tableClass.length > 0) tableClass[0].scrollTop = 0;
                    }
                    tableActions.genericESAction();
                    break;
                case "rowSelectionChange":
                    if (tableMeta.isSelectedAllAllowed)
                        if (tableState.selectedRows.data.length === tableState.data.length || tableState.selectedRows.data.length > tableState.data.length) {
                            const isSelectAll = tableState.selectedRows.data.length === tableState.data.length
                            const rowsSelected = []
                            const total = isSelectAll ? tableState.count : tableState.selectedRows.data.length

                            for (let i = 0; i < total; i++) { rowsSelected.push(isSelectAll ? i : tableState.selectedRows.data[i].index) }

                            if (!allRowsSelected || allRowsSelected?.length === 0 || total !== tableState.count)
                                setAllRowsSelected(rowsSelected)
                            else {
                                tableState.selectedRows.data = []
                                setAllRowsSelected([])
                            }
                            const pageESVariables = copy(tableActions.pageESVariables)

                            let searchQuery = pageESVariables?.search?.query
                            if (props.useWildeCard)
                                searchQuery = searchQuery?.length > 0 ? `*${searchQuery}*` : searchQuery;
                            if (pageESVariables?.search?.query) pageESVariables.search.query = searchQuery

                            pageESVariables.variables.pagination = {
                                first: total,
                                after: null,
                            }
                            const allSelectedRows = await client.query({
                                ...pageESVariables,
                                query: GET_ES_SIMPLE_SEARCH,
                            });

                            tableState.selectedRows.data = rowsSelected.map((index) => ({ index, dataIndex: index }))
                            meta.setSelectedRows(allSelectedRows?.data?.getESSimpleSearch.hits)
                        } else {
                            if (meta?._selectedRows?.length > 0)
                                meta.setSelectedRows([])
                            setAllRowsSelected(undefined)
                        }
                    setSelectedRows(tableState.selectedRows.data)
                    break;
                case "changePage":
                    isPageChanged(true)
                    tableActions.changeESPage();
                    break;
                // case "viewColumnsChange":
                //     viewColumnsChange(tableState.columns);
                //     break;
                default:
            }
        }

        // const viewColumnsChange = (tableColumns) => {
        //     for (let i = 0; i < tableColumns.length; i++) {
        //         if (columns[i]) {
        //             if ((tableColumns[i].display === "true" || tableColumns[i].display === true) && tableColumns[i].display !== false) {
        //                 columns[i].options.display = true;
        //                 if (columns[i].esKey && !columns[i].noFilter) {
        //                     columns[i].options.filter = true;
        //                 }
        //             } else {
        //                 columns[i].options.display = false;
        //                 columns[i].options.filter = false;
        //                 delete columns[i]?.options.filterOptions;
        //             }
        //         }
        //     }
        //     Columns(columns);
        // };

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
            customToolbar: (tableMeta.addBtnText || tableMeta.addableName || tableMeta?.downloadAll?.exportPx) ? () => {
                return (
                    <>
                        {tableMeta?.downloadAll?.exportPx && (
                            <div style={{
                                display: "inline",
                                position: "absolute",
                                right: tableMeta?.downloadAll?.exportPx,
                            }}>
                                <IconButton onClick={onDownload}>
                                    <Tooltip title="Download CSV" aria-label="add">
                                        <CloudDownloadIcon />
                                    </Tooltip>
                                </IconButton>
                            </div>
                        )}
                        {(tableMeta.addBtnText || tableMeta.addableName) && (
                            <div style={{ display: "inline", "float": "left", marginRight: "15px", marginTop: "5px" }}>
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
                        )}
                    </>
                )
            } : undefined,
            customToolbarSelect: ({ data }) => {
                return props.targetLabel !== "well"
                    && props.targetLabel !== "unit"
                    && props.targetLabel !== "operator"
                    && props.targetLabel !== "owner"
                    && props.targetLabel !== "parcel"
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
                // setAddToTable('update');
                // if(drawer === "wells"){
                //   setDrawer(null);
                // }
                setDrawer("tract");
                setClickedRow({ ...rows[dataIndex] })
            }
        }
        options.page = page

        const onInfiniteScroll = () => {
            setCurrentRowsLength(_currentRowsLength => {
                Loading((loading) => {
                    setRows(tableRows => {
                        if (tableRows.length < _currentRowsLength && !loading) {
                            document.getElementById('pagination-next').click()
                        }
                        return tableRows;
                    })
                    return loading;
                })
                return _currentRowsLength;
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

                    selectedGridView={selectedGridView}
                    setSelectedGridView={setSelectedGridView}
                    esHocProps={esHocProps}

                    allRowsSelected={allRowsSelected}
                    setAllRowsSelected={setAllRowsSelected}
                />
            </span>
        );
    };
    HocWithDefaultProps.defaultProps = {
        actionColumns: [" ", "Tags", "Tags ", "Comments", "isPurchased"]
    }

    function HOCContainer(props) {
        const [stateApp, setStateApp] = useContext(AppContext);
        const setStateAppCallback = useCallback(setStateApp, [setStateApp])
        const stateAppMemo = useMemo(() => ({ user: stateApp.user, filtersData: stateApp.filtersData }), [stateApp.filtersData, stateApp.user])

        return <HocWithDefaultProps {...props} stateApp={stateAppMemo} setStateApp={setStateAppCallback} />
    }
    return memo(HOCContainer)
};

export default TableESHOC;
