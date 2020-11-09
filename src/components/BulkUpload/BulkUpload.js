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
      label: "Title",
      mapped_key: "",
      required: false,
      actual_key: "title",
    },
    {
      label: "First Name",
      mapped_key: "",
      required: false,
      actual_key: "firstName",
    },
    {
      label: "Middle Name",
      mapped_key: "",
      required: false,
      actual_key: "middleName",
    },
    {
      label: "Last Name",
      mapped_key: "",
      required: false,
      actual_key: "lastName",
    },
    {
      label: "Suffix",
      mapped_key: "",
      required: false,
      actual_key: "suffix",
    },
    {
      label: "Primary Address 1",
      mapped_key: "",
      required: false,
      actual_key: "address1",
    },
    {
      label: "Primary Address 2",
      mapped_key: "",
      required: false,
      actual_key: "address2",
    },
    {
      label: "City",
      mapped_key: "",
      required: false,
      actual_key: "city",
    },
    {
      label: "Country",
      mapped_key: "",
      required: false,
      actual_key: "country",
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
      label: "Primary Home Phone",
      mapped_key: "",
      required: false,
      actual_key: "homePhone",
    },
    {
      label: "Primary Mobile Phone",
      mapped_key: "",
      required: false,
      actual_key: "mobilePhone",
    },
    {
      label: "Primary Work Phone",
      mapped_key: "",
      required: false,
      actual_key: "AltPhone",
    },
    {
      label: "Email 2",
      mapped_key: "",
      required: false,
      actual_key: "secondaryEmail",
    },

    {
      label: "LinkedIn Profile",
      mapped_key: "",
      required: false,
      actual_key: "linkedin",
    },
    {
      label: "Facebook Profile",
      mapped_key: "",
      required: false,
      actual_key: "facebook",
    },
    {
      label: "Twitter Profile",
      mapped_key: "",
      required: false,
      actual_key: "twitter",
    },
    {
      label: "Company Name",
      mapped_key: "",
      required: false,
      actual_key: "companyName",
    },
    {
      label: "Job Title",
      mapped_key: "",
      required: false,
      actual_key: "jobTitle",
    },
    {
      label: "Lead Stage",
      mapped_key: "",
      required: false,
      actual_key: "leadStage",
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
