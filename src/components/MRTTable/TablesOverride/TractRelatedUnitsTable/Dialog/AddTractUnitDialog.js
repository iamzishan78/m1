import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Grid from "@material-ui/core/Grid";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import { useForm, Controller } from "react-hook-form";
import RightDialog from "components/ContactDetailCard/components/RightDialog";
import AutoCompleteShapeLayer from "components/Shared/Forms/Fields/AutoCompleteShapeLayer";
import { ADD_TRACTS_TOA_SHAPE } from "graphQL/useMutationAddTractsToAShape";
import { tableGlobalController } from "hookstate/tableController";

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
}));

function AddTractUnitDialog(props) {
  const classes = useStyles();
  const { control, reset } = useForm();

  const [loading, setLoading] = useState(false);
  const [selectedShapeLayer, setSelectedShapeLayer] = useState(null);

  const [addShapeTract] = useMutation(ADD_TRACTS_TOA_SHAPE, {
    onCompleted: () => {
      setLoading(false);
      handleClose();
      tableGlobalController.refetch();
    },
    refetchQueries: [
      "getESPaginatedList",
      "getESSimpleSearch",
      "getESFilterList",
    ],
    awaitRefetchQueries: true,
  });

  useEffect(() => {
    if (selectedShapeLayer?.shapeJson) {
      reset({
        ...selectedShapeLayer?.shapeJson?.properties,
        qualifier: selectedShapeLayer?.shapeJson?.properties?.qualifier?.name,
        reviewer: selectedShapeLayer?.shapeJson?.properties?.reviewer?.name,
        campaignNames:
          selectedShapeLayer?.shapeJson?.properties?.campaignName?.join(", "),
      });
    }
  }, [selectedShapeLayer]);

  const handleClose = () => {
    setSelectedShapeLayer(null);
    reset({});
    props.onClose();
  };

  const handleSave = () => {
    setLoading(true);
    addShapeTract({
      variables: {
        shapeTracts: [
          {
            shapeId: selectedShapeLayer._id,
            ...props.selectedTract,
          },
        ],
        shapeType: "Unit",
      },
    });
  };

  return (
    <>
      <RightDialog
        open={props.open}
        handleClickDialogClose={handleClose}
        width={props.width}
      >
        <div style={{ padding: "30px", width: "500px" }}>
          <Grid item xs={12} style={{ minHeight: "35px" }}>
            <h4
              style={{
                margin: "0 0 15px 0",
                float: "left",
                fontSize: "1.1rem",
              }}
            >
              Add Related Unit to Tract
            </h4>
            <div style={{ float: "right" }}>
              <IconButton onClick={handleClose} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>
          </Grid>

          <div>
            <Box mt={2}>
              <Typography>
                Search for existing unit to associate to the tract
              </Typography>
            </Box>

            <AutoCompleteShapeLayer
              shapeType="unit"
              setSelectedShapeLayer={setSelectedShapeLayer}
            />
            <Controller
              as={TextField}
              control={control}
              variant="outlined"
              margin="dense"
              name="uName"
              label={"Unit Name"}
              InputLabelProps={{ shrink: true }}
              fullWidth
              disabled
              defaultValue={""}
            />
            <Controller
              as={TextField}
              control={control}
              variant="outlined"
              margin="dense"
              name="uNumber"
              label={"Unit Number"}
              InputLabelProps={{ shrink: true }}
              fullWidth
              disabled
              defaultValue={""}
            />
            <Controller
              as={TextField}
              control={control}
              variant="outlined"
              margin="dense"
              name="uType"
              label={"Unit Type"}
              InputLabelProps={{ shrink: true }}
              fullWidth
              disabled
              defaultValue={""}
            />
            <Controller
              as={TextField}
              control={control}
              variant="outlined"
              margin="dense"
              name="uStatus"
              label={"Unit Status"}
              InputLabelProps={{ shrink: true }}
              fullWidth
              disabled
              defaultValue={""}
            />
            <Controller
              as={TextField}
              control={control}
              variant="outlined"
              margin="dense"
              name="uAcres"
              label={"Unit Acres"}
              InputLabelProps={{ shrink: true }}
              fullWidth
              disabled
              defaultValue={""}
            />
            <Controller
              as={TextField}
              control={control}
              variant="outlined"
              margin="dense"
              name="uPrimaryOperator"
              label={"Current Operator"}
              InputLabelProps={{ shrink: true }}
              fullWidth
              disabled
              defaultValue={""}
            />
            <Controller
              as={TextField}
              control={control}
              variant="outlined"
              margin="dense"
              name="uUnitPricing"
              label={"Target Unit Pricing (per NRA)"}
              InputLabelProps={{ shrink: true }}
              fullWidth
              disabled
              defaultValue={""}
            />
            <Controller
              as={TextField}
              control={control}
              variant="outlined"
              margin="dense"
              name="uMaxUnitPricing"
              label={"Max Unit Pricing (per NRA)"}
              InputLabelProps={{ shrink: true }}
              fullWidth
              disabled
              defaultValue={""}
            />
            <Controller
              as={TextField}
              control={control}
              variant="outlined"
              margin="dense"
              name="qualifier"
              label={"Qualifier"}
              InputLabelProps={{ shrink: true }}
              fullWidth
              disabled
              defaultValue={""}
            />
            <Controller
              as={TextField}
              control={control}
              variant="outlined"
              margin="dense"
              name="reviewer"
              label={"Reviewer"}
              InputLabelProps={{ shrink: true }}
              fullWidth
              disabled
              defaultValue={""}
            />
            <Controller
              as={TextField}
              control={control}
              variant="outlined"
              margin="dense"
              name="campaignNames"
              label={"Campaign"}
              InputLabelProps={{ shrink: true }}
              fullWidth
              disabled
              defaultValue={""}
            />
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

export default AddTractUnitDialog;
