import React, { useContext, useState, useEffect } from "react";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import InputAdornment from "@material-ui/core/InputAdornment";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import { Grid } from "@material-ui/core";
import get from "lodash/get";

import { AppContext } from "../../../../../AppContext";
import { Modals } from "../../../../../styles/Modal";
import { useMutation, useLazyQuery } from "@apollo/client";
import { ADDOWNERTOAPARCEL } from "../../../../../graphQL/useMutationAddOwnerToAParcel";
import { ADDCONTACT } from "../../../../../graphQL/useMutationAddContact";
import { UPDATEPARCELOWNER } from "../../../../../graphQL/useMutationUpdateParcelOwner";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { showErrorMessage, showSuccessMessage } from "../../../../../actions";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import AutocompEntityNamesVirtualizeList from "./AutocompEntityNamesVirtualizeList";
import { ALLENTITYNAMESFORPARCEL } from "../../../../../graphQL/useQueryAllEntityNamesToAddAsParcelOwner";
import CircularProgress from "@material-ui/core/CircularProgress";
import { PAGINATEDCONTACTSQUERY } from "../../../../../graphQL/useQueryPaginatedContacts";
import { setStateIfDeepEqual } from "../../../functions";
import RightDialog from "../../../../ContactDetailCard/components/RightDialog";
import { addTrailingZeros } from "components/Shared/functions";

const entities = [
  "Corporation",
  "Educational Institution",
  "Governmental Body",
  "Individual",
  "Non Profit",
  "Religious Institution",
  "Trust",
  "Unknown",
];
const types = [
  "Fee Interest",
  "Leasehold",
  "Mineral Interest",
  "Non-Executive Mineral Interest (NEMI)",
  "Overriding Royalty (ORRI)",
  "Royalty Interest (NPRI)",
  "Surface Rights",
  "Unknown",
  "Working Interest",
];

const qtrOptions = ["E2", "NE", "NW", "N2", "SE", "SW", "S2", "W2"];

const useStyles = makeStyles((theme) => ({
  maxWidth: {
    width: "100%",
  },
  dialogContent: {
    "& header": {
      position: "absolute",
      left: "0",
      top: "55px",
    },
  },
  primary: {
    color: "black",
    backgroundColor: "#E0E0E0",
  },
  secondary: {
    color: "white",
    backgroundColor: "#26ACD8",
  },
  dialogAction: {
    "& .Mui-disabled": {
      backgroundColor: "transparent",
    },
  },
  move: {
    zIndex: 10000,
  },
  baseValueChanged: {
    width: "100%",
    '& .MuiInputBase-input': {
      color: 'dodgerblue',
      fontWeight: 'bold'
    }
  }
}));

export default function AddParcelOwnerDialogContent({ selectedRow, setSelectedRow, ...props }) {
  const dispatch = useDispatch();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [newOwner, setNewOwner] = useState({
    surface_interest: null,
    mineral_interest: null,
    royalty_interest: null,
    orri: null,
    unknown_interest: null,
    record_title: null,
    operating_rights: null,
    nri: null,
    net_acres: null,
    depthFrom: "",
    depthTo: "",
    nra: null,
    qtr: [null, null, null, null],
    customLayer: props.customLayerId,
  });
  const [changedKeys, setChangedKeys] = useState({});
  const [parcelOwnersRadioBValue, setParcelOwnersRadioBValue] = useState("true");

  const [nameAutValue, setNameAutValue] = useState({ name: "", _id: null });
  const [mongoEntitiesArray, setMongoEntitiesArray] = useState([]);
  const [nameAutInputValue, NameAutInputValue] = useState("");
  const setNameAutInputValue = (newState) => {
    setStateIfDeepEqual(NameAutInputValue, newState);
  };
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);

  useEffect(() => {
    if (selectedRow) {
      const {
        surface_interest,
        mineral_interest,
        royalty_interest,
        orri,
        unknown_interest,
        record_title,
        operating_rights,
        nri,
        depthFrom,
        depthTo,
        net_acres,
        nra,
        customLayer,
        name,
        ownerEntity,
        qtr,
      } = selectedRow;
      setNameAutValue({ name, _id: ownerEntity });

      setNewOwner({
        surface_interest: surface_interest || null,
        mineral_interest: mineral_interest || null,
        royalty_interest: royalty_interest || null,
        orri: orri || null,
        unknown_interest: unknown_interest || null,
        record_title: record_title || null,
        operating_rights: operating_rights || null,
        nri: nri || null,
        net_acres: net_acres || null,
        nra: nra || null,
        depthFrom: depthFrom || "",
        depthTo: depthTo || "",
        qtr: qtr ? qtr : [null, null, null, null],
        customLayer,
      });

      if (depthTo === "All depths" && depthFrom === "All depths") setParcelOwnersRadioBValue("true");
      else setParcelOwnersRadioBValue("false");
    }
  }, [selectedRow]);

  // CONTACT

  const [getPaginatedContacts, { data: allContacts, loading: contactsLoading, fetchMore: fetchMorePaginatedContacts }] = useLazyQuery(
    PAGINATEDCONTACTSQUERY,
    {
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
    }
  );

  const [addContact, { data: addContactData }] = useMutation(ADDCONTACT);

  const [addOwnerToAParcel, { data: mutationData }] = useMutation(ADDOWNERTOAPARCEL);

  const [updateParcelOwner, { data: updateData }] = useMutation(UPDATEPARCELOWNER);

  useEffect(() => {
    if (get(addContactData, "addContact.contact")) {
      setNameAutValue({
        name: addContactData.addContact.contact.name,
        _id: addContactData.addContact.contact._id,
      });
    }
  }, [addContactData]);

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
    let type = null;
    if (mutationData && mutationData.addOwnerToAParcel) {
      type = { name: "add", success: mutationData.addOwnerToAParcel.success };
    } else if (updateData && updateData.updateParcelOwner) {
      type = { name: "updat", success: updateData.updateParcelOwner.success };
    }

    if (type) {
      if (type.success) {
        dispatch(
          showSuccessMessage(
            nameAutValue && nameAutValue.name
              ? `${nameAutValue.name} was successfully ${type.name}ed`
              : `The owner was successfully ${type.name}ed`
          )
        );

        handleClickDialogClose();
      } else {
        dispatch(showErrorMessage("Error occurred"));
      }

      setStateApp((state) => ({
        ...state,
        universalCircularLoaderAct: false,
      }));
    }
  }, [mutationData, updateData]);

  const emptyStates = () => {
    setNewOwner({
      surface_interest: null,
      mineral_interest: null,
      royalty_interest: null,
      orri: null,
      unknown_interest: null,
      record_title: null,
      operating_rights: null,
      nri: null,
      net_acres: null,
      depthFrom: "",
      depthTo: "",
      nra: null,
      qtr: [null, null, null, null],
      customLayer: props.customLayerId,
    });
    setParcelOwnersRadioBValue("true");
    setNameAutValue(null);
    setNameAutInputValue("");
    setSelectedRow(null);
  };

  const handleClickDialogClose = () => {
    props.onClose();
    emptyStates();
  };

  const handleClickAdd = (e) => {
    e.preventDefault();
    if (nameAutValue) {
      const ownerToAdd = { ...newOwner };
      if (parcelOwnersRadioBValue === "true") {
        ownerToAdd.depthFrom = "All depths";
        ownerToAdd.depthTo = "All depths";
      }
      // if (nameAutValue._id === "newEntity") ownerToAdd.name = nameAutValue.name;
      // else ownerToAdd.ownerEntity = nameAutValue._id;
      if (nameAutValue._id && nameAutValue.name) {
        // now that we are using descriptors we ONLY want the contact _id
        ownerToAdd.ownerEntity = nameAutValue._id;
        ownerToAdd.name = nameAutValue.name;
      }

      if (selectedRow) {
        ownerToAdd._id = selectedRow._id;
        updateParcelOwner({
          variables: {
            parcelOwner: {
              ...ownerToAdd,
              createBy: stateApp.user.mongoId,
              lastUpdateBy: stateApp.user.mongoId,
            },
          },
          refetchQueries: ["getparcelOwners", "getContactParcelInterests", "getContactParcelInterest"],
          awaitRefetchQueries: true,
        });
      } else {
        addOwnerToAParcel({
          variables: {
            parcelOwner: {
              ...ownerToAdd,
              createBy: stateApp.user.mongoId,
              lastUpdateBy: stateApp.user.mongoId,
            },
          },
          refetchQueries: [
            "getCustomLayer",
            // causing timing issue since getCustomLayer also calls this query
            "getparcelOwners",
            "getContactParcelInterests",
            "getContactParcelInterest",
          ],
          awaitRefetchQueries: true,
        });
      }

      setStateApp((state) => ({ ...state, universalCircularLoaderAct: true }));
    }
  };

  const calculateNetAcres = (interest) => {
    if (!interest) return null;
    return addTrailingZeros(stateApp.selectedParcel.sdGrossAcres ? (stateApp.selectedParcel.sdGrossAcres * interest).toFixed(8) : null);
  };

  const calculateNRA = (interest1, interest2) => {
    if (!interest1 && !interest2) return null;
    return addTrailingZeros(
      (
        calculateNetAcres(newOwner.mineral_interest) *
        (parseFloat(interest1 || 0) + parseFloat(interest2 || 0)) *
        8
      )?.toFixed(8));
  };

  const isNetAcresChanged = (netAcres) => {
    setChangedKeys({ net_acres: calculateNetAcres(newOwner.mineral_interest) !== netAcres });
  }
  const isNRAChanged = (nra) => {
    let calculatedNRA = calculateNRA(newOwner.royalty_interest, newOwner.orri);
    if (nra === 'NaN') nra = null;
    setChangedKeys({ nra: calculatedNRA !== nra });
  }

  const classes = useStyles();
  const modalClass = Modals();
  return (
    <div className={classes.move}>
      <React.Fragment>
        <RightDialog open={true} handleClickDialogClose={props.onClose} width={"450px"}>
          <DialogTitle id="customized-dialog-title" style={{ fontWeight: "bold" }}>
            {selectedRow ? "Update" : "Add"} Parcel Ownership
            {selectedRow && (
              <IconButton
                style={{ float: "right", marginRight: "5px" }}
                onClick={() => {
                  props.setM1nSelectedRowsIds([selectedRow._id]);
                  props.handleExpandClick(null, null, null, "deleteParcelOwnership");
                }}
                className={modalClass.titleClose}
                size="small"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <h3>Name</h3>

                <AutocompEntityNamesVirtualizeList
                  mongoEntitiesArray={mongoEntitiesArray}
                  setMongoEntitiesArray={setMongoEntitiesArray}
                  nameAutValue={nameAutValue}
                  setNameAutValue={setNameAutValue}
                  nameAutInputValue={nameAutInputValue}
                  setNameAutInputValue={setNameAutInputValue}
                  hasNextPage={hasNextPage}
                  isNextPageLoading={isNextPageLoading}
                  loadNextPage={loadNextPage}
                  addNew={true}
                  addNewOnClick={(value) => {
                    const contact = { name: value };
                    addContact({
                      variables: {
                        contact: {
                          ...contact,
                          createBy: stateApp.user.mongoId,
                          lastUpdateBy: stateApp.user.mongoId,
                        },
                      },
                      refetchQueries: ["getPaginatedContacts", "getContact"],
                      awaitRefetchQueries: true,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <h3>Surface Interest</h3>
                <TextField
                  type="number"
                  size="small"
                  className={classes.maxWidth}
                  value={newOwner.surface_interest}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewOwner({
                      ...newOwner,
                      surface_interest: value ? addTrailingZeros(e.target.value) : null,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <h3>Mineral Interest</h3>
                <TextField
                  type="number"
                  size="small"
                  className={classes.maxWidth}
                  value={newOwner.mineral_interest}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewOwner({
                      ...newOwner,
                      mineral_interest: value ? addTrailingZeros(value) : null,
                      net_acres: calculateNetAcres(value),
                      nra: calculateNRA(newOwner.royalty_interest, newOwner.orri)
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <h3>Royalty Interest</h3>
                <TextField
                  type="number"
                  size="small"
                  className={classes.maxWidth}
                  value={newOwner.royalty_interest}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewOwner({
                      ...newOwner,
                      royalty_interest: value ? addTrailingZeros(e.target.value) : null,
                      nra: calculateNRA(value, newOwner.orri)
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <h3>Overriding Royalty Interest (ORRI)</h3>
                <TextField
                  type="number"
                  size="small"
                  className={classes.maxWidth}
                  value={newOwner.orri}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewOwner({
                      ...newOwner,
                      orri: value ? addTrailingZeros(e.target.value) : null,
                      nra: calculateNRA(value, newOwner.royalty_interest)
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <h3>Unknown Interest</h3>
                <TextField
                  type="number"
                  size="small"
                  className={classes.maxWidth}
                  value={newOwner.unknown_interest}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewOwner({
                      ...newOwner,
                      unknown_interest: value ? addTrailingZeros(e.target.value) : null,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <h3>Record Title</h3>
                <TextField
                  type="number"
                  size="small"
                  className={classes.maxWidth}
                  value={newOwner.record_title}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewOwner({
                      ...newOwner,
                      record_title: value ? addTrailingZeros(e.target.value) : null,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <h3>Operating Rights</h3>
                <TextField
                  type="number"
                  size="small"
                  className={classes.maxWidth}
                  value={newOwner.operating_rights}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewOwner({
                      ...newOwner,
                      operating_rights: value ? addTrailingZeros(e.target.value) : null,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <h3>Net Revenue Interest (NRI)</h3>
                <TextField
                  type="number"
                  size="small"
                  className={classes.maxWidth}
                  value={newOwner.nri}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewOwner({
                      ...newOwner,
                      nri: value ? addTrailingZeros(e.target.value) : null,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <h3>Net Acres</h3>
                <TextField
                  type="number"
                  size="small"
                  className={changedKeys.net_acres ? classes.baseValueChanged : classes.maxWidth}
                  value={newOwner.net_acres}
                  onChange={(e) => {
                    const value = addTrailingZeros(e.target.value);
                    setNewOwner({
                      ...newOwner,
                      net_acres: value || null,
                    });
                    isNetAcresChanged(value)
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {changedKeys.net_acres && (
                          <IconButton
                            aria-label="toggle royality-acres"
                            onClick={() => {
                              const netAcres = calculateNetAcres(newOwner.mineral_interest);
                              setNewOwner({
                                ...newOwner,
                                net_acres: netAcres
                              });
                              isNetAcresChanged(netAcres);
                            }}
                          >
                            <AutorenewIcon />
                          </IconButton>
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <h3>Net Royalty Acres (NRA)</h3>
                <TextField
                  id="standard-number"
                  type="number"
                  size="small"
                  className={changedKeys.nra ? classes.baseValueChanged : classes.maxWidth}
                  value={newOwner.nra}
                  onChange={(e) => {
                    const value = addTrailingZeros(e.target.value);
                    setNewOwner({
                      ...newOwner,
                      nra: value || null,
                    });
                    isNRAChanged(value);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {changedKeys.nra && (
                          <IconButton
                            aria-label="toggle royality-acres"
                            onClick={() => {
                              const nra = calculateNRA(newOwner.royalty_interest, newOwner.orri);
                              setNewOwner({
                                ...newOwner,
                                nra
                              });
                              isNRAChanged(nra);
                            }}
                          >
                            <AutorenewIcon />
                          </IconButton>
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              {props?.customLayer?.state !== "TX" && (
                <>
                  <Grid item xs={3}>
                    <h3>QTR 1</h3>
                    <Autocomplete
                      options={qtrOptions}
                      getOptionLabel={(option) => option}
                      value={newOwner.qtr[0]}
                      onChange={(e, newInputValue) => {
                        const qtr = JSON.parse(JSON.stringify(newOwner.qtr));
                        qtr[0] = newInputValue ? newInputValue : "";
                        setNewOwner({
                          ...newOwner,
                          qtr,
                        });
                      }}
                      renderInput={(params) => <TextField {...params} size="small" className={classes.maxWidth} multiline />}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <h3>QTR 2</h3>
                    <Autocomplete
                      options={qtrOptions}
                      getOptionLabel={(option) => option}
                      value={newOwner.qtr[1]}
                      onChange={(e, newInputValue) => {
                        const qtr = JSON.parse(JSON.stringify(newOwner.qtr));
                        qtr[1] = newInputValue ? newInputValue : "";
                        setNewOwner({
                          ...newOwner,
                          qtr,
                        });
                      }}
                      renderInput={(params) => <TextField {...params} size="small" className={classes.maxWidth} multiline />}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <h3>QTR 3</h3>
                    <Autocomplete
                      options={qtrOptions}
                      getOptionLabel={(option) => option}
                      value={newOwner.qtr[2]}
                      onChange={(e, newInputValue) => {
                        const qtr = JSON.parse(JSON.stringify(newOwner.qtr));
                        qtr[2] = newInputValue ? newInputValue : "";
                        setNewOwner({
                          ...newOwner,
                          qtr,
                        });
                      }}
                      renderInput={(params) => <TextField {...params} size="small" className={classes.maxWidth} multiline />}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <h3>QTR 4</h3>
                    <Autocomplete
                      options={qtrOptions}
                      getOptionLabel={(option) => option}
                      value={newOwner.qtr[3]}
                      onChange={(e, newInputValue) => {
                        const qtr = JSON.parse(JSON.stringify(newOwner.qtr));
                        qtr[3] = newInputValue ? newInputValue : "";
                        setNewOwner({
                          ...newOwner,
                          qtr,
                        });
                      }}
                      renderInput={(params) => <TextField {...params} size="small" className={classes.maxWidth} multiline />}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <RadioGroup
                  row
                  value={parcelOwnersRadioBValue}
                  onChange={(event) => {
                    setParcelOwnersRadioBValue(event.target.value);
                  }}
                >
                  <FormControlLabel value="true" control={<Radio />} label="All Depths" />
                  <FormControlLabel value="false" control={<Radio />} label="Footages/Formations" />
                </RadioGroup>
              </Grid>

              {parcelOwnersRadioBValue === "false" && (
                <Grid item xs={12}>
                  <h3>Depth From</h3>
                  <TextField
                    size="small"
                    className={classes.maxWidth}
                    multiline
                    value={newOwner.depthFrom}
                    onChange={(e) => {
                      setNewOwner({
                        ...newOwner,
                        depthFrom: e.target.value,
                      });
                    }}
                  />
                </Grid>
              )}
              {parcelOwnersRadioBValue === "false" && (
                <Grid item xs={12}>
                  <h3>Depth To</h3>
                  <TextField
                    size="small"
                    className={classes.maxWidth}
                    multiline
                    value={newOwner.depthTo}
                    onChange={(e) => {
                      setNewOwner({
                        ...newOwner,
                        depthTo: e.target.value,
                      });
                    }}
                  />
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions className={classes.dialogAction}>
            <Button className={classes.primary} onClick={handleClickDialogClose} color="primary" style={{ marginBottom: "40px" }}>
              Cancel
            </Button>
            <Button
              className={classes.secondary}
              disabled={!nameAutValue || !nameAutValue.name || nameAutValue.name === "" ? true : false}
              onClick={handleClickAdd}
              color="secondary"
              style={{ marginBottom: "40px", marginRight: "20px" }}
            >
              {selectedRow ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </RightDialog>
      </React.Fragment>
    </div>
  );
}
