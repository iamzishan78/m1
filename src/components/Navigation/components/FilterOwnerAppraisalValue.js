import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { NavigationContext } from "../NavigationContext";
// import FilterOwnerCount from "./FilterOwnerCount";
// import FilterOwnerInterestSum from "./FilterOwnerInterestSum";

const useStyles = makeStyles((theme) => ({}));

const interestList = [
  "ROYALTY INTEREST",
  "OVERRIDE ROYALTY",
  "WORKING INTEREST",
  "PRODUCTION PAYMENT",
];

const ownerTypesList = [
  "RELIGIOUS INSTITUTIONS",
  "GOVERNMENTAL BODIES",
  "NON PROFITS",
  "TRUSTS",
  "CORPORATIONS",
  "EDUCATIONAL INSTITUTIONS",
  "INDIVIDUALS",
  "UNKNOWN",
];

const appraisalList = [
  "$0 - $1000",
  "$1000 - $10,000",
  "$10,000 - $25,000",
  "$25,000+",
];

export default function FilterOwnerAppraisalValue() {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [appraisalName, setAppraisalName] = useState(
    stateNav.appraisalName ? stateNav.appraisalName : []
  );
  const [appraisals, setAppraisals] = useState(appraisalList);

  const setFilterAppraisal = (appraisalName) => {
    let filter;
    let filters = [];
    let check;
    if (appraisalName) {
      check = appraisalName.map((val) => val);
      check.forEach((option) => {
        if (option === "$0 - $1000") {
          filters.push(["get", "ownerAppraisalLess1k"]);
        }
        if (option === "$1000 - $10,000") {
          filters.push(["get", "ownerAppraisal1to10k"]);
        }
        if (option === "$10,000 - $25,000") {
          filters.push(["get", "ownerAppraisal10to25k"]);
        }
        if (option === "$25,000+") {
          filters.push(["get", "ownerAppraisalOver25k"]);
        }
      });
      if (filters && filters.length > 0) {
        filters.unshift("any");
        filter = filters;
        setStateNav((stateNav) => ({
          ...stateNav,
          filterOwnerAppraisals: filter,
        }));
      } else {
        filter = null;
        setStateNav((stateNav) => ({
          ...stateNav,
          filterOwnerAppraisals: filter,
        }));
      }
    }
  };

  const handleChangeAppraisal = (event) => {
    setAppraisalName(event);
    setFilterAppraisal(event);
    setStateNav((stateNav) => ({
      ...stateNav,
      appraisalName: event,
    }));
  };

  return (
    <Autocomplete
      ChipProps={{ color: "secondary" }}
      defaultValue={appraisalName}
      onChange={(event, newValue) => {
        handleChangeAppraisal(newValue);
      }}
      multiple
      options={appraisals.map((option) => option)}
      renderInput={(params) => (
        <form autoComplete="off">
          <TextField
            {...params}
            variant="outlined"
            label="Owner Tax Appraisals"
            placeholder=""
            fullWidth={true}
          />
        </form>
      )}
      disableListWrap
    />
  );
}
