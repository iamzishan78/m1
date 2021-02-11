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
      label: "Full Name",
      mapped_key: "",
      required: false,
      actual_key: "name",
    },
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
      label: "Last Name",
      mapped_key: "",
      required: false,
      actual_key: "lastName",
    },
    {
      label: "Middle Name",
      mapped_key: "",
      required: false,
      actual_key: "middleName",
    },
    {
      label: "Suffix",
      mapped_key: "",
      required: false,
      actual_key: "suffix",
    },
    // {
    //   label: "Global Owner",
    //   mapped_key: "",
    //   required: false,
    //   actual_key: "globalOwner",
    // },
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
      label: "Primary Mobile Phone",
      mapped_key: "",
      required: false,
      actual_key: "mobilePhone",
    },
    {
      label: "Primary Home Phone",
      mapped_key: "",
      required: false,
      actual_key: "homePhone",
    },
    {
      label: "Primary Email",
      mapped_key: "",
      required: false,
      actual_key: "primaryEmail",
    },
    // {
    //   label: "Created By",
    //   mapped_key: "",
    //   required: false,
    //   actual_key: "createBy",
    // },
    // {
    //   label: "Last Update",
    //   mapped_key: "",
    //   required: false,
    //   actual_key: "lastUpdate",
    // },
    // {
    //   label: "Last Updated By",
    //   mapped_key: "",
    //   required: false,
    //   actual_key: "lastUpdateBy",
    // },
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
      actual_key: "linkedIn",
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
      label: "Lead Source",
      mapped_key: "",
      required: false,
      actual_key: "leadSource",
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
    {
      label: "Home Phone 2",
      mapped_key: "",
      required: false,
      actual_key: "homePhone2",
    },
    {
      label: "Home Phone 3",
      mapped_key: "",
      required: false,
      actual_key: "homePhone3",
    },
    {
      label: "Mobile Phone 2",
      mapped_key: "",
      required: false,
      actual_key: "mobilephone2",
    },
    {
      label: "Mobile Phone 3",
      mapped_key: "",
      required: false,
      actual_key: "mobilephone3",
    },
    {
      label: "Work Phone 2",
      mapped_key: "",
      required: false,
      actual_key: "AltPhone2",
    },
    {
      label: "Work Phone 3",
      mapped_key: "",
      required: false,
      actual_key: "AltPhone3",
    },
    {
      label: "Email 3",
      mapped_key: "",
      required: false,
      actual_key: "email3",
    },
    {
      label: "Status",
      mapped_key: "",
      required: false,
      actual_key: "status",
    },
    {
      label: "Time Zone",
      mapped_key: "",
      required: false,
      actual_key: "timeZone",
    },
    {
      label: "Territory",
      mapped_key: "",
      required: false,
      actual_key: "territory",
    },
    {
      label: "Campaign Name",
      mapped_key: "",
      required: false,
      actual_key: "campaignName",
    },
    {
      label: "Comments",
      mapped_key: "",
      required: false,
      actual_key: "notes",
    },
    {
      label: "Website",
      mapped_key: "",
      required: false,
      actual_key: "website",
    },
    {
      label: "Industry Type",
      mapped_key: "",
      required: false,
      actual_key: "industryType",
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
