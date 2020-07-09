import React, { useContext, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { NavigationContext } from "../NavigationContext";

const profileList = [
  "DIRECTIONAL",
  "HORIZONTAL",
  "SIDETRACKED",
  "UNKNOWN",
  "VERTICAL",
];

export default function FilterWellProfileJ() {
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [profileName, setProfileName] = React.useState(
    stateNav.profileName ? stateNav.profileName : null
  );

  const handleProfileChange = (value) => {
    let filter;
    if (value && value.length) {
      filter = ["match", ["get", "wellBoreProfile"], value, true, false];
      setStateNav((stateNav) => ({ ...stateNav, profileName: value }));
      setProfileName(value);
    } else {
      filter = null;
      setStateNav((stateNav) => ({ ...stateNav, profileName: [] }));
    }
    setStateNav((stateNav) => ({ ...stateNav, filterWellProfile: filter }));
  };

  return (
    <Autocomplete
      ChipProps={{ color: "secondary" }}
      defaultValue={stateNav.profileName}
      onChange={(event, newValue) => {
        handleProfileChange(newValue);
      }}
      multiple
      options={profileList}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Well Profile"
          placeholder=""
          fullWidth={true}
        />
      )}
      disableListWrap
      id="virtualize-well-profiles"
      // style={{ maxWidth: 300, minWidth: 120 }}
    />
  );
}
