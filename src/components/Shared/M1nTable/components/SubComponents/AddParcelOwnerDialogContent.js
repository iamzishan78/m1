import React, { useContext, useState, useEffect } from "react";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { Grid } from "@material-ui/core";
import { AppContext } from "../../../../../AppContext";
import { Modals } from "../../../../../styles/Modal";
import { useMutation } from "@apollo/react-hooks";
import { ADDOWNERTOAPARCEL } from "../../../../../graphQL/useMutationAddOwnerToAParcel";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { showErrorMessage, showSuccessMessage } from "../../../../../actions";

const entities = [
  "Religious Institutions",
  "Governmental Bodies",
  "Non Profits",
  "Trusts",
  "Corporations",
  "Educational Institutions",
  "Individuals",
  "Unknown",
];

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
}));

export default function AddParcelOwnerDialogContent(props) {
  const dispatch = useDispatch();
  const [, setStateApp] = useContext(AppContext);
  const [newOwner, setNewOwner] = useState({
    name: "",
    entity: "Unknown",
    type: "",
    allDepths: props.allDepths,
    depthFrom: "",
    depthTo: "",
    interest: "",
    nma: "",
    nra: "",
  });

  const [addOwnerToAParcel, { data: mutationData }] = useMutation(
    ADDOWNERTOAPARCEL
  );

  useEffect(() => {
    if (mutationData && mutationData.addOwnerToAParcel) {
      if (mutationData.addOwnerToAParcel.success) {
        dispatch(
          showSuccessMessage(
            newOwner.name
              ? `${newOwner.name} was successfully added`
              : "The owner was successfully added"
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
  }, [mutationData]);

  const emptyStates = () => {
    setNewOwner({
      name: "",
      entity: "UNKNOWN",
      type: "",
      allDepths: true,
      depthFrom: "",
      depthTo: "",
      interest: "",
      nma: "",
      nra: "",
    });
  };

  const handleClickDialogClose = () => {
    props.onClose();
    emptyStates();
  };

  const handleClickAdd = (e) => {
    e.preventDefault();

    addOwnerToAParcel({
      variables: {
        customLayerId: props.customLayerId,
        owner: newOwner,
      },
      refetchQueries: ["getCustomLayer"],
      awaitRefetchQueries: true,
    });

    setStateApp((state) => ({ ...state, universalCircularLoaderAct: true }));
  };

  const addNew = () => {
    return (
      <React.Fragment>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <h3>Name</h3>
            <TextField
              size="small"
              placeholder="E.g. Jacob"
              className={classes.maxWidth}
              multiline
              value={newOwner.name}
              onChange={(e) => {
                setNewOwner({
                  ...newOwner,
                  name: e.target.value,
                });
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <h3>Entity</h3>
            <Autocomplete
              options={entities}
              getOptionLabel={(option) => option}
              value={newOwner.entity}
              onChange={(e, newInputValue) => {
                setNewOwner({
                  ...newOwner,
                  entity: newInputValue ? newInputValue : "",
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  className={classes.maxWidth}
                  multiline
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <h3>Type</h3>

            <Autocomplete
              options={[""]}
              getOptionLabel={(option) => option}
              value={newOwner.type}
              onChange={(e, newInputValue) => {
                setNewOwner({
                  ...newOwner,
                  type: newInputValue ? newInputValue : "",
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  className={classes.maxWidth}
                  multiline
                />
              )}
            />
          </Grid>

          {!props.allDepths && (
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
          {!props.allDepths && (
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

          <Grid item xs={4}>
            <h3>interest</h3>
            <TextField
              size="small"
              className={classes.maxWidth}
              multiline
              value={newOwner.interest}
              onChange={(e) => {
                setNewOwner({
                  ...newOwner,
                  interest: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <h3>NMA</h3>
            <TextField
              size="small"
              className={classes.maxWidth}
              multiline
              value={newOwner.nma}
              onChange={(e) => {
                setNewOwner({
                  ...newOwner,
                  nma: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <h3>NRA</h3>
            <TextField
              size="small"
              className={classes.maxWidth}
              multiline
              value={newOwner.nra}
              onChange={(e) => {
                setNewOwner({
                  ...newOwner,
                  nra: e.target.value,
                });
              }}
            />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  };

  const classes = useStyles();
  const modalClass = Modals();

  return (
    <React.Fragment>
      <DialogTitle className={modalClass.title} id="customized-dialog-title">
        Add an Owner
        <HighlightOffIcon
          fontSize="large"
          className={modalClass.titleClose}
          onClick={props.onClose}
        />
      </DialogTitle>
      <DialogContent dividers className={classes.dialogContent}>
        {addNew()}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClickDialogClose} color="primary">
          Cancel
        </Button>
        <Button
          disabled={!newOwner.name || newOwner.name === ""}
          onClick={handleClickAdd}
          color="secondary"
        >
          Add
        </Button>
      </DialogActions>
    </React.Fragment>
  );
}
