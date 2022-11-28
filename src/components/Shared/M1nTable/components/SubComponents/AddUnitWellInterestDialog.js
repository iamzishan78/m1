import React, { useState, useEffect, useContext, useCallback } from "react";
import ReactDOM from "react-dom";
import { useLazyQuery, useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import Grid from "@material-ui/core/Grid";
import { CircularProgress, Dialog } from "@material-ui/core";
import RightDialog from "../../../../ContactDetailCard/components/RightDialog";
import { WELL_INTEREST_SELECT_OPTIONS } from "graphQL/useQueryWellInterestSelectOptions";
import { ADD_SHAPE_WELL_INTEREST } from "graphQL/useMutationAddShapeWellInterest";
import { UPDATE_SHAPE_WELL_INTEREST } from "graphQL/useMutationUpdateShapeWellInterest";
import DeleteConfirmationDialogContent from "./DeleteConfirmationDialogContent";
import { useForm, Controller } from "react-hook-form";

// contexts
import { AppContext } from "AppContext";
import WellSearchApiField from "components/Shared/Forms/Fields/WellSearchApiField";
import AutoCompleteFieldComponent from "components/Shared/Forms/Fields/AutoCompleteField";
import { NumberFormatCustom } from "components/Shared/Forms/Formatting/NumberFormatCustom";


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

function AddUnitInterestDialog(props) {
  const classes = useStyles();

  const [stateApp, setStateApp] = useContext(AppContext);
  const { control, reset, register, getValues } = useForm();

  const [loading, setLoading] = useState(false);
  const [selectedWell, setSelectedWell] = useState(null);
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
  });
  const [updateShapeWellInterests] = useMutation(UPDATE_SHAPE_WELL_INTEREST, {
    onCompleted: () => {
      setLoading(false);
      handleClose();
    },
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
      setSelectedWell({
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
  }, [selectedWell]);

  const handleClose = () => {
    setSelectedWell(null);
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
      'selectedWell.Id': !selectedWell?.Id
    }
    setValid(tempValid);

    return !Object.values(tempValid).reduce((acc, cur) => acc + cur)
  }

  const handleSave = () => {
    setLoading(true);
    if (props.wellInterest) {
      updateShapeWellInterests({
        variables: {
          wellInterests: [{
            id: props.wellInterest._id,
            shapeType: props.shapeType,
            globalWellId: selectedWell.Id,
            ...getValues(),
          }]
        },
        refetchQueries: ["getESPaginatedList", "getESSimpleSearch", "getESFilterList"], awaitRefetchQueries: true
      });
    } else {
      addShapeWellInterest({
        variables: {
          wellInterest: {
            globalWellId: selectedWell.Id,
            userId: stateApp.user.mongoId,
            shapeType: props.shapeType,
            shapeId: props.shapeId,
            ...getValues(),
          }
        },
        refetchQueries: ["getESPaginatedList", "getESSimpleSearch", "getESFilterList", "getShapeSummaryDetails"], awaitRefetchQueries: true
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
      updateShapeWellInterests({
        variables: {
          wellInterests: [{
            id: props.wellInterest._id,
            isDeleted: true
          }],
        },
        refetchQueries: [
          "getESPaginatedList", "getESSimpleSearch", "getESFilterList", "getShapeSummaryDetails"
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

  const content = (
    <div style={{ padding: "30px" }}>
      <Grid item xs={12} style={{ minHeight: "35px" }}>
        <h4
          style={{
            margin: "0 0 15px 0",
            float: "left",
            fontSize: "1.1rem",
          }}
        >
          {props.wellInterest
            ? `Update ${props.shapeType} Well`
            : `Add ${props.shapeType} Well`}
        </h4>
        <div style={{ float: "right" }}>
          {props.wellInterest && (
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
                  <DeleteIcon className={classes.closeIcon} fontSize="small" />
                )}
              </IconButton>
            </>
          )}
          <IconButton onClick={!loading ? handleClose : undefined} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
      </Grid>

      <div>
        <WellSearchApiField
          setTenantWell={setTenantWell}
          setSelectedWell={setSelectedWell}
        />

        <h4
          style={
            {
              //margin: "0 0 15px 0",
              //float: "left",
              //fontSize: "1.1rem",
            }
          }
        >
          Selected well and lease information
        </h4>

        <Controller
          as={TextField}
          control={control}
          variant="outlined"
          margin="dense"
          name="wellName"
          label={"Well Name"}
          InputLabelProps={{ shrink: true }}
          fullWidth
          disabled
          defaultValue=""
        />

        <Controller
          as={TextField}
          control={control}
          variant="outlined"
          margin="dense"
          name="api"
          label="API Number"
          InputLabelProps={{ shrink: true }}
          fullWidth
          disabled
          defaultValue=""
        />

        <Controller
          control={control}
          name="operator"
          label="Operator"
          defaultValue={""}
          options={getOptions("Operator") || []}
          as={<AutoCompleteFieldComponent />}
        />

        <Controller
          as={TextField}
          control={control}
          variant="outlined"
          margin="dense"
          name="leaseId"
          label={"Lease Number"}
          fullWidth
          defaultValue=""
        />
        <Controller
          as={TextField}
          control={control}
          variant="outlined"
          margin="dense"
          name="lease"
          label={"Lease Name"}
          fullWidth
          defaultValue=""
        />

        {/* <Controller
              control={control}
              name="leaseAcres"
              render={(props) => (
                <TextField
                  variant="outlined"
                  margin="dense"
                  value={props.value}
                  inputRef={props.ref}
                  onChange={(event) => {
                    props.onChange(parseFloat(event.target.value))
                  }}
                  label={"Lease Acres"}
                  fullWidth
                  defaultValue=""
                  InputProps={{
                    inputComponent: NumberFormatCustom,
                  }}
                />
              )}
            /> */}
      </div>

      <div>
        <FormControl variant="outlined" fullWidth size="small">
          <Controller
            control={control}
            name="wellType"
            label="Well Type"
            defaultValue={""}
            options={getOptions("WellType") || []}
            as={<AutoCompleteFieldComponent />}
          />

          <Controller
            control={control}
            name="wellBoreProfile"
            label="Wellbore Profile"
            defaultValue={""}
            options={getOptions("WellBoreProfile") || []}
            as={<AutoCompleteFieldComponent />}
          />

          <Controller
            control={control}
            name="wellStatus"
            label="Well Status"
            defaultValue={""}
            options={getOptions("WellStatus") || []}
            as={<AutoCompleteFieldComponent />}
          />
        </FormControl>
      </div>

      <div className={classes.dialogFooter}>
        <Button
          variant="contained"
          color="default"
          size="medium"
          disableElevation
          onClick={handleClose}
          disabled={loading}
          className={classes.footerButton}
          style={{
            margin: "0px 15px 0px 0px",
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color="secondary"
          size="medium"
          id="saveWellButton"
          disableElevation
          onClick={() => {
            handleValidate() && handleSave();
          }}
          className={classes.footerButton}
          disabled={loading || !valid}
        >
          {loading ? <CircularProgress size={14} /> : "Save"}
        </Button>
      </div>
    </div>
  );
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
            header={`Delete Well`}
            onClose={handleCloseDialog}
            deleteFunc={deleteFunc}
            m1nSelectedRowsIds={null}
            setM1nSelectedRowsIndexes={() => { }}
          >
            Do you want to delete the selected well?
          </DeleteConfirmationDialogContent>
        </Dialog>
      )}
      {
        props.drawerContainer &&
        ReactDOM.createPortal(content, props.drawerContainer)
      }
      {
        !props.drawerContainer &&
        <RightDialog
          open={props.open}
          handleClickDialogClose={handleClose}
          width={props.width}
        >
          {content}
        </RightDialog>
      }
    </>
  );
}

export default AddUnitInterestDialog;
