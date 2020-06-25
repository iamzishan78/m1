import React, { useContext, useState, useEffect } from "react";
import RightDialog from "./RightDialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import M1nTable from "../../Shared/M1nTable/M1nTable";
import { Grid } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "../../../AppContext"; ///////////
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useLazyQuery } from "@apollo/react-hooks";
import { WELLOWNERSQUERY } from "../../../graphQL/useQueryWellOwners";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";

const useStyles = makeStyles((theme) => ({
  maxWidth: {
    width: "100%",
  },
  divTable: {
    paddingTop: "10px",
    paddingBottom: "10px",
    paddingLeft: "32px",
    paddingRight: "32px",
    //backgroundColor: "#fff"
  },
}));

export default function ContactsTableAndAddDialog() {
  const classes = useStyles();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [stateApp, setStateApp] = useContext(AppContext); /////////
  const [validated, setValidated] = useState(false);
  const [ifNewContact, setIfNewContact] = useState("");

  const [wellId, setWellId] = useState("");
  const [ownerName, setOwnerName] = useState("");

  const [newContact, setNewContact] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    mobilePhone: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zipcode: "",
    assignedTo: "",
  });

  const emptyStates = () => {
    setWellId("");
    setOwnerName("");
    setNewContact({
      name: "",
      lastName: "",
      email: "",
      phone: "",
      mobilePhone: "",
      address: "",
      address2: "",
      city: "",
      state: "",
      zipcode: "",
      assignedTo: "",
    });
  };

  // const handleClickDialogOpen = (e) => {
  //   e.preventDefault();
  //   setDialogOpen(true);
  // };
  // const handleClickDialogClose = (e) => {
  //   e.preventDefault();
  //   setDialogOpen(false);
  //   setIfNewContact();
  //   emptyStates();
  // };

  // const handleClickAdd = (e) => {
  //   e.preventDefault();

  //   /////addddddd{}
  //   handleClickDialogClose(e);
  // };

  useEffect(() => {
    if (
      (ifNewContact === "Add A Well Owner" && ownerName !== "") ||
      ifNewContact === "Add A New"
    ) {
      setValidated(true);
    } else {
      setValidated(false);
    }
  }, [ifNewContact, ownerName]); ///////////add other inputs

  useEffect(() => {
    emptyStates();
  }, [ifNewContact]);

  const [
    getWellOwners,
    { loading: loadingWellOwners, data: dataWellOwners },
  ] = useLazyQuery(WELLOWNERSQUERY);

  useEffect(() => {
    if (wellId !== "") {
      getWellOwners({
        variables: { id: wellId },
      });
    }
  }, [wellId]);

  // const ifNewContactFromOwner = () => {
  //   return (
  //     <div>
  //       <Grid container spacing={2}>
  //         <Grid item xs={12}>
  //           <TextField
  //             size="small"
  //             className={classes.maxWidth}
  //             label="Well API Number"
  //             multiline
  //             variant="outlined"
  //             value={wellId}
  //             onChange={(e) => {
  //               setOwnerName("");
  //               setWellId(e.target.value);
  //             }}
  //           />
  //         </Grid>
  //         <Grid item xs={12}>
  //           <Autocomplete
  //             size="small"
  //             className={classes.maxWidth}
  //             options={
  //               dataWellOwners && dataWellOwners.wellOwners
  //                 ? dataWellOwners.wellOwners
  //                 : []
  //             }
  //             getOptionLabel={(option) => (option.name ? option.name : "")}
  //             autoComplete
  //             autoSelect
  //             disableClearable
  //             includeInputInList
  //             value={ownerName}
  //             disabled={!dataWellOwners}
  //             onChange={(e, newValue) => {
  //               setOwnerName(newValue === null ? "" : newValue);
  //             }}
  //             renderInput={(params) => (
  //               <TextField
  //                 {...params}
  //                 label="Owners"
  //                 variant="outlined"
  //                 fullWidth
  //                 multiline
  //               />
  //             )}
  //           />
  //         </Grid>
  //       </Grid>
  //     </div>
  //   );
  // };

  return (
    <div>
      <div className={classes.divTable}>
        <M1nTable
          parent="Contacts"
        />
      </div>
      {/* <RightDialog
        open={dialogOpen}
        handleClickDialogClose={handleClickDialogClose}
        width="300px"
      >
        <DialogTitle id="alert-dialog-slide-title">
          Add a Contact
          <FormControl component="fieldset">
            <RadioGroup
              value={ifNewContact}
              onChange={(e) => {
                setIfNewContact(e.target.value);
              }}
            >
              <FormControlLabel
                value="Add A New"
                control={<Radio />}
                label="Add A New"
              />
              <FormControlLabel
                value="Add A Well Owner"
                control={<Radio />}
                label="Add A Well Owner"
              />
            </RadioGroup>
          </FormControl>
        </DialogTitle>
        <DialogContent>
          {ifNewContact === "Add A Well Owner" && ifNewContactFromOwner()}
          {ifNewContact === "Add A New" && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  size="small"
                  className={classes.maxWidth}
                  label="Name"
                  multiline
                  variant="outlined"
                  value={newContact.name}
                  onChange={(e) => {
                    setNewContact({
                      ...newContact,
                      name: e.target.value,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  size="small"
                  className={classes.maxWidth}
                  label="Last Name"
                  multiline
                  variant="outlined"
                  value={newContact.lastName}
                  onChange={(e) => {
                    setNewContact({
                      ...newContact,
                      lastName: e.target.value,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  size="small"
                  className={classes.maxWidth}
                  label="Email"
                  multiline
                  variant="outlined"
                  value={newContact.email}
                  onChange={(e) => {
                    setNewContact({
                      ...newContact,
                      email: e.target.value,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  size="small"
                  className={classes.maxWidth}
                  label="Phone"
                  multiline
                  variant="outlined"
                  value={newContact.phone}
                  onChange={(e) => {
                    setNewContact({
                      ...newContact,
                      phone: e.target.value,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  size="small"
                  className={classes.maxWidth}
                  label="Mobile Phone"
                  multiline
                  variant="outlined"
                  value={newContact.mobilePhone}
                  onChange={(e) => {
                    setNewContact({
                      ...newContact,
                      mobilePhone: e.target.value,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  size="small"
                  className={classes.maxWidth}
                  label="Address"
                  multiline
                  variant="outlined"
                  value={newContact.address}
                  onChange={(e) => {
                    setNewContact({
                      ...newContact,
                      address: e.target.value,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  size="small"
                  className={classes.maxWidth}
                  label="Address Line2"
                  multiline
                  variant="outlined"
                  value={newContact.address2}
                  onChange={(e) => {
                    setNewContact({
                      ...newContact,
                      address2: e.target.value,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  size="small"
                  className={classes.maxWidth}
                  label="City"
                  multiline
                  variant="outlined"
                  value={newContact.city}
                  onChange={(e) => {
                    setNewContact({
                      ...newContact,
                      city: e.target.value,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  size="small"
                  className={classes.maxWidth}
                  label="State"
                  multiline
                  variant="outlined"
                  value={newContact.state}
                  onChange={(e) => {
                    setNewContact({
                      ...newContact,
                      state: e.target.value,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  size="small"
                  className={classes.maxWidth}
                  label="Zipcode"
                  multiline
                  variant="outlined"
                  value={newContact.zipcode}
                  onChange={(e) => {
                    setNewContact({
                      ...newContact,
                      zipcode: e.target.value,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  size="small"
                  className={classes.maxWidth}
                  label="Assigned To"
                  multiline
                  variant="outlined"
                  value={newContact.assignedTo}
                  onChange={(e) => {
                    setNewContact({
                      ...newContact,
                      assignedTo: e.target.value,
                    });
                  }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickDialogClose} color="primary">
            Cancel
          </Button>
          {ifNewContact && (
            <Button
              disabled={!validated}
              onClick={handleClickAdd}
              color="secondary"
            >
              Add
            </Button>
          )}
        </DialogActions>
      </RightDialog> */}
    </div>
  );
}
