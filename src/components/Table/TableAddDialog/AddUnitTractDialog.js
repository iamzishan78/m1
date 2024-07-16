import React, { useState, useEffect, useContext } from "react";
import { useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import Grid from "@material-ui/core/Grid";
import { Box, CircularProgress, Dialog, Typography } from "@material-ui/core";
import RightDialog from "../../ContactDetailCard/components/RightDialog";
import DeleteConfirmationDialogContent from "../../Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";
import { useForm, Controller } from "react-hook-form";

// contexts 
import { AppContext } from "AppContext";
import { getParcelOriginalProperties } from "components/ParcelsDetailCard/utils/GetParcelOriginalProps";
import AutoCompleteShapeLayer from "components/Shared/Forms/Fields/AutoCompleteShapeLayer";
import TractForm from "components/Table/TableAddDialog/Common/TractForm";
import { ADD_TRACTS_TOA_SHAPE } from "graphQL/useMutationAddTractsToAShape";
import { UPDATE_SHAPE_TRACTS } from "graphQL/useMutationUpdateShapeTracts";
import pick from 'lodash/pick';
import { tableGlobalController } from 'hookstate/tableController';


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
  const { control, reset, register, getValues, watch } = useForm();

  const [loading, setLoading] = useState(false);
  const [stateApp, setStateApp] = useContext(AppContext);
  const [tractValue, setTractValue] = useState({ name: "", _id: null });
  const [selectedShapeLayer, setSelectedShapeLayer] = useState(null);

  const tract = watch()

  const [addShapeTract, { data: mutationData }] = useMutation(ADD_TRACTS_TOA_SHAPE, {
    onCompleted: () => {
      setLoading(false);
      handleClose();
    },
    refetchQueries: ["getESPaginatedList", "getESSimpleSearch", "getESFilterList"], awaitRefetchQueries: true
  });
  const [updateShapeTract, { data: updateData }] = useMutation(UPDATE_SHAPE_TRACTS, {
    onCompleted: () => {
      setLoading(false);
      handleClose();
    },
    onError: (err) => { },
    refetchQueries: ["getESPaginatedList", "getESSimpleSearch", "getESFilterList"], awaitRefetchQueries: true
  });

  useEffect(() => {
    let type = null;
    if (mutationData && mutationData.addTractsToAShape) {
      type = { name: 'add', success: mutationData.addTractsToAShape.success };
    } else if (updateData && updateData.updateShapeTracts) {
      type = { name: 'update', success: updateData.updateShapeTracts.success };
    }
    if (type) {
      handleCloseDialog();
      setStateApp(state => ({
        ...state,
        universalCircularLoaderAct: false,
      }));
      tableGlobalController.refetch() // refresh MRTtable data on add or update
    }
  }, [mutationData, updateData]);

  useEffect(() => {
    if (props.seletedTract) {
      props.seletedTract.parcelId = props.seletedTract?.parcel?._id
      props.seletedTract.name = props.seletedTract?.parcel?.name
      setSelectedShapeLayer(props.seletedTract);
      setTractValue({ _id: props.seletedTract.parcelId, name: props.seletedTract.name })

      reset(pick(props.seletedTract, ['name', 'state', 'county', 'survey', 'block', 'section', 'abstract', 'township', 'meridian', 'range', 'altSurvey', 'qtr', 'shapeArea', 'sdGrossAcres', 'uAcres', 'legalDescription', 'basin', 'field']))
    }
  }, [props.seletedTract]);

  useEffect(() => {
    // if launched from grid row set initializing based on selectedWell state
    if (selectedShapeLayer?.shapeJson) {
      const originalProperties = getParcelOriginalProperties(selectedShapeLayer?.shapeJson?.properties)
      const shapeArea = selectedShapeLayer?.shapeJson?.properties?.shapeArea;
      const sdGrossAcres = selectedShapeLayer?.shapeJson?.properties?.sdGrossAcres;
      const legalDescription = selectedShapeLayer?.shapeJson?.properties?.legalDescription;
      selectedShapeLayer.parcelId = selectedShapeLayer._id
      setTractValue({ _id: selectedShapeLayer._id, name: selectedShapeLayer.name })
      reset({ ...getValues(), shapeArea, sdGrossAcres, legalDescription, ...originalProperties, name: selectedShapeLayer.name })
    } else {
      if (selectedShapeLayer?.clear) {
        setTractValue({ name: "", _id: null })
        reset({})
      }
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
          shapeTracts: [{
            name: selectedShapeLayer.name,
            shapeId: props.shapeId,
            parcelId: selectedShapeLayer.parcelId,
            ...getValues(),
          }],
          shapeType: props.shapeType,
          selectedTractToUpdate: props.seletedTract._id, // Pass selectedTract id for replace tract with current selected tract
        }
      });
      setStateApp(state => ({ ...state, universalCircularLoaderAct: true }))
    } else {
      addShapeTract({
        variables: {
          shapeTracts: [{
            parcelId: selectedShapeLayer.parcelId,
            name: selectedShapeLayer.name,
            shapeId: props.shapeId,
            ...getValues(),
          }],
          shapeType: props.shapeType,
        }
      });
      setStateApp(state => ({ ...state, universalCircularLoaderAct: true }))
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
        refetchQueries: ["getESPaginatedList", "getESSimpleSearch", "getESFilterList"], awaitRefetchQueries: true
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

            <TractForm tract={tract} tractValue={tractValue} setSelectedShapeLayer={setSelectedShapeLayer} register={register} control={control} />


            <Controller as={TextField} control={control} variant="outlined" margin="dense" name='shapeArea' label={"Tract Calc. Acres"}
              InputLabelProps={{ shrink: true }} fullWidth disabled defaultValue={tract?.shapeArea || ''} />

            <Controller as={TextField} control={control} variant="outlined" margin="dense" name='sdGrossAcres' label={"Tract Gross Acres"}
              InputLabelProps={{ shrink: true }} fullWidth disabled defaultValue={tract?.sdGrossAcres || ''} />

            <Controller as={TextField} control={control} variant="outlined" margin="dense" name='unitTractId' label={"Unit Tract ID"}
              InputLabelProps={{ shrink: true }} fullWidth onWheel={(e) => e.target.blur()} />

            <Controller as={TextField} control={control} variant="outlined" margin="dense" name='uAcres' label={"Unit Tract Acres"}
              InputLabelProps={{ shrink: true }} type='number' fullWidth onWheel={(e) => e.target.blur()} />

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
