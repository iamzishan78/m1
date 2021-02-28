import React, { useState, useEffect, useContext, useRef } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import uuid from "uuid";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import { AppContext } from "../../../../../AppContext";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { CircularProgress, Dialog, Typography } from "@material-ui/core";
import RightDialog from "../../RightDialog";
import { useDispatch, useSelector } from "react-redux";
import { showErrorMessage, showSuccessMessage } from "../../../../../actions";

const useStyles = makeStyles((theme) => ({
  
}));

function AddWellInterestDialog(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  
  const [stateApp, setStateApp] = useContext(AppContext);
  const [foundWells, setFoundWells] = useState([]);
  const [selectedWell, setSelectedWell] = useState(null);
  const [newOwner, setNewOwner] = useState({
    name: "",
  });

  const handleNewOwnerChange = e => {
    const { name, value } = e.target;
    console.log("handleNewOwnerChange name", name);
    console.log("handleNewOwnerChange value", value);
    setNewOwner(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleClose = () => {
    console.log("handleClose");
    console.log("newOwner", newOwner);
    setStateApp((stateApp) => ({
      ...stateApp,
      wellInterestDialog: false,
    }));
  }

  return (
    <>
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
                float: "left",
                fontSize: "1.1rem",
              }}
            >
              Add Well Interest
            </h4>
            <div style={{ float: "right" }}>
              <IconButton
                onClick={handleClose}
                size="small"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>
          </Grid>

          <div>
            <FormControl
              variant="outlined"
              fullWidth
              //className={classes.inputField}
              size="small"
            >
              <Autocomplete
                //className={classes.fieldWidth}
                options={foundWells}
                onChange={(e, well) => {
                  setSelectedWell(well);
                }}
                //value={users.find((user) => user?.value === ownerId) || null}
                //getOptionLabel={(option) => option.text}
                //getOptionSelected={(option) => option.value === ownerId}
                renderInput={(params) => (
                  <TextField
                    margin="dense"
                    {...params}
                    variant="outlined"
                    label="Search for a well by name or API"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </FormControl>

            <TextField
              variant="outlined"
              margin="dense"
              value={selectedWell?.name}
              label="Well Name"
              fullWidth
              disabled
              //className={classes.inputField}
            />

            <TextField
              variant="outlined"
              margin="dense"
              value={selectedWell?.api}
              label="API Number"
              fullWidth
              disabled
              //className={classes.inputField}
            />

            <TextField
              variant="outlined"
              margin="dense"
              value={selectedWell?.lease}
              label="Lease Name"
              fullWidth
              disabled
              //className={classes.inputField}
            />

            <TextField
              variant="outlined"
              margin="dense"
              value={selectedWell?.acres}
              label="Lease Acres"
              fullWidth
              disabled
              //className={classes.inputField}
            />
          </div>

          <div>
            <h4
              style={{
                //margin: "0 0 15px 0",
                //float: "left",
                //fontSize: "1.1rem",
              }}
            >
              Enter information for new interest owner
            </h4>

            <TextField
              variant="outlined"
              margin="dense"
              value={newOwner.name}
              name="name"
              onChange={handleNewOwnerChange}
              label="Interest Owner Name"
              fullWidth
              //className={classes.inputField}
            />

<FormControl
              variant="outlined"
              fullWidth
              //className={classes.inputField}
              size="small"
            >
              <Autocomplete
                //className={classes.fieldWidth}
                options={foundWells}
                onChange={(e, well) => {
                  setSelectedWell(well);
                }}
                //value={users.find((user) => user?.value === ownerId) || null}
                //getOptionLabel={(option) => option.text}
                //getOptionSelected={(option) => option.value === ownerId}
                renderInput={(params) => (
                  <TextField
                    margin="dense"
                    {...params}
                    variant="outlined"
                    label="Search for a well by name or API"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </FormControl>
          </div>

        </div>
      </RightDialog>
    </>
  );
}

export default AddWellInterestDialog;
