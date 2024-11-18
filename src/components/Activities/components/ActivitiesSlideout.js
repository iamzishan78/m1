import React, { useContext, useState, useEffect, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useLazyQuery, useMutation } from "@apollo/client";

import { AppContext } from "../../../AppContext";
import { GETMONGOUSERS } from "../../../graphQL/useQueryGetUsers";
import Badge from '@material-ui/core/Badge';
import IdentityIcon from '@material-ui/icons/PermIdentity';
import HomeIcon from '@material-ui/icons/HomeOutlined';
import Slideout from "components/Shared/Slideout";
import ActivityForm from "./ActivityForm";
import { UPSERTCOMMONDESCRIPTOR } from "graphQL/useMutationUpsertCommonDescriptor";
import { REMOVECOMMONDESCRIPTOR } from "graphQL/useMutationRemoveCommonDescriptor";
import { slidoutState } from "hookstate/initialStates";
import { useHookstate } from "@hookstate/core";
import ObligationForm from "../ObligationForm";

const useStyles = makeStyles((theme) => ({
    dialogExpCard: {
        "& .MuiDialog-paperScrollPaper": {
            height: "100%",
        },
        "& *": {
            margin: 0,
        },
    },
    addAct: {
        width: "100%",
        backgroundColor: "#fff",
        minHeight: "100%",
        display: "flex",
    },
    inputFieldRoot: {
        padding: "15px 25px 0px",
    },
    left: {
        width: "50%",
        borderRight: "2px solid #d9d9d9",
        padding: "20px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "flexstart",
        justifyContent: "flexstart",
    },
    row: {
        display: "flex",
        alignItems: "flexstart",
        justifyContent: "flexstart",
        marginBottom: 16,
    },
    rowIcon: {
        minWidth: 120,
        color: "#B9C5D1",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: 16,
    },
    typeDisplay: {
        border: "1px solid #d9d9d9",
        borderRadius: 3,
        display: "flex",
        alignItems: "center",
    },
    filterDisplay: {
        color: "#999",
        backgroundColor: "#f9f9f9",
        display: "flex",
        alignItems: "center",
        padding: "0px 8px",
        border: "1px solid #fff",
        borderRadius: 3,
        cursor: "pointer",
        userSelect: "none",
        height: 40,
        fontSize: 14,

        "& .MuiSvgIcon-root": {
            fontSize: 16,
        },

        "& span": {
            marginLeft: 8,
        },
    },
    dateTimeRow: {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
    },
    dateTimeField: {
        height: 41,
        width: 172,
        marginBottom: 8,

        "& .MuiInputBase-root": {
            height: "100%",
        },
    },
    marginLeft: {
        marginLeft: 6,
    },
    marginBottom: {
        marginBottom: 20,
    },
    line: {
        height: 2,
        width: 16,
        margin: "0 8px",
        backgroundColor: "#B9C5D1",
    },
    notes: {
        backgroundColor: "#FFFCDC",
        display: "block",
        width: "100%",

        "& .MuiOutlinedInput-root": {
            width: "100%",
        },
    },
    fieldWidth: {
        width: "100%",
        maxWidth: 400,
    },
    inputField: {
        height: 41,

        "& .MuiOutlinedInput-root": {
            height: 41,
        },
    },
    btnGroup: {
        width: 400,
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    active: {
        backgroundColor: "#D0F1FC",
        color: "#259AED !important",
    },
    right: {
        width: "40%",
    },
    error: {
        border: "2px solid red !important",
    },
}));


export default function ActivitiesSlideout({ activityId, events, setSelectedActivityId, getContactsForActivity, type = '' }) {
    const classes = useStyles();
    const [stateApp, setStateApp] = useContext(AppContext);

    const [users, setUsers] = useState([]);
    const { selectedActivity } = stateApp;

    const activeTabs = useHookstate(slidoutState.activeTabs).get({ noproxy: true });
    const show = useHookstate(slidoutState.show).get({ noproxy: true });


    const [getAllMongoUsers, { data: userLists }] = useLazyQuery(GETMONGOUSERS, {
        fetchPolicy: "cache-and-network",
    });
    const [upsertCommonDescriptor] = useMutation(UPSERTCOMMONDESCRIPTOR);
    const [removeCommonDescriptor] = useMutation(REMOVECOMMONDESCRIPTOR);

    const views = useMemo(
        () => [
            {
                name: 'Home',
                Icon: props => (
                    <Badge
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        color="primary"
                    >
                        <HomeIcon {...props} />
                    </Badge>
                ),
                Component: () => (
                    type === 'obligations' ? (<ObligationForm events={events} setSelectedActivityId={setSelectedActivityId} />) : (<ActivityForm events={events} setSelectedActivityId={setSelectedActivityId} />)
                ),
                props: {

                },
                onClick: () => { },
            },
            {
                name: 'Contacts',
                type: 'contact',
                Icon: props => (
                    <Badge
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        color="primary"
                        badgeContent={stateApp?.activityContacts?.contacts?.length}
                    >
                        <IdentityIcon {...props} />
                    </Badge>
                ),
                props: {
                    consts: {
                        loading: false,
                        stateAppKey: "activityContacts"
                    },
                    functions: {
                        gotoContact: (index) => { },
                        getRemoveDescriptorResponse: async (descriptorId) => {
                            let result = await removeCommonDescriptor({
                                variables: { id: descriptorId, relatedObjectType: "Contact" },
                                refetchQueries: ["getContactsForActivity"],
                                awaitRefetchQueries: true,
                            });

                            let response = await result.data.removeCommonDescriptor.success;

                            return response;
                        },

                        addSelectedContact: (contact) => {
                            upsertCommonDescriptor({
                                variables: {
                                    descriptorId: selectedActivity._id,
                                    relatedObject: contact._id,
                                    relatedObjectType: "Contact",
                                    descriptorType: "Activity",
                                    userId: stateApp.user.mongoId,
                                },
                                refetchQueries: ["getContactsForActivity"],
                                awaitRefetchQueries: true,
                            }).then(result => { });
                        },
                        refetchData: () => {

                        }
                    }
                },
                onClick: () => { },
            },
        ],
        [events, selectedActivity, activityId, stateApp.user.mongoId, stateApp?.activityContacts?.contacts?.length]
    );

    useEffect(() => {
        slidoutState.parentId.set(activityId);
        slidoutState.views.set(views);
        slidoutState.view.set(views[0]);
    }, [views, show, activityId]);

    useEffect(() => {
        getAllMongoUsers();
    }, []);

    useEffect(() => {
        if (userLists && userLists.allMongoUsers) {
            setUsers(
                userLists.allMongoUsers.map((user) => ({
                    value: user._id,
                    text: user.name,
                }))
            );
        }
    }, [userLists]);

    return (
        <Slideout show={show} />

    );
}
