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
// import { useLazyQuery } from "@apollo/client";
// import { WELLOWNERSQUERY } from "../../../graphQL/useQueryWellOwners";
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

  return (
    <div>
      <div className={classes.divTable}>
        <M1nTable
          parent="Contacts"
        />
      </div>
    </div>
  );
}
