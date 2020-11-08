import React, { useEffect } from "react";
import { AppContext } from "../../AppContext";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "./components/stepper";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "white",
  },
  header: {
    paddingTop: "25px",
    paddingBottom: "75px",
    paddingLeft: "20px",
  },
}));

export default function BulkUpload(props) {
  const [stateApp, setStateApp] = React.useContext(AppContext);

  useEffect(() => {
    reset_state();
  }, []);
  const M1neral_headers = [
    {
      label: "First Name",
      mapped_key: "",
      required: false,
      actual_key: "firstName",
    },
    {
      label: "Last Name",
      mapped_key: "",
      required: false,
      actual_key: "lastName",
    },
    // {
    //   label: "Full Name",
    //   mapped_key: "",
    //   required: false,
    //   actual_key: "name",
    // },
    {
      label: "Street Address",
      mapped_key: "",
      required: false,
      actual_key: "address1",
    },
    {
      label: "City",
      mapped_key: "",
      required: false,
      actual_key: "city",
    },
    {
      label: "State",
      mapped_key: "",
      required: false,
      actual_key: "state",
    },
    {
      label: "Zip",
      mapped_key: "",
      required: false,
      actual_key: "zip",
    },
    {
      label: "Primary Email",
      mapped_key: "",
      required: false,
      actual_key: "primaryEmail",
    },
    /////
    {
      label: "Home Phone",
      mapped_key: "",
      required: false,
      actual_key: "homePhone",
    },
    {
      label: "Mobile Phone",
      mapped_key: "",
      required: false,
      actual_key: "mobilePhone",
    },
    {
      label: "Work Phone",
      mapped_key: "",
      required: false,
      actual_key: "AltPhone",
    },
    {
      label: "Alternate Email 2",
      mapped_key: "",
      required: false,
      actual_key: "secondaryEmail",
    },
    {
      label: "Alternate Email 3",
      mapped_key: "",
      required: false,
      actual_key: "email3",
    },
    {
      label: "Alternate Home Phone 2",
      mapped_key: "",
      required: false,
      actual_key: "homePhone2",
    },
    {
      label: "Alternate Home Phone 3",
      mapped_key: "",
      required: false,
      actual_key: "homePhone3",
    },
    {
      label: "Alternate Mobile Phone 2",
      mapped_key: "",
      required: false,
      actual_key: "mobilephone2",
    },
    {
      label: "Alternate Mobile Phone 3",
      mapped_key: "",
      required: false,
      actual_key: "mobilephone3",
    },
    {
      label: "Alternate Work Phone 2",
      mapped_key: "",
      required: false,
      actual_key: "AltPhone2",
    },
    {
      label: "Alternate Work Phone 3",
      mapped_key: "",
      required: false,
      actual_key: "AltPhone3",
    },
  ];
  const reset_state = () => {
    setStateApp((state) => ({
      ...state,
      csvContactsListToSend: [],
      activeStepNumber: 0,
      csvContactsList: [],
      m1neralHeaders: M1neral_headers,
      mappedHeadersFromCSV: [],
    }));
  };
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Stepper>{props.children}</Stepper>
    </div>
  );
}
