import React, { useState, useEffect } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Grid, Box, CircularProgress, InputAdornment, IconButton } from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import SearchIcon from "@material-ui/icons/Search";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { Modals } from "styles/Modal";
import _ from "lodash";

import KeyboardTabIcon from '@material-ui/icons/KeyboardTab';
import Typography from "@material-ui/core/Typography";
import RightDialog from "../../../../ContactDetailCard/components/RightDialog";
import { AppContext } from "AppContext";
import ContactAutoComplete from "components/Shared/ContactAutoComplete";
import FieldBulkAutoComplete from "components/Shared/FieldBulkAutoComplete";
import Loader from "components/Loaders";
import TextField from "@material-ui/core/TextField";
import { PUBLICTAGSQUERY } from "graphQL/useQueryPublicTags";
import { BULKUPSERTTAG } from "graphQL/useMutationBulkUpsertTagOnContacts";
import EntityType from "components/ContactDetailCard/components/FieldContent/EntityType";
import AutocompEntityNamesVirtualizeList from "./AutocompEntityNamesVirtualizeList";
import { setStateIfDeepEqual } from "components/Shared/functions";
import { PAGINATEDCONTACTSQUERY } from "graphQL/useQueryPaginatedContacts";
import { ADDCONTACT } from "graphQL/useMutationAddContact";
import AssociatedDealField from "components/ContactDetailCard/components/FieldContent/AssociatedDealField";
import { UPDATEBULKPARCEL } from "graphQL/useMutationUpdateBulkParcel";

const styles = () => ({
    topHeading: { fontWeight: "bold" },
    loading: {
        position: "absolute",
        left: "250px",
        bottom: "148px",
        zIndex: "150",
    },
    dialogTitle: {
        padding: "25px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    fullWidth: {
        width: "100%",
    },
    chip: {
        "& .MuiAutocomplete-inputRoot": { minHeight: "56px" },
        "& .MuiChip-root": {
            backgroundColor: "#ECEDED",
            color: "#606060",
        },
    },
    input: {
        "& input": {
            caretColor: ({ showPlusAddIcon }) =>
                !showPlusAddIcon ? "" : "transparent",
            color: ({ showPlusAddIcon }) => (!showPlusAddIcon ? "" : "#008ebf"),
            backgroundColor: ({ showPlusAddIcon }) =>
                !showPlusAddIcon ? "" : "#D5F4FF",
            maxWidth: ({ showPlusAddIcon }) => (!showPlusAddIcon ? "" : "33px"),
            width: ({ showPlusAddIcon }) => (!showPlusAddIcon ? "" : "33px"),
            height: ({ showPlusAddIcon }) => (!showPlusAddIcon ? "" : "32px"),
            fontSize: ({ showPlusAddIcon }) => (!showPlusAddIcon ? "" : "25px"),
            margin: ({ showPlusAddIcon }) => (!showPlusAddIcon ? "" : "3px"),
            padding: ({ showPlusAddIcon }) =>
                !showPlusAddIcon ? "" : "0px !important",
            borderRadius: ({ showPlusAddIcon }) => (!showPlusAddIcon ? "" : "50%"),
            textAlign: ({ showPlusAddIcon }) => (!showPlusAddIcon ? "" : "center"),
            cursor: ({ showPlusAddIcon }) => (!showPlusAddIcon ? "" : "pointer"),
            "&:hover": {
                boxShadow: ({ showPlusAddIcon }) =>
                    !showPlusAddIcon
                        ? ""
                        : "0px 2px 2px -1px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.12), 0px 1px 10px 0px rgba(0,0,0,0.1)",
                backgroundColor: ({ showPlusAddIcon }) =>
                    !showPlusAddIcon ? "" : "rgba(0, 0, 0, 0.08)",
            },
            transition: ({ showPlusAddIcon }) =>
                !showPlusAddIcon
                    ? ""
                    : "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        },
    },
});

const useStyles = makeStyles(styles);

export default function UpdateBulkTractOwnership({ onClose, rows, setRows, showSuccessMessage, getContactCampaignAction, campaignList, setSelectedRows }) {
    const [stateApp] = React.useContext(AppContext);
    const classes = useStyles();
    const modalClass = Modals();
    const [contactOwner, setContactOwner] = useState('');
    const [field, setField] = useState('');
    const [fieldKey, setFieldKey] = useState();
    const [loading, setLoading] = useState(false);
    const [inputFocused, _setFocused] = useState(false);


    const [nameAutValue, setNameAutValue] = useState({ name: "", _id: null });
    const [mongoEntitiesArray, setMongoEntitiesArray] = useState([]);
    const [nameAutInputValue, NameAutInputValue] = useState("");
    const setNameAutInputValue = (newState) => {
        setStateIfDeepEqual(NameAutInputValue, newState);
    };
    const [hasNextPage, setHasNextPage] = useState(true);
    const [isNextPageLoading, setIsNextPageLoading] = useState(false);


    const [getPaginatedContacts, { data: allContacts, fetchMore: fetchMorePaginatedContacts }] = useLazyQuery(PAGINATEDCONTACTSQUERY, {
        fetchPolicy: "cache-and-network",
        nextFetchPolicy: "cache-first",
    });
    const [addContact, { data: addContactData }] = useMutation(ADDCONTACT);

    const { laoding, error, data: publicTags } = useQuery(
        PUBLICTAGSQUERY,
        {
            fetchPolicy: "cache-and-network",
        }
    );

    const fieldsToUpdate = [
        { title: "Name", value: "name" },
        { title: "Entity Type", value: "ownerType" },
        { title: "Surface Interest", value: "surface_interest" },
        { title: "Mineral Interest", value: "mineral_interest" },
        { title: "Royalty Interest", value: "royalty_interest" },
        { title: "Overriding Royalty Interest (ORRI)", value: "orri" },
        //{ title: "Record Title", value: "record_title" },
        { title: "Working Interest", value: "operating_rights" },
        { title: "Net Revenue Interest (NRI)", value: "nri" },
        { title: "Net Acres", value: "net_acres" },
        { title: "Company Net Acres", value: "company_net_acres" },
        { title: "Net Royalty Acres (NRA)", value: "nra" },
        { title: "Associated Deals", value: "deals" },
        { title: "Tags", value: "contactStatus" }
    ];

    useEffect(() => {
        if (allContacts?.paginatedContacts) {
            setMongoEntitiesArray([...allContacts?.paginatedContacts?.edges?.map((el) => el.node)]);
            setHasNextPage(allContacts?.paginatedContacts?.pageInfo?.hasNextPage);
        }
        setIsNextPageLoading(false);
    }, [allContacts]);

    useEffect(() => {
        //will also run during initial mount
        setIsNextPageLoading(true);
        getPaginatedContacts({
            variables: {
                search: nameAutInputValue,
            },
        });
    }, [nameAutInputValue]);

    const loadNextPage = async (pageVariables) => {
        setIsNextPageLoading(true);
        fetchMorePaginatedContacts(pageVariables);
        return null;
    };


    useEffect(() => {
        if (
            ![
                "Industry Type",
                "Lead Source",
                "Territory",
                "Time Zone",
                "Tags",
            ].includes(field)
        )
            getContactCampaignAction({
                search: fieldKey ? `${fieldKey}*` : "*",
            });
        // eslint-disable-next-line
    }, [fieldKey]);

    const [updateBulkParcel] = useMutation(UPDATEBULKPARCEL);
    const [updateBulkTags] = useMutation(BULKUPSERTTAG);

    const onFieldToUpdateChange = (field) => {
        setField(field);
        setFieldKey('');
        setNameAutValue({ name: "", _id: null })
    }
    console.log(nameAutValue)
    const onAssign = () => {
        let contactIds = rows.map((row) => row._id);

        const errorMsg = 'Failed to Update in Bulk'
        Loader.createToast('Bulk-Updating', 'Parcel Bulk Update in progress')

        let fieldToUpdate = { [fieldsToUpdate.find(fieldtoUpdate => fieldtoUpdate.title === field).value]: fieldKey }

        if (nameAutValue._id !== null)
            fieldToUpdate = { name: nameAutValue.name, ownerEntity: nameAutValue._id }

        if (field === "Tags") {
            let contactIds = rows.map((row) => row._id);

            updateBulkTags({
                variables: {
                    tags: fieldKey,
                    user: stateApp.user.mongoId, 
                    contactIds,
                    objectType: "Parcel Ownership"
                },
                refetchQueries: ["getESContacts", "getESSimpleSearch"],
                awaitRefetchQueries: true, 
            }).then(
                (res) => {
                    if (res.data && res.data.bulkUpsertTagOnContacts) {
                        const { success, message } = res.data.bulkUpsertTagOnContacts;

                        if (success) {
                            Loader.successToast("Bulk-Updating-Tags", message);
                            showSuccessMessage("Contacts Updated Successfuly");
                        } else {
                            Loader.errorToast("Bulk-Updating-Tags", message);
                        }
                    } else {
                        Loader.errorToast("Bulk-Updating-Tags", errorMsg);
                    }
                },
                (err) => {
                    console.log(err);
                    Loader.errorToast("Bulk-Updating-Tags", errorMsg);
                }
            );
        }
        else {
            updateBulkParcel({
                variables: {
                    contactIds: contactIds,
                    keysToUpdate: fieldToUpdate,
                },
                refetchQueries: ["getESSimpleSearch"],
                awaitRefetchQueries: true,
            }).then(res => {
                if (res.data && res.data.updateBulkParcel) {

                    const success = res.data.updateBulkParcel.some(res => res.success)
                    if (success) {
                        Loader.successToast('Bulk-Updating', "updated")
                        showSuccessMessage(`${field} Bulk Updated Successfully`)
                    } else {
                        Loader.errorToast('Bulk-Updating', "updated")
                    }
                } else {
                    Loader.errorToast('Bulk-Updating', "failed")
                }
                setSelectedRows();
            },
                err => { console.log(err); Loader.errorToast('v', errorMsg) });
        }



        onClose();
        setLoading(false);
    };

    return (
        <RightDialog open={true} width={"700px"}>
            <MuiDialogTitle disableTypography className={classes.dialogTitle}>
                <Typography className={classes.topHeading} variant="h5" component="h1">
                    Bulk Update
                </Typography>
                <IconButton aria-label="close" onClick={onClose} size="medium">
                    <KeyboardTabIcon fontSize="large" />
                </IconButton>
            </MuiDialogTitle>
            <DialogContent>
                <Box p={0} pt={2} pb={2}>
                    <Grid container direction="column">
                        <Grid item>
                            <Typography style={{ fontWeight: "bold", paddingBottom: "10px" }}>
                                Search for the field you would like to update from the list
                                below
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Autocomplete
                                freeSolo
                                id="free-solo-2-demo"
                                disableClearable
                                options={fieldsToUpdate.map((field) => field.title)}
                                onChange={(e, field) => {
                                    setFieldKey("");
                                    onFieldToUpdateChange(field);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Select field to update"
                                        variant="outlined"
                                        InputProps={{
                                            ...params.InputProps,
                                            type: "search",
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon htmlColor="#757575" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item>
                            <Typography style={{ fontWeight: "bold", marginTop: "30px" }}>
                                {field}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <SelectedFieldTest
                                field={field}
                                setField={setField}
                                fieldKey={fieldKey}
                                setFieldKey={setFieldKey}
                                contactOwner={contactOwner}
                                setContactOwner={setContactOwner}
                                inputFocused={inputFocused}
                                _setFocused={_setFocused}
                                publicTags={publicTags}
                                mongoEntitiesArray={mongoEntitiesArray}
                                setMongoEntitiesArray={setMongoEntitiesArray}
                                nameAutValue={nameAutValue}
                                setNameAutValue={setNameAutValue}
                                nameAutInputValue={nameAutInputValue}
                                setNameAutInputValue={setNameAutInputValue}
                                hasNextPage={hasNextPage}
                                isNextPageLoading={isNextPageLoading}
                                loadNextPage={loadNextPage}
                                classes={classes}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>

            <DialogActions className={modalClass.actionButtons}>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    variant="contained"
                    component="span"
                    disabled={(nameAutValue && nameAutValue._id === null) && !fieldKey}
                    style={
                        (nameAutValue && nameAutValue._id === null) && !fieldKey
                            ? {}
                            : { backgroundColor: "#00abed", color: "white" }
                    }
                    onClick={onAssign}
                >
                    Update
                </Button>
            </DialogActions>

            {loading && (
                <div className={classes.loading}>
                    <CircularProgress size={80} disableShrink color="secondary" />
                </div>
            )}
        </RightDialog>
    );
}

const SelectedFieldTest = React.memo(({ field, fieldKey, contactOwner, setFieldKey, setContactOwner, inputFocused, publicTags, _setFocused, classes, ...rest }) => {
    // let contactIds = rows.map((row) => row._id);
    let filterKey = ''
    switch (field) {
        case "Contact Owner":
            return (
                <ContactAutoComplete
                    value={contactOwner}
                    onChange={(e, user) => {
                        const value = user && user.value ? user.value : '';
                        setFieldKey(value);
                        setContactOwner(value);
                    }}
                />
            );
        case "Name":
            // filterKey = 'campaignName.keyword'
            return (
                <AutocompEntityNamesVirtualizeList
                    mongoEntitiesArray={rest.mongoEntitiesArray}
                    setMongoEntitiesArray={rest.setMongoEntitiesArray}
                    nameAutValue={rest.nameAutValue}
                    setNameAutValue={rest.setNameAutValue}
                    nameAutInputValue={rest.nameAutInputValue}
                    setNameAutInputValue={rest.setNameAutInputValue}
                    hasNextPage={rest.hasNextPage}
                    isNextPageLoading={rest.isNextPageLoading}
                    loadNextPage={rest.loadNextPage}
                    addNew={true}
                    addNewOnClick={(value) => {
                        const contact = { name: value };
                        // addContact({
                        //     variables: {
                        //         contact: {
                        //             ...contact,
                        //             createBy: stateApp.user.mongoId,
                        //             lastUpdateBy: stateApp.user.mongoId,
                        //         },
                        //     },
                        //     refetchQueries: ["getPaginatedContacts", "getContact"],
                        //     awaitRefetchQueries: true,
                        // });
                    }}
                />
            );
        case "Entity Type":
            filterKey = "ownerType.keyword";
            return (
                <EntityType
                    setDocumentType={(value) => {
                        setFieldKey(value._id)
                    }}
                    value={fieldKey}
                />
            );
        case "Surface Interest":
        case "Mineral Interest":
        case "Royalty Interest":
        case "Overriding Royalty Interest (ORRI)":
        //case "Record Title":
        case "Working Interest":
        case "Net Revenue Interest (NRI)":
        case "Net Acres":
        case "Company Net Acres":
        case "Net Royalty Acres (NRA)":
            return (
                <TextField
                    placeholder={"Enter a value"}
                    type="number"
                    value={fieldKey}
                    onChange={({ target }) => {
                        setFieldKey(target.value)
                    }}
                    autoFocus={inputFocused}
                    onFocus={() => _setFocused(true)}
                    onBlur={() => _setFocused}
                    className={classes.fullWidth}
                />


            );

        case "Associated Deals":
            return (
                <AssociatedDealField
                    className={classes.maxWidth}
                    onChange={(values, id) => {
                        setFieldKey({ deals: values || [] })
                    }}
                    value={fieldKey.deals}
                    fullWidth
                    targetLabel="Contact"
                    simpleChips
                />
            );
        case "Tags":
            return (
                <Autocomplete
                    multiple
                    className={classes.chip}
                    id="update-contacts-tags"
                    options={publicTags?.publicTags || []}
                    getOptionLabel={(option) => {
                        return option;
                    }}
                    value={fieldKey || []}
                    onChange={(e, newTagsArr) => setFieldKey(newTagsArr)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            className={classes.input}
                        />
                    )}
                />
            );

        default:
    }

    if (filterKey) {
        return <FieldBulkAutoComplete
            value={fieldKey || []}
            placeholder={`Select ${field}`}
            filterKey={filterKey}
            onChange={(e, fieldKey) => {
                setFieldKey(fieldKey.value);
            }}
        />
    }
    else return ''
});
