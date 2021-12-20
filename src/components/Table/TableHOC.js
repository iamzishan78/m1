import React, { useContext, useState, useEffect, useCallback } from "react";

import { AppContext } from "AppContext";

import { setStateIfDeepEqual } from "components/Shared/functions";

import { useLazyQuery } from "@apollo/client";
import { TAGSAMPLES } from "graphQL/useQueryTagSamples";
import { COMMENTSCOUNTER } from "graphQL/useQueryCommentsCounter";
import { IFARECONTACTS } from "graphQL/useQueryIfOwnersAreContacts";
import { TRACKSBYOBJECTTYPE } from "graphQL/useQueryTracksByObjectType";
import { isEmpty } from "lodash";

export const TableHOC = (Component) => {
    return function HOC(props) {

        const [rows, Rows] = useState([]);
        const setRows = (newState) => { setStateIfDeepEqual(Rows, newState) };
        const [searchedRows, setSearchedRows] = useState([])

        const [loading, Loading] = useState(true);
        const setLoading = (newState) => { setStateIfDeepEqual(Loading, newState) };

        const [dataTracksIds, DataTracksIds] = useState(null);
        const setDataTracksIds = (newState) => { setStateIfDeepEqual(DataTracksIds, newState) };

        const [dataTracks, DataTracks] = useState(null);
        const setDataTracks = (newState) => { setStateIfDeepEqual(DataTracks, newState) };

        const [tracksByObjectType, { data: constDataTracks }] = useLazyQuery(TRACKSBYOBJECTTYPE, { fetchPolicy: "cache-and-network", });
        const [getCommentsCounter, { data: dataCommentsCounter }] = useLazyQuery(COMMENTSCOUNTER, { fetchPolicy: "cache-and-network", });
        const [getTagSamples, { data: dataTagSamples }] = useLazyQuery(TAGSAMPLES, { fetchPolicy: "cache-and-network", });
        const [checkIfOwnersAreContacts, { data: checkIfOwnersAreContactsData },] = useLazyQuery(IFARECONTACTS, { fetchPolicy: "cache-and-network", });

        const [dependencyUpdate, SetDependencyUpdate] = useState(false);

        const [stateApp, setStateApp] = useContext(AppContext);

        // useEffect(() => {
        //     const tracksByObjectType = async () => {
        //         if (
        //             props.targetLabel &&
        //             stateApp.user &&
        //             stateApp.user.mongoId &&
        //             props.showTracks &&
        //             props.targetLabel !== "contact" &&
        //             !dataTracks
        //         ) {
        //             const { data: constDataTracks } = await client.query({
        //                 query: TRACKSBYOBJECTTYPE,
        //                 variables: {
        //                     objectType:
        //                         props.targetLabel === "Parcel Interest"
        //                             ? "Parcel Ownership"
        //                             : props.targetLabel,
        //                 },
        //             })
        //             const tracksIdArray = constDataTracks.tracksByObjectType.map((track) => track.trackOn);
        //             setDataTracksIds(tracksIdArray);
        //             setDataTracks(constDataTracks);
        //         }
        //     }
        //     tracksByObjectType()
        // }, [stateApp.user, props.targetLabel, props.showTracks]);


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

        const setGenricData = (data, id, actions) => {

            if (actions.includes('tracks')) {
                data.isTracked = false;
                for (let i = 0; i < dataTracks?.tracksByObjectType.length; i++) {
                    if (id === dataTracks?.tracksByObjectType[i].trackOn) {
                        data.isTracked = true;
                        break;
                    }
                }
            }
            if (actions.includes('comments')) {
                data.commentsCounter = 0;
                const comments = dataCommentsCounter?.commentsCounter || []
                for (let i = 0; i < comments.length; i++) {
                    if (id === comments[i]._id) {
                        data.commentsCounter = comments[i].total;
                        break;
                    }
                }
            }
            if (actions.includes('tags')) {
                data.tags = [[], 0];
                const tags = dataTagSamples?.tagSamples || []
                for (let i = 0; i < tags.length; i++) {
                    if (id === tags[i]._id) {
                        data.tags = [tags[i].tags, tags[i].total];
                        break;
                    }
                }
            }

            if (actions.includes('ifAreContacts')) {
                const ifAreContacs = checkIfOwnersAreContactsData?.ifAreContacts || []
                if (ifAreContacs.length > 0) {
                    const contact = ifAreContacs.find((ifc) => ifc.globalOwner === data.id || ifc.globalOwner === data.globalOwnerId)
                    if (contact) {
                        data.isContact = contact.isContact;
                        data.entity = contact._id;
                    }
                }
            }
            return data
        }

        const initializeTableActions = (tableState, meta, tableData, columns, gqlQuery, selectedGridView = {}) => {
            let pageESVariables = {
                variables: {
                    esIndex: tableState.esIndex,
                    search: tableState.searchText ? `${tableState.searchText}*` : '',
                    pagination: {
                        // pit: tableData?.before_pit,
                        first: tableState.rowsPerPage,
                        after: null,
                    },
                    ...(!isEmpty(tableState.sortOrder)) && {
                        sort:
                            [{
                                [columns.find(el => el.name === tableState.sortOrder?.name)?.esKey ||
                                    columns.find(el => el.name === tableState.sortOrder?.name)?.name]: {
                                    order: tableState.sortOrder?.direction,
                                    // unmapped_type: "null",
                                    missing: "_last"
                                }
                            }]
                    },

                    filters: [],
                },
            };
            tableState.filterList.forEach((val, index) => {
                if (val.length > 0) {
                    pageESVariables.variables.filters.push({ field: columns[index].esKey, value: val[0] })
                }
            })
            if (selectedGridView?.filters && selectedGridView.type === 'Default') {
                selectedGridView.filters.forEach(filter => {
                    pageESVariables.variables.filters.push(filter)
                })
            }
            return {
                pageESVariables,
                genericESAction: () => {
                    setLoading(true);
                    tableState.page = 0;
                    meta.setPageInd(tableState.page);
                    meta.setRowsPerPage(tableState.rowsPerPage);
                    gqlQuery(pageESVariables);
                },
                changeESPage: () => {
                    debugger
                    setLoading(true);
                    gqlQuery({
                        ...pageESVariables,
                        variables: {
                            ...pageESVariables.variables,
                            pagination: {
                                pit: tableData.pit,
                                ...pageESVariables.variables.pagination,
                                before: tableState.page === 0 ? null : rows && tableState.page < meta.pageInd ? rows[0]?.sort : null,
                                after: tableState.page === 0 ? null : rows && tableState.page > meta.pageInd ? rows[rows.length - 1]?.sort : null,
                            },
                        },
                    });
                },
                searchClientSide: () => {
                    let searchRows = []
                    searchRows = JSON.parse(JSON.stringify(rows));
                    for (let j = 0; j < tableState.filterList.length; j++) {
                        if (tableState.filterList[j].length > 0) {
                            for (let i = 0; i < searchRows.length; i++) {
                                const isFiltered = searchRows[i].isFiltered !== false
                                const rowdata = searchRows[i][columns[j].name]
                                const filter = tableState.filterList[j][0]
                                if (isFiltered && rowdata !== filter) {
                                    searchRows[i].isFiltered = false
                                    continue
                                }
                            }
                        }
                    }
                    setSearchedRows(searchRows.filter(row => row.isFiltered !== false))
                },
                extendSearchQuery: (extraSearch) => {
                    if (pageESVariables.variables.search)
                        pageESVariables.variables.search = `${pageESVariables.variables.search} AND ${extraSearch}`
                    else
                        pageESVariables.variables.search = `${extraSearch}`
                }
            }
        }

        return (
            <Component
                {...props}
                rows={rows}
                searchedRows={searchedRows}
                setSearchedRows={setSearchedRows}
                loading={loading}
                dataTracks={dataTracksIds}
                setRows={setRows}
                setLoading={setLoading}
                initializeGenericData={initializeGenericData}
                ifAreContacts={ifAreContacts}
                setGenricData={setGenricData}
                dependencyUpdate={dependencyUpdate}
                initializeTableActions={initializeTableActions}
            />
        );
    };
};

export default TableHOC;
