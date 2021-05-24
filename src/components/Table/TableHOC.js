import React, { useContext, useState, useEffect } from "react";

import { AppContext } from "AppContext";

import { setStateIfDeepEqual } from "components/Shared/functions";

import { useApolloClient } from "@apollo/client";
import { TAGSAMPLES } from "graphQL/useQueryTagSamples";
import { COMMENTSCOUNTER } from "graphQL/useQueryCommentsCounter";
import { IFARECONTACTS } from "graphQL/useQueryIfOwnersAreContacts";
import { TRACKSBYOBJECTTYPE } from "graphQL/useQueryTracksByObjectType";

export const TableHOC = (Component) => {
    return function HOC(props) {

        const [rows, Rows] = useState([]);
        const setRows = (newState) => { setStateIfDeepEqual(Rows, newState) };

        const [loading, Loading] = useState(true);
        const setLoading = (newState) => { setStateIfDeepEqual(Loading, newState) };

        const [dataTracksIds, DataTracksIds] = useState(null);
        const setDataTracksIds = (newState) => { setStateIfDeepEqual(DataTracksIds, newState) };

        const [dataTracks, DataTracks] = useState(null);
        const setDataTracks = (newState) => { setStateIfDeepEqual(DataTracks, newState) };

        const client = useApolloClient();
        const [stateApp, setStateApp] = useContext(AppContext);

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

        const getGenericData = async (ids, actions) => {
            let comments = [], tags = [], ifAreContacts = [];
            if (actions.includes("comments")) {
                comments = await client.query({
                    query: COMMENTSCOUNTER,
                    variables: {
                        objectsIdsArray: ids,
                        userId: stateApp.user.mongoId,
                    },
                })
            }

            if (actions.includes("tags")) {
                tags = await client.query({
                    query: TAGSAMPLES,
                    variables: {
                        objectsIdsArray: ids,
                        userId: stateApp.user.mongoId,
                    },
                })
            }
            if (actions.includes("ifAreContacts")) {
                ifAreContacts = await client.query({
                    query: IFARECONTACTS,
                    variables: {
                        idsArray: ids
                    },
                })
            }
            return { comments: comments?.data?.commentsCounter, tags: tags?.data?.tagSamples, ifAreContacts: ifAreContacts?.data?.ifAreContacts }
        };

        const setGenricData = (data, id, genericData, actions) => {
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
                for (let i = 0; i < genericData.comments.length; i++) {
                    if (id === genericData.comments[i]._id) {
                        data.commentsCounter =
                            genericData.comments[i].total;
                        break;
                    }
                }
            }
            if (actions.includes('tags')) {
                for (let i = 0; i < genericData.tags.length; i++) {
                    if (id === genericData.tags[i]._id) {
                        data.tags = [
                            genericData.tags[i].tags,
                            genericData.tags[i].total,
                        ];
                        break;
                    }
                }
            }

            if (actions.includes('ifAreContacts')) {
                for (let i = 0; i < genericData.ifAreContacts.length; i++) {
                    if (data.id === genericData.ifAreContacts[i].globalOwner) {
                        data.isContact = genericData.ifAreContacts[i].isContact;
                        data.entity = genericData.ifAreContacts[i]._id;
                        break;
                    }
                }
            }
            return data
        };

        return (
            <Component
                {...props}
                rows={rows}
                loading={loading}
                dataTracks={dataTracksIds}
                setRows={setRows}
                setLoading={setLoading}
                getGenericData={getGenericData}
                setGenricData={setGenricData}
            />
        );
    };
};

export default TableHOC;