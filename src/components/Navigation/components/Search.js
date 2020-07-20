import React, { useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import parse from "autosuggest-highlight/parse";
import throttle from "lodash/throttle";
import { AppContext } from "../../../AppContext";
import Button from "@material-ui/core/Button";
import PersonIcon from "@material-ui/icons/Person";
import WellIcon from "../../Shared/svgIcons/well";
import OperatorIcon from "../../Shared/svgIcons/operator";
import LeaseIcon from "../../Shared/svgIcons/lease";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { OWNERWELLSQUERY } from "../../../graphQL/useQueryOwnerWells ";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { WELLSQUERY } from "../../../graphQL/useQueryWells";
import { OPERATORSLATSLONS } from "../../../graphQL/useQueryOperatorLatsLonsArray";
import { LEASELATSLONS } from "../../../graphQL/useQueryLeaseLatsLonsArray";
import { USERSEARCHHISTORY } from "../../../graphQL/useQueryUserSearchHistory";
import { ADDSEARCHHISTORY } from "../../../graphQL/useMutationAddSearchHistory";
import { UPDATESEARCHHISTORY } from "../../../graphQL/useMutationUpdateSearchHistory";
import { REMOVESEARCHHISTORY } from "../../../graphQL/useMutationRemoveSearchHistory";
import { NavigationContext } from "../NavigationContext";
import Popover from "@material-ui/core/Popover";
import Tooltip from "@material-ui/core/Tooltip";
import Box from "@material-ui/core/Box";
import { CircularProgress } from "@material-ui/core";

function loadScript(src, position, id) {
  if (!position) {
    return;
  }

  const script = document.createElement("script");
  script.setAttribute("async", "");
  script.setAttribute("id", id);
  script.src = src;
  position.appendChild(script);
}

// const autocompleteService = { current: null };

const maxMinScore = (options) => {
  let max = 0;
  let min = 1000000;
  for (let i = 0; i < options.length; i++) {
    if (options[i].Score > max) max = options[i].Score;
    if (options[i].Score < min) min = options[i].Score;
  }

  return [max, min];
};

const calcScoreOpacity = (maxMin, score) => {
  if (maxMin[0] === maxMin[1]) return 0;
  if (score === maxMin[1]) return 1;

  return 1 - (score - maxMin[1]) / (maxMin[0] - maxMin[1]);
};

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
  groupsHeadersText: {
    margin: "0",
    marginTop: "3px",
    padding: "0",
    fontFamily: "Poppins",
    color: "#0f2046",
    paddingLeft: "5px",
  },
  groupsHeaders: {
    position: "-webkit-sticky",
    position: "sticky",
    top: "-9px",
    backgroundColor: "#d4e7fce0",
    zIndex: "4000",
  },
  groupsButton: {
    margin: "3px",
    zIndex: "2000",
    color: "#5f5f5f",
  },
  textF: {
    "& input": { color: "#ffffffc9", height: "5px" },
    "& .MuiInputBase-adornedStart, .MuiInputBase-adornedEnd": {
      padding: "9px 0 !important",
    },
  },
  score: {
    position: "absolute",
    top: "-8px",
    width: "17px",
    height: "16px",
    borderRadius: "50%",
    marginLeft: "10px",
  },
  headerButtons: {
    width: "100%",
    margin: "0 4px",
    minWidth: "max-content",
  },
  historyPopover: {
    "& .MuiPopover-paper": {
      width: "calc(100% - 42px) !important",
      maxWidth: "none !important",
      minWidth: "unset !important",
      maxHeight: "55vh !important",
    },
  },
  historyRow: {
    "&:hover": {
      backgroundColor: "#EFEFEF",
      cursor: "pointer",
    },
  },
  startAdornmentIcon: {
    padding: "6px 8px",
    cursor: "pointer",
  },
}));

export default function Search() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [stateApp, setStateApp] = React.useContext(AppContext);
  const [stateNav, setStateNav] = React.useContext(NavigationContext);
  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState("");
  const [searchOption, setSearchOption] = React.useState("all");
  const [options, setOptions] = React.useState([]);
  const [searchTop, setSearchTop] = React.useState(5);
  const [maxMinWellsScore, setMaxMinWellsScore] = React.useState([0, 0]);
  const [maxMinOwnersScore, setMaxMinOwnersScore] = React.useState([0, 0]);
  const [maxMinOperatosScore, setMaxMinOperatosScore] = React.useState([0, 0]);
  const [maxMinLeasesScore, setMaxMinLeasesScore] = React.useState([0, 0]);
  const [maxMinMapboxSearchScore, setMaxMinMapboxSearchScore] = React.useState([
    0,
    0,
  ]);
  const [searchHistoryList, setSearchHistoryList] = React.useState([]);
  const loaded = React.useRef(false);
  const [loadingWells, setLoadingWells] = React.useState(false);
  const [loadingOwners, setLoadingOwners] = React.useState(false);
  const [loadingLeases, setLoadingLeases] = React.useState(false);
  const [loadingOperators, setLoadingOperators] = React.useState(false);
  const [loadingMapboxSearch, setLoadingMapboxSearch] = React.useState(false);

  const [getOwnerWells, { data: dataOwnerWells }] = useLazyQuery(
    OWNERWELLSQUERY
  );
  const [getWells, { data: dataWells }] = useLazyQuery(WELLSQUERY);

  const [getOperatorWells, { data: dataOperatorWells }] = useLazyQuery(
    OPERATORSLATSLONS
  );
  const [getLeaseWells, { data: dataLeaseWells }] = useLazyQuery(LEASELATSLONS);

  //////////// Search History Begin//////////////////

  // Search History Queries and Mutations
  const [getSearchHistory, { data: searchHistoryData }] = useLazyQuery(
    USERSEARCHHISTORY
  );
  const [addSearchHistory] = useMutation(ADDSEARCHHISTORY);
  const [updateSearchHistory] = useMutation(UPDATESEARCHHISTORY);
  const [removeSearchHistory] = useMutation(REMOVESEARCHHISTORY);

  useEffect(() => {
    if (stateApp && stateApp.user && stateApp.user.mongoId) {
      getSearchHistory({
        variables: {
          userId: stateApp.user.mongoId,
        },
      });
    }
  }, [stateApp.user]);

  useEffect(() => {
    if (searchHistoryData && searchHistoryData.getSearchHistory) {
      const compare = (a, b) => {
        if (a.ts < b.ts) return 1;
        if (a.ts > b.ts) return -1;
        return 0;
      };
      let list = searchHistoryData.getSearchHistory;
      list.sort(compare);

      setSearchHistoryList(list);
    }
  }, [searchHistoryData]);

  useEffect(() => {
    if (searchHistoryList && searchHistoryList.length > 100) {
      ///remove last add
      removeSearchHistory({
        variables: {
          searchId: searchHistoryList[0]._id,
        },
        refetchQueries: ["getSearchHistory"],
        awaitRefetchQueries: true,
      });
    }
  }, [searchHistoryList]);

  //////////// Search History End//////////////////

  //   if (typeof window !== 'undefined' && !loaded.current) {
  //     if (!document.querySelector('#google-maps')) {
  //       loadScript(
  //         'https://maps.googleapis.com/maps/api/js?key=AIzaSyBwRp1e12ec1vOTtGiA4fcCt2sCUS78UYc&libraries=places',
  //         document.querySelector('head'),
  //         'google-maps',
  //       );
  //     }

  //     loaded.current = true;
  //   }

  const callWellSearch = React.useMemo(
    () =>
      throttle((request, top, callback) => {
        const endpoint =
          "https://m1search.search.windows.net/indexes/wellheader-index/docs?api-version=2019-05-06&$count=true&searchFields=WellName,ApiNumber&$top=" +
          top +
          "&search=" +
          request.input;

        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("api-key", "1AE3C6346B38CEB007191D51CFDDFF65");

        const options = {
          method: "GET",
          headers: headers,
        };

        console.log(
          "request made to wellheader-index search at: " + new Date().toString()
        );

        fetch(endpoint, options)
          .then((response) => response.json())
          .then((response) => {
            console.log(response);
            callback(response);
          })
          .catch((error) => {
            console.log(error);
          });
      }, 200),
    []
  );

  const callOwnerSearch = React.useMemo(
    () =>
      throttle((request, top, callback) => {
        const endpoint =
          "https://m1search.search.windows.net/indexes/lod2019-index/docs?api-version=2019-05-06&%24count=true&searchFields=OwnerName%2CAddress1&%24top=" +
          top +
          "&search=" +
          request.input;

        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("api-key", "1AE3C6346B38CEB007191D51CFDDFF65");

        const options = {
          method: "GET",
          headers: headers,
        };

        console.log(
          "request made to lod2019-index search at: " + new Date().toString()
        );

        fetch(endpoint, options)
          .then((response) => response.json())
          .then((response) => {
            console.log(response);
            callback(response);
          })
          .catch((error) => {
            console.log(error);
          });
      }, 200),
    []
  );

  const callOperatorSearch = React.useMemo(
    () =>
      throttle((request, top, callback) => {
        const endpoint =
          "https://m1search.search.windows.net/indexes/operator-index/docs?api-version=2019-05-06&$count=true&searchFields=Operator&$top=" +
          top +
          "&search=" +
          request.input;

        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("api-key", "1AE3C6346B38CEB007191D51CFDDFF65");

        const options = {
          method: "GET",
          headers: headers,
        };

        console.log(
          "request made to operator-index search at: " + new Date().toString()
        );

        fetch(endpoint, options)
          .then((response) => response.json())
          .then((response) => {
            console.log(response);
            callback(response);
          })
          .catch((error) => {
            console.log(error);
          });
      }, 200),
    []
  );

  const callLeaseSearch = React.useMemo(
    () =>
      throttle((request, top, callback) => {
        const endpoint =
          "https://m1search.search.windows.net/indexes/lease-index/docs?api-version=2019-05-06&$count=true&searchFields=Lease,LeaseId&$top=" +
          top +
          "&search=" +
          request.input;

        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("api-key", "1AE3C6346B38CEB007191D51CFDDFF65");

        const options = {
          method: "GET",
          headers: headers,
        };

        console.log(
          "request made to lease-index search at: " + new Date().toString()
        );

        fetch(endpoint, options)
          .then((response) => response.json())
          .then((response) => {
            console.log(response);
            callback(response);
          })
          .catch((error) => {
            console.log(error);
          });
      }, 200),
    []
  );

  const callMapboxSearch = React.useMemo(
    () =>
      throttle((request, top, callback) => {
        const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${
          request.input
        }.json?access_token=${
          stateApp.mapboxglAccessToken
        }&autocomplete=true&country=us%2Cca&limit=${top > 10 ? 10 : top}`;

        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        const options = {
          method: "GET",
          headers,
        };

        fetch(endpoint, options)
          .then((response) => response.json())
          .then((response) => {
            callback(response);
          })
          .catch((error) => {
            console.log(error);
          });
      }, 200),
    []
  );

  React.useEffect(() => {
    // if (!autocompleteService.current && window.google) {
    //   autocompleteService.current = new window.google.maps.places.AutocompleteService();
    // }
    // if (!autocompleteService.current) {
    //   return undefined;
    // }

    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }

    (async () => {
      let newOptions = [];

      Promise.all([
        searchOption == "all" || searchOption == "wells"
          ? callWellSearch({ input: inputValue }, searchTop, (results) => {
              if (results) {
                const indexSource = results["@odata.context"].substring(
                  results["@odata.context"].indexOf("('") + 2,
                  results["@odata.context"].indexOf("')")
                );

                console.log(indexSource);
                newOptions = [
                  ...results.value.map((result) => {
                    result.Score = result["@search.score"];
                    delete result["@search.score"];
                    return {
                      ...result,
                      Source: indexSource,
                      Primary: result.WellName,
                      Secondary: result.ApiNumber,
                    };
                  }),
                  ...newOptions,
                ];

                setMaxMinWellsScore(maxMinScore(results.value));
              }

              setOptions(newOptions);
              setLoadingWells(false);
            })
          : null,
        searchOption == "all" || searchOption == "owners"
          ? callOwnerSearch({ input: inputValue }, searchTop, (results) => {
              if (results) {
                const indexSource = results["@odata.context"].substring(
                  results["@odata.context"].indexOf("('") + 2,
                  results["@odata.context"].indexOf("')")
                );
                console.log(indexSource);
                newOptions = [
                  ...results.value.map((result) => {
                    result.Score = result["@search.score"];
                    delete result["@search.score"];
                    return {
                      ...result,
                      Source: indexSource,
                      Primary: result.OwnerName,
                      Secondary: `${result.Address1}\n${result.Address2}\n${result.City}\n${result.State}\n${result.Zip}`,
                    };
                  }),
                  ...newOptions,
                ];

                setMaxMinOwnersScore(maxMinScore(results.value));
              }

              setOptions(newOptions);
              setLoadingOwners(false);
            })
          : null,
        searchOption == "all" || searchOption == "operators"
          ? callOperatorSearch({ input: inputValue }, searchTop, (results) => {
              if (results) {
                const indexSource = results["@odata.context"].substring(
                  results["@odata.context"].indexOf("('") + 2,
                  results["@odata.context"].indexOf("')")
                );
                console.log(indexSource);
                newOptions = [
                  ...results.value.map((result) => {
                    result.Score = result["@search.score"];
                    delete result["@search.score"];
                    return {
                      ...result,
                      Source: indexSource,
                      Primary: result.Operator,
                      Secondary: null,
                    };
                  }),
                  ...newOptions,
                ];

                setMaxMinOperatosScore(maxMinScore(results.value));
              }

              setOptions(newOptions);
              setLoadingOperators(false);
            })
          : null,
        searchOption == "all" || searchOption == "leases"
          ? callLeaseSearch({ input: inputValue }, searchTop, (results) => {
              if (results) {
                const indexSource = results["@odata.context"].substring(
                  results["@odata.context"].indexOf("('") + 2,
                  results["@odata.context"].indexOf("')")
                );
                console.log(indexSource);
                newOptions = [
                  ...results.value.map((result) => {
                    result.Score = result["@search.score"];
                    delete result["@search.score"];

                    return {
                      ...result,
                      Source: indexSource,
                      Primary:
                        result.Lease &&
                        (result.Lease === "" ||
                          result.Lease === "N/A" ||
                          result.Lease === "(N/A)")
                          ? "--"
                          : result.Lease,
                      Secondary:
                        result.LeaseId &&
                        (result.LeaseId === "" ||
                          result.LeaseId === "N/A" ||
                          result.LeaseId === "(N/A)")
                          ? null
                          : result.LeaseId,
                    };
                  }),
                  ...newOptions,
                ];

                setMaxMinLeasesScore(maxMinScore(results.value));
              }

              setOptions(newOptions);
              setLoadingLeases(false);
            })
          : null,
        searchOption == "all" || searchOption == "locations"
          ? callMapboxSearch({ input: inputValue }, searchTop, (results) => {
              if (results) {
                let resultsMod = results.features
                  ? results.features.map((result) => {
                      return {
                        ...result,
                        Id: result.id,
                        Source: "mapboxSearch",
                        Score: result.relevance ? result.relevance : 0,
                        Primary: result.text ? result.text : "",
                        Secondary: result.place_name
                          ? result.place_name.indexOf(result.text + ", ") === 0
                            ? result.place_name.slice(
                                result.place_name.indexOf(", ") + 2,
                                result.place_name.length
                              )
                            : result.place_name
                          : "",
                      };
                    })
                  : [];

                newOptions = [...newOptions, ...resultsMod];
                setMaxMinMapboxSearchScore(maxMinScore(resultsMod));
              }

              setOptions(newOptions);
              setLoadingMapboxSearch(false);
            })
          : null,
      ]);
    })();
  }, [
    inputValue,
    callWellSearch,
    callOwnerSearch,
    callOperatorSearch,
    callLeaseSearch,
    callMapboxSearch,
    searchOption,
    searchTop,
  ]);

  //// getting wells data from owners ////

  useEffect(() => {
    if (dataOwnerWells && dataOwnerWells.ownerWells) {
      if (dataOwnerWells.ownerWells.length !== 0) {
        let wellsIdsArray = dataOwnerWells.ownerWells.map(
          (item) => item.WellId
        );

        getWells({
          variables: {
            wellIdArray: wellsIdsArray,
            authToken: stateApp.user.authToken,
          },
        });
      } else {
        console.log("Not wells found for the owner");
        stateApp.deactivateUserDefinedLayers(6);
        setStateApp((stateApp) => ({
          ...stateApp,
          wellListFromSearch: null,
        }));
      }
    }
  }, [dataOwnerWells]);

  useEffect(() => {
    if (
      dataWells &&
      dataWells.wells &&
      dataWells.wells.results &&
      dataWells.wells.results.length !== 0
    ) {
      console.log("wells data from search", dataWells.wells.results);

      setStateApp((stateApp) =>
        dataWells.wells.results.length === 1
          ? {
              ...stateApp,
              selectedWell: null,
              fitBounds: null,
              selectedWellId: dataWells.wells.results[0].id.toLowerCase(),
              wellSelectedCoordinates: [
                dataWells.wells.results[0].longitude,
                dataWells.wells.results[0].latitude,
              ],
              wellListFromSearch: dataWells.wells.results,
            }
          : {
              ...stateApp,
              fitBounds: null,
              wellListFromSearch: dataWells.wells.results,
            }
      );
      stateApp.activateUserDefinedLayers(6);
    }
  }, [dataWells]);

  //// getting wells data from  operators////
  useEffect(() => {
    if (dataOperatorWells && dataOperatorWells.operatorLatsLonsArray) {
      if (dataOperatorWells.operatorLatsLonsArray.length !== 0) {
        console.log(
          "wells data from search",
          dataOperatorWells.operatorLatsLonsArray
        );

        setStateApp((stateApp) =>
          dataOperatorWells.operatorLatsLonsArray.length === 1
            ? {
                ...stateApp,
                selectedWell: null,
                fitBounds: null,
                selectedWellId: dataOperatorWells.operatorLatsLonsArray[0].id.toLowerCase(),
                wellSelectedCoordinates: [
                  dataOperatorWells.operatorLatsLonsArray[0].longitude,
                  dataOperatorWells.operatorLatsLonsArray[0].latitude,
                ],
                wellListFromSearch: dataOperatorWells.operatorLatsLonsArray,
              }
            : {
                ...stateApp,
                fitBounds: null,
                wellListFromSearch: dataOperatorWells.operatorLatsLonsArray,
              }
        );
        stateApp.activateUserDefinedLayers(6);
      } else {
        console.log("Not wells found for the operator");
        stateApp.deactivateUserDefinedLayers(6);
        setStateApp((stateApp) => ({
          ...stateApp,
          wellListFromSearch: null,
        }));
      }
    }
  }, [dataOperatorWells]);

  //// getting wells data from  leases ////
  useEffect(() => {
    if (dataLeaseWells && dataLeaseWells.leaseLatsLonsArray) {
      if (dataLeaseWells.leaseLatsLonsArray.length !== 0) {
        console.log(
          "wells data from search",
          dataLeaseWells.leaseLatsLonsArray
        );

        setStateApp((stateApp) =>
          dataLeaseWells.leaseLatsLonsArray.length === 1
            ? {
                ...stateApp,
                selectedWell: null,
                fitBounds: null,
                selectedWellId: dataLeaseWells.leaseLatsLonsArray[0].id.toLowerCase(),
                wellSelectedCoordinates: [
                  dataLeaseWells.leaseLatsLonsArray[0].longitude,
                  dataLeaseWells.leaseLatsLonsArray[0].latitude,
                ],
                wellListFromSearch: dataLeaseWells.leaseLatsLonsArray,
              }
            : {
                ...stateApp,
                fitBounds: null,
                wellListFromSearch: dataLeaseWells.leaseLatsLonsArray,
              }
        );
        stateApp.activateUserDefinedLayers(6);
      } else {
        console.log("Not wells found for the lease");
        stateApp.deactivateUserDefinedLayers(6);
        setStateApp((stateApp) => ({
          ...stateApp,
          wellListFromSearch: null,
        }));
      }
    }
  }, [dataLeaseWells]);

  ///////////////////////////////////////

  const handleChange = (newValue) => {
    console.log("search Selected", newValue);

    if (
      !value ||
      (newValue &&
        (value.Id !== newValue.Id ||
          value.Source !== newValue.Source ||
          value.Primary !== newValue.Primary ||
          value.Secondary !== newValue.Secondary))
    ) {
      //// setting search history
      const setSearchHistory = (search) => {
        if (search.searchId) {
          ///update
          updateSearchHistory({
            variables: {
              searchId: search.searchId,
            },
            refetchQueries: ["getSearchHistory"],
            awaitRefetchQueries: true,
          });
          delete newValue.searchId;
        } else {
          ///add
          addSearchHistory({
            variables: {
              searchHistory: {
                searchData: search,
                user: stateApp.user.mongoId,
              },
            },
            refetchQueries: ["getSearchHistory"],
            awaitRefetchQueries: true,
          });
        }
      };

      setSearchHistory(newValue);
      setValue(newValue);

      //// setting map loader
      setStateApp((stateApp) => ({ ...stateApp, mapCircularLoaderAct: true }));

      //// if well, with lat long
      if (
        newValue &&
        newValue.Source === "wellheader-index" &&
        newValue.Longitude &&
        newValue.Latitude
      ) {
        setStateApp((stateApp) => ({
          ...stateApp,
          fitBounds: null,
          selectedWell: null,
          selectedWellId: newValue.Id ? newValue.Id.toLowerCase() : null,
          wellSelectedCoordinates: [newValue.Longitude, newValue.Latitude],
          wellListFromSearch: [
            {
              id: newValue.Id,
              longitude: newValue.Longitude,
              latitude: newValue.Latitude,
            },
          ],
        }));
        stateApp.activateUserDefinedLayers(6);
      }

      //// if owner
      if (newValue && newValue.Source === "lod2019-index" && newValue.Id) {
        getOwnerWells({
          variables: {
            ownerId: newValue.Id,
          },
        });
      }

      //// if operator
      if (
        newValue &&
        newValue.Source === "operator-index" &&
        newValue.Operator
      ) {
        getOperatorWells({
          variables: {
            operatorName: newValue.Operator,
          },
        });
      }

      //// if lease
      if (
        newValue &&
        newValue.Source === "lease-index" &&
        ((newValue.Lease && newValue.Lease !== "") ||
          (newValue.LeaseId && newValue.LeaseId !== ""))
      ) {
        if (newValue.Lease && newValue.Lease !== "") {
          getLeaseWells({
            variables: {
              fieldName: "Lease",
              value: newValue.Lease,
            },
          });
        } else {
          getLeaseWells({
            variables: {
              fieldName: "LeaseId",
              value: newValue.LeaseId,
            },
          });
        }
      }

      //// if mapboxSearch
      if (newValue && newValue.Source === "mapboxSearch" && newValue.center) {
        let minLong, maxLong, minLat, maxLat;
        if (newValue.bbox) [minLong, minLat, maxLong, maxLat] = newValue.bbox;

        setStateApp((stateApp) => ({
          ...stateApp,
          selectedWell: null,
          selectedWellId: null,
          wellSelectedCoordinates: null,
          wellListFromSearch: [
            {
              id: newValue.Id,
              longitude: newValue.center[0],
              latitude: newValue.center[1],
            },
          ],
          fitBounds: newValue.bbox
            ? { maxLat, minLat, maxLong, minLong }
            : null,
        }));
        stateApp.activateUserDefinedLayers(6);
      }
    }
  };

  //// setting the buttons header /////
  const header = {
    Source: "header",
    Score: 0,
    Id: "0",
    Primary: "",
    Secondary: "",
  };
  let optionsWithHeader = [header, ...options];
  //// adding loader ////
  if (
    (searchOption === "all" &&
      (loadingWells ||
        loadingOwners ||
        loadingOperators ||
        loadingLeases ||
        loadingMapboxSearch)) ||
    (searchOption === "wells" && loadingWells) ||
    (searchOption === "owners" && loadingOwners) ||
    (searchOption === "operators" && loadingOperators) ||
    (searchOption === "leases" && loadingLeases) ||
    (searchOption === "locations" && loadingMapboxSearch)
  ) {
    optionsWithHeader = [header, { ...header, Source: "loader" }];
  }

  return (
    <Autocomplete
      id="cognitive-search-autocomplete"
      getOptionLabel={(option, value) => option.Primary}
      forcePopupIcon
      filterOptions={(x) => x}
      options={optionsWithHeader}
      groupBy={(option) => {
        if (option.Source === "lod2019-index") return "Owners";
        if (option.Source === "wellheader-index") return "Wells";
        if (option.Source === "operator-index") return "Operators";
        if (option.Source === "lease-index") return "Leases";
        if (option.Source === "mapboxSearch") return "Locations";
        if (option.Source === "loader") return "loader";
        return "header";
      }}
      // leftIconButton={<SearchIcon />}
      renderGroup={(option) => {
        if (option.group === "loader")
          return (
            <CircularProgress
              key="loader"
              style={{ margin: "10px 0 0 48%" }}
              size={28}
              color="secondary"
            />
          );

        return option.group === "header" ? (
          <Grid
            key={option.group}
            container
            item
            spacing={0}
            style={{
              position: "relative",
              top: "0",
              backgroundColor: "#ffffff",
              paddingBottom:
                (searchOption === "all" &&
                  (loadingWells ||
                    loadingOwners ||
                    loadingOperators ||
                    loadingLeases ||
                    loadingMapboxSearch)) ||
                (searchOption === "wells" && loadingWells) ||
                (searchOption === "owners" && loadingOwners) ||
                (searchOption === "operators" && loadingOperators) ||
                (searchOption === "leases" && loadingLeases) ||
                (searchOption === "locations" && loadingMapboxSearch) ||
                options.length === 0
                  ? "0"
                  : "9px",
            }}
          >
            <Grid
              item
              xs={12}
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "0 4px",
              }}
            >
              <Button
                className={classes.headerButtons}
                variant={searchOption === "all" ? "contained" : "outlined"}
                size="small"
                color={searchOption === "all" ? "secondary" : "primary"}
                onClick={() => {
                  setSearchTop(5);
                  setSearchOption("all");
                }}
              >
                All
              </Button>
              <Button
                className={classes.headerButtons}
                variant={searchOption === "wells" ? "contained" : "outlined"}
                size="small"
                color={searchOption === "wells" ? "secondary" : "primary"}
                onClick={() => {
                  setSearchTop(5);
                  setSearchOption("wells");
                }}
              >
                Wells
              </Button>
              <Button
                className={classes.headerButtons}
                variant={searchOption === "owners" ? "contained" : "outlined"}
                size="small"
                color={searchOption === "owners" ? "secondary" : "primary"}
                onClick={() => {
                  setSearchTop(5);
                  setSearchOption("owners");
                }}
              >
                Owners
              </Button>
              <Button
                className={classes.headerButtons}
                variant={
                  searchOption === "operators" ? "contained" : "outlined"
                }
                size="small"
                color={searchOption === "operators" ? "secondary" : "primary"}
                onClick={() => {
                  setSearchTop(5);
                  setSearchOption("operators");
                }}
              >
                Operators
              </Button>
              <Button
                className={classes.headerButtons}
                variant={searchOption === "leases" ? "contained" : "outlined"}
                size="small"
                color={searchOption === "leases" ? "secondary" : "primary"}
                onClick={() => {
                  setSearchTop(5);
                  setSearchOption("leases");
                }}
              >
                Leases
              </Button>
              <Button
                className={classes.headerButtons}
                variant={
                  searchOption === "locations" ? "contained" : "outlined"
                }
                size="small"
                color={searchOption === "locations" ? "secondary" : "primary"}
                onClick={() => {
                  setSearchTop(5);
                  setSearchOption("locations");
                }}
              >
                Locations
              </Button>
            </Grid>
          </Grid>
        ) : (
          (searchOption === "all" ||
            searchOption === option.group.toLowerCase()) && (
            <Grid key={option.group} container item>
              <Grid container item xs={12} className={classes.groupsHeaders}>
                <Grid item item xs={6}>
                  <h3 className={classes.groupsHeadersText}>{option.group}</h3>
                </Grid>
                <Grid item xs={6} style={{ textAlign: "right" }}>
                  {searchTop === 5 ? (
                    <Button
                      size="small"
                      className={classes.groupsButton}
                      onClick={() => {
                        setSearchTop(200);
                        setSearchOption(
                          option.group === "Owners"
                            ? "owners"
                            : option.group === "Wells"
                            ? "wells"
                            : option.group === "Operators"
                            ? "operators"
                            : option.group === "Leases"
                            ? "leases"
                            : option.group === "Locations"
                            ? "locations"
                            : "all"
                        );
                      }}
                    >
                      See All Results
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      className={classes.groupsButton}
                      onClick={() => {
                        setSearchTop(5);
                        setSearchOption("all");
                      }}
                    >
                      See Less
                    </Button>
                  )}
                </Grid>
              </Grid>
              <Grid item xs={12}>
                {option.children}
              </Grid>
            </Grid>
          )
        );
      }}
      autoComplete
      includeInputInList
      value={value}
      onChange={(event, newValue) => {
        handleChange(newValue);
      }}
      onInputChange={(event, newInputValue, reason) => {
        if (reason == "input") {
          setInputValue(newInputValue);

          if (newInputValue !== "") {
            //// setting loader
            if (searchOption === "all") {
              setLoadingWells(true);
              setLoadingOwners(true);
              setLoadingOperators(true);
              setLoadingLeases(true);
              setLoadingMapboxSearch(true);
            }
            if (searchOption === "wells") setLoadingWells(true);
            if (searchOption === "owners") setLoadingOwners(true);
            if (searchOption === "operators") setLoadingOperators(true);
            if (searchOption === "leases") setLoadingLeases(true);
            if (searchOption === "locations") setLoadingMapboxSearch(true);
          } else {
            // setValue(null);
            setOptions([]);
            setLoadingWells(false);
            setLoadingOwners(false);
            setLoadingOperators(false);
            setLoadingLeases(false);
            setLoadingMapboxSearch(false);
          }
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          fullWidth
          placeholder="Search by well name, API, owner, operator, lease or a location"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment>
                <div className={classes.startAdornmentIcon}>
                  <SearchIcon htmlColor="#fff" />
                </div>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment>
                <div>
                  <Tooltip title="Search History" placement="top">
                    <IconButton
                      onClick={(event) => {
                        setAnchorEl(event.currentTarget);
                      }}
                    >
                      <ArrowDropDownIcon htmlColor="#fff" />
                    </IconButton>
                  </Tooltip>

                  <Popover
                    onBlur={() => {
                      setAnchorEl(null);
                    }}
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={() => {
                      setAnchorEl(null);
                    }}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    style={{
                      width: document.getElementById("searchBarDivParent")
                        ? document.getElementById("searchBarDivParent")
                            .offsetWidth
                        : "400px",
                    }}
                    className={classes.historyPopover}
                  >
                    {searchHistoryList && searchHistoryList.length > 0 ? (
                      searchHistoryList.map((search, i) => {
                        let option = search.searchData;
                        const parts = parse(option.Primary, Array());

                        return (
                          <Box
                            p={1}
                            key={i}
                            className={classes.historyRow}
                            onClick={() => {
                              setSearchTop(5);
                              setSearchOption(
                                option.Source === "lod2019-index"
                                  ? "owners"
                                  : option.Source === "wellheader-index"
                                  ? "wells"
                                  : option.Source === "operator-index"
                                  ? "operators"
                                  : option.Source === "lease-index"
                                  ? "leases"
                                  : option.group === "mapboxSearch"
                                  ? "locations"
                                  : "all"
                              );
                              setInputValue(
                                option.Primary
                                  ? option.Primary
                                  : option.Secondary
                              );
                              handleChange({ ...option, searchId: search._id });
                            }}
                          >
                            <Grid container spacing={0}>
                              <Grid container item xs={9} alignItems="center">
                                <Grid item>
                                  {option.Source === "lod2019-index" && (
                                    <PersonIcon className={classes.icon} />
                                  )}
                                  {option.Source === "operator-index" && (
                                    <OperatorIcon
                                      className={classes.icon}
                                      color={"#757575"}
                                    />
                                  )}
                                  {option.Source === "wellheader-index" && (
                                    <WellIcon
                                      className={classes.icon}
                                      color={"#757575"}
                                      opacity="1.0"
                                      small
                                    />
                                  )}
                                  {option.Source === "lease-index" && (
                                    <LeaseIcon
                                      className={classes.icon}
                                      color={"#757575"}
                                    />
                                  )}
                                  {option.Source === "mapboxSearch" && (
                                    <LocationOnIcon className={classes.icon} />
                                  )}
                                </Grid>
                                <Grid item xs>
                                  {parts.map((part, index) => (
                                    <span
                                      key={index}
                                      style={{
                                        fontWeight: part.highlight ? 700 : 400,
                                      }}
                                    >
                                      {part.text}
                                    </span>
                                  ))}

                                  {option && option.Secondary && (
                                    <Typography
                                      variant="body2"
                                      color="textSecondary"
                                    >
                                      {option.Secondary}
                                    </Typography>
                                  )}
                                </Grid>
                              </Grid>
                              <Grid container item xs={3} alignItems="center">
                                <Grid item>
                                  <Typography
                                    variant="body2"
                                    style={{ color: "rgb(80, 187, 223)" }}
                                  >
                                    {new Intl.DateTimeFormat("en-US", {
                                      year: "2-digit",
                                      month: "2-digit",
                                      day: "2-digit",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }).format(search.ts)}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Box>
                        );
                      })
                    ) : (
                      <Box p={1}>
                        <Typography>There is no history yet.</Typography>
                      </Box>
                    )}
                  </Popover>
                </div>
              </InputAdornment>
            ),
          }}
          className={classes.textF}
        />
      )}
      renderOption={(option) => {
        if (option.Source === "header" || option.group === "loader")
          return null;
        const parts = parse(option.Primary, Array());

        return (
          <Grid container spacing={0}>
            <Grid container item xs={11} alignItems="center">
              <Grid item>
                {option.Source === "lod2019-index" && (
                  <PersonIcon className={classes.icon} />
                )}
                {option.Source === "operator-index" && (
                  <OperatorIcon className={classes.icon} color={"#757575"} />
                )}
                {option.Source === "wellheader-index" && (
                  <WellIcon
                    className={classes.icon}
                    color={"#757575"}
                    opacity="1.0"
                    small
                  />
                )}
                {option.Source === "lease-index" && (
                  <LeaseIcon className={classes.icon} color={"#757575"} />
                )}
                {option.Source === "mapboxSearch" && (
                  <LocationOnIcon className={classes.icon} />
                )}
              </Grid>
              <Grid item xs>
                {parts.map((part, index) => (
                  <span
                    key={index}
                    style={{ fontWeight: part.highlight ? 700 : 400 }}
                  >
                    {part.text}
                  </span>
                ))}

                {option && option.Secondary && (
                  <Typography variant="body2" color="textSecondary">
                    {option.Secondary}
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Grid container item xs={1} alignItems="center">
              <Grid item style={{ position: "relative" }}>
                <div
                  className={classes.score}
                  style={{
                    zIndex: "1300",
                    backgroundColor: "#12ABE0",
                  }}
                />
                <div
                  className={classes.score}
                  style={{
                    zIndex: "1301",
                    backgroundImage:
                      "repeating-linear-gradient(135deg, #ffffff , #ffffffb7 4.5%, #ffffff 15%)",
                    opacity: calcScoreOpacity(
                      option.Source === "lod2019-index"
                        ? maxMinOwnersScore
                        : option.Source === "wellheader-index"
                        ? maxMinWellsScore
                        : option.Source === "operator-index"
                        ? maxMinOperatosScore
                        : option.Source === "lease-index"
                        ? maxMinLeasesScore
                        : maxMinMapboxSearchScore,
                      option.Score
                    ).toString(),
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        );
      }}
    />
  );
}
