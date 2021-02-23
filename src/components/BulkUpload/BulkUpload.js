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
      label: "Campaign Name",
      mapped_key: "",
      required: false,
      actual_key: "campaignName",
    },
    {
      label: "City",
      mapped_key: "",
      required: false,
      actual_key: "city",
    },
    {
      label: "Comments",
      mapped_key: "",
      required: false,
      actual_key: "notes",
    },
    {
      label: "Company Name",
      mapped_key: "",
      required: false,
      actual_key: "companyName",
    },
    {
      label: "Country",
      mapped_key: "",
      required: false,
      actual_key: "country",
    },
    {
      label: "Email 2",
      mapped_key: "",
      required: false,
      actual_key: "secondaryEmail",
    },
    {
      label: "Email 3",
      mapped_key: "",
      required: false,
      actual_key: "email3",
    },
    {
      label: "Facebook Profile",
      mapped_key: "",
      required: false,
      actual_key: "facebook",
    },
    {
      label: "First Name",
      mapped_key: "",
      required: false,
      actual_key: "firstName",
    },
    {
      label: "Full Name",
      mapped_key: "",
      required: false,
      actual_key: "name",
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
      label: "Industry Type",
      mapped_key: "",
      required: false,
      actual_key: "industryType",
    },
    {
      label: "Job Title",
      mapped_key: "",
      required: false,
      actual_key: "jobTitle",
    },
    {
      label: "Last Name",
      mapped_key: "",
      required: false,
      actual_key: "lastName",
    },
    {
      label: "Lead Source",
      mapped_key: "",
      required: false,
      actual_key: "leadSource",
    },
    {
      label: "Lead Stage",
      mapped_key: "",
      required: false,
      actual_key: "leadStage",
    },
    {
      label: "LinkedIn Profile",
      mapped_key: "",
      required: false,
      actual_key: "linkedIn",
    },
    {
      label: "Middle Name",
      mapped_key: "",
      required: false,
      actual_key: "middleName",
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
      label: "Primary Email",
      mapped_key: "",
      required: false,
      actual_key: "primaryEmail",
    },
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
      label: "State",
      mapped_key: "",
      required: false,
      actual_key: "state",
    },
    {
      label: "Status",
      mapped_key: "",
      required: false,
      actual_key: "status",
    },
    {
      label: "Suffix",
      mapped_key: "",
      required: false,
      actual_key: "suffix",
    },
    {
      label: "Territory",
      mapped_key: "",
      required: false,
      actual_key: "territory",
    },
    {
      label: "Time Zone",
      mapped_key: "",
      required: false,
      actual_key: "timeZone",
    },
    {
      label: "Twitter Profile",
      mapped_key: "",
      required: false,
      actual_key: "twitter",
    },
    {
      label: "Website",
      mapped_key: "",
      required: false,
      actual_key: "website",
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
      label: "Zip",
      mapped_key: "",
      required: false,
      actual_key: "zip",
    },


    // {
    //   label: "Title",
    //   mapped_key: "",
    //   required: false,
    //   actual_key: "title",
    // },
    // {
    //   label: "Global Owner",
    //   mapped_key: "",
    //   required: false,
    //   actual_key: "globalOwner",
    // },
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
