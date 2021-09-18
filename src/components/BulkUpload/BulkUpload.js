import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { NavigationContext } from "../Navigation/NavigationContext";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Stepper from "./components/stepper";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "white",
  },
  header: {
    borderBottom: "1px solid rgba(224, 224, 224, 1)",
    backgroundColor: "#F2F2F2",
    minHeight: "64px",
    display: "flex",
    position: "relative",
    alignItems: "center",
  },
}));

export default function BulkUpload(props) {
  const [stateApp, setStateApp] = React.useContext(AppContext);
  const [stateNav, setStateNav] = React.useContext(NavigationContext);
  let history = useHistory();

  const checkModuleHistory = () => {
    return !!stateNav.bulkUploadFromMap;
  };

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
    {
      label: "Age",
      mapped_key: "",
      required: false,
      actual_key: "age",
    },
    {
      label: "Relative Names",
      mapped_key: "",
      required: false,
      actual_key: "relatives",
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
      label: "Country",
      mapped_key: "",
      required: false,
      actual_key: "country",
    },
    {
      label: "Primary Email",
      mapped_key: "",
      required: false,
      actual_key: "primaryEmail",
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
      label: "Primary Home Phone",
      mapped_key: "",
      required: false,
      actual_key: "homePhone",
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
      label: "Primary Mobile Phone",
      mapped_key: "",
      required: false,
      actual_key: "mobilePhone",
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
      label: "Primary Work Phone",
      mapped_key: "",
      required: false,
      actual_key: "AltPhone",
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
      label: "Industry Type",
      mapped_key: "",
      required: false,
      actual_key: "industryType",
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
      label: "Website",
      mapped_key: "",
      required: false,
      actual_key: "website",
    },
    {
      label: "Contact Owner",
      mapped_key: "",
      required: false,
      actual_key: "contactOwner",
    },
    // {
    //   label: "Comments",
    //   mapped_key: "",
    //   required: false,
    //   actual_key: "notes",
    // },
    // {
    //   label: "Lead Stage",
    //   mapped_key: "",
    //   required: false,
    //   actual_key: "leadStage",
    // },
    // {
    //   label: "Status",
    //   mapped_key: "",
    //   required: false,
    //   actual_key: "status",
    // },
    // {
    //   label: "Time Zone",
    //   mapped_key: "",
    //   required: false,
    //   actual_key: "timeZone",
    // },
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
      <div className={classes.header}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "left",
            paddingLeft: "25px",
          }}
        ></div>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          {checkModuleHistory() && (
            <Link
              style={{
                marginLeft: "5px",
                fontSize: "16px",
                cursor: "pointer",
              }}
              color="inherit"
              onClick={() => {
                setStateApp((stateApp) => ({
                  ...stateApp,
                  // parcelDetailCardOpen: false,
                }));

                history.push("/");

                setStateNav((stateApp) => ({
                  ...stateApp,
                  contactFromMap: false,
                }));
              }}
            >
              Map
            </Link>
          )}

          {console.log("CURRENT MAP BREADCRUMB")}

          <Typography
            style={{ color: "#18AADD", fontSize: "16px", marginLeft: "5px" }}
          >
            Interest Owner Upload
          </Typography>
        </Breadcrumbs>
      </div>
      <Stepper>{props.children}</Stepper>
    </div>
  );
}
