import React, { useContext, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { NavigationContext } from "../NavigationContext";
import { USERAVAILABLEFILTERTAGSQUERY } from "../../../graphQL/useQueryUserAvailableFilterTags";
import { OBJECTSFROMTAGSARRAY } from "../../../graphQL/useQueryObjectsFromTagsArray";
import { useLazyQuery } from "@apollo/react-hooks";
import CircularProgress from "@material-ui/core/CircularProgress";
import { AppContext } from "../../../AppContext";
import { OWNERSWELLSQUERY } from "../../../graphQL/useQueryOwnersWells";

export default function FilterTags() {
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [ownersWells, setOwnersWells] = React.useState(null);

  const [
    getUserAvailableFilterTags,
    { loading, data: dataUserAvailableTags },
  ] = useLazyQuery(USERAVAILABLEFILTERTAGSQUERY, {
    fetchPolicy: "cache-and-network",
  });

  const [getWellsIdsFromTagsArray, { data: dataWellsIds }] = useLazyQuery(
    OBJECTSFROMTAGSARRAY,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  const [getOwnersIdsFromTagsArray, { data: dataOwnersIds }] = useLazyQuery(
    OBJECTSFROMTAGSARRAY,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  const [getOwnersWells, { data: dataOwnersWells }] = useLazyQuery(
    OWNERSWELLSQUERY
  );

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

  ////Fetching wells ids and owners ids
  useEffect(() => {
    if (
      stateNav.selectedTags &&
      stateNav.selectedTags.length > 0 &&
      stateApp.user
    ) {
      getWellsIdsFromTagsArray({
        variables: {
          objectType: "well",
          tagsArray: stateNav.selectedTags,
          userId: stateApp.user.mongoId,
        },
      });
      getOwnersIdsFromTagsArray({
        variables: {
          objectType: "owner",
          tagsArray: stateNav.selectedTags,
          userId: stateApp.user.mongoId,
        },
      });
    }
  }, [stateNav.selectedTags, stateApp.user]);

  useEffect(() => {
    if (dataOwnersIds && dataOwnersIds.objectsFromTagsArray) {
      if (dataOwnersIds.objectsFromTagsArray.length > 0) {
        ////Fetching all well ids from owners
        getOwnersWells({
          variables: {
            ownersIds: dataOwnersIds.objectsFromTagsArray,
          },
        });
      } else {
        if (dataWellsIds && dataWellsIds.objectsFromTagsArray)
          setStateNav((stateNav) => ({
            ...stateNav,
            wellsIdsFromTags: dataWellsIds.objectsFromTagsArray.map((well) =>
              well.toUpperCase()
            ),
          }));
      }
    }
  }, [dataOwnersIds, dataWellsIds]);

  useEffect(() => {
    if (dataOwnersWells && dataOwnersWells.ownersWells)
      if (dataOwnersWells.ownersWells.length <= 0) {
        setOwnersWells([]);
      } else {
        let wellsIdsArray = [];
        for (let i = 0; i < dataOwnersWells.ownersWells.length; i++) {
          wellsIdsArray = [
            ...wellsIdsArray,
            ...dataOwnersWells.ownersWells[i].wells.map((well) =>
              well.wellId.toUpperCase()
            ),
          ];
        }
        setOwnersWells(wellsIdsArray);
      }
  }, [dataOwnersWells]);

  useEffect(() => {
    if (dataWellsIds && dataWellsIds.objectsFromTagsArray && ownersWells) {
      setStateNav((stateNav) => ({
        ...stateNav,
        wellsIdsFromTags: [
          ...dataWellsIds.objectsFromTagsArray.map((well) =>
            well.toUpperCase()
          ),
          ...ownersWells,
        ],
      }));
    }
  }, [dataWellsIds, ownersWells]);

  const handleChange = (value) => {
    setOwnersWells(null);
    if (value && value.length) {
      setStateNav((stateNav) => ({ ...stateNav, selectedTags: value }));
    } else {
      setStateNav((stateNav) => ({
        ...stateNav,
        selectedTags: [],
        wellsIdsFromTags: [],
      }));
      setStateApp((stateApp) => ({
        ...stateApp,
        wellListFromTagsFilter: null,
      }));
      stateApp.deactivateUserDefinedLayers(5);
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
      disabled={
        !(
          dataUserAvailableTags &&
          dataUserAvailableTags.userAvailableFilterTags &&
          dataUserAvailableTags.userAvailableFilterTags.length > 0
        )
      }
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
        />
      )}
      disableListWrap
    />
  );
}
