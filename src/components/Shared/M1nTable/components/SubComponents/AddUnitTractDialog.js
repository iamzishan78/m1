import React, { useState, useEffect, useContext, useCallback } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import Grid from "@material-ui/core/Grid";
import { Box, CircularProgress, Dialog, Typography } from "@material-ui/core";
import RightDialog from "../../../../ContactDetailCard/components/RightDialog";
import { WELL_INTEREST_SELECT_OPTIONS } from "graphQL/useQueryWellInterestSelectOptions";
import { ADD_SHAPE_WELL_INTEREST } from "graphQL/useMutationAddShapeWellInterest";
import { UPDATE_SHAPE_WELL_INTEREST } from "graphQL/useMutationUpdateShapeWellInterest";
import DeleteConfirmationDialogContent from "./DeleteConfirmationDialogContent";
import { useForm, Controller } from "react-hook-form";

// contexts 
import { AppContext } from "AppContext";
import { getParcelOriginalProperties } from "components/ParcelsDetailCard/utils/GetParcelOriginalProps";
import AutoCompleteShapeLayer from "components/Shared/Forms/Fields/AutoCompleteShapeLayer";


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
    '& .MuiInputBase-input': {
      color: 'red'
    }
  }
}));

function AddUnitTractDialog(props) {
  const classes = useStyles();

  const [stateApp, setStateApp] = useContext(AppContext);
  const { control, reset, register, getValues } = useForm();

  const [loading, setLoading] = useState(false);
  const [selectedShapeLayer, setSelectedShapeLayer] = useState(null);
  const [wellInterestSelectOptions, setWellInterestSelectOptions] = useState({});
  const [valid, setValid] = useState({});

  const [getWellInterestsSelectOptions, { data: dataWellInterestsSelectOptions }] = useLazyQuery(WELL_INTEREST_SELECT_OPTIONS, {
    fetchPolicy: "cache-and-network",
  });

  const [addShapeWellInterest] = useMutation(ADD_SHAPE_WELL_INTEREST, {
    onCompleted: () => {
      setLoading(false);
      handleClose();
    },
    refetchQueries: [
      "getESShapeWells",
      "getESShapeWellsFilter"
    ],
    awaitRefetchQueries: true,
  });
  const [updateShapeWellInterest] = useMutation(UPDATE_SHAPE_WELL_INTEREST, {
    onCompleted: () => {
      setLoading(false);
      handleClose();
    },
    refetchQueries: [
      "getESShapeWells",
      "getESShapeWellsFilter"
    ],
    awaitRefetchQueries: true,
  });

  useEffect(() => {
    getWellInterestsSelectOptions({ variables: { selectKeys: ['Operator', 'WellType', 'WellStatus', 'WellBoreProfile'] } })
  }, []);

  useEffect(() => {
    setWellInterestSelectOptions(dataWellInterestsSelectOptions?.wellInterestsSelectOptions?.res);
  }, dataWellInterestsSelectOptions);

  const getOptions = useCallback(
    (type) => {
      return wellInterestSelectOptions ? wellInterestSelectOptions[type]?.map(e => e.Desc || e.Name) : []
    },
    [wellInterestSelectOptions],
  );

  useEffect(() => {
    if (props.wellInterest) {
      props.wellInterest.api = props.wellInterest.apiNumber
      setSelectedShapeLayer({
        Id: props.wellInterest.wellId,
        WellName: props.wellInterest.wellName,
        ApiNumber: props.wellInterest.api,
        LeaseId: props.wellInterest.leaseId,
        Lease: props.wellInterest.lease,
        LeaseAcreage: props.wellInterest.leaseAcres
      });

      reset(props.wellInterest)
    }
  }, [props.wellInterest]);

  useEffect(() => {
    // if launched from grid row set initializing based on selectedWell state
    const originalProperties = getParcelOriginalProperties(selectedShapeLayer?.shapeJson?.properties)
    const shapeArea = selectedShapeLayer?.shapeJson?.properties?.shapeArea;
    reset({ ...getValues(), shapeArea, ...originalProperties })
  }, [selectedShapeLayer]);

  const handleClose = () => {
    setSelectedShapeLayer(null);
    setStateApp((stateApp) => ({
      ...stateApp,
      wellInterestDialog: false,
      activeWellInterest: null,
    }));
    setValid({});
    reset({})
    props.onClose();
  }

  const handleValidate = () => {
    const tempValid = {
      ...valid,
      'selectedWell.Id': !selectedShapeLayer?.Id
    }
    setValid(tempValid);

    return !Object.values(tempValid).reduce((acc, cur) => acc + cur)
  }

  const handleSave = () => {
    setLoading(true);
    if (props.wellInterest) {
      updateShapeWellInterest({
        variables: {
          wellInterest: {
            id: props.wellInterest._id,
            shapeType: props.shapeType,
            globalWellId: selectedShapeLayer.Id,
            ...getValues(),
          },
        },
        refetchQueries: [
          "getESShapeWells",
          "getESShapeWellsFilter"
        ],
        awaitRefetchQueries: true,
      });
    } else {
      addShapeWellInterest({
        variables: {
          wellInterest: {
            globalWellId: selectedShapeLayer.Id,
            userId: stateApp.user.mongoId,
            shapeType: props.shapeType,
            shapeId: props.shapeId,
            ...getValues(),
          }
        },
        refetchQueries: [
          "getESShapeWells",
          "getESShapeWellsFilter"
        ],
        awaitRefetchQueries: true,
      });
    }
  }

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
      updateShapeWellInterest({
        variables: {
          wellInterest: {
            id: props.wellInterest._id,
            isDeleted: true
          },
        },
        refetchQueries: [
          "getESShapeWells",
          "getESShapeWellsFilter"
        ],
        awaitRefetchQueries: true,
      });
    } catch {
      setLoading(false);
    }
  };

  const setTenantWell = (well) => {
    if (well) reset(well)
  }

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
      <RightDialog
        open={props.open}
        handleClickDialogClose={handleClose}
        width={props.width}
      >
        <div style={{ padding: "30px" }}>
          <Grid item xs={12} style={{ minHeight: "35px" }}>
            <h4
              style={{
                margin: "0 0 15px 0",
                "float": "left",
                fontSize: "1.1rem",
              }}
            >
              {props.wellInterest ? `Update ${props.shapeType} Tract` : `Add ${props.shapeType} Tract`}
            </h4>
            <div style={{ "float": "right" }}>
              {(props.wellInterest && (
                <>
                  <IconButton
                    disabled={loading}
                    onClick={openConfirmationDialog}
                    size="small"
                    style={{ margin: "0 8px" }}
                  >
                    {loading ? (
                      <CircularProgress size={20} color="secondary" />
                    ) : (
                      <DeleteIcon
                        className={classes.closeIcon}
                        fontSize="small"
                      />
                    )}
                  </IconButton>
                </>
              ))}
              <IconButton
                onClick={handleClose}
                size="small"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>
          </Grid>

          <div>

            <Box mt={2}>
              <Typography>
                Search for existing tract to associate to unit and enter tract unit acres
              </Typography>
            </Box>


            <AutoCompleteShapeLayer shapeType='parcel' setSelectedShapeLayer={setSelectedShapeLayer} />


            <Controller as={TextField} control={control} variant="outlined" margin="dense" name='state' inputRef={register()} label={"State"}
              InputLabelProps={{ shrink: true }} fullWidth disabled defaultValue="" />

            <Controller as={TextField} control={control} variant="outlined" margin="dense" name='county' inputRef={register()} label={"County"}
              InputLabelProps={{ shrink: true }} fullWidth disabled defaultValue="" />

            <Controller as={TextField} control={control} variant="outlined" margin="dense" name='survey' inputRef={register()} label={"Survey"}
              InputLabelProps={{ shrink: true }} fullWidth disabled defaultValue="" />

            <Controller as={TextField} control={control} variant="outlined" margin="dense" name='block' inputRef={register()} label={"Block"}
              InputLabelProps={{ shrink: true }} fullWidth disabled defaultValue="" />

            <Controller as={TextField} control={control} variant="outlined" margin="dense" name='section' inputRef={register()} label={"Section"}
              InputLabelProps={{ shrink: true }} fullWidth disabled defaultValue="" />

            <Controller as={TextField} control={control} variant="outlined" margin="dense" name='abstract' inputRef={register()} label={"Abstract"}
              InputLabelProps={{ shrink: true }} fullWidth disabled defaultValue="" />

            <Controller as={TextField} control={control} variant="outlined" margin="dense" name='altSurvey' inputRef={register()} label={"Alternate Survey"}
              InputLabelProps={{ shrink: true }} fullWidth disabled defaultValue="" />

            <Grid container spacing={1}>
              <Grid item xs={3}>
                <Controller as={TextField} control={control} variant="outlined" margin="dense" name='qtr[0]' inputRef={register()} label={"QTR1"}
                  InputLabelProps={{ shrink: true }} fullWidth disabled defaultValue="" />
              </Grid>
              <Grid item xs={3}>
                <Controller as={TextField} control={control} variant="outlined" margin="dense" name='qtr[1]' inputRef={register()} label={"QTR2"}
                  InputLabelProps={{ shrink: true }} fullWidth disabled defaultValue="" />
              </Grid>
              <Grid item xs={3}>
                <Controller as={TextField} control={control} variant="outlined" margin="dense" name='qtr[2]' inputRef={register()} label={"QTR3"}
                  InputLabelProps={{ shrink: true }} fullWidth disabled defaultValue="" />
              </Grid>
              <Grid item xs={3}>
                <Controller as={TextField} control={control} variant="outlined" margin="dense" name='qtr[3]' inputRef={register()} label={"QTR4"}
                  InputLabelProps={{ shrink: true }} fullWidth disabled defaultValue="" />
              </Grid>
            </Grid>


            <Controller as={TextField} control={control} variant="outlined" margin="dense" name='shapeArea' inputRef={register()} label={"Calc. Acres"}
              InputLabelProps={{ shrink: true }} fullWidth disabled defaultValue="" />

            <Controller as={TextField} control={control} variant="outlined" margin="dense" name='altSurvey' inputRef={register()} label={"Unit. Acres"}
              InputLabelProps={{ shrink: true }} fullWidth defaultValue="" />

          </div>

          <div className={classes.dialogFooter}>
            <Button variant="contained" color="default" size="medium" disableElevation onClick={handleClose} disabled={loading} className={classes.footerButton}
              style={{ margin: "0px 15px 0px 0px" }}>
              Cancel
            </Button>

            <Button variant="contained" color="secondary" size="medium" disableElevation onClick={() => { handleValidate() && handleSave() }}
              className={classes.footerButton} disabled={loading || !valid}>
              {loading ? (
                <CircularProgress size={14} />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </RightDialog>
    </>
  );
}

export default AddUnitTractDialog;
