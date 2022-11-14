import React, { useState, useEffect } from "react";
import {
  Grid,
  makeStyles,
} from "@material-ui/core";
import { useSelector } from "react-redux";

import ExhibitA from "./ExhibitA";
import ReportGroupHeader from "components/Shared/ReportGroupHeader";
import { setStateIfDeepEqual } from "components/Shared/functions";
import AutoCompleteTypeComponent from "components/Shared/Forms/Fields/AutoCompleteType";
import StateField from "../../../../Revenue/components/Properties/DetailComponents/State";
import CountyField from "../../../../Revenue/components/Properties/DetailComponents/County";

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: "100%",
  },
  select: {
    height: 40,
  },
  actionsGrid: {
    width: "100%",
  },
  actionBar: {
    backgroundColor: "#f7f7f7",
    width: "100%",
    minHeight: "65px",
    marginBottom: 30,

    "& .MuiSelect-select:focus, & .MuiOutlinedInput-root": {
      backgroundColor: "#ffff",
    },
    "& .MuiButtonGroup-groupedContainedSecondary:not(:last-child)": {
      borderColor: "#ffff",
    },
  },
}));

export default function ExhibitATabPanel() {
  const classes = useStyles();
  const propertiesReportGroup = useSelector(
    ({ Revenue }) => Revenue.propertiesReportGroup
  );

  const [externalFilters, setExtFilters] = useState({
    state: 'All',
    county: 'All',
    internalCompany: "All",
    acquisitionID: "All",
    prospectID: "All",
    reportingGroup: "All",
  });
  const [esFilters, ESFilters] = useState([]);

  useEffect(() => {
    const newESFilters = [];

    // Add available values to filters
    [
      
      "internalCompany",
      "acquisitionID",
      "prospectID",
    ].map((field) => {
      if (externalFilters[field] !== "All")
        newESFilters.push({
          field: `${field}.keyword`,
          value: externalFilters[field],
        });
    });

    ESFilters(newESFilters);
  }, [externalFilters]);

  const setESFilters = (newState) => {
    setStateIfDeepEqual(ESFilters, newState);
  };

  const handleFilterChange = (field, newValue) => {
    setExtFilters({ ...externalFilters, [field]: newValue || "All" });
  };

  return (
    <>
      <div className={classes.actionBar}>
        <Grid
          container
          direction="row"
          display="flex"
          alignItems="center"
          spacing={3}
          style={{ padding: "0px 36px" }}
        >
          <Grid item xs={12} md={2} style={{}}>
            <StateField
              label="State"
              shrink
              value={externalFilters.state}
              onStateChange={(state) =>
                handleFilterChange("state", state.acronym)
              }
            />
          </Grid>
          <Grid item xs={12} md={2} style={{}}>
            <CountyField
              label="County"
              shrink
              value={externalFilters.county}
              state={externalFilters.state}
              onCountyChange={(selectedCounty) =>
                handleFilterChange("county", selectedCounty.county)
              }
            />
          </Grid>
          {/* Similar Filter Fields */}
          {["internalCompany", "acquisitionID", "prospectID"].map((field) => (
            <Grid item xs={12} md={2}>
              <AutoCompleteTypeComponent
                fullWidth
                value={externalFilters[field]}
                shapeType="Agreement"
                typeKey={field}
                variant="outlined"
                createable={false}
                onChange={(e, newValue) =>
                  handleFilterChange(field, newValue?.name)
                }
                autoFocus={false}
                id={`field-${field}`}
              />
            </Grid>
          ))}
          <Grid item xs={12} md={2}>
            <Grid container display="flex" className={classes.actionsGrid}>
              <ReportGroupHeader
                type="Agreements"
                esFilters={externalFilters.reportingGroup}
                setESFilters={(value) => setESFilters(value)}
                setFilterToggle={() => {}}
                isBackground={false}
                noUpdate={true}
                strechedWidth
                isShrink
                noPadding
              />
            </Grid>
          </Grid>
        </Grid>
      </div>
      <ExhibitA
        header="Exhibit A"
        esFilters={esFilters}
        targetLabel="acerage"
        parent="AcerageDetail"
        esIndex="shapetracts_flat"
        setESFilters={setESFilters}
      />
    </>
  );
}
