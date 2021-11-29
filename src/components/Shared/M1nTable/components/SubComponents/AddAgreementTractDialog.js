import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import Grid from "@material-ui/core/Grid";
import { Box, CircularProgress, Dialog, FormControlLabel, List, ListItem, ListItemText, MenuItem, Radio, RadioGroup, Select, Typography } from "@material-ui/core";
import RightDialog from "../../../../ContactDetailCard/components/RightDialog";
import DeleteConfirmationDialogContent from "./DeleteConfirmationDialogContent";
import { useForm, Controller } from "react-hook-form";

// contexts 
import { getParcelOriginalProperties } from "components/ParcelsDetailCard/utils/GetParcelOriginalProps";
import AutoCompleteShapeLayer from "components/Shared/Forms/Fields/AutoCompleteShapeLayer";
import { ADD_TRACTS_TOA_SHAPE } from "graphQL/useMutationAddTractsToAShape";
import { UPDATE_SHAPE_TRACTS } from "graphQL/useMutationUpdateShapeTracts";
import pick from 'lodash/pick';
import AutocompEntityNamesList from "components/Shared/Forms/Fields/AutocompEntityNamesList";
import AutoCompleteWithNewOption from "components/Shared/Forms/Fields/AutoCompleteWithNewOption";


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
  },
  selectedType: {
    color: 'black',
    borderBottom: "4px solid #01B0F0",
    display: "inline",
    cursor: "pointer",
  },
  unSelectedType: {
    display: "inline",
    color: "#827F7F",
    cursor: "pointer",
  },
}));

function AddAgreementTractDialog(props) {
  const classes = useStyles();
  const { control, reset, register, getValues, watch } = useForm();

  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("new");
  const [nameAutValue, setNameAutValue] = useState({ name: "", _id: null });
  const [selectedShapeLayer, setSelectedShapeLayer] = useState(null);

  const state = watch('state', '')

  const parcelOwnersRadioBValue = watch('parcelOwnersRadioBValue', '')

  const [addShapeTract] = useMutation(ADD_TRACTS_TOA_SHAPE, {
    onCompleted: () => {
      setLoading(false);
      handleClose();
    },
    refetchQueries: ["getESPaginatedList", "getESFilterList"], awaitRefetchQueries: true
  });
  const [updateShapeTract] = useMutation(UPDATE_SHAPE_TRACTS, {
    onCompleted: () => {
      setLoading(false);
      handleClose();
    },
    onError: (err) => { },
    refetchQueries: ["getESPaginatedList", "getESFilterList"], awaitRefetchQueries: true
  });

  useEffect(() => {
    if (props.seletedTract) {
      props.seletedTract.parcelId = props.seletedTract?.parcel?._id
      props.seletedTract.name = props.seletedTract?.parcel?.name
      setSelectedShapeLayer(props.seletedTract);

      reset(pick(props.seletedTract, ['state', 'county', 'survey', 'block', 'section', 'abstract', 'township', 'meridian', 'range', 'altSurvey', 'qtr', 'sdGrossAcres', 'uAcres', 'legalDescription']))
    }
  }, [props.seletedTract]);

  useEffect(() => {
    // if launched from grid row set initializing based on selectedWell state
    if (selectedShapeLayer?.shapeJson) {
      const originalProperties = getParcelOriginalProperties(selectedShapeLayer?.shapeJson?.properties)
      const sdGrossAcres = selectedShapeLayer?.shapeJson?.properties?.sdGrossAcres;
      const legalDescription = selectedShapeLayer?.shapeJson?.properties?.legalDescription;
      selectedShapeLayer.parcelId = selectedShapeLayer._id
      reset({ ...getValues(), sdGrossAcres, legalDescription, ...originalProperties, name: selectedShapeLayer.name })
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
            _id: selectedShapeLayer._id,
            name: selectedShapeLayer.name,
            shapeId: props.shapeId,
            ...getValues(),
          }],
          shapeType: props.shapeType,
        }
      });
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
        refetchQueries: ["getESPaginatedList", "getESFilterList"], awaitRefetchQueries: true
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
                Search for existing tract to associate to agreement and populate ownership detail
              </Typography>
            </Box>


            <AutoCompleteShapeLayer shapeType='parcel' setSelectedShapeLayer={setSelectedShapeLayer} />


            <Controller as={TextField} control={control} variant="outlined" margin="dense" name='state' inputRef={register()} label={"State"}
              InputLabelProps={{ shrink: true }} fullWidth disabled />



            <Controller as={TextField} control={control} variant="outlined" margin="dense" name='county' inputRef={register()} label={"County"}
              InputLabelProps={{ shrink: true }} fullWidth disabled />



            {state !== 'TX' && <>
              <Controller as={TextField} control={control} variant="outlined" margin="dense" name='meridian' inputRef={register()} label={"Meridian"}
                InputLabelProps={{ shrink: true }} fullWidth disabled />

              <Controller as={TextField} control={control} variant="outlined" margin="dense" name='township' inputRef={register()} label={"Township"}
                InputLabelProps={{ shrink: true }} fullWidth disabled />

              <Controller as={TextField} control={control} variant="outlined" margin="dense" name='range' inputRef={register()} label={"Range"}
                InputLabelProps={{ shrink: true }} fullWidth disabled />

              <Controller as={TextField} control={control} variant="outlined" margin="dense" name='altSurvey' inputRef={register()} label={"Section"}
                InputLabelProps={{ shrink: true }} fullWidth disabled />
            </>}

            {state === 'TX' && <>
              <Controller as={TextField} control={control} variant="outlined" margin="dense" name='survey' inputRef={register()} label={"Survey"}
                InputLabelProps={{ shrink: true }} fullWidth disabled />

              <Controller as={TextField} control={control} variant="outlined" margin="dense" name='block' inputRef={register()} label={"Block"}
                InputLabelProps={{ shrink: true }} fullWidth disabled />

              <Controller as={TextField} control={control} variant="outlined" margin="dense" name='range' inputRef={register()} label={"Section"}
                InputLabelProps={{ shrink: true }} fullWidth disabled />

              <Controller as={TextField} control={control} variant="outlined" margin="dense" name='section' inputRef={register()} label={"Abstract"}
                InputLabelProps={{ shrink: true }} fullWidth disabled />
            </>}

            <Controller as={TextField} control={control} variant="outlined" margin="dense" name='altSurvey' inputRef={register()} label={"Alternate Survey"}
              InputLabelProps={{ shrink: true }} fullWidth disabled />

            <Controller as={TextField} control={control} variant="outlined" margin="dense" name='legalDescription' inputRef={register()} label={"Full Legal Description"}
              InputLabelProps={{ shrink: true }} multiline rows={4} fullWidth disabled />


            <Controller as={TextField} control={control} variant="outlined" margin="dense" name='sdGrossAcres' inputRef={register()} label={"Gross. Acres"}
              InputLabelProps={{ shrink: true }} fullWidth disabled />

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
                      setSelectedType("new");
                      // setSearch("");
                      // setNewDocument(documentInitial);
                    }}
                    className={selectedType === "new" ? classes.selectedType : classes.unSelectedType}
                  >
                    New Owner
                  </h4>
                  <h4
                    onClick={() => {
                      setSelectedType("existing");
                    }}
                    className={selectedType === "existing" ? classes.selectedType : classes.unSelectedType}
                    style={{ marginLeft: "20px" }}
                  >
                    Existing Tract Owners
                  </h4>
                </ListItemText>
              </ListItem>
            </List>
          </div>

          <AutocompEntityNamesList nameAutValue={nameAutValue} setNameAutValue={setNameAutValue} />

          <Controller as={TextField} control={control} variant="outlined" margin="dense" name='mineral_interest' inputRef={register()} label={"Mineral Interest"}
            InputLabelProps={{ shrink: true }} type='number' fullWidth onWheel={(e) => e.target.blur()} />

          <Controller as={TextField} control={control} variant="outlined" margin="dense" name='royality_interest' inputRef={register()} label={"Royality Interest"}
            InputLabelProps={{ shrink: true }} type='number' fullWidth onWheel={(e) => e.target.blur()} />
          <Controller as={TextField} control={control} variant="outlined" margin="dense" name='orri' inputRef={register()} label={"Overriding Royalty Interest (ORRI)"}
            InputLabelProps={{ shrink: true }} type='number' fullWidth onWheel={(e) => e.target.blur()} />

          <Controller as={TextField} control={control} variant="outlined" margin="dense" name='net_acres' inputRef={register()} label={"Net Acres"}
            InputLabelProps={{ shrink: true }} type='number' fullWidth onWheel={(e) => e.target.blur()} />


          <Controller
            control={control}
            name={`parcelOwnersRadioBValue`}
            render={(
              { onChange, value, ref },
            ) => (
              <RadioGroup
                row
                value={value}
                onChange={(event) => {
                  onChange(event.target.value);
                }}
              >
                <FormControlLabel value="true" control={<Radio />} label="All Depths" />
                <FormControlLabel value="false" control={<Radio />} label="Footages/Formations" />
              </RadioGroup>
            )}
          />

          {parcelOwnersRadioBValue === "false" && (
            <Grid item xs={12}>

              <Controller as={TextField} control={control} variant="outlined" margin="dense" name='depthFrom' inputRef={register()} label={"Depth From"}
                InputLabelProps={{ shrink: true }} type='number' fullWidth onWheel={(e) => e.target.blur()} />


              <Controller as={TextField} control={control} variant="outlined" margin="dense" name='depthTo' inputRef={register()} label={"Depth To"}
                InputLabelProps={{ shrink: true }} type='number' fullWidth onWheel={(e) => e.target.blur()} />
            </Grid>
          )}

          {/* <Controller
            control={control}
            name={`tractStatus`}
            render={(
              { onChange, value, ref },
            ) => (
              <AutoCompleteWithNewOption variant="outlined" options={provisionAutoCompleteList} value={value} onChange={(_, value) => { onChange(value.name); }} />
            )}
          /> */}

          <Select
            className={classes.viewSwitcher}
            variant="outlined"
            label='countAcres'
            nputRef={register()}
            name=''
          >
            <MenuItem value={true}>Yes</MenuItem>
            <MenuItem value={false}>No</MenuItem>
          </Select>



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

export default AddAgreementTractDialog;
