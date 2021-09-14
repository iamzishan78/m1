import React, { useState } from "react";
import FieldContent from "../../ContactDetailCard/components/FieldContent";
import { FieldTypes } from "../../ContactDetailCard/components/FieldContent/helper";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { excludeList } from "./ExcludeList";
import { Grid } from "@material-ui/core";
import {
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
    margin: "0 0 8px 0",
    "float": "right",
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
    "float": "right",
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
  switchButtom: {
    "float": "right",
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
  viewSwitcher:{
    width : "245px",
    fontSize : "14px",
    marginLeft: "10px",
  }
}));

const MelissaTable =  ({ ...props }) => {
  const classes = useStyles();
  const [showEmpty, setShowEmpty] = useState(true);
  const [selectedPurchaseData, setSelectedPurchaseData] = useState('')

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
    <div style={{ padding: "23px 28px" }}>
      <Grid item xs={12} style={{ minHeight: "28px" }}>
        <Box display="flex" justifyContent="space-between">
          {props.header === 'Purchased Data' ? (
            <span>
              <h4 style={{ margin: "0 0 13px 0", display: "inline-block" }}>
                Purchased Data
              </h4>
              <Select
                className={classes.viewSwitcher}
                value={selectedPurchaseData}
                onChange={(e) => setSelectedPurchaseData(e.target.value)}
              >
                <MenuItem value="id1">IDI Data -07/28/2021 11:07:02am</MenuItem>
                <MenuItem value="id2">IDI Data -07/29/2021 11:07:02am</MenuItem>
              </Select>
            </span>
          ) : (
            <h4 style={{ margin: "0 0 13px 0" }}>
              Basic Information
            </h4>
          )}
          <ToggleEmptyFieldButton />
        </Box>
        <Grid item xs={12} container className={props.wrapperClass} spacing={0}>
          {Object.entries(props.rows).map(([key, value]) => {
            if (!excludeList.includes(key)) {
              if (showEmpty) {

                return (
                  <React.Fragment>
                    <Grid item xs={3} className="fieldName">
                      <p className="dataLabels">{key}</p>
                    </Grid>
                    <Grid item xs={9}>
                      <FieldContent
                        id={props.id}
                        entity={props.entity}
                        onlyChildren={value.inner ? true : false}
                        content={value.data}
                        linkType={value.linkType}
                      >
                        {value.inner}
                      </FieldContent>
                    </Grid>
                  </React.Fragment>
                );
              } else {
                let objName = Object.keys(value.data)[0];
                if (value.data[objName] != undefined
                  && value.data[objName] != `""`
                  && value.data[objName] != ''
                  && value.data[objName] != ""
                  && value.data[objName].length != 0
                  && value.data[objName] != null
                ) {
                  return (
                    <React.Fragment>
                      <Grid item xs={3} className="fieldName">
                        <p className="dataLabels">{key}</p>
                      </Grid>
                      <Grid item xs={9}>
                        <FieldContent
                          id={props.id}
                          entity={props.entity}
                          onlyChildren={value.inner ? true : false}
                          content={value.data}
                          linkType={value.linkType}
                        >
                          {value.inner}
                        </FieldContent>
                      </Grid>
                    </React.Fragment>
                  );
                }
              }
            }
            return null;
          })}
        </Grid>

        {/* {props.melissaData &&
          props.melissaData.melissaAddressRecord &&
          props.melissaData.melissaAddressRecord.CurrentAddress && (
          <>
            <h4 style={{ margin: "13px 0 13px 0" }}>Melissa Address Record</h4>
            <Grid
              item
              xs={12}
              container
              className={props.wrapperClass}
              spacing={0}
            >
              {Object.entries(
                props.melissaData.melissaAddressRecord.CurrentAddress
              ).map(([key, value]) => {
                if(!excludeList.includes(key)){ 
                  return (
                    <React.Fragment>
                      <Grid item xs={3} className="fieldName">
                        <p className="dataLabels">{key}</p>
                      </Grid>
                      <Grid item xs={9}>
                        <FieldContent
                          melissaAddressRecordId={
                            props.melissaData.melissaAddressRecord._id
                          }
                          content={{ [key]: value }}
                          fieldType={FieldTypes.MelissaAddressRecord}
                          isEdited={
                            props.melissaData.updatedMelissaRecords.find(
                              (item) =>
                                item.fieldName === key &&
                                item.melissaRecordType === "address"
                            )
                              ? true
                              : false
                          }
                        />
                      </Grid>
                    </React.Fragment>
               )
              };
              return null;
              }
            )}
            </Grid>
          </>
        )} */}

        {/* {props.melissaData && props.melissaData.melissaRecord ? (
          <>
            <h4 style={{ margin: "13px 0 13px 0" }}>Purchased Contact Data</h4>
            <Grid
              item
              xs={12}
              container
              className={props.wrapperClass}
              spacing={0}
            >
              {Object.entries(props.melissaData.melissaRecord).map(
                ([key, value]) => {
                  if (!excludeList.includes(key)) {
                    return (
                      <React.Fragment>
                        <Grid item xs={3} className="fieldName">
                          <p className="dataLabels">{key}</p>
                        </Grid>
                        <Grid item xs={9}>
                          <FieldContent
                            melissaRecordId={
                              props.melissaData.melissaRecord._id
                            }
                            content={{ [key]: value }}
                            fieldType={FieldTypes.MelissaRecord}
                            isEdited={
                              props.melissaData.updatedMelissaRecords.find(
                                (item) =>
                                  item.fieldName === key &&
                                  item.melissaRecordType === "main"
                              )
                                ? true
                                : false
                            }
                          />
                        </Grid>
                      </React.Fragment>
                    );
                  }
                  return null;
                }
              )}
            </Grid>
          </>
        ) : (
            <h4 style={{ margin: "13px 0 13px 0" }}>
              No Purchased Contact Information to Display
            </h4>
          )} */}
      </Grid>
    </div>
  );
};

export default MelissaTable