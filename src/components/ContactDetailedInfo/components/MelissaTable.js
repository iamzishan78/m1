import React, { useEffect, useState } from "react";
import FieldContent, {
  FieldTypes,
} from "./../../ContactDetailCard/components/FieldContent";
import { makeStyles } from "@material-ui/core/styles";
import { excludeList } from "./ExcludeList";
import { Grid } from "@material-ui/core";

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
}));

export default ({ ...props }) => {
  const classes = useStyles();

  return (
    <div style={{ padding: "23px 28px" }}>
      <Grid item xs={12} style={{ minHeight: "28px" }}>
        <h4 style={{ margin: "0 0 13px 0" }}>Basic Information</h4>

        <Grid item xs={12} container className={props.wrapperClass} spacing={0}>
          {Object.entries(props.rows).map(([key, value]) => {
            if(!excludeList.includes(key)){ 
              return(
                <React.Fragment>
                  <Grid item xs={3} className="fieldName">
                    <p className="dataLabels">{key}</p>
                  </Grid>
                  <Grid item xs={9}>
                    <FieldContent
                      onlyChildren={value.inner ? true : false}
                      content={value.data}
                      linkType={value.linkType}
                    >
                      {value.inner}
                    </FieldContent>
                  </Grid>
                </React.Fragment>
            )};
            return null;
            }
          )}
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

        
        {props.melissaData && props.melissaData.melissaRecord ? (
          <>
          <h4 style={{ margin: "13px 0 13px 0" }}>Purchased Contact Data</h4>
            <Grid
              item
              xs={12}
              container
              className={props.wrapperClass}
              spacing={0}
            >
              {Object.entries(props.melissaData.melissaRecord).map(([key, value]) => {
                if(!excludeList.includes(key)){ 
                  return (
                    <React.Fragment>
                      <Grid item xs={3} className="fieldName">
                        <p className="dataLabels">{key}</p>
                      </Grid>
                      <Grid item xs={9}>
                        <FieldContent
                          melissaRecordId={props.melissaData.melissaRecord._id}
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
                  )
                };
                return null;
                }
              )}
            </Grid>
          </>
        ) : (
          <h4 style={{ margin: "13px 0 13px 0" }}>No Purchased Contact Information to Display</h4>
        )}
      </Grid>
    </div>
  );
};
