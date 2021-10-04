import React, { useContext, useState, useEffect } from "react";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import { Grid } from "@material-ui/core";
import get from "lodash/get";

import { AppContext } from "../../../../../AppContext";
import { Modals } from "../../../../../styles/Modal";
import { useMutation, useLazyQuery } from "@apollo/client";
import { ADD_OWNER_TOA_UNIT } from "graphQL/useMutationAddOwnerToAUnit";
import { ADDCONTACT } from "../../../../../graphQL/useMutationAddContact";
import { UPDATE_UNIT_OWNER } from "graphQL/useMutationUpdateUnitOwner";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { showErrorMessage, showSuccessMessage } from "../../../../../actions";
import AutocompEntityNamesVirtualizeList from "./AutocompEntityNamesVirtualizeList";
import { PAGINATEDCONTACTSQUERY } from "../../../../../graphQL/useQueryPaginatedContacts";
import { setStateIfDeepEqual } from "../../../functions";
import RightDialog from "../../../../ContactDetailCard/components/RightDialog";
import { addTrailingZeros } from "components/Shared/functions";

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

export default function AddUnitOwnerDialogContent({ selectedRow, setSelectedRow, ...props }) {
  const dispatch = useDispatch();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [newOwner, setNewOwner] = useState({
    working_interest: null,
    royalty_interest: null,
    orri: null,
    nra: null,
    nri: null,
    customLayer: props.customLayerId,
  });
  const [changedKeys, setChangedKeys] = useState({});

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
        working_interest,
        royalty_interest,
        orri,
        nri,
        nra,
        seller_asking_price,
        competitor_offer_price,
        offer_price,
        customLayer,
        name,
        ownerEntity,
      } = selectedRow;
      setNameAutValue({ name, _id: ownerEntity });

      setNewOwner({
        working_interest: working_interest || null,
        royalty_interest: royalty_interest || null,
        orri: orri || null,
        nri: nri || null,
        nra: nra || null,
        seller_asking_price: seller_asking_price || null,
        competitor_offer_price: competitor_offer_price || null,
        offer_price: offer_price || null,
        customLayer,
      });

    }
  }, [selectedRow]);

  useEffect(() => {
    const netAcresChanged = isNetAcresChanged(newOwner.net_acres, false);
    const nraChanged = isNRAChanged(newOwner.nra, false);
    setChangedKeys({ netAcres: netAcresChanged, nra: nraChanged });
  }, [newOwner.net_acres, newOwner.nra]);

  // CONTACT

  const [getPaginatedContacts, { data: allContacts, fetchMore: fetchMorePaginatedContacts }] = useLazyQuery(
    PAGINATEDCONTACTSQUERY,
    {
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
    }
  );

  const [addContact, { data: addContactData }] = useMutation(ADDCONTACT);

  const [addOwnerToAUnit, { data: mutationData }] = useMutation(ADD_OWNER_TOA_UNIT);

  const [updateUnitOwner, { data: updateData }] = useMutation(UPDATE_UNIT_OWNER);

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
    if (mutationData && mutationData.addOwnerToAUnit) {
      type = { name: "add", success: mutationData.addOwnerToAUnit.success };
    } else if (updateData && updateData.updateUnitOwner) {
      type = { name: "updat", success: updateData.updateUnitOwner.success };
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
      working_interest: null,
      royalty_interest: null,
      orri: null,
      nri: null,
      nra: null,
      seller_asking_price: null,
      competitor_offer_price: null,
      offer_price: null,
      customLayer: props.customLayerId,
    });
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
      // if (nameAutValue._id === "newEntity") ownerToAdd.name = nameAutValue.name;
      // else ownerToAdd.ownerEntity = nameAutValue._id;
      if (nameAutValue._id && nameAutValue.name) {
        // now that we are using descriptors we ONLY want the contact _id
        ownerToAdd.ownerEntity = nameAutValue._id;
        ownerToAdd.name = nameAutValue.name;
      }

      if (selectedRow) {
        ownerToAdd._id = selectedRow._id;
        updateUnitOwner({
          variables: {
            unitOwner: {
              ...ownerToAdd,
              createBy: stateApp.user.mongoId,
              lastUpdateBy: stateApp.user.mongoId,
            },
          },
          refetchQueries: ["getUnitOwners", "getContactUnitInterests", "getContactUnitInterest"],
          awaitRefetchQueries: true,
        });
      } else {
        addOwnerToAUnit({
          variables: {
            unitOwner: {
              ...ownerToAdd,
              createBy: stateApp.user.mongoId,
              lastUpdateBy: stateApp.user.mongoId,
            },
          },
          refetchQueries: [
            "getCustomLayer",
            // causing timing issue since getCustomLayer also calls this query
            "getUnitOwners",
            // "getContactUnitInterests",
            // "getContactUnitInterest",
          ],
          awaitRefetchQueries: true,
        });
      }

      setStateApp((state) => ({ ...state, universalCircularLoaderAct: true }));
    }
  };

  const calculateNetAcres = (interest) => {
    if (!interest) return null;
    const netAcres = addTrailingZeros(stateApp.selectedUnit.sdGrossAcres ? (stateApp.selectedUnit.sdGrossAcres * interest).toFixed(8) : null);
    return netAcres;
  };

  const calculateNRA = (interest1, interest2, mineralInterest = newOwner.mineral_interest) => {
    if (!interest1 && !interest2) return null;
    let netAcres = calculateNetAcres(mineralInterest),
      nra = netAcres * (parseFloat(interest1 || 0) + parseFloat(interest2 || 0)) * 8;
    nra = addTrailingZeros(nra.toFixed(8));

    return nra;
  };

  const isNetAcresChanged = (netAcres, stateUpdate = true) => {
    const isChanged = calculateNetAcres(newOwner.mineral_interest) !== netAcres;
    if (stateUpdate) {
      setChangedKeys({ ...changedKeys, netAcres: isChanged });
    } else return isChanged;
  }
  const isNRAChanged = (nra, stateUpdate = true) => {
    let calculatedNRA = calculateNRA(newOwner.royalty_interest, newOwner.orri);
    if (nra === 'NaN') nra = null;
    if (stateUpdate) {
      setChangedKeys({ ...changedKeys, nra: calculatedNRA !== nra });
    } else return calculatedNRA !== nra;
  }

  const classes = useStyles();
  const modalClass = Modals();
  return (
    <div className={classes.move}>
      <React.Fragment>
        <RightDialog open={true} handleClickDialogClose={props.onClose} width={"450px"}>
          <DialogTitle id="customized-dialog-title" style={{ fontWeight: "bold" }}>
            {selectedRow ? "Update" : "Add"} Unit Ownership
            {selectedRow && (
              <IconButton
                style={{ cssFloat: "right", marginRight: "5px" }}
                onClick={() => {
                  props.setM1nSelectedRowsIds([selectedRow._id]);
                  props.handleExpandClick(null, null, null, "deleteUnitOwnership");
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
                <h3>Working Interest</h3>
                <TextField
                  type="number"
                  size="small"
                  className={classes.maxWidth}
                  value={newOwner.working_interest}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewOwner({
                      ...newOwner,
                      working_interest: value ? addTrailingZeros(e.target.value) : null,
                    });
                  }}
                  onWheel={(e) => e.target.blur()}
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
                  onWheel={(e) => e.target.blur()}
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
                  onWheel={(e) => e.target.blur()}
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
                  onWheel={(e) => e.target.blur()}
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
                            }}
                          >
                            <AutorenewIcon />
                          </IconButton>
                        )}
                      </InputAdornment>
                    ),
                  }}
                  onWheel={(e) => e.target.blur()}
                />
              </Grid>
              <Grid item xs={12}>
                <h3>Seller Asking Price</h3>
                <TextField
                  id="standard-number"
                  type="number"
                  size="small"
                  className={changedKeys.nra ? classes.baseValueChanged : classes.maxWidth}
                  value={newOwner.seller_asking_price}
                  onChange={(e) => {
                    const value = addTrailingZeros(e.target.value);
                    setNewOwner({
                      ...newOwner,
                      seller_asking_price: value || null,
                    });
                  }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  onWheel={(e) => e.target.blur()}
                />
              </Grid>

              <Grid item xs={12}>
                <h3>Competitor Offer Price</h3>
                <TextField
                  id="standard-number"
                  type="number"
                  size="small"
                  className={changedKeys.competitor_offer_price ? classes.baseValueChanged : classes.maxWidth}
                  value={newOwner.competitor_offer_price}
                  onChange={(e) => {
                    const value = addTrailingZeros(e.target.value);
                    setNewOwner({
                      ...newOwner,
                      competitor_offer_price: value || null,
                    });
                  }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  onWheel={(e) => e.target.blur()}
                />
              </Grid>

              <Grid item xs={12}>
                <h3>Offer Price</h3>
                <TextField
                  id="standard-number"
                  type="number"
                  size="small"
                  className={changedKeys.offer_price ? classes.baseValueChanged : classes.maxWidth}
                  value={newOwner.offer_price}
                  onChange={(e) => {
                    const value = addTrailingZeros(e.target.value);
                    setNewOwner({
                      ...newOwner,
                      offer_price: value || null,
                    });
                  }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  onWheel={(e) => e.target.blur()}
                />
              </Grid>

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
