import React, { useContext } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { NavigationContext } from "../NavigationContext";

const wellTypesList = [
  "COALBED METHANE",
  "DISPOSAL",
  "DRY HOLE",
  "GAS",
  "INJECTION",
  "OIL",
  "OIL AND GAS",
  "P&A",
  "PERMITTED",
  "STORAGE",
  "UNKNOWN",
  "WATER",
];

export default function FilterWellTypeJ() {
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [typeName, setTypeName] = React.useState(
    stateNav.typeName ? stateNav.typeName : null
  );

  console.log(stateNav);
  const handleTypeChange = (value) => {
    let filter;
    if (value && value.length) {
      filter = ["match", ["get", "wellType"], value, true, false];
      setStateNav((stateNav) => ({ ...stateNav, typeName: value }));
      setTypeName(value);
    } else {
      filter = null;
      setStateNav((stateNav) => ({ ...stateNav, typeName: [] }));
    }
    setStateNav((stateNav) => ({ ...stateNav, filterWellType: filter }));
  };

  return (
    <Autocomplete
      ChipProps={{ color: "secondary" }}
      defaultValue={stateNav.typeName}
      onChange={(event, newValue) => {
        handleTypeChange(newValue);
      }}
      multiple
      options={wellTypesList}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Well Type"
          placeholder=""
          fullWidth={true}
        />
      )}
      disableListWrap
      id="virtualize-well-types"
      // style={{ maxWidth: 300, minWidth: 120 }}
    />
  );
}
