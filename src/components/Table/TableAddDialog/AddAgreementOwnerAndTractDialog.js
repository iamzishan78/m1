import React, { useState, useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon2 from "components/Shared/svgIcons/KeyboardTabBlackIcon";
import SearchIcon from "@material-ui/icons/Search";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import Grid from "@material-ui/core/Grid";
import {
  Box,
  CircularProgress,
  Dialog,
  FormControl,
  FormControlLabel,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
  InputAdornment,
} from "@material-ui/core";
import RightDialog from "../../ContactDetailCard/components/RightDialog";
import DeleteConfirmationDialogContent from "../../Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";
import { useForm, Controller } from "react-hook-form";

// contexts
import { getParcelOriginalProperties } from "components/ParcelsDetailCard/utils/GetParcelOriginalProps";
import { UPDATE_SHAPE_TRACTS } from "graphQL/useMutationUpdateShapeTracts";
import { ADD_OWNER_TOA_SHAPE } from "graphQL/useMutationAddOwnerToAShape";
import { UPDATE_SHAPE_OWNERS } from "graphQL/useMutationUpdateShapeOwners";
import TractForm from "components/Table/TableAddDialog/Common/TractForm";
import AutocompEntityNamesList from "components/Shared/Forms/Fields/AutocompEntityNamesList";
import AutoCompleteWithNewOption from "components/Shared/Forms/Fields/AutoCompleteWithNewOption";
import { addTrailingZeros } from "components/Shared/functions";
import { GET_AUTOCOMPLETE_LIST } from "graphQL/useQueryGetAutoCompleteList";
import AutoCompleteParcelOwners from "components/Shared/Forms/Fields/AutoCompleteParcelOwners";

const useStyles = makeStyles((theme) => ({
  dialogFooter: {
    display: "flex",
    justifyContent: "flex-end",
    paddingTop: "10px",
  },
  footerButton: {
    letterSpacing: "1px",
    textTransform: "capitalize",
    fontWeight: "bold",
    padding: "8px 20px",
  },
  dialog: {
    zIndex: "9999999999 !important",
  },
  royaltyAcres: {
    "& .MuiInputBase-input": {
      color: "red",
    },
  },
  selectedType: {
    color: "black",
    borderBottom: "4px solid #01B0F0",
    display: "inline",
    cursor: "pointer",
  },
  unSelectedType: {
    display: "inline",
    color: "#827F7F",
    cursor: "pointer",
  },
  netAcresOveridden: {
    "& .MuiInputBase-input": {
      color: "#01B0F0 !important",
      fontWeight: "bold !important",
    },
  },
  netAcresNormal: {
    "& .MuiInputBase-input": {
      color: "inherit !important",
      fontWeight: "normal !important",
    },
  },
}));

// const qtrOptions = ["E2", "NE", "NW", "N2", "SE", "SW", "S2", "W2"];

function AddAgreementOwnerAndTractDialog(props) {
  const classes = useStyles();
  const { control, reset, register, getValues, watch, setValue } = useForm();

  const [loading, setLoading] = useState(false);
  const [isTractOwner, setIsTractOwner] = useState(false);
  const [nameAutValue, setNameAutValue] = useState({ name: "", _id: null });
  const [tractValue, setTractValue] = useState({ name: "", _id: null });
  const [selectedShapeLayer, setSelectedShapeLayer] = useState(null);
  const [getautoCompleteList, { data: dataAutoCompleteList = [] }] = useLazyQuery(GET_AUTOCOMPLETE_LIST);

  const tract = watch("tract", {});

  useEffect(() => {
    register("tract.qtrQtrSelection");
  }, [tract]);

  const parcelOwnersRadioBValue = watch("parcelOwnersRadioBValue", "true");

  const [addOwnerToAShape] = useMutation(ADD_OWNER_TOA_SHAPE, {
    onCompleted: () => {
      setLoading(false);
      handleClose();
    },
    refetchQueries: ["getESPaginatedList", "getESSimpleSearch", "getESFilterList"],
    awaitRefetchQueries: true,
  });

  const [updateShapeOwners] = useMutation(UPDATE_SHAPE_OWNERS, {
    onCompleted: () => {
      setLoading(false);
      handleClose();
    },
    refetchQueries: ["getESPaginatedList", "getESSimpleSearch", "getESFilterList"],
    awaitRefetchQueries: true,
  });

  const [updateShapeTract] = useMutation(UPDATE_SHAPE_TRACTS, {
    onCompleted: () => {
      setLoading(false);
      handleClose();
    },
    onError: (err) => { },
    refetchQueries: ["getESPaginatedList", "getESSimpleSearch", "getESFilterList"],
    awaitRefetchQueries: true,
  });

  // const setShapeLayer = (layer) => {
  //   const _layer = copy(layer);
  //   if (_layer) {
  //     _layer.qtr1 = _layer.
  //   }
  //   setSelectedShapeLayer(layer);
  // }

  useEffect(() => {
    if (props.seletedOwner) {
      props.seletedOwner.realtedObject = props.seletedOwner?.contact?._id;
      props.seletedOwner.ownerEntity = props.seletedOwner.realtedObject;
      props.seletedOwner.ownerName = props.seletedOwner?.contact?.entityDetail?.name;
      setIsTractOwner(props.seletedOwner.isTractOwner);
      setTractValue({ _id: props.seletedOwner?.tract?.tractId, name: props?.seletedOwner?.tract?.tractName });
      setNameAutValue({ _id: props.seletedOwner?.ownerEntity, name: props?.seletedOwner?.ownerName });
      setSelectedShapeLayer(props.seletedOwner);

      if (props.seletedOwner.depthTo === "All depths" && props.seletedOwner.depthFrom === "All depths")
        props.seletedOwner.parcelOwnersRadioBValue = "true";
      else props.seletedOwner.parcelOwnersRadioBValue = "false";

      reset(props.seletedOwner);

      // reset(pick(props.seletedOwner, ['state', 'county', 'survey', 'block', 'section', 'abstract', 'township', 'meridian', 'range', 'altSurvey', 'qtr', 'sdGrossAcres', 'uAcres', 'legalDescription']))
    }
  }, [props.seletedOwner]);

  useEffect(() => {
    getautoCompleteList({ variables: { type: "AgreementShapeOwner", data: { key: "tractStatus" } } });
  }, []);

  useEffect(() => {
    // if launched from grid row set initializing based on selectedWell state
    if (selectedShapeLayer?.shapeJson) {
      const originalProperties = getParcelOriginalProperties(selectedShapeLayer?.shapeJson?.properties);
      const sdGrossAcres = selectedShapeLayer?.shapeJson?.properties?.sdGrossAcres || "";
      const legalDescription = selectedShapeLayer?.shapeJson?.properties?.legalDescription || "";
      selectedShapeLayer.parcelId = selectedShapeLayer._id;

      setTractValue({ _id: selectedShapeLayer._id, name: selectedShapeLayer.name });
      const form = {
        ...getValues(),
        depthTo: getValues().depthTo || "All depths",
        depthFrom: getValues().depthFrom || "All depths",
        tract: {
          tractId: selectedShapeLayer._id,
          tractName: selectedShapeLayer.name,
          sdGrossAcres,
          legalDescription,
          ...originalProperties,
          qtrQtrSelection: selectedShapeLayer.qtrQtrSelection,
        },
      };
      reset({ ...form });
    } else {
      if (selectedShapeLayer?.clear) {
        setTractValue({ name: "", _id: null });
        reset({ ...getValues(), tract: {} });
      }
    }
  }, [selectedShapeLayer]);

  const handleClose = () => {
    setSelectedShapeLayer(null);
    reset({});
    props.onClose();
  };

  const handleSave = () => {
    const ownerToAdd = getValues();
    ownerToAdd.isTractOwner = isTractOwner;
    ownerToAdd.tract = tract;
    Object.keys(ownerToAdd).forEach((key) => {
      if (["mineral_interest", "royalty_interest", "orri", "net_acres"].includes(key)) ownerToAdd[key] = addTrailingZeros(ownerToAdd[key]);
    });

    if (ownerToAdd.parcelOwnersRadioBValue === "true") {
      ownerToAdd.depthFrom = "All depths";
      ownerToAdd.depthTo = "All depths";
    }

    setLoading(true);
    if (props.seletedOwner) {
      ownerToAdd.relatedObject = ownerToAdd.ownerEntity;
      updateShapeOwners({
        variables: {
          shapeOwners: [
            {
              shapeId: props.shapeId,
              ...ownerToAdd,
            },
          ],
          shapeType: props.shapeType,
        },
        refetchQueries: ["getESSimpleSearch"],
        awaitRefetchQueries: true,
      });
    } else {
      addOwnerToAShape({
        variables: {
          shapeType: props.shapeType,
          shapeOwner: {
            shapeId: props.shapeId,
            ...ownerToAdd,
          },
        },
        refetchQueries: ["getESSimpleSearch"],
        awaitRefetchQueries: true,
      });
    }
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const openConfirmationDialog = () => {
    setDeleteDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
  };

  const deleteFunc = async () => {
    try {
      setLoading(true);
      updateShapeTract({
        variables: {
          seletedTract: {
            id: props.seletedTract._id,
            isDeleted: true,
          },
        },
        refetchQueries: ["getESPaginatedList", "getESSimpleSearch", "getESFilterList"],
        awaitRefetchQueries: true,
      });
    } catch {
      setLoading(false);
    }
  };

  const calculateNetAcres = () => {
    if (!getValues().mineral_interest) return null;
    const netAcres = addTrailingZeros(
      getValues()?.tract?.sdGrossAcres ? (getValues()?.tract?.sdGrossAcres * getValues().mineral_interest).toFixed(8) : null
    );
    return netAcres;
  };

  useEffect(() => {
    if (nameAutValue?._id && nameAutValue?.name) {
      reset({ ...getValues(), ownerEntity: nameAutValue._id, ownerName: nameAutValue.name });
    }
  }, [nameAutValue]);

  const setExistingOwner = (e, value) => {
    if (value?._id && value?.name) {
      setNameAutValue(value);
      let net_acres = value.ownerData.net_acres;
      if (value.ownerData.mineral_interest && !value.ownerData.net_acres) {
        net_acres = addTrailingZeros(
          getValues()?.tract?.sdGrossAcres ? (getValues()?.tract?.sdGrossAcres * value.ownerData.mineral_interest).toFixed(8) : null
        );
      }
      reset({
        ...getValues(),
        ownerEntity: value._id,
        ownerName: value.name,
        mineral_interest: value.ownerData.mineral_interest || "",
        royalty_interest: value.ownerData.royalty_interest || "",
        orri: value.ownerData.orri || "",
        depthFrom: value.ownerData.depthFrom || "",
        depthTo: value.ownerData.depthTo || "",
        net_acres: net_acres || "",
        ...value.ownerData,
      });
    } else {
      setNameAutValue(null);
    }
  };

  const checkIfNotEqual = (value) => {
    const acres = calculateNetAcres();
    if (!value || !acres) return false;
    return value && Number(value) !== Number(acres);
  };

  const autoCompleteList = dataAutoCompleteList?.autoCompleteList || [];
  return (
    <>
      {deleteDialogOpen && (
        <Dialog
          className={classes.dialog}
          open={deleteDialogOpen ? true : false}
          onClose={handleCloseDialog}
          fullWidth={false}
          maxWidth="sm"
        >
          <DeleteConfirmationDialogContent
            header={`Delete Well Interest`}
            onClose={handleCloseDialog}
            deleteFunc={deleteFunc}
            m1nSelectedRowsIds={null}
            setM1nSelectedRowsIndexes={() => { }}
          >
            Do you want to delete the selected well interest?
          </DeleteConfirmationDialogContent>
        </Dialog>
      )}
      <RightDialog open={props.open} handleClickDialogClose={handleClose} width={props.width}>
        <div style={{ padding: "30px" }}>
          <Grid item xs={12} style={{ minHeight: "35px" }}>
            <h4
              style={{
                margin: "0 0 15px 0",
                float: "left",
                fontSize: "1.1rem",
              }}
            >
              {props.seletedTract ? `Update ${props.shapeType} Tract` : `Add ${props.shapeType} Tract`}
            </h4>
            <div style={{ float: "right" }}>
              {props.seletedTract && (
                <>
                  <IconButton disabled={loading} onClick={openConfirmationDialog} size="small" style={{ margin: "0 8px" }}>
                    {loading ? (
                      <CircularProgress size={20} color="secondary" />
                    ) : (
                      <CloseIcon2 className={classes.closeIcon} fontSize="small" />
                    )}
                  </IconButton>
                </>
              )}
              <IconButton onClick={handleClose} size="small">
                <CloseIcon2 fontSize="small" />
              </IconButton>
            </div>
          </Grid>

          <div>
            <Box mt={2}>
              <Typography>Search for existing tract to associate to agreement and populate ownership detail</Typography>
            </Box>
            <TextField id="_id" name="_id" style={{ display: "none" }} inputRef={register()} />
            <TractForm
              tract={tract}
              tractValue={tractValue}
              setSelectedShapeLayer={setSelectedShapeLayer}
              control={control}
              prefix={"tract."}
            />

            <TextField id="tractName" name="tract.tractName" style={{ display: "none" }} inputRef={register()} />
            <TextField id="tractId" name="tract.tractId" style={{ display: "none" }} inputRef={register()} />
            <Controller
              as={TextField}
              control={control}
              variant="outlined"
              margin="dense"
              name="tract.sdGrossAcres"
              label={"Gross. Acres"}
              InputLabelProps={{ shrink: true }}
              fullWidth
              disabled
              defaultValue={tract?.sdGrossAcres || ""}
            />
          </div>
          <div>
            <List>
              <ListItem
                style={{
                  flexDirection: "column",
                  justifyContent: "start",
                  alignItems: "start",
                }}
              >
                <ListItemText>
                  <h4
                    onClick={() => {
                      setIsTractOwner(false);
                    }}
                    className={!isTractOwner ? classes.selectedType : classes.unSelectedType}
                  >
                    New Owner
                  </h4>
                  <h4
                    onClick={() => {
                      setIsTractOwner(true);
                    }}
                    className={isTractOwner ? classes.selectedType : classes.unSelectedType}
                    style={{ marginLeft: "20px" }}
                  >
                    Existing Tract Owners
                  </h4>
                </ListItemText>
              </ListItem>
            </List>
          </div>

          {isTractOwner ? (
            <AutoCompleteParcelOwners
              variant="outlined"
              parcel={tract}
              placeholder="Search existing tract owner by name"
              value={nameAutValue}
              onChange={setExistingOwner}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          ) : (
            <AutocompEntityNamesList
              variant="outlined"
              placeholder="Search for owner by name"
              nameAutValue={nameAutValue}
              setNameAutValue={setNameAutValue}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          )}

          <TextField id="ownerEntity" name={`ownerEntity`} style={{ display: "none" }} inputRef={register()} />
          <TextField id="ownerName" name={`ownerName`} style={{ display: "none" }} inputRef={register()} />
          <Controller
            control={control}
            name="mineral_interest"
            render={({ onChange, value }) => (
              <TextField
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                margin="dense"
                value={value}
                type="number"
                label={"Mineral Interest"}
                fullWidth
                onWheel={(e) => e.target.blur()}
                onChange={(e) => {
                  onChange(e.target.value);
                  setValue("net_acres", calculateNetAcres());
                }}
              />
            )}
          />

          <Controller
            as={TextField}
            control={control}
            variant="outlined"
            margin="dense"
            name="royalty_interest"
            inputRef={register()}
            label={"Royalty Interest"}
            InputLabelProps={{ shrink: true }}
            type="number"
            fullWidth
            onWheel={(e) => e.target.blur()}
          />
          <Controller
            as={TextField}
            control={control}
            variant="outlined"
            margin="dense"
            name="orri"
            inputRef={register()}
            label={"Overriding Royalty Interest (ORRI)"}
            InputLabelProps={{ shrink: true }}
            type="number"
            fullWidth
            onWheel={(e) => e.target.blur()}
          />

          <Controller
            control={control}
            name="net_acres"
            render={({ onChange, value }) => (
              <TextField
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                margin="dense"
                value={value}
                type="number"
                label={"Net Acres"}
                className={checkIfNotEqual(value) ? classes.netAcresOveridden : classes.netAcresNormal}
                fullWidth
                onWheel={(e) => e.target.blur()}
                onChange={(e) => {
                  onChange(e.target.value);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {checkIfNotEqual(value) && (
                        <IconButton
                          aria-label="toggle royality-acres"
                          onClick={() => {
                            setValue("net_acres", calculateNetAcres());
                          }}
                        >
                          {checkIfNotEqual(value)}
                          <AutorenewIcon />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          <Controller
            control={control}
            name={`parcelOwnersRadioBValue`}
            render={({ onChange, value, ref }) => (
              <RadioGroup
                row
                value={value || "true"}
                onChange={(event) => {
                  if (event.target.value === "true") {
                    setValue("depthFrom", "All depths");
                    setValue("depthTo", "All depths");
                  }
                  onChange(event.target.value);
                }}
              >
                <FormControlLabel value="true" control={<Radio />} label="All Depths" />
                <FormControlLabel value="false" control={<Radio />} label="Footages/Formations" />
              </RadioGroup>
            )}
          />

          <Grid item xs={12} style={{ display: parcelOwnersRadioBValue !== "false" ? "none" : "block" }}>
            <Controller
              as={TextField}
              control={control}
              variant="outlined"
              margin="dense"
              name="depthFrom"
              inputRef={register()}
              label={"Depth From"}
              InputLabelProps={{ shrink: true }}
              fullWidth
              onWheel={(e) => e.target.blur()}
            />

            <Controller
              as={TextField}
              control={control}
              variant="outlined"
              margin="dense"
              name="depthTo"
              inputRef={register()}
              label={"Depth To"}
              InputLabelProps={{ shrink: true }}
              fullWidth
              onWheel={(e) => e.target.blur()}
            />
          </Grid>

          <Grid container direction="row" spacing={2}>
            <Grid item xs={6}>
              <Controller
                control={control}
                name={`tractStatus`}
                render={({ onChange, value, ref }) => (
                  <AutoCompleteWithNewOption
                    margin="dense"
                    label="Tract Status"
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    options={autoCompleteList}
                    value={value}
                    onChange={(_, value) => {
                      value && onChange(value.name);
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl variant="outlined" fullWidth margin="dense" inputRef={register()} name="countAcres">
                <InputLabel id="countAcres">Count Acres</InputLabel>
                <Controller
                  control={control}
                  name="countAcres"
                  render={({ onChange, value }) => (
                    <Select labelId="countAcres" label="Count Acres" value={value} onChange={onChange}>
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>

          <div className={classes.dialogFooter}>
            <Button
              variant="contained"
              color="default"
              size="medium"
              disableElevation
              onClick={handleClose}
              disabled={loading}
              className={classes.footerButton}
              style={{ margin: "0px 15px 0px 0px" }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              color="secondary"
              size="medium"
              disableElevation
              onClick={() => {
                handleSave();
              }}
              className={classes.footerButton}
              disabled={!selectedShapeLayer?._id}
            >
              {loading ? <CircularProgress size={14} /> : "Save"}
            </Button>
          </div>
        </div>
      </RightDialog>
    </>
  );
}

export default AddAgreementOwnerAndTractDialog;
