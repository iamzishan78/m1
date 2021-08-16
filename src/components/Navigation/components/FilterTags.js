import React, { useState,useContext, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { NavigationContext } from "../NavigationContext";
import { USERAVAILABLEFILTERTAGSQUERY } from "../../../graphQL/useQueryUserAvailableFilterTags";
import { useLazyQuery } from "@apollo/client";
import CircularProgress from "@material-ui/core/CircularProgress";
import { AppContext } from "../../../AppContext";

export default function FilterTags() {
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [filterLoading, setFilterLoading] = useState(false);

  const [
    getUserAvailableFilterTags,
    { loading, data: dataUserAvailableTags },
  ] = useLazyQuery(USERAVAILABLEFILTERTAGSQUERY, {
    fetchPolicy: "cache-and-network",
  });

  ////All User Available Tags For The DropDown
  useEffect(() => {
    if (stateApp.user && stateApp.user.mongoId) {
      getUserAvailableFilterTags({
        variables: {
          userId: stateApp.user.mongoId,
        },
      });
    }
  }, [stateApp.user]);


  const handleChange = (value) => {
    if (value && value.length) {
      setFilterLoading(true);
      setStateNav((stateNav) => ({ 
        ...stateNav, 
        selectedTags: [...value],
        filterTagsLoading: setFilterLoading,
      }));
    } else {
      if (!stateNav.filterTrackedWells && !stateNav.filterTrackedOwners)
        stateApp.toggleLayersActivity("Wells", true);

      stateApp.toggleLayersActivity("User Tags", false);
      setStateNav((stateNav) => ({
        ...stateNav,
        selectedTags: [],
        wellsIdsFromTags: [],
        filterTags: null,
        filterTagsLoading: () => {},
      }));
      setStateApp((stateApp) => ({
        ...stateApp,
        wellListFromTagsFilter: [],
      }));
      setFilterLoading(false);
    }
  };

  return loading ? (
    <div style={{ height: "56px" }}>
      <CircularProgress
        color="secondary"
        style={{ marginLeft: "50%" }}
        size={28}
      />
    </div>
  ) : (
    <Autocomplete
      ChipProps={{ color: "secondary" }}
      defaultValue={stateNav.selectedTags}
      onChange={(event, newValue) => {
        handleChange(newValue);
      }}
      multiple
      options={
        dataUserAvailableTags && dataUserAvailableTags.userAvailableFilterTags
          ? dataUserAvailableTags.userAvailableFilterTags
          : []
      }
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Tags"
          placeholder=""
          fullWidth={true}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {filterLoading ? (
                  <CircularProgress color="secondary" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      disableListWrap
    />
  );
}
