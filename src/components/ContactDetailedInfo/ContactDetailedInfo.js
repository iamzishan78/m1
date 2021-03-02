import React, { useEffect, useState } from "react";
import MelissaTable from "./components/MelissaTable";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import FieldContent, {
  LinkTypes,
} from "./../ContactDetailCard/components/FieldContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import { anyToDate } from "@amcharts/amcharts4/.internal/core/utils/Utils";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import {
  MenuItem,
  Checkbox,
  Select,
  InputLabel,
  Grid,
  Button,
  FormControl,
  Typography,
  Box,
  FormControlLabel,
  FormGroup,
  Switch
} from "@material-ui/core";


const AntSwitch = withStyles((theme) => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    "&$checked": {
      transform: "translateX(12px)",
      color: theme.palette.common.white,
      "& + $track": {
        opacity: 1,
        backgroundColor: "#12ABE0",
        borderColor: "#12ABE0",
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: "none",
  },
  track: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.common.white,
  },
  checked: {},
}))(Switch);

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  avatar: {
    marginRight: "20px",
  },
  moreIcon: {
    color: "lightgray",
  },
  viewAll: {
    margin: "0 0 8px 22px",
    float: "right",
    color: theme.palette.secondary.main,
    cursor: "pointer",
    fontWeight: "normal",
    "&:hover": { color: "#757575" },
    transition: "color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  },
  viewAllCard: {
    display: "flex",
    justifyContent: "space-between",
  },
  inputField: {
    marginBottom: "30px",
  },
  textBtn: {
    margin: "0 0 8px 0",
    float: "right",
    color: theme.palette.secondary.main,
    cursor: "pointer",
    fontWeight: "normal",
    "&:hover": { color: "#757575" },
    transition: "color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  },
  label: {
    backgroundColor: "white",
  },
  activitiesList: {
    padding: "20px",
  },
  activitiesFilter: {
    padding: "20px 30px",
    borderLeft: "1px solid #9A9A9A",
    minWidth: "250px",
  },
  checkBox: {
    minHeight: "35px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  activityCardRight: {
    display: "flex",
  },
  activityStats: {
    margin: "20px 30px",
    padding: "30px",
    height: "fit-content",
    backgroundColor: "#FAFAEB",
  },
  activityScore: {
    border: "5px solid #F5A724",
    borderRadius: "50%",
    padding: "25px",
    textAlign: "center",
    fontSize: "2rem",
    marginBottom: "5px",
  },
  statsMessage: {
    color: "#7B7B7B",
    textAlign: "center",
  },
  dataSect: {
    borderTop: "2px solid #C9C9C9",
    // margin: "23px 28px",
    color: "#757575",
    width: "100%",
    "& p": {
      wordWrap: "break-word",
    },
    "& .dataLabels": {
      fontWeight: "bold",
    },
    "& > .MuiGrid-item": {
      borderBottom: "2px solid #C9C9C9",
      borderRight: "2px solid #C9C9C9",
      position: "relative",
    },
    "& .fieldName": {
      borderLeft: "2px solid #C9C9C9",
      backgroundColor: "#EBEBEB",
      "& p": { margin: "8px 10px" },
    },
    "& a": { color: "#757575" },
  },
  showAll: {
    margin: "8px 0 0 0",
    float: "right",
    color: theme.palette.secondary.main,
    cursor: "pointer",
    fontWeight: "normal",
    "&:hover": { color: "#757575" },
    transition: "color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  },
  switchButtom: {
    float: "right",
    width: "fit-content",
    alignSelf: "flex-end",
    marginRight: 0,
    "& span.MuiTypography-body1": {
      fontSize: "0.9rem",
      marginLeft: "5px"
    },
  },
  switchTextDeselected: {
    color: "rgb(141, 141, 141)",
  },
}));

export default function DetailInfo(props) {
  const [basicInfExp, setBasicInfExp] = useState(false);
  const [showEmpty, setShowEmpty] = useState(true);
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const basicInfoContent = {
    // "Full Name": {
    //   data: {
    //     title: props.contactData.title,
    //     firstName: props.contactData.firstName,
    //     middleName: props.contactData.middleName,
    //     lastName: props.contactData.lastName,
    //     suffix: props.contactData.suffix,
    //   },
    //   linkType: LinkTypes.None,
    // },
    "Primary Email": {
      data: { primaryEmail: props.contactData.primaryEmail },
      linkType: LinkTypes.Mail,
    },

    "Primary Mobile Phone": {
      data: { mobilePhone: props.contactData.mobilePhone },
      linkType: LinkTypes.None,
    },
    "Primary Home Phone": {
      data: { homePhone: props.contactData.homePhone },
      linkType: LinkTypes.None,
    },
    "Primary Work Phone": {
      data: { AltPhone: props.contactData.AltPhone },
      linkType: LinkTypes.None,
    },
    "Primary Address": {
      data: {
        address1: props.contactData.address1,
        address2: props.contactData.address2,
        city: props.contactData.city,
        state: props.contactData.state,
        zip: props.contactData.zip,
        country: props.contactData.country,
      },
      linkType: LinkTypes.None,
    },
    "Secondary Address": {
      data: {
        address1Alt: props.contactData.address1Alt,
        address2Alt: props.contactData.address2Alt,
        cityAlt: props.contactData.cityAlt,
        stateAlt: props.contactData.stateAlt,
        zipAlt: props.contactData.zipAlt,
        countryAlt: props.contactData.countryAlt,
      },
      linkType: LinkTypes.None,
    },
  };

  const lastUpdateByRow =
    props.contactData.lastUpdateBy &&
      props.contactData.lastUpdateBy.name === null ? (
        <span className={classes.userSmallLoader}>
          <CircularProgress size={22} color="secondary" />
        </span>
      ) : (props.contactData.lastUpdateBy &&
        props.contactData.lastUpdateBy.name) ||
        props.contactData.lastUpdateAt ? (
          `${props.contactData.lastUpdateBy && props.contactData.lastUpdateBy.name
            ? props.contactData.lastUpdateBy.name
            : ""
          }
    ${props.contactData.lastUpdateAt
            ? " - " + anyToDate(props.contactData.lastUpdateAt).toLocaleString()
            : ""
          }`
        ) : (
          <p className={classes.notAvailableP}>Not Available</p>
        );

  const createByRow =
    props.contactData.createBy && props.contactData.createBy.name === null ? (
      <span className={classes.userSmallLoader}>
        <CircularProgress size={22} color="secondary" />
      </span>
    ) : (props.contactData.createBy && props.contactData.createBy.name) ||
      props.contactData.createAt ? (
          `${props.contactData.createBy && props.contactData.createBy.name
            ? props.contactData.createBy.name
            : ""
          }
    ${props.contactData.createAt
            ? " - " + anyToDate(props.contactData.createAt).toLocaleString()
            : ""
          }`
        ) : (
          <p className={classes.notAvailableP}>Not Available</p>
        );

  const basicInfoExpContent = {
    "Email 2": {
      data: { secondaryEmail: props.contactData.secondaryEmail },
      linkType: LinkTypes.Mail,
    },
    "Email 3": {
      data: { email3: props.contactData.email3 },
      linkType: LinkTypes.None,
    },
    "Mobile Phone 2": {
      data: { mobilephone2: props.contactData.mobilephone2 },
      linkType: LinkTypes.None,
    },
    "Mobile Phone 3": {
      data: { mobilephone3: props.contactData.mobilephone3 },
      linkType: LinkTypes.None,
    },
    "Home Phone 2": {
      data: { homePhone2: props.contactData.homePhone2 },
      linkType: LinkTypes.None,
    },
    "Home Phone 3": {
      data: { homePhone3: props.contactData.homePhone3 },
      linkType: LinkTypes.None,
    },
    "Work Phone 2": {
      data: { AltPhone2: props.contactData.AltPhone2 },
      linkType: LinkTypes.None,
    },
    "Work Phone 3": {
      data: { AltPhone3: props.contactData.AltPhone3 },
      linkType: LinkTypes.None,
    },

    // Notes: {
    //   data: { notes: props.contactData.notes },
    //   linkType: LinkTypes.None,
    // },
    Website: {
      data: { website: props.contactData.website },
      linkType: LinkTypes.None,
    },

    "LinkedIn Profile": {
      data: { linkedIn: props.contactData.linkedIn },
      linkType: LinkTypes.Simple,
      // inner: props.contactData.linkedIn && (
      //   <a
      //     href={`${
      //       !props.contactData.linkedIn.startsWith("http") &&
      //       !props.contactData.linkedIn.startsWith("//")
      //         ? "//"
      //         : ""
      //     }${props.contactData.linkedIn}`}
      //     target="_blank"
      //   >
      //     {props.contactData.linkedIn}
      //   </a>
      // ),
    },
    "Facebook Profile": {
      data: { facebook: props.contactData.facebook },
      linkType: LinkTypes.Simple,
      // inner: props.contactData.facebook && (
      //   <a
      //     href={`${
      //       !props.contactData.facebook.startsWith("http") &&
      //       !props.contactData.facebook.startsWith("//")
      //         ? "//"
      //         : ""
      //     }${props.contactData.facebook}`}
      //     target="_blank"
      //   >
      //     {props.contactData.facebook}
      //   </a>
      // ),
    },
    "Twitter Profile": {
      data: { twitter: props.contactData.twitter },
      linkType: LinkTypes.Simple,
      // inner: props.contactData.twitter && (
      //   <a
      //     href={`${
      //       !props.contactData.twitter.startsWith("http") &&
      //       !props.contactData.twitter.startsWith("//")
      //         ? "//"
      //         : ""
      //     }${props.contactData.twitter}`}
      //     target="_blank"
      //   >
      //     {props.contactData.twitter}
      //   </a>
      // ),
    },

    "Relative Names": {
      data: { relatives: props.contactData.relatives },
      linkType: LinkTypes.None,
    },
    // "Company Name": {
    //   data: { companyName: props.contactData.companyName },
    //   linkType: LinkTypes.None,
    // },
    // "Job Title": {
    //   data: { jobTitle: props.contactData.jobTitle },
    //   linkType: LinkTypes.None,
    // },
    "Lead Stage": {
      data: { leadStage: props.contactData.leadStage },
      linkType: LinkTypes.None,
    },
    "Industry Type": {
      data: { industryType: props.contactData.industryType },
      linkType: LinkTypes.None,
    },

    "Campaign Name": {
      data: { campaignName: props.contactData.campaignName },
      linkType: LinkTypes.None,
    },
    "Lead Source": {
      data: { leadSource: props.contactData.leadSource },
      linkType: LinkTypes.None,
    },
    Status: {
      data: { status: props.contactData.status },
      linkType: LinkTypes.None,
    },
    "Time Zone": {
      data: { timeZone: props.contactData.timeZone },
      linkType: LinkTypes.None,
    },
    Territory: {
      data: { territory: props.contactData.territory },
      linkType: LinkTypes.None,
    },
    "Created By": {
      data: { createByRow },
      linkType: LinkTypes.None,
      inner: createByRow,
    },
    "Last Updated By": {
      data: { lastUpdateByRow },
      linkType: LinkTypes.None,
      inner: lastUpdateByRow,
    },
  };

  useEffect(() => {
    setLoading(true);
    async function update() {
      setLoading(false);
    }
    update();
  }, [props.contactData])



  const handleEmptyFields = () => {
    setShowEmpty(!showEmpty);
  }

  const ToggleEmptyFieldButton = () => {
    return (
      <FormGroup style={{ display: "block" }}>
        <FormControlLabel
          className={`${classes.switchButtom}${props.publicLeftBottom ? classes.publicLeftBottom : ""
            } ${!showEmpty ? classes.switchTextDeselected : ""}`}
          control={
            <React.Fragment>
              <AntSwitch
                checked={showEmpty}
                onChange={() => {
                  handleEmptyFields();
                }}
                name="checkedC"
              />
            </React.Fragment>
          }
          label="Show empty fields"
          labelPlacement="end"

        />
      </FormGroup>
    );
  };

  return (
    <div className={classes.root}>
      <Grid item xs={12} style={{ minHeight: "28px" }}>
        <h4 style={{ margin: "0 0 10px 0", float: "left" }}>
          Basic Information
        </h4>
        <Box display="flex" justifyContent="flex-end">
          <ToggleEmptyFieldButton />
          <h4
            className={classes.viewAll}
            onClick={() => {
              props.handleOpenExpandableCard(
                <MelissaTable
                  id={props.contactData._id}
                  entity={props.contactData.entity}
                  rows={{ ...basicInfoContent, ...basicInfoExpContent }}
                  wrapperClass={classes.dataSect}
                  melissaData={props.melissaData}
                />,
                "Detailed Information"
              );
            }}
          >
            View All
        </h4>
        </Box>
      </Grid>


      <Grid item xs={12} container className={classes.dataSect} spacing={0}>
        {!loading && basicInfoContent &&
          Object.entries(basicInfoContent).map(([key, row]) => {
            if (showEmpty) {
              return (
                <React.Fragment>
                  <Grid item xs={3} className="fieldName">
                    <p className="dataLabels">{key}</p>
                  </Grid>
                  <Grid item xs={9}>
                    <FieldContent
                      id={props.contactData._id}
                      entity={props.contactData.entity}
                      content={row.data}
                      linkType={row.linkType}
                    />
                  </Grid>
                </React.Fragment>
              )
            } else {
              let objName = Object.keys(row.data)[0];
              if (row.data[objName] != undefined 
                  && row.data[objName] != `""` 
                  && row.data[objName] != '' 
                  && row.data[objName] != ""                  
                  && row.data[objName].length != 0
                  && row.data[objName] != null 
                  ) {
                return (
                  <React.Fragment>
                    <Grid item xs={3} className="fieldName">
                      <p className="dataLabels">{key}</p>
                    </Grid>
                    <Grid item xs={9}>
                      <FieldContent
                        id={props.contactData._id}
                        entity={props.contactData.entity}
                        content={row.data}
                        linkType={row.linkType}
                      />
                    </Grid>
                  </React.Fragment>
                )
              }
            }

          })}

        {basicInfExp && (
          <>
            {Object.entries(basicInfoExpContent).map(([key, row]) => {
              if (showEmpty) {
                return (
                  <React.Fragment key={key}>
                    <Grid item xs={3} className="fieldName">
                      <p className="dataLabels">{key}</p>
                    </Grid>
                    <Grid item xs={9}>
                      <FieldContent
                        onlyChildren={row.inner ? true : false}
                        id={props.contactData._id}
                        entity={props.contactData.entity}
                        content={row.data}
                        linkType={row.linkType}
                      >
                        {row.inner}
                      </FieldContent>
                    </Grid>
                  </React.Fragment>
                )
              } else {
                let objName = Object.keys(row.data)[0];

                if (row.data[objName] != undefined
                  && row.data[objName] != `""` 
                  && row.data[objName] != '' 
                  && row.data[objName] != ""                  
                  && row.data[objName].length != 0
                  && row.data[objName] != null 
                  ) {
                  return (
                  
                    <React.Fragment key={key}>
                      <Grid item xs={3} className="fieldName">
                        <p className="dataLabels">{key}</p>
                      </Grid>
                      <Grid item xs={9}>
                        <FieldContent
                          onlyChildren={row.inner ? true : false}
                          id={props.contactData._id}
                          entity={props.contactData.entity}
                          content={row.data}
                          linkType={row.linkType}
                        >
                          {row.inner}
                        </FieldContent>
                      </Grid>
                    </React.Fragment>
                  )
                }
              }

            })}
          </>
        )}
      </Grid>
      <Grid item xs={12}>
        <h4
          className={classes.showAll}
          onClick={() => {
            setBasicInfExp(!basicInfExp);
          }}
        >
          Show {!basicInfExp ? "More" : "Less"}
          {!basicInfExp ? (
            <ExpandMoreIcon style={{ position: "relative", top: "8px" }} />
          ) : (
              <ExpandLessIcon style={{ position: "relative", top: "8px" }} />
            )}
        </h4>
      </Grid>
    </div>
  );
};
