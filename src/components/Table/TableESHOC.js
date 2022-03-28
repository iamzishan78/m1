import React, { useContext, useState, useEffect, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { useLazyQuery } from "@apollo/client";
import { Button, Tooltip, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { useHistory } from "react-router-dom";
import { isEmpty, uniqBy } from "lodash";

import { AppContext } from "AppContext";

import { copy, setStateIfDeepEqual } from "components/Shared/functions";
import { TAGSAMPLES } from "graphQL/useQueryTagSamples";
import { COMMENTSCOUNTER } from "graphQL/useQueryCommentsCounter";
import { IFARECONTACTS } from "graphQL/useQueryIfOwnersAreContacts";
import { TRACKSBYOBJECTTYPE } from "graphQL/useQueryTracksByObjectType";

import { GET_ES_SIMPLE_SEARCH } from "graphQL/useQueryESSimpleSearch";
import { AutoCompleteFilter } from "./AutoCompleteFilter";
import { GET_ES_SIMPLE_FILTER } from "graphQL/useQueryESSimpleFilter";

import { get } from "lodash";

import { usetableStyles } from "./Styles";
import { updateUserGridViewSettingAction } from "store/actions/sessionActions";
import { handleSelectedGridChange, setColumnDisplayAndFilter } from "./helpers";


export const TableESHOC = (Component) => {
    return function HOC(props) {
        const dispatch = useDispatch();
        const classes = usetableStyles();

        const [columns, Columns] = useState([]);
        const [filters, setFilters] = useState([]);
        const setColumns = (newState) => { setStateIfDeepEqual(Columns, newState); };

        const [addToTable, setAddToTable] = useState('')
        const [openDialog, setOpenDialog] = useState(null);
        const [clickedRow, setClickedRow] = useState();

        const [tableMeta, setTableMeta] = useState([]);

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

        const activeSearchRef = useRef();
        const activeFiltersRef = useRef();
        const tableStateRef = useRef();


        const [dependencyUpdate, SetDependencyUpdate] = useState(false);

        const [stateApp, setStateApp] = useContext(AppContext);
        const history = useHistory();

        const tableData = elasticData?.getESSimpleSearch || {}

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
                getESSimpleSearch({
                    variables: {
                        index: tableMeta.esIndex,
                        pagination: {
                            first: tableMeta.startPaginationAt,
                            keep_alive: "1micros"
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
                let { TableHeader, formatColumns, formatHits } = tableMeta
                TableHeader = columns.length > 0 ? columns : TableHeader;
                let hits = tableData?.hits
                if (formatHits)
                    hits = formatHits(hits)
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
            let { TableHeader, extendSearchQuery, esIndex } = tableMeta
            tableCols.forEach((column, index) => {
                if (column?.options?.filter) {
                    const custom = column.custom;
                    column.options = {
                        ...column.options,
                        filter: true,
                        filterType: "custom",
                        filterList: undefined,
                        customFilterListOptions: {
                            render: v => v.map(l => l === "true" && column?.options?.forceFilter ? "Yes" : l === "false" && column?.options?.forceFilter ? "No" : l),
                        },
                        filterOptions: {
                            display: (filterList, onChange, index, column) => {
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
                                        filters={activeFiltersRef.current}
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
                    let value = get(allFilters.find((filter) => { return JSON.stringify(filter.field) === JSON.stringify(column.esKey) }), "value", "");
                    let filterList = Array.isArray(column.esKey) ? undefined : [];
                    if (value && typeof value !== "object") {
                        if (column.custom?.isDate) {
                            const filterData = stateApp.filtersData[columns[index].name];
                            const data = filterData?.find(f => f.key_as_string === value)
                            if (data) value = data.key
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
                    const contact = ifAreContacs.find((ifc) => ifc.globalOwner === data.id || ifc.globalOwner === data.globalOwnerId)
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
                                filters.push({ field: filter.field[index], value: filter.value[index] })
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
                        query: tableState.searchText,
                        fields: tableMeta.searchFields
                    },
                    pagination: {
                        // pit: tableData?.before_pit,
                        first: tableState.rowsPerPage,
                        after: null,
                    },
                    ...(!isEmpty(tableState.sortOrder)) ? {
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
            tableState.filterList.forEach((val, index) => {
                if (val.length > 0) {
                    if (columns[index].custom?.isDate) {
                        const filterData = stateApp.filtersData[columns[index].name];
                        const data = filterData.find(f => f.key === val[0] || f.key_as_string === val[0])
                        pageESVariables.variables.filters.push({ field: columns[index].esKey, value: data.key_as_string });
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
                        pageESVariables.variables.filters.push({ field: columns[index].esKey, value: val[0] })
                    }

                }
            })
            if (selectedGridView?.filters && selectedGridView.type === 'Default') {
                selectedGridView.filters.forEach(filter => {
                    pageESVariables.variables.filters.push(filter)
                })
            }
            if (tableState.polygon) {
                pageESVariables.variables.filters.push(tableState.polygon)
            }
            return {
                pageESVariables,
                genericESAction: () => {
                    setLoading(true);
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
                    gqlQuery({
                        ...pageESVariables,
                        variables: {
                            ...pageESVariables.variables,
                            pagination: {
                                pit: tableData?.pit,
                                ...pageESVariables.variables.pagination,
                                before: rows && tableState.page < meta.pageInd ? rows[0]?.sort : null,
                                after: rows && tableState.page > meta.pageInd ? rows[rows.length - 1]?.sort : null,
                            },
                            filters: handleMultiFieldFilter(pageESVariables.variables.filters.concat(tableMeta.filters))
                        },
                    });
                }
            }
        }

        const updateGridViewRedux = (tableState) => {
            if (tableMeta?.selectedGridView?._id)
                dispatch(updateUserGridViewSettingAction.STARTED({
                    userGridViewSetting: {
                        gridView: tableMeta.selectedGridView._id,
                        gridViewPatch: {
                            filters: activeFiltersRef.current,
                            columns: tableState.columns.map((col) => ({ name: col.name, display: col.display === 'true' })),
                        },
                        user: props.userId
                    }
                }))
        }

        const onTableChange = (action, tableState, rows, meta) => {
            tableState.esIndex = tableMeta.esIndex;
            // tableState.filters = tableMeta.filters ? tableMeta.filters : [];
            tableState.polygon = tableMeta.polygon ? tableMeta.polygon : undefined;

            const tableActions = initializeTableActions(tableState, meta, tableData, columns, getESSimpleSearch)
            activeSearchRef.current = tableActions.pageESVariables.variables.search;
            activeFiltersRef.current = handleMultiFieldFilter(tableActions.pageESVariables.variables.filters.concat(tableMeta.filters));
            tableStateRef.current = tableState


            if (action === 'filterChange' && tableMeta.setAppliedFilters) {
                // tableMeta.setAppliedFilters(activeFiltersRef.current);
            }
            if (['filterChange', 'resetFilters'].includes(action)) {
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
                    tableActions.genericESAction();
                    break;
                case "rowSelectionChange":
                    setSelectedRows(tableState.selectedRows.data)
                    break;
                case "changePage":
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
                if (tableColumns[i].display === "true" || tableColumns[i].display === true) {
                    columns[i].options.display = true;
                    if (columns[i].esKey && !columns[i].noFilter) {
                        columns[i].options.filter = true;
                    }
                } else {
                    columns[i].options.display = false;
                    columns[i].options.filter = false;
                    delete columns[i].options.filterOptions;
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
            rowsSelected: selectedRows.map((sR => sR.dataIndex)),
            filter: true,
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
                return props.targetLabel !== "well" && (<div style={{ height: "48px", display: "flex" }}>
                    <div style={{ marginTop: "6px", height: "35px", display: "flex", }}>
                        <Tooltip title={"Delete"}>
                            <IconButton size="medium" style={{ margin: "0 5px" }} aria-label="delete" onClick={(e) => { setOpenDialog("delete"); }}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>)
            },
            onRowClick: (rowData, { dataIndex, rowIndex }) => {
                setAddToTable('update')
                setClickedRow({ ...rows[dataIndex] })
            }
        }

        return (
            <Component
                {...props}
                rows={rows}
                searchedRows={searchedRows}
                setSearchedRows={setSearchedRows}
                total={tableData?.total}
                loading={loading}
                dataTracks={dataTracksIds}
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

                activeSearchRef={activeSearchRef}
                activeFiltersRef={activeFiltersRef}

                initialFilters={initialFilters}
                setInitialFilters={setInitialFilters}
            />
        );
    };
};

export default TableESHOC;
