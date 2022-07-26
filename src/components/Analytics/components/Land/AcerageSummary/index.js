import React, { useState, useEffect } from "react";
import {
  FormControl,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  makeStyles,
} from "@material-ui/core";
import { useSelector } from "react-redux";

import AcerageSummary from "./AcerageSummary";
import ReportGroupHeader from "components/Shared/ReportGroupHeader";
import TableHeader from "components/Table/constants/analytics-land-acerage-summary-schema";
import { setStateIfDeepEqual } from "components/Shared/functions";

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: "100%",
  },
  select: {
    height: 40,
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
export default function AcerageSummaryTabDeatils() {
  const classes = useStyles();
  const propertiesReportGroup = useSelector(
    ({ Revenue }) => Revenue.propertiesReportGroup
  );

  const [aggregatedBy, setAggBy] = useState(10);
  const [esFilters, ESFilters] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);

  const setESFilters = (newState) => {
    setStateIfDeepEqual(ESFilters, newState);
  };

  useEffect(() => {
    const tableHeaders = TableHeader.filter((col) => {
      if (aggregatedBy === 20) {
        return !["prospect", "acquisition"].includes(col.name);
      } else if (aggregatedBy === 30) {
        return !["acquisition"].includes(col.name);
      } else if (aggregatedBy === 40) {
        return !["prospect"].includes(col.name);
      } else {
        return !["county", "prospect", "acquisition"].includes(col.name);
      }
    });

    setTableHeaders(tableHeaders);
  }, [aggregatedBy]);

  return (
    <>
    <div className={classes.actionBar}>
      <Grid
        container
        direction="row"
        display="flex"
        alignItems="center"
        spacing={2}
        style={{ padding: "0px 36px" }}
      >
        <Grid item xs={12} md={2} style={{ marginTop: "4px" }}>
          <Grid container display="flex" alignItems="center" spacing={3}>
            <FormControl
              variant="outlined"
              required
              className={classes.formControl}
            >
              <InputLabel id="demo-simple-select-required-label">
                Aggregated By
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={aggregatedBy}
                onChange={({ target }) => setAggBy(target.value)}
                label="Aggregated By"
                fullWidth
                className={classes.select}
              >
                <MenuItem value={10}>State</MenuItem>
                <MenuItem value={20}>State/County</MenuItem>
                <MenuItem value={30}>Prospect</MenuItem>
                <MenuItem value={40}>Acquisition</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid item xs={12} md={2}>
          <Grid container display="flex" className={classes.actionsGrid}>
            <ReportGroupHeader
              type="Properties"
              esFilters={propertiesReportGroup || []}
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
      <AcerageSummary
        header="Acreage Summary"
        esFilters={esFilters}
        targetLabel="acerage"
        parent="AcerageSummary"
        setESFilters={setESFilters}
        tableHeaders={tableHeaders}
      />
    </>
  );
}
