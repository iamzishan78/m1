import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import FieldContent from "../ContactDetailCard/components/FieldContent";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import Button from '@material-ui/core/Button';
import AddIcon from "@material-ui/icons/Add";
import { useHistory } from "react-router-dom";
import { useLazyQuery } from '@apollo/client';
import { Grid, Box, FormControlLabel, FormGroup, Switch, InputAdornment, IconButton } from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import moment from "moment";

import {
  getBasicInfoContent,
  getBasicInfoExpContent,
  getBasicPurchaseInfoContent,
  getBasicPurchaseInfoExpContent,
  featureFlagChanges,
} from "components/ContactDetailedInfo/helper";
import { FEATURES } from "components/Shared/FeatureFlag/common";
import { globalStateController } from "hookstate/globalStateController";
import { GET_META_DATA } from 'graphQL/useQueryGetMetaData';


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
    paddingRight: "25px",
    paddingLeft: "15px",
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
    color: "#757575",
    width: "100%",
    overflow: "overlay",
    maxHeight: "45.25vh",
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
      "& .editIcon": {
        visibility: "hidden",
      },
      "&:hover .editIcon": {
        visibility: "visible",
      },
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
      marginLeft: "5px",
    },
  },
  switchTextDeselected: {
    color: "rgb(141, 141, 141)",
  },
  tab: {
    border: "1px solid #C9C9C9",
    padding: "3px 20px",
    color: "#919191",
    cursor: "pointer",
  },
  selectedTab: {
    color: "white",
    background: "#01B0F0",
  },
  viewSwitcher: {
    width: "275px",
    fontSize: "14px",
    marginLeft: "10px",
  },
  headerActions: {
    minHeight: "28px",
    display: "flex",
    justifyContent: "space-between",
    padding: "20px 2px 4px 2px",
  },
  addDataButton: {
    position: "relative",
    bottom: "10px",
    right: "20px",
    backgroundColor: "white",
    color: "black",
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: theme.palette.common.white,
      opacity: 0.15,
    },
  },
}));

export default function DetailInfo(props) {
  const [basicInfExp, setBasicInfExp] = useState(true);
  const [showEmpty, setShowEmpty] = useState(true);
  const [selectedTab, setSelectedTab] = useState("Basic Info");
  const [selectedPurchaseData, setSelectedPurchaseData] = useState("");

  // State for Custom_Data fields
  const [metafields, setMetaFields] = useState([]);

  const [getMetaData, { data: metaDataRes }] = useLazyQuery(GET_META_DATA);

  const classes = useStyles();
  let history = useHistory();
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => state.app);

  const showGenericPhones = React.useMemo(() => {
    return user.features?.find((f) => f.name === "showGenericPhones");
  }, [user]);

  useEffect(() => {
    if (props.purchaseData.length > 0) {
      setSelectedPurchaseData(props.purchaseData[0]._id);
    }
  }, [props.purchaseData]);

  useEffect(() => {
    setLoading(true);
    async function update() {
      setLoading(false);
    }
    update();
  }, [props.contactData]);

  // Will get custom data on first render
  useEffect(() => {
    getMetaData({
      variables: {
        user: null,
        category: "Contacts",
      },
    });
  }, []);

  useEffect(() => {
    if (!metaDataRes?.getMetaData?.metaData) return;

    setMetaFields(metaDataRes?.getMetaData?.metaData);
  }, [metaDataRes]);

  const handleEmptyFields = () => {
    setShowEmpty(!showEmpty);
  };

  const ToggleEmptyFieldButton = () => {
    return (
      <FormGroup style={{ display: "block" }}>
        <FormControlLabel
          className={`${classes.switchButtom}${props.publicLeftBottom ? classes.publicLeftBottom : ""} ${!showEmpty ? classes.switchTextDeselected : ""}`}
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

  const tabs =
    props.purchaseData.length > 0 && props?.user?.features?.find((f) => f.name === FEATURES.IDICORE)
      ? ["Basic Info", "Purchased Info"]
      : ["Basic Info"];

  return (
    <div className={classes.root}>
      <Grid item xs={12} className={classes.headerActions}>
        <div>
          {tabs.map((tab) => {
            return (
              <span className={`${classes.tab} ${selectedTab === tab ? classes.selectedTab : ""}`} onClick={() => setSelectedTab(tab)}>
                {tab}
              </span>
            );
          })}
          {selectedTab === "Purchased Info" && (
            <Select
              className={classes.viewSwitcher}
              value={selectedPurchaseData}
              onChange={(e) => {
                setSelectedPurchaseData(e.target.value);
              }}
            >
              {props.purchaseData.map((purchaseData) => {
                return (
                  <MenuItem value={purchaseData._id}>M1 Data - {moment(purchaseData.sysDateTime).format("MM/DD/YYYY hh:mm:ss a")}</MenuItem>
                );
              })}
            </Select>
          )}
        </div>

        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            className={classes.addDataButton}
            startIcon={<AddIcon />}
            onClick={() => {
              globalStateController.updateState({
                showFieldModal: true,
              });
            }}
          >
            Add Custom Data
          </Button>
          <ToggleEmptyFieldButton />
          <h4
            className={classes.viewAll}
            onClick={() => {
              history.push(`/contact/details/${props.contactData._id}/detailedInformation`);
            }}
          >
            View All
          </h4>
        </Box>
      </Grid>

      {selectedTab === "Basic Info" && (
        <>
          <Grid item xs={12} container className={classes.dataSect} spacing={0}>
            {!loading &&
              getBasicInfoContent(props.contactData) &&
              Object.entries(getBasicInfoContent(props.contactData)).map(([key, row]) => {
                if (showEmpty) {
                  return (
                    <React.Fragment>
                      <Grid item xs={3} className="fieldName">
                        <p className="dataLabels">{featureFlagChanges(showGenericPhones, key)}</p>
                      </Grid>
                      <Grid item xs={9}>
                        <FieldContent
                          id={props.contactData._id}
                          entity={props.contactData.entity}
                          isMerged={!!props.contactData.mergedContacts}
                          content={row.data}
                          linkType={row.linkType}
                          isPurchased={selectedTab === "Purchased Info"}
                          name={key}
                          row={row}
                          handleQuickActionActivity={props.handleQuickActionActivity}
                        />
                      </Grid>
                    </React.Fragment>
                  );
                } else {
                  let objName = Object.keys(row.data)[0];
                  if (
                    row.data[objName] !== undefined &&
                    row.data[objName] !== null &&
                    row.data[objName] !== `""` &&
                    row.data[objName] !== "" &&
                    row.data[objName] !== "" &&
                    row.data[objName].length !== 0 &&
                    row.data[objName] != null
                  ) {
                    return (
                      <React.Fragment>
                        <Grid item xs={3} className="fieldName">
                          <p className="dataLabels">{featureFlagChanges(showGenericPhones, key)}</p>
                        </Grid>
                        <Grid item xs={9}>
                          <FieldContent
                            id={props.contactData._id}
                            entity={props.contactData.entity}
                            isMerged={!!props.contactData.mergedContacts}
                            content={row.data}
                            linkType={row.linkType}
                            row={row}
                            handleQuickActionActivity={props.handleQuickActionActivity}
                          />
                        </Grid>
                      </React.Fragment>
                    );
                  }
                }
              })}

            {basicInfExp && (
              <>
                {Object.entries(getBasicInfoExpContent(props.contactData, metafields)).map(([key, row]) => {
                  if (showEmpty) {
                    return (
                      <React.Fragment key={key}>
                        <Grid item xs={3} className="fieldName"
                          {...(row.isMeta && {
                            style: {
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            },
                          })}
                        >
                          <p className="dataLabels">{featureFlagChanges(showGenericPhones, key)} </p>

                          {/* Edit  Icon for meta fields */}
                          {row?.isMeta && <InputAdornment className="editIcon" position="end">
                            <IconButton
                              aria-label="Edit Meta"
                              style={{ padding: '6px' }}
                              onClick={() => {
                                globalStateController.updateState({ showFieldModal: true });
                                window.setStateApp(stateApp => ({
                                  ...stateApp,
                                  selectedMeta: row?.rawMeta,
                                  showFieldModal: true,
                                }))
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </InputAdornment>}
                        </Grid>
                        <Grid item xs={9}>
                          <FieldContent
                            onlyChildren={row.inner ? true : false}
                            id={props.contactData._id}
                            entity={props.contactData.entity}
                            isMerged={!!props.contactData.mergedContacts}
                            content={row.data}
                            linkType={row.linkType}
                            row={row}
                            handleQuickActionActivity={props.handleQuickActionActivity}
                            metafields={metafields}
                          >
                            {row.inner}
                          </FieldContent>
                        </Grid>
                      </React.Fragment>
                    );
                  } else {
                    let objName = Object.keys(row.data)[0];

                    if (
                      row.data[objName] &&
                      row.data[objName] !== undefined &&
                      row.data[objName] !== `""` &&
                      row.data[objName] !== "" &&
                      row.data[objName] !== "" &&
                      row.data[objName].length &&
                      row.data[objName].length !== 0 &&
                      row.data[objName] !== null
                    ) {
                      return (
                        <React.Fragment key={key}>
                          <Grid item xs={3} className="fieldName"
                            {...(row.isMeta && {
                              style: {
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              },
                            })}
                          >
                            <p className="dataLabels">{featureFlagChanges(showGenericPhones, key)}</p>

                            {/* Edit  Icon for meta fields */}
                            {row?.isMeta && <InputAdornment className="editIcon" position="end">
                              <IconButton
                                aria-label="Edit Meta"
                                style={{ padding: '6px' }}
                                onClick={() => {
                                  globalStateController.updateState({ showFieldModal: true });
                                  window.setStateApp(stateApp => ({
                                    ...stateApp,
                                    selectedMeta: row?.rawMeta,
                                    showFieldModal: true,
                                  }))
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                            </InputAdornment>}
                          </Grid>
                          <Grid item xs={9}>
                            <FieldContent
                              onlyChildren={row.inner ? true : false}
                              id={props.contactData._id}
                              entity={props.contactData.entity}
                              isMerged={!!props.contactData.mergedContacts}
                              content={row.data}
                              linkType={row.linkType}
                              row={row}
                              handleQuickActionActivity={props.handleQuickActionActivity}
                            >
                              {row.inner}
                            </FieldContent>
                          </Grid>
                        </React.Fragment>
                      );
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
        </>
      )}

      {selectedTab === "Purchased Info" && (
        <>
          <Grid item xs={12} container className={classes.dataSect} spacing={0}>
            {!basicInfExp &&
              getBasicPurchaseInfoContent(props.purchaseData.find((purchaseData) => purchaseData._id === selectedPurchaseData)) &&
              Object.entries(
                getBasicPurchaseInfoContent(props.purchaseData.find((purchaseData) => purchaseData._id === selectedPurchaseData))
              ).map(([key, row]) => {
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
                          isPurchased
                          row={row}
                          handleQuickActionActivity={props.handleQuickActionActivity}
                        />
                      </Grid>
                    </React.Fragment>
                  );
                } else {
                  let objName = Object.keys(row.data)[0];
                  if (
                    row.data[objName] != undefined &&
                    row.data[objName] != `""` &&
                    row.data[objName] != "" &&
                    row.data[objName] != "" &&
                    row.data[objName].length != 0 &&
                    row.data[objName] != null
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
                            isPurchased
                            row={row}
                            handleQuickActionActivity={props.handleQuickActionActivity}
                          />
                        </Grid>
                      </React.Fragment>
                    );
                  }
                }
              })}

            {basicInfExp && (
              <>
                {Object.entries(
                  getBasicPurchaseInfoExpContent(props.purchaseData.find((purchaseData) => purchaseData._id === selectedPurchaseData))
                ).map(([key, row]) => {
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
                            isMerged={!!props.contactData.mergedContacts}
                            content={row.data}
                            linkType={row.linkType}
                            isPurchased
                            row={row}
                            handleQuickActionActivity={props.handleQuickActionActivity}
                          >
                            {row.inner}
                          </FieldContent>
                        </Grid>
                      </React.Fragment>
                    );
                  } else {
                    let objName = Object.keys(row.data)[0];

                    if (
                      row.data[objName] != undefined &&
                      row.data[objName] != `""` &&
                      row.data[objName] != "" &&
                      row.data[objName] != "" &&
                      row.data[objName].length != 0 &&
                      row.data[objName] != null
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
                              isMerged={!!props.contactData.mergedContacts}
                              content={row.data}
                              linkType={row.linkType}
                              isPurchased
                              row={row}
                              handleQuickActionActivity={props.handleQuickActionActivity}
                            >
                              {row.inner}
                            </FieldContent>
                          </Grid>
                        </React.Fragment>
                      );
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
        </>
      )}
    </div>
  );
}
