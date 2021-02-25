import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import parse from "autosuggest-highlight/parse";
import throttle from "lodash/throttle";
import debounce from "lodash/debounce";
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
import { useLazyQuery, useMutation } from "@apollo/client";
import { WELLSQUERY } from "../../../graphQL/useQueryWells";
import { OWNERSLATSLONS } from "../../../graphQL/useQueryOwnerLatsLonsArray";
import { OPERATORSLATSLONS } from "../../../graphQL/useQueryOperatorLatsLonsArray";
import { LEASELATSLONS } from "../../../graphQL/useQueryLeaseLatsLonsArray";
import { USERSEARCHHISTORY } from "../../../graphQL/useQueryUserSearchHistory";
import { ADDSEARCHHISTORY } from "../../../graphQL/useMutationAddSearchHistory";
import { UPDATESEARCHHISTORY } from "../../../graphQL/useMutationUpdateSearchHistory";
import { REMOVESEARCHHISTORY } from "../../../graphQL/useMutationRemoveSearchHistory";
import { PAGINATEDCONTACTSQUERY } from "../../../graphQL/useQueryPaginatedContacts";
import { NavigationContext } from "../NavigationContext";
import Popover from "@material-ui/core/Popover";
import Tooltip from "@material-ui/core/Tooltip";
import Box from "@material-ui/core/Box";
import { CircularProgress } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { toggleMapGridCardAtived, setMapGridCardState } from "../../../actions";
import { deepEqualObjects, deepEqual, setStateIfDeepEqual } from "../../Shared/functions";
import ClearIcon from "@material-ui/icons/Clear";


const leaseIndexName = 'lease-index-v2';
const operatorIndexName = 'operator-index';
const wellCogIndexName = "wellheader-index-en-ms";
const ownerCogIndexName = "globalowner-index";


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
  root: {
    height: "42px",
    width: "100%",
    "& .MuiAutocomplete-inputRoot": { maxHeight: "42px" },
  },
  textF: {
    "& input": {
      color: "#ffffffc9",
      height: "5px",
      minWidth: "0 !important",
      visibility: ({ mapGridCardActivated }) =>
        mapGridCardActivated ? "hidden" : "unset",
      opacity: ({ mapGridCardActivated }) => (mapGridCardActivated ? "0" : "1"),
      transition: "opacity 0.5s linear",
    },
    // "& .MuiInputAdornment-root": {
    //   padding: "6px 0 6px 8px",
    //   height: "23px",
    // },
    "& .MuiInputBase-adornedStart, .MuiInputBase-adornedEnd": {
      padding: "9px 0 !important",
    },
  },
  endAdornmentIcon: {
    opacity: ({ mapGridCardActivated }) => (mapGridCardActivated ? "0" : "1"),
    transition: "opacity 1.2s linear",
    "& button": {
      width: ({ mapGridCardActivated }) => (mapGridCardActivated ? "0" : ""),
      transition: "width 1s ",
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
    cursor: "pointer",
    height: "23px",
  },
}));

function Search() {
  const dispatch = useDispatch();
  const {
    mapGridCardActivated,
    mapGridCardActiveTap,
    searchInputValue,
    objToPopulateSearchLayer,
  } = useSelector(({ MapGridCard }) => MapGridCard);
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
  const [maxMinContactsScore, setMaxMinContactsScore] = React.useState([0, 0]);
  const [maxMinMapboxSearchScore, setMaxMinMapboxSearchScore] = React.useState([
    0,
    0,
  ]);
  const [searchHistoryList, setSearchHistoryList] = React.useState([]);
  const loaded = React.useRef(false);
  const [loadingWells, setLoadingWells] = React.useState(false);
  const [loadingOwners, setLoadingOwners] = React.useState(false);
  const [loadingLeases, setLoadingLeases] = React.useState(false);
  const [loadingContacts, setLoadingContacts] = React.useState(false);
  const [loadingOperators, setLoadingOperators] = React.useState(false);
  const [loadingMapboxSearch, setLoadingMapboxSearch] = React.useState(false);
  const classes = useStyles({ mapGridCardActivated });

  const [getOwnerWells, { data: dataOwnerWells }] = useLazyQuery(
    OWNERSLATSLONS
  );
  const [getWells, { data: dataWells }] = useLazyQuery(WELLSQUERY);

  const [getOperatorWells, { data: dataOperatorWells }] = useLazyQuery(
    OPERATORSLATSLONS
  );
  const [getLeaseWells, { data: dataLeaseWells }] = useLazyQuery(LEASELATSLONS);

  const setPageInd = (newState) => {
    setStateIfDeepEqual(PageInd, newState);
  };

  const [pageInd, PageInd] = useState(0);

  const setDataContacts = (newState) => {
    setStateIfDeepEqual(DataContacts, newState);
  };

  const [dataContacts, DataContacts] = useState(null);

  const setRows = (newState) => {
    setStateIfDeepEqual(Rows, newState);
  };
  const [rows, Rows] = useState([]);
  const [loading, Loading] = useState(true);
  const setLoading = (newState) => {
    setStateIfDeepEqual(Loading, newState);
  };



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
      let list = [...searchHistoryData.getSearchHistory].sort(
        (a, b) => b.ts - a.ts
      );

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


  const callWellSearch = React.useMemo(
    () =>
      debounce((request, top, callback) => {
        const endpoint =
          "https://m1search.search.windows.net/indexes/wellheader-index-en-ms/docs?api-version=2020-06-30&queryType=full&count=true&searchFields=WellName%2CApiNumber&top=" +
          top +
          "&search=" +
          encodeURIComponent(
            request.input.replace(/\b(?<=\w)(?=\s+)|$(?<=\w)/g, "~")
          );

        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("api-key", "1AE3C6346B38CEB007191D51CFDDFF65");

        const options = {
          method: "GET",
          headers: headers,
        };

        console.log(
          "request made to wellheader-index-en-ms search at: " +
            new Date().toString()
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
      }, 500),
    []
  );

  const callOwnerSearch = React.useMemo(
    () =>
      debounce((request, top, callback) => {
        const endpoint =
          "https://m1search.search.windows.net/indexes/globalowner-index/docs?api-version=2020-06-30&queryType=full&count=true&searchFields=OwnerName&top=" +
          top +
          "&search=" +
          encodeURIComponent(
            request.input.replace(/\b(?<=\w)(?=\s+)|$(?<=\w)/g, "~")
          );

        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("api-key", "1AE3C6346B38CEB007191D51CFDDFF65");

        const options = {
          method: "GET",
          headers: headers,
        };

        console.log(
          "request made to globalowner-index search at: " +
            new Date().toString()
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
      }, 500),
    []
  );

  const callOperatorSearch = React.useMemo(
    () =>
      debounce((request, top, callback) => {
        const endpoint =
          "https://m1search.search.windows.net/indexes/"+operatorIndexName+"/docs?api-version=2020-06-30&queryType=full&ount=true&searchFields=Operator&top=" +
          top +
          "&search=" +
          encodeURIComponent(
            request.input.replace(/\b(?<=\w)(?=\s+)|$(?<=\w)/g, "~")
          );

        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("api-key", "1AE3C6346B38CEB007191D51CFDDFF65");

        const options = {
          method: "GET",
          headers: headers,
        };

        console.log(
          "request made to operator search at: " + new Date().toString()
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
      }, 500),
    []
  );

  const callLeaseSearch = React.useMemo(
    () =>
      debounce((request, top, callback) => {
        const endpoint =
          "https://m1search.search.windows.net/indexes/"+leaseIndexName+"/docs?api-version=2020-06-30&queryType=full&count=true&searchFields=Lease%2CLeaseId&top=" +
          top +
          "&search=" +
          encodeURIComponent(
            request.input.replace(/\b(?<=\w)(?=\s+)|$(?<=\w)/g, "~")
          );

        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("api-key", "1AE3C6346B38CEB007191D51CFDDFF65");

        const options = {
          method: "GET",
          headers: headers,
        };

        console.log(
          "request made to lease search at: " + new Date().toString()
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
      }, 500),
    []
  );

  // const searchRequest = (e) => {
  //   /// this function takes the search request and sends it to gql
  //   console.log('eeeeeee',e)
  //   getPaginatedContacts({
  //     variables: {
  //       search: e.input,
  //     },
  //   });
  // };





///////// CALLING DATA FOR CONTACTS SEARCH VIA MONGO ////////

  const [getPaginatedContacts, { data: constDataContacts }] = useLazyQuery(
    PAGINATEDCONTACTSQUERY,
    {
      fetchPolicy: "no-cache",
    }
  );


  const callContactsSearch = React.useMemo(
    () =>
    debounce((request, top, callback) => {

      /// this function takes the search request and sends it to gql
      getPaginatedContacts({
        variables: {
          search: request.input,
        },
      });

    }, 500),
    []
  );

  useEffect(() => {
    // this use effect takes the contactdata once it comes in from the gql query
    // and flattens things into an array 
    // that presents options up to the search menu bar (called newOptions)

    if (
      constDataContacts 
    ) {
      var newOptions = [];
      var newOptions = [

        ...constDataContacts.paginatedContacts.edges.map((result) => {

          result = result.node;
          result.Source = 'contacts-index'
          
          if(result.name){
            result.Primary = result.name
          } else {
            result.Primary = "--"
          }; 

          if(result.address1 || result.city || result.state){
            result.Secondary = result.address1 + ' ' + result.city+ ', ' + result.state+ ' ' + result.zip
          } else {
            result.Secondary = "--"
          }; 

          return result
          
        }),
        ...newOptions,
      ];

      setOptions(newOptions);
      setLoadingContacts(false);

    }
  }, [
    constDataContacts,
  ]);

  //////// >>>>>>>>> END 






  const callMapboxSearch = React.useMemo(
    () =>
      debounce((request, top, callback) => {
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
      }, 500),
    []
  );

  

  React.useEffect(() => {

    if (!mapGridCardActivated) {
      if (searchInputValue === "") {
        setOptions(value ? [value] : []);
        setValue(null);
        setStateApp((state) => ({ ...state, wellListFromSearch: [] }));
        return undefined;
      }

      (async () => {
        let newOptions = [];

        Promise.all([
          searchOption == "all" || searchOption == "wells"
            ? callWellSearch(
                { input: searchInputValue },
                searchTop,
                (results) => {
                  if (results) {
                    const indexSource = results["@odata.context"].substring(
                      results["@odata.context"].indexOf("('") + 2,
                      results["@odata.context"].indexOf("')")
                    );

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
                }
              )
            : null,
          searchOption == "all" || searchOption == "owners"
            ? callOwnerSearch(
                { input: searchInputValue },
                searchTop,
                (results) => {
                  if (results) {
                    const indexSource = results["@odata.context"].substring(
                      results["@odata.context"].indexOf("('") + 2,
                      results["@odata.context"].indexOf("')")
                    );
                    newOptions = [
                      ...results.value.map((result) => {
                        result.Score = result["@search.score"];
                        delete result["@search.score"];
                        return {
                          ...result,
                          Source: indexSource,
                          Primary: result.OwnerName,
                          Secondary: `${result.StreetAddress}\n${result.City}\n${result.State}\n${result.Zip}`,
                        };
                      }),
                      ...newOptions,
                    ];

                    setMaxMinOwnersScore(maxMinScore(results.value));
                  }

                  setOptions(newOptions);
                  setLoadingOwners(false);
                }
              )
            : null,
          searchOption == "all" || searchOption == "operators"
            ? callOperatorSearch(
                { input: searchInputValue },
                searchTop,
                (results) => {
                  if (results) {
                    const indexSource = results["@odata.context"].substring(
                      results["@odata.context"].indexOf("('") + 2,
                      results["@odata.context"].indexOf("')")
                    );
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
                }
              )
            : null,
          searchOption == "all" || searchOption == "leases"
            ? callLeaseSearch(
                { input: searchInputValue },
                searchTop,
                (results) => {
                  if (results) {
                    const indexSource = results["@odata.context"].substring(
                      results["@odata.context"].indexOf("('") + 2,
                      results["@odata.context"].indexOf("')")
                    );
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
                }
              )
            : null,

          // searchOption == "all" || searchOption == "contacts"
          //   ? callContactsSearch(
          //       { input: searchInputValue },
          //       searchTop,
          //     )
          //   : null,

          searchOption == "all" || searchOption == "locations"
            ? callMapboxSearch(
                { input: searchInputValue },
                searchTop,
                (results) => {
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
                              ? result.place_name.indexOf(
                                  result.text + ", "
                                ) === 0
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
                }
              )
            : null,
        ]);
      })();
    }
  }, [
    searchInputValue,
    callWellSearch,
    callOwnerSearch,
    callOperatorSearch,
    callLeaseSearch,
    // callContactsSearch,
    callMapboxSearch,
    searchOption,
    searchTop,
  ]);

  //// getting wells data from owners ////

  useEffect(() => {
    if (dataOwnerWells && dataOwnerWells.ownerLatsLonsArray) {
      if (dataOwnerWells.ownerLatsLonsArray.length !== 0) {


        setStateApp((stateApp) =>
          dataOwnerWells.ownerLatsLonsArray.length === 1
            ? {
                ...stateApp,
                selectedWell: null,
                fitBounds: null,
                selectedWellId: dataOwnerWells.ownerLatsLonsArray[0].id.toLowerCase(),
                wellSelectedCoordinates: [
                  dataOwnerWells.ownerLatsLonsArray[0].longitude,
                  dataOwnerWells.ownerLatsLonsArray[0].latitude,
                ],
                wellListFromSearch: [...dataOwnerWells.ownerLatsLonsArray],
              }
            : {
                ...stateApp,
                fitBounds: null,
                wellListFromSearch: [...dataOwnerWells.ownerLatsLonsArray],
              }
        );

        stateApp.toggleLayersActivity("Search", true);
      } else {
        stateApp.toggleLayersActivity("Search", false);
        setStateApp((stateApp) => ({
          ...stateApp,
          wellListFromSearch: [],
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
              wellListFromSearch: [...dataWells.wells.results],
            }
          : {
              ...stateApp,
              fitBounds: null,
              wellListFromSearch: [...dataWells.wells.results],
            }
      );
      stateApp.toggleLayersActivity("Search", true);
    }
  }, [dataWells]);

  //// getting wells data from  operators////
  useEffect(() => {
    if (dataOperatorWells && dataOperatorWells.operatorLatsLonsArray) {
      if (dataOperatorWells.operatorLatsLonsArray.length !== 0) {

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
                wellListFromSearch: [
                  ...dataOperatorWells.operatorLatsLonsArray,
                ],
              }
            : {
                ...stateApp,
                fitBounds: null,
                wellListFromSearch: [
                  ...dataOperatorWells.operatorLatsLonsArray,
                ],
              }
        );
        stateApp.toggleLayersActivity("Search", true);
      } else {
        stateApp.toggleLayersActivity("Search", false);
        setStateApp((stateApp) => ({
          ...stateApp,
          wellListFromSearch: [],
        }));
      }
    }
  }, [dataOperatorWells]);

  //// getting wells data from  leases ////
  useEffect(() => {
    if (dataLeaseWells && dataLeaseWells.leaseLatsLonsArray) {
      if (dataLeaseWells.leaseLatsLonsArray.length !== 0) {


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
                wellListFromSearch: [...dataLeaseWells.leaseLatsLonsArray],
              }
            : {
                ...stateApp,
                fitBounds: null,
                wellListFromSearch: [...dataLeaseWells.leaseLatsLonsArray],
              }
        );
        stateApp.toggleLayersActivity("Search", true);
      } else {
        stateApp.toggleLayersActivity("Search", false);
        setStateApp((stateApp) => ({
          ...stateApp,
          wellListFromSearch: [],
        }));
      }
    }
  }, [dataLeaseWells]);



  //////////////////////////////////// populating the search layer from external resource ////
  useEffect(() => {
    if (objToPopulateSearchLayer) {
      //// if owner
      if (
        objToPopulateSearchLayer.objectType === "owner" &&
        objToPopulateSearchLayer.objectId
      ) {
        getOwnerWells({
          variables: {
            ownerId: objToPopulateSearchLayer.objectId,
          },
        });
      }

      //// if multiple wells
      if (
        objToPopulateSearchLayer.objectType === "wells" &&
        objToPopulateSearchLayer.wells
      ) {
        if (objToPopulateSearchLayer.wells.length !== 0) {
          setStateApp((stateApp) =>
            objToPopulateSearchLayer.wells.length === 1
              ? {
                  ...stateApp,
                  selectedWell: null,
                  fitBounds: null,
                  selectedWellId: objToPopulateSearchLayer.wells[0].id.toLowerCase(),
                  wellSelectedCoordinates: [
                    objToPopulateSearchLayer.wells[0].longitude,
                    objToPopulateSearchLayer.wells[0].latitude,
                  ],
                  wellListFromSearch: [...objToPopulateSearchLayer.wells],
                }
              : {
                  ...stateApp,
                  fitBounds: null,
                  wellListFromSearch: [...objToPopulateSearchLayer.wells],
                }
          );
          stateApp.toggleLayersActivity("Search", true);
        } else {
          stateApp.toggleLayersActivity("Search", false);
          setStateApp((stateApp) => ({
            ...stateApp,
            wellListFromSearch: [],
          }));
        }
      }

      //// add others types here
      /////////////////////////////////
      dispatch(
        setMapGridCardState({
          objToPopulateSearchLayer: null,
        })
      );
    }
  }, [objToPopulateSearchLayer]);

  ///////////////////////////////////////

  const handleChange = (newValue) => {
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

      dispatch(
        setMapGridCardState({
          mapGridCardActiveTap: 0,
          searchInputValue: newValue.Primary
            ? newValue.Primary
            : newValue.Secondary
            ? newValue.Secondary
            : "",
        })
      );

      //// setting map loader
      setStateApp((stateApp) => ({ ...stateApp, mapCircularLoaderAct: true }));

      //// if well, with lat long
      if (
        newValue &&
        newValue.Source === wellCogIndexName &&
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
        stateApp.toggleLayersActivity("Search", true);
      }

      //// if owner
      if (newValue && newValue.Source === ownerCogIndexName && newValue.Id) {
        getOwnerWells({
          variables: {
            ownerId: newValue.Id,
          },
        });
      }

      //// if operator
      if (
        newValue &&
        newValue.Source === "operatorIndexName" &&
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
        newValue.Source === leaseIndexName &&
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


      //// if contact
      // if (
      //   newValue &&
      //   newValue.Source === "contacts-index" &&
      //   ((newValue.Lease && newValue.Lease !== "") ||
      //     (newValue.LeaseId && newValue.LeaseId !== ""))
      // ) {
      //   if (newValue.Lease && newValue.Lease !== "") {
      //     getLeaseWells({
      //       variables: {
      //         fieldName: "Lease",
      //         value: newValue.Lease,
      //       },
      //     });
      //   } else {
      //     getLeaseWells({
      //       variables: {
      //         fieldName: "LeaseId",
      //         value: newValue.LeaseId,
      //       },
      //     });
      //   }
      // }

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
        stateApp.toggleLayersActivity("Search", true);
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
        // loadingContacts ||
        loadingMapboxSearch)) ||
    (searchOption === "wells" && loadingWells) ||
    (searchOption === "owners" && loadingOwners) ||
    (searchOption === "operators" && loadingOperators) ||
    (searchOption === "leases" && loadingLeases) ||
    // (searchOption === "contacts" && loadingContacts) ||
    (searchOption === "locations" && loadingMapboxSearch)
  ) {
    optionsWithHeader = [header, { ...header, Source: "loader" }];
  }

  return (
    <div className={classes.root}>
      <Autocomplete
        id="cognitive-search-autocomplete"
        getOptionLabel={(option, value) => option.Primary}
        forcePopupIcon
        filterOptions={(x) => x}
        options={optionsWithHeader}
        groupBy={(option) => {
          if (option.Source === ownerCogIndexName) return "Owners";
          if (option.Source === wellCogIndexName) return "Wells";
          if (option.Source === operatorIndexName) return "Operators";
          if (option.Source === leaseIndexName) return "Leases";
          // if (option.Source === "contacts-index") return "Contacts";
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
            <div>
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
                      // loadingContacts ||
                      loadingMapboxSearch)) ||
                  (searchOption === "wells" && loadingWells) ||
                  (searchOption === "owners" && loadingOwners) ||
                  (searchOption === "operators" && loadingOperators) ||
                  (searchOption === "leases" && loadingLeases) ||
                  // (searchOption === "contacts" && loadingContacts) ||
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
                    // setSearchTop(5);
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
                    // setSearchTop(5);
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
                    // setSearchTop(5);
                    setSearchOption("owners");
                  }}
                >
                  Tax Owners
                </Button>
                <Button
                  className={classes.headerButtons}
                  variant={
                    searchOption === "operators" ? "contained" : "outlined"
                  }
                  size="small"
                  color={searchOption === "operators" ? "secondary" : "primary"}
                  onClick={() => {
                    // setSearchTop(5);
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
                    // setSearchTop(5);
                    setSearchOption("leases");
                  }}
                >
                  Leases
                </Button>
                {/* <Button
                  className={classes.headerButtons}
                  variant={
                    searchOption === "contacts" ? "contained" : "outlined"
                  }
                  size="small"
                  color={searchOption === "contacts" ? "secondary" : "primary"}
                  onClick={() => {
                    setSearchOption("contacts");
                  }}
                >
                  Contacts
                </Button> */}
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
            </div>
          ) : (
            (searchOption === "all" ||
              searchOption === option.group.toLowerCase()) && (
              <Grid key={option.group} container item>
                <Grid container item xs={12} className={classes.groupsHeaders}>
                  <Grid item item xs={6}>
                    <h3 className={classes.groupsHeadersText}>
                      {option.group}
                    </h3>
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
                              // : option.group === "Contacts"
                              // ? "contacts"
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

            dispatch(
              setMapGridCardState({
                mapGridCardActiveTap:
                  newInputValue === ""
                    ? mapGridCardActiveTap === 0
                      ? 1
                      : mapGridCardActiveTap
                    : 0,
                searchInputValue: newInputValue,
              })
            );

            if (newInputValue !== "") {
              //// setting loader
              if (searchOption === "all") {
                setLoadingWells(true);
                setLoadingOwners(true);
                setLoadingOperators(true);
                setLoadingLeases(true);
                // setLoadingContacts(false);
                setLoadingMapboxSearch(true);
              }
              if (searchOption === "wells") setLoadingWells(true);
              if (searchOption === "owners") setLoadingOwners(true);
              if (searchOption === "operators") setLoadingOperators(true);
              if (searchOption === "leases") setLoadingLeases(true);
              // if (searchOption === "contacts") setLoadingContacts(true);
              if (searchOption === "locations") setLoadingMapboxSearch(true);
            } else {
              // setValue(null);
              setOptions([]);
              setLoadingWells(false);
              setLoadingOwners(false);
              setLoadingOperators(false);
              setLoadingLeases(false);
              // setLoadingContacts(false);
              setLoadingMapboxSearch(false);
            }
          }
        }}
        renderInput={(params) => (

          <div>
          <TextField
            {...params}
            variant="outlined"
            fullWidth
            placeholder="Search by well name, API, owner, operator, lease or a location"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment className={classes.startAdornmentIcon}>
                  <Button
                    style={{ minWidth: "0", height: "42px" }}
                    onClick={() => {
                      if (mapGridCardActivated)
                        dispatch(toggleMapGridCardAtived());
                    }}
                  >
                    <SearchIcon htmlColor="#fff" />
                  </Button>
                </InputAdornment>
              ),
              endAdornment: !mapGridCardActivated && (
                <InputAdornment className={classes.endAdornmentIcon}>
                  <div>
                    {((searchInputValue && searchInputValue !== "") ||
                      (stateApp.wellListFromSearch &&
                        stateApp.wellListFromSearch.length > 0)) && (
                      <Tooltip title="Clear" placement="top">
                        <IconButton
                          size="small"
                          onClick={() => {
                            dispatch(
                              setMapGridCardState({
                                searchInputValue: "",
                                searchResultData: [],
                              })
                            );
                            setStateApp((state) => ({
                              ...state,
                              wellListFromSearch: [],
                            }));
                          }}
                        >
                          <ClearIcon htmlColor="#fff" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Search History" placement="top">
                      <IconButton
                        size="small"
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

                          /// THIS IS THEI LIST FOR THE SEARCH HISTORY 
                          return (
                            <div>
                            <Box
                              p={1}
                              key={i}
                              className={classes.historyRow}
                              onClick={() => {
                                setSearchTop(5);
                                setSearchOption(
                                  option.Source === ownerCogIndexName
                                    ? "owners"
                                    : option.Source === wellCogIndexName
                                    ? "wells"
                                    : option.Source === operatorIndexName
                                    ? "operators"
                                    : option.Source === leaseIndexName
                                    ? "leases"
                                    // : option.Source === "contacts-index"
                                    // ? "contacts"
                                    : option.group === "mapboxSearch"
                                    ? "locations"
                                    : "all"
                                );

                                dispatch(
                                  setMapGridCardState({
                                    mapGridCardActiveTap: 0,
                                    searchInputValue: option.Primary
                                      ? option.Primary
                                      : option.Secondary,
                                  })
                                );
                                handleChange({
                                  ...option,
                                  searchId: search._id,
                                });
                              }}
                            >
                              <Grid container spacing={0}>
                                <Grid container item xs={9} alignItems="center">
                                  <Grid item>
                                    {option.Source === ownerCogIndexName && (
                                      <PersonIcon className={classes.icon} />
                                    )}
                                    {/* {option.Source === "contacts-index" && (
                                      //will need to change this to something different 
                                      <PersonIcon className={classes.icon} />
                                    )} */}
                                    {option.Source === operatorIndexName && (
                                      <OperatorIcon
                                        className={classes.icon}
                                        color={"#757575"}
                                      />
                                    )}
                                    {option.Source ===
                                      wellCogIndexName && (
                                      <WellIcon
                                        className={classes.icon}
                                        color={"#757575"}
                                        opacity="1.0"
                                        small
                                      />
                                    )}
                                    {option.Source === leaseIndexName && (
                                      <LeaseIcon
                                        className={classes.icon}
                                        color={"#757575"}
                                      />
                                    )}
                                    {option.Source === "mapboxSearch" && (
                                      <LocationOnIcon
                                        className={classes.icon}
                                      />
                                    )}
                                  </Grid>
                                  <Grid item xs>
                                    {parts.map((part, index) => (
                                      <span
                                        key={index}
                                        style={{
                                          fontWeight: part.highlight
                                            ? 700
                                            : 400,
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
                            </div>
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
          </div>
        )}
        renderOption={(option) => {
          if (option.Source === "header" || option.group === "loader")
            return null;
          const parts = parse(option.Primary, Array());

          return (
            <Grid container spacing={0}>
              <Grid container item xs={11} alignItems="center">
                <Grid item>
                  {option.Source === ownerCogIndexName && (
                    <PersonIcon className={classes.icon} />
                  )}
                  {option.Source === operatorIndexName && (
                    <OperatorIcon className={classes.icon} color={"#757575"} />
                  )}
                  {option.Source === wellCogIndexName && (
                    <WellIcon
                      className={classes.icon}
                      color={"#757575"}
                      opacity="1.0"
                      small
                    />
                  )}
                  {option.Source === leaseIndexName && (
                    <div>
                    <WellIcon className={classes.icon} color={"#757575"} />
                    </div>
                  )}
                  {/* {option.Source === "contacts-index" && (
                    //will need to change this to something different
                    <PersonIcon className={classes.icon} color={"#757575"} />
                  )} */}
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
                        option.Source === ownerCogIndexName
                          ? maxMinOwnersScore
                          : option.Source === wellCogIndexName
                          ? maxMinWellsScore
                          : option.Source === operatorIndexName
                          ? maxMinOperatosScore
                          : option.Source === leaseIndexName
                          ? maxMinLeasesScore
                          // : option.Source === "contacts-index"
                          // ? maxMinContactsScore
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
    </div>
  );
}

export default React.memo(Search, deepEqualObjects);
