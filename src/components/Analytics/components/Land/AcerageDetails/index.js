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

import AcerageDetail from "./AcerageDetail";
import ReportGroupHeader from "components/Shared/ReportGroupHeader";
import { setStateIfDeepEqual } from "components/Shared/functions";
import AutoCompleteTypeComponent from "components/Shared/Forms/Fields/AutoCompleteType";

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

export default function AcerageDetailTabPanel() {
  const classes = useStyles();
  const propertiesReportGroup = useSelector(
    ({ Revenue }) => Revenue.propertiesReportGroup
  );

  const [externalFilters, setExtFilters] = useState({
    agreementType: "lease",
    agreementSubType: "All",
    internalCompany: "All",
    acquisitionID: "All",
    prospectID: "All",
    reportingGroup: "All",
  });
  const [esFilters, ESFilters] = useState([]);

  useEffect(() => {
    const newESFilters = [];

    // Add available values to filters
    ["agreementType", "agreementSubType", "internalCompany", "acquisitionID", "prospectID"].map(field => {
      if(externalFilters[field] !== "All")
        newESFilters.push({
          field: `${field}.keyword`,
          value: externalFilters[field],
        });
    })
    
    ESFilters(newESFilters);
  }, [externalFilters]);

  const setESFilters = (newState) => {
    setStateIfDeepEqual(ESFilters, newState);
  };

  const handleFilterChange = (field, newValue) => {
    setExtFilters({ ...externalFilters, [field]: newValue || "All" });
  }

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
                Agreement Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={externalFilters.agreementType}
                onChange={({ target }) => setAgreementType(target.value)}
                label="Agreement Type"
                fullWidth
                className={classes.select}
              >
                <MenuItem value={"lease"}>Lease</MenuItem>
                <MenuItem value={"deed"}>Deed</MenuItem>
                <MenuItem value={"contract"}>Contract</MenuItem>
                <MenuItem value={"surface"}>Surface/ROW</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        {/* Similar Filter Fields */}
        {[
          "agreementSubType",
          "internalCompany",
          "acquisitionID",
          "prospectID",
        ].map((field) => (
          <Grid item xs={12} md={2}>
            <AutoCompleteTypeComponent
              fullWidth
              value={externalFilters[field]}
              shapeType="Agreement"
              typeKey={field}
              variant="outlined"
              createable={false}
              onChange={(e, newValue) => handleFilterChange(field, newValue?.name)}
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
      <AcerageDetail
        header="Acreage Detail"
        esFilters={esFilters}
        targetLabel="acerage"
        parent="AcerageDetail"
        setESFilters={setESFilters}
      />
    </>
  );
}
