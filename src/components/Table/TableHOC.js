import React, { useContext, useState, useEffect } from "react";

import { AppContext } from "AppContext";

import { setStateIfDeepEqual } from "components/Shared/functions";

import { useApolloClient, useLazyQuery } from "@apollo/client";
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

        const [getCommentsCounter, { data: dataCommentsCounter }] = useLazyQuery(COMMENTSCOUNTER, { fetchPolicy: "cache-and-network", });
        const [getTagSamples, { data: dataTagSamples }] = useLazyQuery(TAGSAMPLES, { fetchPolicy: "cache-and-network", });
        const [checkIfOwnersAreContacts, { data: checkIfOwnersAreContactsData },] = useLazyQuery(IFARECONTACTS, { fetchPolicy: "cache-and-network", });

        const [dependencyUpdate, SetDependencyUpdate] = useState(false);

        const client = useApolloClient();
        const [stateApp, setStateApp] = useContext(AppContext);

        useEffect(() => {
            setSearchedRows(rows)
        }, [rows])

        useEffect(() => {
            const tracksByObjectType = async () => {
                if (
                    props.targetLabel &&
                    stateApp.user &&
                    stateApp.user.mongoId &&
                    props.showTracks &&
                    props.targetLabel !== "contact" &&
                    !dataTracks
                ) {
                    const { data: constDataTracks } = await client.query({
                        query: TRACKSBYOBJECTTYPE,
                        variables: {
                            objectType:
                                props.targetLabel === "Parcel Interest"
                                    ? "Parcel Ownership"
                                    : props.targetLabel,
                        },
                    })
                    const tracksIdArray = constDataTracks.tracksByObjectType.map((track) => track.trackOn);
                    setDataTracksIds(tracksIdArray);
                    setDataTracks(constDataTracks);
                }
            }
            tracksByObjectType()
        }, [stateApp.user, props.targetLabel, props.showTracks]);

        useEffect(() => {
            SetDependencyUpdate(!dependencyUpdate)
        }, [dataCommentsCounter, dataTagSamples, checkIfOwnersAreContactsData])

        const initializeGenericData = (ids, actions) => {
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
        }

        const setGenricData = (data, id, actions) => {
            data.isTracked = false;
            data.commentsCounter = 0;
            data.tags = [[], 0];

            if (actions.includes('tracks')) {
                for (let i = 0; i < dataTracks?.tracksByObjectType.length; i++) {
                    if (id === dataTracks?.tracksByObjectType[i].trackOn) {
                        data.isTracked = true;
                        break;
                    }
                }
            }
            if (actions.includes('comments')) {
                const comments = dataCommentsCounter?.commentsCounter || []
                for (let i = 0; i < comments.length; i++) {
                    if (id === comments[i]._id) {
                        data.commentsCounter = comments[i].total;
                        break;
                    }
                }
            }
            if (actions.includes('tags')) {
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
                for (let i = 0; i < ifAreContacs.length; i++) {
                    if (data.id === ifAreContacs[i].globalOwner || data.globalOwnerId === ifAreContacs[i].globalOwner) {
                        data.isContact = ifAreContacs[i].isContact;
                        data.entity = ifAreContacs[i]._id;
                        break;
                    }
                }
            }
            return data
        };

        const initializeTableActions = (tableState, meta, tableData, columns, gqlQuery) => {
            let pageESVariables = {
                variables: {
                    search: tableState.searchText,
                    pagination: {
                        pit: tableData?.before_pit,
                        first: tableState.rowsPerPage,
                        after: null,
                    },
                    ...(!isEmpty(tableState.sortOrder)) && {
                        sort:
                            [{
                                [columns.find(el => el.name === tableState.sortOrder?.name)?.sortKey ||
                                    columns.find(el => el.name === tableState.sortOrder?.name)?.name]: {
                                    order: tableState.sortOrder?.direction,
                                    // unmapped_type: "null",
                                    missing: "_last"
                                }
                            }]
                    },

                    filters: {},
                },
            };
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
                    setLoading(true);
                    gqlQuery({
                        ...pageESVariables,
                        variables: {
                            ...pageESVariables.variables,
                            pagination: {
                                pit: tableData.pit,
                                ...pageESVariables.variables.pagination,
                                before: rows && tableState.page < meta.pageInd ? rows[0]?.sort : null,
                                after: rows && tableState.page > meta.pageInd ? rows[rows.length - 1]?.sort : null,
                            },
                        },
                    });
                },
                searchData: () => {
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
                setGenricData={setGenricData}
                dependencyUpdate={dependencyUpdate}
                initializeTableActions={initializeTableActions}
            />
        );
    };
};

export default TableHOC;
