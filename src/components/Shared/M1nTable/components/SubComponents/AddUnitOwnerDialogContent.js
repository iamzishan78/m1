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

import { AppContext } from "../../../../../AppContext";
import { Modals } from "../../../../../styles/Modal";
import { useMutation } from "@apollo/client";
import { ADD_OWNER_TOA_SHAPE } from "graphQL/useMutationAddOwnerToAShape";
import { UPDATE_SHAPE_OWNER } from "graphQL/useMutationUpdateShapeOwner";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { showErrorMessage, showSuccessMessage } from "../../../../../actions";
import { setStateIfDeepEqual } from "../../../functions";
import RightDialog from "../../../../ContactDetailCard/components/RightDialog";
import { addTrailingZeros } from "components/Shared/functions";
import { Controller, useForm } from "react-hook-form";
import AutocompEntityNamesList from "components/Shared/Forms/Fields/AutocompEntityNamesList";

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

export default function AddUnitOwnerDialogContent({ selectedRow, setSelectedRow, uAcres, ...props }) {
  const dispatch = useDispatch();
  const [stateApp, setStateApp] = useContext(AppContext);
  const { control, reset, setValue, register, getValues, watch } = useForm();

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
  const [nameAutInputValue, NameAutInputValue] = useState("");
  const setNameAutInputValue = (newState) => {
    setStateIfDeepEqual(NameAutInputValue, newState);
  };

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

      reset({
        working_interest: working_interest || null,
        royalty_interest: royalty_interest || null,
        orri: orri || null,
        nri: nri || null,
        nra: nra || null,
        seller_asking_price: seller_asking_price || null,
        competitor_offer_price: competitor_offer_price || null,
        offer_price: offer_price || null,
        customLayer,
      })

    }
  }, [selectedRow]);

  useEffect(() => {
    const netAcresChanged = isNetAcresChanged(newOwner.net_acres, false);
    const nraChanged = isNRAChanged(newOwner.nra, false);
    setChangedKeys({ netAcres: netAcresChanged, nra: nraChanged });
  }, [newOwner.net_acres, newOwner.nra]);

  // CONTACT


  const [addOwnerToAShape, { data: mutationData }] = useMutation(ADD_OWNER_TOA_SHAPE);

  const [updateShapeOwner, { data: updateData }] = useMutation(UPDATE_SHAPE_OWNER);

  useEffect(() => {
    let type = null;
    if (mutationData && mutationData.addOwnerToAShape) {
      type = { name: "add", success: mutationData.addOwnerToAShape.success };
    } else if (updateData && updateData.updateShapeOwner) {
      type = { name: "update", success: updateData.updateShapeOwner.success };
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
    // setSelectedRow(null);
  };

  const handleClickDialogClose = () => {
    props.onClose();
    emptyStates();
  };

  const handleClickAdd = (e) => {
    e.preventDefault();
    if (nameAutValue) {
      const ownerToAdd = { ...getValues() };
      // if (nameAutValue._id === "newEntity") ownerToAdd.name = nameAutValue.name;
      // else ownerToAdd.ownerEntity = nameAutValue._id;

      Object.keys(ownerToAdd).forEach((key) => {
        if (['working_interest', 'royalty_interest', 'orri', 'nri', 'nra'].includes(key))
          ownerToAdd[key] = addTrailingZeros(ownerToAdd[key])
      })
      if (nameAutValue._id && nameAutValue.name) {
        // now that we are using descriptors we ONLY want the contact _id
        ownerToAdd.ownerEntity = nameAutValue._id;
        ownerToAdd.name = nameAutValue.name;
      }

      if (selectedRow) {
        ownerToAdd._id = selectedRow._id;
        updateShapeOwner({
          variables: {
            shapeType: props.shapeType,
            shapeOwner: {
              shapeId: props.shapeId,
              ...ownerToAdd,
              createBy: stateApp.user.mongoId,
              lastUpdateBy: stateApp.user.mongoId,
            },
          },
          refetchQueries: ["getESShapeOwners", "getESShapeOwnersFilter"],
          awaitRefetchQueries: true,
        });
      } else {
        addOwnerToAShape({
          variables: {
            shapeType: props.shapeType,
            shapeOwner: {
              shapeId: props.shapeId,
              ...ownerToAdd,
              createBy: stateApp.user.mongoId,
              lastUpdateBy: stateApp.user.mongoId,
            },
          },
          refetchQueries: ["getESShapeOwners", "getESShapeOwnersFilter"],
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

  const calculateNRA = (interest1, interest2, unitAcres = uAcres) => {
    if (!interest1 && !interest2) return null;
    let nra = parseFloat(unitAcres || 1) * (parseFloat(interest1 || 0) + parseFloat(interest2 || 0)) * 8;
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

  // const royalty_interest = watch('royalty_interest')
  // const orri = watch('orri')

  // useEffect(() => {
  //   setValue('nra', calculateNRA(royalty_interest, orri))
  // }, [royalty_interest, orri])

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
                style={{ "float": "right", marginRight: "5px" }}
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
                <AutocompEntityNamesList userId={stateApp.user.mongoId} nameAutValue={nameAutValue} setNameAutValue={setNameAutValue} />
              </Grid>
              <Grid item xs={12}>
                <h3>Working Interest</h3>

                <Controller
                  control={control}
                  name="working_interest"
                  render={(props) => (
                    <TextField
                      size="small"
                      type="number"
                      value={props.value}
                      inputRef={props.ref}
                      onChange={(e) => {
                        if (e.target.value) {
                          props.onChange(e.target.value)
                        }
                      }}
                      fullWidth
                      defaultValue=""
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <h3>Royalty Interest</h3>
                <Controller
                  control={control}
                  name="royalty_interest"
                  render={(props) => (
                    <TextField
                      size="small"
                      type="number"
                      value={props.value}
                      inputRef={props.ref}
                      onChange={(e) => {
                        if (e.target.value) {
                          props.onChange(e.target.value)
                          setValue('nra', calculateNRA(e.target.value, getValues().orri))
                        }
                      }}
                      fullWidth
                      defaultValue=""
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <h3>Overriding Royalty Interest (ORRI)</h3>
                <Controller
                  control={control}
                  name="orri"
                  render={(props) => (
                    <TextField
                      size="small"
                      type="number"
                      value={props.value}
                      inputRef={props.ref}
                      // onWheel={(e) => e.target.blur()}
                      onChange={(e) => {
                        if (e.target.value) {
                          props.onChange(e.target.value)
                          setValue('nra', calculateNRA(getValues().royalty_interest, e.target.value))
                        }
                      }}
                      fullWidth
                      defaultValue=""
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <h3>Net Revenue Interest (NRI)</h3>

                <Controller
                  control={control}
                  name="nri"
                  render={(props) => (
                    <TextField
                      size="small"
                      type="number"
                      value={props.value}
                      inputRef={props.ref}
                      // onWheel={(e) => e.target.blur()}
                      onChange={(e) => {
                        if (e.target.value) {
                          props.onChange(e.target.value)
                        }
                      }}
                      fullWidth
                      defaultValue=""
                    />
                  )}
                />


                {/* <TextField
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
                /> */}
              </Grid>
              <Grid item xs={12}>
                <h3>Net Royalty Acres (NRA)</h3>
                <Controller
                  control={control}
                  name="nra"
                  render={(props) => (
                    <TextField
                      size="small"
                      type="number"
                      value={props.value}
                      inputRef={props.ref}
                      onChange={(e) => {
                        if (e.target.value) {
                          props.onChange(e.target.value)
                          setValue('nra', calculateNRA(e.target.value, getValues().orri))
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {changedKeys.nra && (
                              <IconButton
                                aria-label="toggle royality-acres"
                                onClick={() => {
                                  setValue('nra', calculateNRA(getValues().royalty_interest, getValues().orri))
                                }}
                              >
                                <AutorenewIcon />
                              </IconButton>
                            )}
                          </InputAdornment>
                        ),
                      }}
                      fullWidth
                      defaultValue=""
                    />
                  )}
                />

              </Grid>
              <Grid item xs={12}>
                <h3>Seller Asking Price</h3>

                <Controller
                  control={control}
                  name="seller_asking_price"
                  render={(props) => (
                    <TextField
                      size="small"
                      type="number"
                      value={props.value}
                      inputRef={props.ref}
                      onWheel={(e) => e.target.blur()}
                      onChange={(e) => {
                        if (e.target.value) {
                          props.onChange(e.target.value)
                        }
                      }}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      fullWidth
                      defaultValue=""
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <h3>Competitor Offer Price</h3>
                <Controller
                  control={control}
                  name="competitor_offer_price"
                  render={(props) => (
                    <TextField
                      size="small"
                      type="number"
                      value={props.value}
                      inputRef={props.ref}
                      onWheel={(e) => e.target.blur()}
                      onChange={(e) => {
                        if (e.target.value) {
                          props.onChange(e.target.value)
                        }
                      }}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      fullWidth
                      defaultValue=""
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <h3>Offer Price</h3>

                <Controller
                  control={control}
                  name="offer_price"
                  render={(props) => (
                    <TextField
                      size="small"
                      type="number"
                      value={props.value}
                      inputRef={props.ref}
                      onWheel={(e) => e.target.blur()}
                      onChange={(e) => {
                        if (e.target.value) {
                          props.onChange(e.target.value)
                        }
                      }}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      fullWidth
                      defaultValue=""
                    />
                  )}
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
