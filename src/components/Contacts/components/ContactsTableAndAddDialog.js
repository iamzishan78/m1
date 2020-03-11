import React, { useContext, useState, useEffect } from "react";
import RightDialog from "./RightDialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";
import M1nTable from "../../Shared/M1nTable/M1nTable";
import { Grid } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "../../../AppContext"; ///////////

const useStyles = makeStyles(theme => ({
  maxWidth: {
    width: "100%"
  }
}));

export default function ContactsTableAndAddDialog() {
  const classes = useStyles();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [stateApp, setStateApp] = useContext(AppContext); /////////

  const handleClickDialogOpen = e => {
    e.preventDefault();
    setDialogOpen(true);
  };
  const handleClickDialogClose = e => {
    e.preventDefault();
    setDialogOpen(false);
  };

  return (
    <div>
      <M1nTable
        parent="Contacts"
        // selectedWell={stateApp.selectedWell}
        externalAddFunction={handleClickDialogOpen}
      />

      <RightDialog
        open={dialogOpen}
        handleClickDialogClose={handleClickDialogClose}
        width="300px"
        header="Add a new Contact"
      >
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                size="small"
                className={classes.maxWidth}
                label="Name"
                multiline
                variant="outlined"
                // value={}
                // onChange={e => {}}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                className={classes.maxWidth}
                label="Last Name"
                multiline
                variant="outlined"
                // value={}
                // onChange={e => {}}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                className={classes.maxWidth}
                label="Email"
                multiline
                variant="outlined"
                // value={}
                // onChange={e => {}}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                className={classes.maxWidth}
                label="Phone"
                multiline
                variant="outlined"
                // value={}
                // onChange={e => {}}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                className={classes.maxWidth}
                label="Account"
                multiline
                variant="outlined"
                // value={}
                // onChange={e => {}}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                className={classes.maxWidth}
                label="Work Phone"
                multiline
                variant="outlined"
                // value={}
                // onChange={e => {}}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                className={classes.maxWidth}
                label="Mobile Phone"
                multiline
                variant="outlined"
                // value={}
                // onChange={e => {}}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                className={classes.maxWidth}
                label="Job Title"
                multiline
                variant="outlined"
                // value={}
                // onChange={e => {}}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                className={classes.maxWidth}
                label="Deparment"
                multiline
                variant="outlined"
                // value={}
                // onChange={e => {}}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                className={classes.maxWidth}
                label="Asigned To"
                multiline
                variant="outlined"
                // value={}
                // onChange={e => {}}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                className={classes.maxWidth}
                label="Status"
                multiline
                variant="outlined"
                // value={}
                // onChange={e => {}}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                className={classes.maxWidth}
                label="Do Not Disturb"
                multiline
                variant="outlined"
                // value={}
                // onChange={e => {}}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                className={classes.maxWidth}
                label="Addres"
                multiline
                variant="outlined"
                // value={}
                // onChange={e => {}}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                className={classes.maxWidth}
                label="Zipcode"
                multiline
                variant="outlined"
                // value={}
                // onChange={e => {}}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickDialogClose} color="primary">
            Cancel
          </Button>
          <Button color="secondary">Save</Button>
        </DialogActions>
      </RightDialog>
    </div>
  );
}
