import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { matchRoutes } from "react-router-config";
import { AppContext } from "../../AppContext";
import { NavigationContext } from "../Navigation/NavigationContext";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Stepper from "./components/stepper";
import { Menu, MenuItem } from "@material-ui/core";
import M1neral_headers from "./jobHeaders";
import FeatureFlag from "components/Shared/FeatureFlag/FeatureFlagComponent";
import { FEATURES } from "components/Shared/FeatureFlag/common";
import isEmpty from 'lodash/isEmpty'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "white",
    top: "64px",
    position: "relative",
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

export const rawJobs = [
  { name: 'Import Contacts', type: 'CONTACTS' },
  { name: 'Import Contact Well Interests', type: 'CONTACTS_WELL_INTEREST' },
  { name: 'Interest Owner Upload', type: 'PARCELINTERESTS' },
  { name: 'Shape Owner Upload', type: 'SHAPEOWNER' },
  { name: 'Import Tracts', type: 'TRACTS', featureFlag: "TRACTIMPORT" },
  { name: 'Import Units', type: 'UNITS', featureFlag: "UNITIMPORT" },
  { name: 'Check Detail Upload', type: 'CHECKDETAILS' },
  { name: 'Property Upload', type: 'PROPERTIES' },
  { name: 'Agreement Upload (Header)', type: 'AGREEMENT_HEADER', redirectTo: '/land/agreements' },
  { name: 'Comment Uploader', type: 'AGREEMENT_COMMENTS' },
  { name: 'Agreement Upload (Provisions)', type: 'AGREEMENT_PROVISIONS' },
  { name: 'Agreement Upload (Related Well)', type: 'AGREEMENT_RELATED_WELLS' },
  { name: 'Agreement Upload (Related Tracts)', type: 'AGREEMENT_RELATED_TRACTS' },
  { name: 'Transfer Shape to M1 Layer', type: 'SHAPE_TO_M1_LAYER', initialActiveStepNumber: 1, skipReview: true }
]

export default function BulkUpload(props) {
  const [stateApp, setStateApp] = React.useContext(AppContext);
  const [stateNav, setStateNav] = React.useContext(NavigationContext);
  const history = useHistory();
  let previousRoute = matchRoutes(props.routes, typeof history.pathHistory[1] === "string" ? history.pathHistory[1] : history?.pathHistory[1]?.pathname ?? "");

  if (!isEmpty(history.location.state)) {
    previousRoute[0].match = { url: history.location.state.previousRoute }
    previousRoute[0].route = { title: history.location.state.title }
  }

  const jobs = rawJobs.filter((job) => {
    let filter = true;
    switch (job.type) {
      case "CONTACTS":
        filter = stateNav.bulkUploadFromMap ? false : true;
        break;
      case 'CONTACTS_WELL_INTEREST':
        filter = stateNav.bulkUploadFromMap ? false : true;
        break;
      case "PARCELINTERESTS":
        filter = stateNav.bulkUploadParcel ? true : false;
        break;
      case "SHAPEOWNER":
        filter = stateNav.bulkUploadShape ? true : false;
        break;
      default:
        break;
    }
    return filter;
  });
  let initialJob = jobs[0];
  if (props?.match?.params?.type) {
    initialJob = jobs.find((job) => job.type.toLowerCase().includes(props.match.params.type.toLowerCase())) || jobs[0];
  }

  if (initialJob.type === 'SHAPE_TO_M1_LAYER' && stateApp.transferData) {
    initialJob.m1neralHeaders = stateApp.transferData.selectedSourceCategory.m1neralHeaders
    initialJob.mappedHeadersFromCSV = stateApp.transferData.selectedSourceCategory.mappedHeadersFromCSV
  }

  const [selectedJob, setSelectedJob] = useState(initialJob);
  const [showIcon, setShowIcon] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    reset_state();
    return function cleanup() {
      setStateNav((state) => ({
        ...state,
        bulkUploadFromMap: false,
        bulkUploadFromContacts: false,
        bulkUploadParcel: null,
      }));
    };
  }, []);

  useEffect(() => {
    reset_state();
  }, [selectedJob]);

  const reset_state = () => {
    setStateApp((state) => ({
      ...state,
      csvDataToSend: [],
      activeStepNumber: selectedJob.initialActiveStepNumber || 0,
      csvDataList: [],
      job: selectedJob,
      jobType: selectedJob.type,
      m1neralHeaders: selectedJob.m1neralHeaders || M1neral_headers[selectedJob.type] || [],
      mappedHeadersFromCSV: selectedJob.mappedHeadersFromCSV || [],
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
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
          {previousRoute[0] && (
            <Link
              style={{
                marginLeft: "5px",
                fontSize: "16px",
                cursor: "pointer",
              }}
              color="inherit"
              onClick={() => {
                setStateNav((stateApp) => ({
                  ...stateApp,
                  bulkUploadFromMap: false,
                }));
                history.push(previousRoute[0]?.match?.url);
              }}
            >
              {previousRoute[0]?.route?.title}
            </Link>
          )}
          {stateNav.bulkUploadParcel?.shapeLabel && (
            <Link
              style={{
                marginLeft: "5px",
                fontSize: "16px",
                cursor: "pointer",
              }}
              color="inherit"
              onClick={() => {
                setStateNav((stateApp) => ({
                  ...stateApp,
                  bulkUploadFromMap: false,
                }));

                history.push(previousRoute[0]?.match?.url);
              }}
            >
              {stateNav.bulkUploadParcel?.shapeLabel}
            </Link>
          )}
          {stateNav.bulkUploadShape?.shapeLabel && (
            <Link
              style={{
                marginLeft: "5px",
                fontSize: "16px",
                cursor: "pointer",
              }}
              color="inherit"
              onClick={() => {
                setStateNav((stateApp) => ({
                  ...stateApp,
                  bulkUploadFromMap: false,
                }));

                history.push(previousRoute[0]?.match?.url);
              }}
            >
              {stateNav.bulkUploadShape?.shapeLabel}
            </Link>
          )}
          <div>
            <div
              style={{
                display: "flex",
                color: "#18AADD",
                fontSize: "16px",
                cursor: "pointer",
              }}
              onClick={(event) => {
                handleClick(event);
              }}
              onMouseOver={() => setShowIcon(true)}
              onMouseLeave={() => setShowIcon(false)}
            >
              <Typography style={{ color: "#18AADD", fontSize: "16px", marginLeft: "5px" }}>
                {selectedJob.name}
                <span
                  style={{
                    height: "0px",
                    color: "#18AADD",
                    fontSize: "16px",
                    cursor: "pointer",
                    "vertical-align": "middle",
                  }}
                >
                  {showIcon && <ExpandMoreIcon />}
                </span>
              </Typography>
              <Menu
                style={{ zIndex: "1305" }}
                id="menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={(e) => {
                  e.stopPropagation();
                  handleClose();
                }}
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
              >
                {jobs.map((job) => (
                  <FeatureFlag feature={FEATURES[job.featureFlag]} noCheck={!FEATURES[job.featureFlag]}>
                    <MenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClose();
                        setSelectedJob(job);
                      }}
                    >
                      {job.name}
                    </MenuItem>
                  </FeatureFlag>
                ))}
              </Menu>
            </div>
          </div>
        </Breadcrumbs>
      </div>
      <Stepper {...{ routes: props.routes, selectedJob, setSelectedJob }}>{props.children}</Stepper>
    </div>
  );
}
