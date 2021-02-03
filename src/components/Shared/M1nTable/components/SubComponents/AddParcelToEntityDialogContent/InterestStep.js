import React, { useContext, useState, useEffect } from "react";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { Grid } from "@material-ui/core";
import { AppContext } from "../../../../../../AppContext";
import { Modals } from "../../../../../../styles/Modal";
import { useMutation, useLazyQuery } from "@apollo/client";
import { ADDOWNERTOAPARCEL } from "../../../../../../graphQL/useMutationAddOwnerToAParcel";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import {
  showErrorMessage,
  showSuccessMessage,
} from "../../../../../../actions";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import AutocompEntityNamesVirtualizeList from "../AutocompEntityNamesVirtualizeList";
import { ALLENTITYNAMESFORPARCEL } from "../../../../../../graphQL/useQueryAllEntityNamesToAddAsParcelOwner";
import CircularProgress from "@material-ui/core/CircularProgress";

const entities = [
  "Corporation",
  "Educational Institution",
  "Governmental Body",
  "Individual",
  "Non Profit",
  "Religious Institution",
  "Trust",
  "Unknown",
];
const types = [
  "Fee Interest",
  "Leasehold",
  "Mineral Interest",
  "Non-Executive Mineral Interest (NEMI)",
  "Overriding Royalty (ORRI)",
  "Royalty Interest (NPRI)",
  "Surface Rights",
  "Unknown",
  "Working Interest",
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

export default function InterestStep(props) {
  const dispatch = useDispatch();
  const [, setStateApp] = useContext(AppContext);
  const [newOwner, setNewOwner] = useState({
    entity: "Unknown",
    type: "Unknown",
    depthFrom: "",
    depthTo: "",
    interest: "",
    nma: "",
    nra: "",
    customLayer: props.customLayerId,
  });
  const [parcelOwnersRadioBValue, setParcelOwnersRadioBValue] = useState(
    "true"
  );

  const emptyStates = () => {
    setNewOwner({
      entity: "Unknown",
      type: "Unknown",
      depthFrom: "",
      depthTo: "",
      interest: "",
      nma: "",
      nra: "",
      customLayer: props.customLayerId,
    });
    setParcelOwnersRadioBValue("true");
  };

  const handleClickDialogClose = () => {
    props.onClose();
    emptyStates();
  };

  const handleClickAdd = (e) => {
    e.preventDefault();
    // if (nameAutValue) {
    //   const ownerToAdd = { ...newOwner };
    //   if (parcelOwnersRadioBValue === "true") {
    //     ownerToAdd.depthFrom = "All depths";
    //     ownerToAdd.depthTo = "All depths";
    //   }
    //   if (nameAutValue._id === "newEntity") ownerToAdd.name = nameAutValue.name;
    //   else ownerToAdd.ownerEntity = nameAutValue._id;

    //   addOwnerToAParcel({
    //     variables: {
    //       parcelOwner: ownerToAdd,
    //     },
    //     refetchQueries: [
    //       "getCustomLayer",
    //       "getAllEntityNamesToAddAsParcelOwner",
    //       "getContactParcelInterests",
    //     ],
    //     awaitRefetchQueries: true,
    //   });

    //   setStateApp((state) => ({ ...state, universalCircularLoaderAct: true }));
    // }
  };

  const classes = useStyles();

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={6}>
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
        <Grid item xs={6}>
          <h3>Type</h3>

          <Autocomplete
            options={types}
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
        <Grid item xs={12}>
          <RadioGroup
            row
            value={parcelOwnersRadioBValue}
            onChange={(event) => {
              setParcelOwnersRadioBValue(event.target.value);
            }}
          >
            <FormControlLabel
              value="true"
              control={<Radio />}
              label="All Depths"
            />
            <FormControlLabel
              value="false"
              control={<Radio />}
              label="Footages/Formations"
            />
          </RadioGroup>
        </Grid>

        {parcelOwnersRadioBValue === "false" && (
          <Grid item xs={6}>
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
        {parcelOwnersRadioBValue === "false" && (
          <Grid item xs={6}>
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
          <h3>Interest</h3>
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
}
