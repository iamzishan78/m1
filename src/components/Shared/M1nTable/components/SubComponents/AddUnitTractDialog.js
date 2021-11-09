import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import Grid from "@material-ui/core/Grid";
import { Box, CircularProgress, Dialog, Typography } from "@material-ui/core";
import RightDialog from "../../../../ContactDetailCard/components/RightDialog";
import DeleteConfirmationDialogContent from "./DeleteConfirmationDialogContent";
import { useForm, Controller } from "react-hook-form";

// contexts 
import { getParcelOriginalProperties } from "components/ParcelsDetailCard/utils/GetParcelOriginalProps";
import AutoCompleteShapeLayer from "components/Shared/Forms/Fields/AutoCompleteShapeLayer";
import { ADD_TRACT_TOA_SHAPE } from "graphQL/useMutationAddTractToAShape";
import { UPDATE_SHAPE_TRACT } from "graphQL/useMutationUpdateShapeTract";
import pick from 'lodash/pick';


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
  const { control, reset, register, getValues } = useForm();

  const [loading, setLoading] = useState(false);
  const [selectedShapeLayer, setSelectedShapeLayer] = useState(null);

  const [addShapeTract] = useMutation(ADD_TRACT_TOA_SHAPE, {
    onCompleted: () => {
      setLoading(false);
      handleClose();
    },
    refetchQueries: [
      "getESShapeTracts",
      "getESShapeTractsFilter"
    ],
    awaitRefetchQueries: true,
  });
  const [updateShapeTract] = useMutation(UPDATE_SHAPE_TRACT, {
    onCompleted: () => {
      setLoading(false);
      handleClose();
    },
    onError: (err) => { },
    refetchQueries: [
      "getESShapeTracts",
      "getESShapeTractsFilter"
    ],
    awaitRefetchQueries: true,
  });

  useEffect(() => {
    if (props.seletedTract) {
      props.seletedTract.parcelId = props.seletedTract?.parcel?._id
      props.seletedTract.name = props.seletedTract?.parcel?.name
      setSelectedShapeLayer(props.seletedTract);

      reset(pick(props.seletedTract, ['state', 'county', 'survey', 'block', 'section', 'abstract', 'altSurvey', 'qtr', 'shapeArea', 'uAcres']))
    }
  }, [props.seletedTract]);

  useEffect(() => {
    // if launched from grid row set initializing based on selectedWell state
    if (selectedShapeLayer?.shapeJson) {
      const originalProperties = getParcelOriginalProperties(selectedShapeLayer?.shapeJson?.properties)
      const shapeArea = selectedShapeLayer?.shapeJson?.properties?.shapeArea;
      selectedShapeLayer.parcelId = selectedShapeLayer._id
      reset({ ...getValues(), shapeArea, ...originalProperties, name: selectedShapeLayer.name })
    }
  }, [selectedShapeLayer]);

  const handleClose = () => {
    setSelectedShapeLayer(null);
    reset({})
    props.onClose();
  }

  const handleSave = () => {
    setLoading(true);
    if (props.seletedTract) {
      updateShapeTract({
        variables: {
          shapeTract: {
            _id: selectedShapeLayer._id,
            name: selectedShapeLayer.name,
            shapeId: props.shapeId,
            ...getValues(),
          },
          shapeType: props.shapeType,
        }
      });
    } else {
      addShapeTract({
        variables: {
          shapeTract: {
            parcelId: selectedShapeLayer.parcelId,
            name: selectedShapeLayer.name,
            shapeId: props.shapeId,
            ...getValues(),
          },
          shapeType: props.shapeType,
        }
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
      updateShapeTract({
        variables: {
          seletedTract: {
            id: props.seletedTract._id,
            isDeleted: true
          },
        },
        refetchQueries: [
          "getESShapeTracts",
          "getESShapeTractsFilter"
        ],
        awaitRefetchQueries: true,
      });
    } catch {
      setLoading(false);
    }
  };

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
              {props.seletedTract ? `Update ${props.shapeType} Tract` : `Add ${props.shapeType} Tract`}
            </h4>
            <div style={{ "float": "right" }}>
              {(props.seletedTract && (
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
              InputLabelProps={{ shrink: true }} fullWidth disabled />

            <Controller as={TextField} control={control} variant="outlined" margin="dense" name='county' inputRef={register()} label={"County"}
              InputLabelProps={{ shrink: true }} fullWidth disabled />

            <Controller as={TextField} control={control} variant="outlined" margin="dense" name='survey' inputRef={register()} label={"Survey"}
              InputLabelProps={{ shrink: true }} fullWidth disabled />

            <Controller as={TextField} control={control} variant="outlined" margin="dense" name='block' inputRef={register()} label={"Block"}
              InputLabelProps={{ shrink: true }} fullWidth disabled />

            <Controller as={TextField} control={control} variant="outlined" margin="dense" name='section' inputRef={register()} label={"Section"}
              InputLabelProps={{ shrink: true }} fullWidth disabled />

            <Controller as={TextField} control={control} variant="outlined" margin="dense" name='abstract' inputRef={register()} label={"Abstract"}
              InputLabelProps={{ shrink: true }} fullWidth disabled />

            <Controller as={TextField} control={control} variant="outlined" margin="dense" name='altSurvey' inputRef={register()} label={"Alternate Survey"}
              InputLabelProps={{ shrink: true }} fullWidth disabled />

            <Grid container spacing={1}>
              <Grid item xs={3}>
                <Controller as={TextField} control={control} variant="outlined" margin="dense" name='qtr[0]' inputRef={register()} label={"QTR1"}
                  InputLabelProps={{ shrink: true }} fullWidth disabled />
              </Grid>
              <Grid item xs={3}>
                <Controller as={TextField} control={control} variant="outlined" margin="dense" name='qtr[1]' inputRef={register()} label={"QTR2"}
                  InputLabelProps={{ shrink: true }} fullWidth disabled />
              </Grid>
              <Grid item xs={3}>
                <Controller as={TextField} control={control} variant="outlined" margin="dense" name='qtr[2]' inputRef={register()} label={"QTR3"}
                  InputLabelProps={{ shrink: true }} fullWidth disabled />
              </Grid>
              <Grid item xs={3}>
                <Controller as={TextField} control={control} variant="outlined" margin="dense" name='qtr[3]' inputRef={register()} label={"QTR4"}
                  InputLabelProps={{ shrink: true }} fullWidth disabled />
              </Grid>
            </Grid>


            <Controller as={TextField} control={control} variant="outlined" margin="dense" name='shapeArea' inputRef={register()} label={"Calc. Acres"}
              InputLabelProps={{ shrink: true }} fullWidth disabled />

            <Controller as={TextField} control={control} variant="outlined" margin="dense" name='uAcres' inputRef={register()} label={"Unit. Acres"}
              InputLabelProps={{ shrink: true }} fullWidth defaultValue={props.uAcres} />

          </div>

          <div className={classes.dialogFooter}>
            <Button variant="contained" color="default" size="medium" disableElevation onClick={handleClose} disabled={loading} className={classes.footerButton}
              style={{ margin: "0px 15px 0px 0px" }}>
              Cancel
            </Button>

            <Button variant="contained" color="secondary" size="medium" disableElevation onClick={() => { handleSave() }}
              className={classes.footerButton} disabled={!selectedShapeLayer?._id}>
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
