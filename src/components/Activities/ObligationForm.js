
import React, { useContext, useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { FormControl, Grid } from "@material-ui/core";
import moment from "moment";
import get from "lodash/get";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";


import SimpleTextField from "components/Shared/Slideout/FieldComponents/SimpleTextfield";
import SingleSelectField from "components/Shared/Slideout/FieldComponents/singleSelectField";
import DateField from "components/Shared/Slideout/FieldComponents/DateField";
import OwnerField from "components/Shared/Slideout/FieldComponents/OwnerField";
import DescriptionField from "components/Shared/Slideout/FieldComponents/DescriptionField";
import { slidoutStateController } from "hookstate/slidoutStateController";
import { slidoutState } from "hookstate/initialStates";
import { useHookstate } from "@hookstate/core";
import { setStateIfDeepEqual } from "components/Shared/functions";
import { AppContext } from "AppContext";
import { ADDACTIVITY, DELETEACTIVITY, UPDATEACTIVITY } from "graphQL/useMutationActivity";
import { ADDCONTACT } from "graphQL/useMutationAddContact";
import { GETMONGOUSERS } from "graphQL/useQueryGetUsers";
import { PAGINATEDCONTACTSQUERY } from "graphQL/useQueryPaginatedContacts";
import { OPENDEALS } from "graphQL/useQueryOpenDeals";
import { obligationFormState } from "./obligationFormStateController";
import DealComments from "components/Transact/components/DealComments";
import { globalState } from "hookstate/initialStates";

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
    gridStyle: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
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

const getCurrentDate = () => {
    const d = new Date().toISOString();
    return d.slice(0, d.indexOf("T"));
};


const mergeDateAndTime = (d, t) => {
    return `${d}T${t}`;
};

const activityStatusOptions = [
    { label: 'Open', value: false },
    { label: 'Complete', value: true }
];

export default function ObligationForm({ setSelectedActivityId }) {
    const outcomeFieldRef = useRef();
    const classes = useStyles();
    const [stateApp, setStateApp] = useContext(AppContext);
    const history = useHistory();
    const [addNew, setAddNew] = useState(true);
    const [startTime, setStartTime] = useState("08:00");
    const [endTime, setEndTime] = useState("08:00");
    const [users, setUsers] = useState([]);
    const { selectedActivity } = stateApp;

    const activityName = useHookstate(slidoutState.title).get({ noproxy: true });
    const formMode = useHookstate(slidoutState.formMode);
    const {
        activityType,
        startDate,
        endDate,
        frequency,
        applicable,
        obligationValue,
        responsibleParty,
        owner,
        assignedOwner,
        status,
        notes,
    } = useHookstate(obligationFormState);
    const [newCommentsIds, setNewCommentsIds] = useState([]);

    const [getAllMongoUsers, { data: userLists }] = useLazyQuery(GETMONGOUSERS, {
        fetchPolicy: "cache-and-network",
    });

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

    const [addActivityMutation] = useMutation(ADDACTIVITY, {
        onCompleted: () => {
            onModalClose();
        },
        refetchQueries: ["getAllActivities", "getESSimpleSearch"],
        awaitRefetchQueries: true,
    });

    const [updateActivityMutation] = useMutation(UPDATEACTIVITY, {
        onCompleted: () => {
            onModalClose();
        },
        refetchQueries: ["getAllActivities", "getESSimpleSearch"],
        awaitRefetchQueries: true,
    });

    const [deleteActivityMutation] = useMutation(DELETEACTIVITY, {
        onCompleted: () => {
            onModalClose();
        },
        refetchQueries: ["getAllActivities", "getESSimpleSearch"],
        awaitRefetchQueries: true,
    });

    const [getPaginatedContacts, { data: allContacts, fetchMore: fetchMorePaginatedContacts }] = useLazyQuery(PAGINATEDCONTACTSQUERY, {
        fetchPolicy: "cache-and-network",
        nextFetchPolicy: "cache-first",
    });
    const [addContact, { data: addContactData }] = useMutation(ADDCONTACT);
    const [nameAutInputValue, NameAutInputValue] = useState("");
    const setNameAutInputValue = (newState) => {
        setStateIfDeepEqual(NameAutInputValue, newState);
    };
    const [hasNextPage, setHasNextPage] = useState(true);
    const [isNextPageLoading, setIsNextPageLoading] = useState(false);

    const [openDeals, setOpenDeals] = useState([]);
    const [getOpenDeals, { data: dealsData }] = useLazyQuery(OPENDEALS
        , {
            fetchPolicy: "cache-and-network",
        });

    const typeOptions = [
        { _id: "Call", name: "Call" },
        { _id: "Text Message", name: "Text Message" },
        { _id: "Email", name: "Email" },
        { _id: "Meeting", name: "Meeting" },
        { _id: "Task", name: "Task" },
        { _id: "Deadline", name: "Deadline" },
        { _id: "Mailer", name: "Mailer" },
    ]

    const statusOptions = [
        { _id: "notYetReviewed", name: "Not Yet Reviewed" },
        { _id: "inProgress", name: "In Progress" },
        { _id: "reviewCompleted", name: "Review Completed" }
    ]

    useEffect(() => {
        //will also run during initial mount
        setIsNextPageLoading(true);
        getPaginatedContacts({
            variables: {
                search: nameAutInputValue,
            },
        });
    }, [nameAutInputValue]);





    useEffect(() => {
        if (selectedActivity) {
            setAddNew(false);

            activityType.set(selectedActivity.type);
            frequency.set(selectedActivity.frequency);
            applicable.set(selectedActivity.applicable);
            obligationValue.set(selectedActivity.value);
            responsibleParty.set(selectedActivity.responsibleParty);
            assignedOwner.set(selectedActivity.assignedOwner);
            status.set(selectedActivity.status);
            notes.set(selectedActivity.notes);

            owner.set({
                name: selectedActivity?.ownerName,
                id: selectedActivity?.ownerId,
            });

            slidoutStateController.updateTitle(selectedActivity.name);
            if (!activityName)
                slidoutStateController.updateTitle(selectedActivity.name);


            outcomeFieldRef.current?.updateDefaultValue(selectedActivity.outcome);
            setStartTime(moment.parseZone(selectedActivity.start).format("HH:mm"));
            endDate.set(moment.parseZone(selectedActivity.end).format("yyyy-MM-DD"));
            startDate.set(moment.parseZone(selectedActivity.start).format("yyyy-MM-DD"));
            setEndTime(moment.parseZone(selectedActivity.end).format("HH:mm"));
        } else {
            setAddNew(true);


            activityType.set('');
            frequency.set('');
            applicable.set('');
            obligationValue.set('');
            responsibleParty.set('');
            assignedOwner.set('');
            status.set('');
            notes.set('');

            owner.set({
                name: selectedActivity?.ownerName,
                id: selectedActivity?.ownerId,
            });

            slidoutStateController.updateTitle("");
            startDate.set(getCurrentDate());
            endDate.set(getCurrentDate());
            setStartTime("08:00");
            setEndTime("08:00");
        }

    }, []);

    useEffect(() => {
        if (stateApp.user && stateApp.user.mongoId) {
            getOpenDeals();
        }
    }, [stateApp.user]);

    useEffect(() => {
        if (dealsData) {
            setOpenDeals(dealsData?.openDeals?.deals);
        }
    }, [dealsData]);

    useEffect(() => {
        if (formMode.get()) {
            if (formMode.get() === "update")
                if (addNew) addActivity()
                else updateActivity();
            else if (formMode.get() === "delete") {
                deleteActivity()
            }
            formMode.set('')
            slidoutStateController.hideSlideout();
        }

    }, [formMode.get()])

    const setNewCommentId = (id) => {
        const comments = JSON.parse(JSON.stringify(newCommentsIds));
        comments.push(id);
        setNewCommentsIds(comments);
    };

    const onModalClose = () => {
        if (history.location.pathname !== "/contacts/activityDashboard") {
            window.history.pushState("", "", `/calendar/activities`);
        }

        clearFields();
        setSelectedActivityId(null);
        setStateApp((stateApp) => ({
            ...stateApp,
            activityDialog: false,
            selectedActivity: null,
        }));
    };

    const clearFields = () => {
        setAddNew(true);
        notes.set("");

        activityType.set("");
        slidoutStateController.updateTitle("");
        status.set(false);
        startDate.set(getCurrentDate());
        endDate.set(getCurrentDate());
        setStartTime("08:00");
        setEndTime("08:00");
        setNameAutInputValue("");
    };

    const addActivity = async () => {

        const dateTime = mergeDateAndTime(startDate.get(), startTime);
        const endDateTime = mergeDateAndTime(endDate.get(), endTime);

        await addActivityMutation({
            variables: {
                activity: {
                    _id: selectedActivity?._id,
                    type: activityType.get(),
                    name: activityName,
                    dateTime: new Date(dateTime).toUTCString(),
                    endDateTime: new Date(endDateTime).toUTCString(),

                    frequency: frequency.get(),
                    applicable: applicable.get(),
                    value: obligationValue.get(),
                    responsibleParty: responsibleParty.get(),
                    assignedOwner: assignedOwner.get(),
                    status: status.get(),
                    notes: notes.get(),

                    user: stateApp.user._id
                },
            },
        });
    };

    const updateActivity = async () => {
        globalState.universalLoader.set(true)
        const dateTime = mergeDateAndTime(startDate.get(), startTime);
        const endDateTime = mergeDateAndTime(endDate.get(), endTime);

        updateActivityMutation({
            variables: {
                activity: {
                    _id: selectedActivity?._id,
                    type: activityType.get(),
                    name: activityName,
                    dateTime: new Date(dateTime).toUTCString(),
                    endDateTime: new Date(endDateTime).toUTCString(),

                    frequency: frequency.get(),
                    applicable: applicable.get(),
                    value: obligationValue.get(),
                    responsibleParty: responsibleParty.get(),
                    assignedOwner: assignedOwner.get(),
                    ownerId: owner.get()?.id,
                    ownerName: owner.get()?.name,
                    status: status.get(),
                    notes: notes.get(),

                    user: stateApp.user._id
                },
            },
        }).then(result => {
            globalState.universalLoader.set(false)
        });

    };

    const deleteActivity = async () => {
        globalState.universalLoader.set(true)
        await deleteActivityMutation({
            variables: {
                id: selectedActivity._id,
            },
        });

        globalState.universalLoader.set(false)
    };

    return (
        <div>

            <div className={classes.inputFieldRoot}>

                <SimpleTextField disabled title="Obligation Type" value={activityType.get()} setValue={() => { }} />

                <FormControl variant="outlined" fullWidth size="small">
                    <Grid container className={classes.gridStyle}>
                        <DateField disabled title="Start Date" date={startDate.get()} setDate={() => { }} />
                        <DateField disabled title="End Date" date={endDate.get()} setDate={() => { }} />
                    </Grid>
                </FormControl>

                <SimpleTextField disabled title="Frequecy" value={frequency.get()} setValue={() => { }} />
                <SimpleTextField disabled title="Applicable" value={applicable.get()} setValue={() => { }} />
                <SimpleTextField disabled title="Value" value={obligationValue.get()} setValue={() => { }} />
                <SimpleTextField disabled title="Responsible Party" value={responsibleParty.get()} setValue={() => { }} />

                <OwnerField title="Assigned To" users={users} setOwnerId={(value) => {
                    const foundText = users.find(item => item.value === value)?.text || '';
                    owner.set({ id: value, name: foundText })
                }} ownerId={owner.get()?.id} />

                <SingleSelectField
                    title="Status"
                    value={status.get()}
                    options={statusOptions}
                    onChange={(value) => status.set(value)}
                />

                <DescriptionField description={notes.get()} setDescription={(value) => notes.set(value)} />
            </div>

        </div>
    );
}
