import React, { useEffect, useMemo, useState } from "react";
import get from "lodash/get";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { AppContext } from "AppContext";

import { CircularProgress, Dialog, DialogTitle, IconButton, TextField, withStyles } from "@material-ui/core";
import KeyboardTabBlackIcon from "components/Shared/svgIcons/KeyboardTabBlackIcon";
import { useLazyQuery } from "@apollo/client";

import moment from "moment";
import { Clear } from "@material-ui/icons";

// functions
import { grey600, grey400 } from "material-ui/styles/colors";
import { Autocomplete } from "@material-ui/lab";
import AutoCompleteESField from "components/Shared/Forms/Fields/AutoCompleteESField";

import { GET_ES_SIMPLE_SEARCH } from "graphQL/useQueryESSimpleSearch";
import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";
import { detailCardController } from "hookstate/detailCardController";

const useStyles = makeStyles({
    list: {
        width: 250,
    },
    fullList: {
        width: "auto",
    },
    maxWidth: {
        width: "100%",
    },

    fileUploadSection: {
        minHeight: "50px",
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        width: "100%",
    },
    fileUploadTopSection: {
        minHeight: "50px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: "23px",
    },
    uploadTitle: {
        margin: "0",
        color: "#757575",
        fontWeight: "normal",
        marginBottom: "8px",
    },
    uploadSubtext: {
        color: "rgb(176, 176, 176)",
        margin: "0",
        fontWeight: "normal",
    },
    IconSection: {
        minHeight: "35px",
        display: "flex",
        justifyContent: "center",
        width: "fit-content",
    },
    fileDrop: {
        minHeight: "125px",
        width: "100%",
        padding: "10px 40px",
        color: "#757575",
        fontWeight: "normal",
        backgroundColor: "#eee",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px dashed rgb(176, 176, 176)",
        marginBottom: "30px",
    },
    imageSubText: {
        letterSpacing: "0.5px",
        textAlign: "center",
    },
    fileDropError: {
        color: "red",
    },
    Uploadcomp: {
        // width: "200px !important",
        // height: "200px !important",
    },
    forImage: {
        width: "100px !important",
        height: "100px !important",
        backgroundColor: "transparent !important",
        // border: "1px solid #999",
        borderRadius: "10px !important",
    },
    forImageContainer: {
        width: "100px !important",
        height: "100px !important",
        borderRadius: "10px !important",
        backgroundColor: "#eeeeee !important",
        // border: "1px solid #999",
        textAlign: "center",
        fontSize: "1.5rem",
        fontWeight: "bold",
        color: "#555",
        textTransform: "uppercase",
        paddingTop: "30px",
        cursor: "pointer",
        marginBottom: "5px",
    },
    dialogFooter: {
        display: "flex",
        justifyContent: "flex-end",
        paddingTop: "10px",
        paddingRight: "19px",
        paddingBottom: "40px",
    },
    footerButton: {
        letterSpacing: "1px",
        textTransform: "capitalize",
        fontWeight: "bold",
        padding: "8px 20px",
    },
    selectedType: {
        borderBottom: "4px solid #01B0F0",
        display: "inline",
        cursor: "pointer",
    },
    unSelectedType: {
        display: "inline",
        color: "#827F7F",
        cursor: "pointer",
    },
    optionNumber: {
        fontSize: "12px",
    },
    closeButton: {
        "& svg": {
            fill: grey400,
            "&:hover": {
                fill: grey600,
            },
        },
    },
    dateRoot: {
        color: "grey",
        "& input": {
            marginLeft: "20px",
        },
    },
});

export default function AddNewRelatedData({ title, addNewData, payeeFieldsData, ...rest }) {

    const classes = useStyles();
    const [stateApp, setStateApp] = React.useContext(AppContext);

    let [loader, setLoader] = useState(false);

    const [newData, setNewData] = useState();
    const [contact, setContact] = useState();
    const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
    const [state, setState] = useState({
        right: false,
    });

    const cell = {
        id: "property.number", title: "Property #", filterKey: ['number.keyword', 'name.keyword'], sort: true, type: 'autocomplete', esIndex: 'properties_flat', width: '180px'
    }

    const [getESSearch, { data: esFilter, loading }] = useLazyQuery(GET_ES_SIMPLE_SEARCH, {
        fetchPolicy: "no-cache",
    });

    useEffect(() => {
        getContacts();
    }, [stateApp.paymentMultiGrid]);

    const formattedContactOptions = useMemo(() => {
        const options = get(esFilter, "getESSimpleSearch.hits", []).map(option => ({
            value: option._id,
            name: option.name,
            fullObject: option
        }))

        return options;
    }, [esFilter, loading])

    const getContacts = (search = "") => {
        getESSearch({
            variables: {
                index: "contacts_flat",
                pagination: {
                    first: 25,
                    after: null
                },
                search: {
                    query: search ? `*${search}*` : null,
                    fields: [
                        "name^4",
                        "_id",
                    ]
                },
                sort: {
                    field: "lastUpdateAt",
                    order: "desc",
                    unmapped_type: "date"
                },
                filters: []
            }
        });
    }

    const onInputChange = (_, value) => {
        getContacts(value);
    }

    const handleDeleteCancel = () => {
        setOpenDeleteConfirmDialog(false);
    };
    const handleClose = () => {
        detailCardController.updateState({ drawer: "" })
    };

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const DocumentDetail = (anchor) => (
        <div
            style={{ width: "500px", marginLeft: "15px" }}
            className={clsx(classes.list, {
                [classes.fullList]: anchor === "top" || anchor === "bottom",
            })}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                <ListItem
                    style={{
                        display: "flex",
                        justifyContent: "between",
                        width: "100%",
                        alignItems: "center",
                    }}
                >
                    <ListItemText>
                        <h3>Related {title}</h3>
                    </ListItemText>
                    <ListItemIcon>
                        <IconButton
                            size="small"
                            component="span"
                            style={{
                                background: "transparent",
                                paddingLeft: "10px",
                                align: "center",
                            }}
                            className={classes.closeButton}
                            onClick={handleClose}
                        >
                            <KeyboardTabBlackIcon size="medium" />
                        </IconButton>
                    </ListItemIcon>
                </ListItem>
                {payeeFieldsData.map((field) => (
                    <React.Fragment key={field.key}>
                        {field.type === "searchableContacts" && (
                            <ListItem
                                style={{
                                    flexDirection: "column",
                                    justifyContent: "start",
                                    alignItems: "start",
                                }}
                            >
                                <h4>{field.name}</h4>
                                <Autocomplete
                                    className={classes.maxWidth}
                                    id="search-contacts"
                                    getOptionSelected={(option, value) => option.name === value.name}
                                    getOptionLabel={(option) => option.name}
                                    options={formattedContactOptions}
                                    loading={loading}
                                    value={contact}
                                    onInputChange={onInputChange}
                                    onChange={(_, selectedContact) => {
                                        setNewData({
                                            ...newData,
                                            [field.key]: selectedContact.name,
                                            contactId: selectedContact.value,
                                        });
                                        setContact(selectedContact);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label=""
                                            multiline
                                            size="small"
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <React.Fragment>
                                                        {loading ? (
                                                            <CircularProgress color="inherit" size={20} />
                                                        ) : null}
                                                        {params.InputProps.endAdornment}
                                                    </React.Fragment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </ListItem>
                        )}

                        {field.type === "searchableProperties" && (
                            <ListItem
                                style={{
                                    flexDirection: "column",
                                    justifyContent: "start",
                                    alignItems: "start",
                                }}
                            >
                                <h4>{field.name}</h4>
                                <AutoCompleteESField
                                    style={{ maxWidth: "468px", width: "468px" }}
                                    label={cell.title}
                                    value=""
                                    column={cell}
                                    index={0}
                                    getAllValues={true}
                                    onChange={(value) => {
                                        setNewData({
                                            ...newData,
                                            [field.key]: value,
                                        });
                                    }}
                                    query={GET_ES_FILTER_LIST}
                                    esIndex={cell.esIndex}
                                />
                            </ListItem>
                        )}

                        {field.type === "startEndDateInput" && (
                            <ListItem
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "start",
                                    alignItems: "start",
                                }}
                            >
                                <div style={{
                                    marginRight: "15px",
                                }}>
                                    <h4>Start Date</h4>
                                    <TextField
                                        // autoOk
                                        type="date"
                                        id="startdate"
                                        //variant="outlined"
                                        defaultValue={newData?.startDate ? moment(newData?.startDate).format("yyyy-MM-DD") : ""}
                                        value={newData?.startDate ? moment(newData?.v).format("yyyy-MM-DD") : ""}
                                        margin="none"
                                        fullWidth
                                        onChange={(event) => {
                                            const splittedDate = event?.target?.value.split("-");
                                            if (splittedDate.length === 3) {
                                                const newDate = new Date();
                                                newDate.setFullYear(Number(splittedDate[0])); // Use setFullYear instead of setYear
                                                newDate.setMonth(Number(splittedDate[1]) - 1);
                                                newDate.setDate(Number(splittedDate[2]));
                                                setNewData({ ...newData, startDate: newDate });
                                            } else {
                                                setNewData({ ...newData, startDate: "" });
                                            }
                                        }}

                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        disableToolbar
                                        KeyboardButtonProps={{ "aria-label": "change date" }}
                                        format="MM/DD/YYYY"
                                        PopoverProps={{ disablePortal: false }}
                                        InputProps={{
                                            endAdornment: (
                                                <IconButton onClick={(event) => setNewData({ ...newData, startDate: "" })}>
                                                    <Clear style={{ height: 22, width: 22 }} />
                                                </IconButton>
                                            ),
                                            classes: {
                                                root: classes.dateRoot,
                                            },
                                        }}
                                    />
                                </div>

                                <div style={{
                                    marginRight: "15px",
                                }}>
                                    <h4>End Date</h4>
                                    <TextField
                                        // autoOk
                                        type="date"
                                        id="enddate"
                                        //variant="outlined"
                                        defaultValue={newData?.endDate ? moment(newData?.endDate).format("yyyy-MM-DD") : ""}
                                        value={newData?.endDate ? moment(newData?.v).format("yyyy-MM-DD") : ""}
                                        margin="none"
                                        fullWidth
                                        onChange={(event) => {
                                            const splittedDate = event?.target?.value.split("-");
                                            if (splittedDate.length === 3) {
                                                const newDate = new Date();
                                                newDate.setFullYear(Number(splittedDate[0])); // Use setFullYear instead of setYear
                                                newDate.setMonth(Number(splittedDate[1]) - 1);
                                                newDate.setDate(Number(splittedDate[2]));
                                                setNewData({ ...newData, endDate: newDate });
                                            } else {
                                                setNewData({ ...newData, endDate: "" });
                                            }
                                        }}

                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        disableToolbar
                                        KeyboardButtonProps={{ "aria-label": "change date" }}
                                        format="MM/DD/YYYY"
                                        PopoverProps={{ disablePortal: false }}
                                        InputProps={{
                                            endAdornment: (
                                                <IconButton onClick={(event) => setNewData({ ...newData, endDate: "" })}>
                                                    <Clear style={{ height: 22, width: 22 }} />
                                                </IconButton>
                                            ),
                                            classes: {
                                                root: classes.dateRoot,
                                            },
                                        }}
                                    />
                                </div>

                            </ListItem>
                        )}

                        {field.type === "text" && (
                            <ListItem
                                style={{
                                    flexDirection: "column",
                                    justifyContent: "start",
                                    alignItems: "start",
                                }}
                            >
                                <h4>{field.name}</h4>
                                <TextField
                                    className={classes.maxWidth}
                                    multiline
                                    id={field.key}
                                    value={newData?.[field.key]}
                                    onChange={(e) => {
                                        setNewData({
                                            ...newData,
                                            [field.key]: e.target.value,
                                        });
                                    }}
                                />
                            </ListItem>
                        )}
                    </React.Fragment>
                ))}

            </List>

            <div className={classes.dialogFooter}>
                <Button
                    variant="contained"
                    color="default"
                    size="medium"
                    disableElevation
                    // disabled={updateDealLoading || addContactLoading}
                    className={classes.footerButton}
                    style={{
                        margin: "0px 15px 0px 0px",
                    }}
                    onClick={() => {
                        handleClose();
                    }}
                >
                    Cancel
                </Button>

                <Button
                    id="saveDocumentButton"
                    variant="contained"
                    color="secondary"
                    size="medium"
                    disableElevation
                    onClick={() => addNewData(newData, setLoader)}
                    className={classes.footerButton}
                >
                    Save
                </Button>
            </div>
        </div>
    );

    return (
        <div>
            <Drawer anchor={"right"} open={true}>
                <Dialog open={openDeleteConfirmDialog} onClose={handleDeleteCancel} style={{ zIndex: 99999999999 }}>

                </Dialog>
                <Dialog open={loader} style={{ zIndex: 99999999999 }}>
                    <DialogTitle id="alert-dialog-title">
                        <CircularProgress />
                    </DialogTitle>
                </Dialog>

                <>{DocumentDetail("right")}</>
            </Drawer>
        </div>
    );
}