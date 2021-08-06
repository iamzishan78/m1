import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import parse from "autosuggest-highlight/parse";
import debounce from "lodash/debounce";
import Button from "@material-ui/core/Button";
import PersonIcon from "@material-ui/icons/Person";

import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";


// contexts 
import { AppContext } from "../../../AppContext";
import { NavigationContext } from "../NavigationContext";

// queries 
import { useLazyQuery, useMutation } from "@apollo/client";
import { OWNERWELLSQUERY } from "../../../graphQL/useQueryOwnerWells ";
import { WELLSQUERY } from "../../../graphQL/useQueryWells";
import { OWNERSLATSLONS } from "../../../graphQL/useQueryOwnerLatsLonsArray";
import { OPERATORSLATSLONS } from "../../../graphQL/useQueryOperatorLatsLonsArray";
import { LEASELATSLONS } from "../../../graphQL/useQueryLeaseLatsLonsArray";
import { USERSEARCHHISTORY } from "../../../graphQL/useQueryUserSearchHistory";
import { ADDSEARCHHISTORY } from "../../../graphQL/useMutationAddSearchHistory";
import { UPDATESEARCHHISTORY } from "../../../graphQL/useMutationUpdateSearchHistory";
import { REMOVESEARCHHISTORY } from "../../../graphQL/useMutationRemoveSearchHistory";
import { PAGINATEDCONTACTSQUERY } from "../../../graphQL/useQueryPaginatedContacts";
import { CONTACTWELLS } from "../../../graphQL/useQueryContactWells";
import { PAGINATEDWELLSQUERY } from "graphQL/useQueryPaginatedWells";
import { PAGINATEDOWNERSQUERY } from "graphQL/useQueryPaginatedOwner";
import { PAGINATEDOPERATORSQUERY } from "graphQL/useQueryPaginatedOperators";
import { PAGINATEDLEASESQUERY } from "graphQL/useQueryPaginatedLeases";

// custom components 
import { toggleMapGridCardAtived, setMapGridCardState } from "../../../actions";
import { deepEqualObjects, deepEqual, setStateIfDeepEqual } from "../../Shared/functions";
import WellIcon from "../../Shared/svgIcons/well";
import LeaseGrayIcon from "../../Shared/svgIcons/lease-gray";
import OperatorIcon from "../../Shared/svgIcons/operator";
import LeaseIcon from "../../Shared/svgIcons/lease";


// 3rd party components
import Popover from "@material-ui/core/Popover";
import Tooltip from "@material-ui/core/Tooltip";
import Box from "@material-ui/core/Box";
import { CircularProgress } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const leaseIndexName = 'lease-index-v2';
const operatorIndexName = 'operator-index';
const wellCogIndexName = "wellheader-index-en-ms";
const ownerCogIndexName = "globalowner-index";
const contactIndexName = 'contacts-index';


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
      visibility: "unset",
      opacity: "1",
      // visibility: ({ mapGridCardActivated }) =>
      //   mapGridCardActivated ? "hidden" : "unset",
      // opacity: ({ mapGridCardActivated }) => (mapGridCardActivated ? "0" : "1"),
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
    opacity: "1",
    // opacity: ({ mapGridCardActivated }) => (mapGridCardActivated ? "0" : "1"),
    transition: "opacity 1.2s linear",
    "& button": {
      width: "",
      // width: ({ mapGridCardActivated }) => (mapGridCardActivated ? "0" : ""),
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
    lastSearch,
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

  // loaders 
  const [loadingWells, setLoadingWells] = React.useState(false);
  const [loadingOwners, setLoadingOwners] = React.useState(false);
  const [loadingLeases, setLoadingLeases] = React.useState(false);
  const [loadingContacts, setLoadingContacts] = React.useState(false);
  const [loadingOperators, setLoadingOperators] = React.useState(false);
  const [loadingMapboxSearch, setLoadingMapboxSearch] = React.useState(false);
  const classes = useStyles({ mapGridCardActivated });

  // queries 
  const [getOwnerWells, { data: dataOwnerWells }] = useLazyQuery(OWNERSLATSLONS);
  const [getOperatorWells, { data: dataOperatorWells }] = useLazyQuery(OPERATORSLATSLONS);
  const [getLeaseWells, { data: dataLeaseWells }] = useLazyQuery(LEASELATSLONS);
  const [getContactsWells, { data: dataContactWells }] = useLazyQuery(CONTACTWELLS);
  const [getSearchHistory, { data: searchHistoryData }] = useLazyQuery(USERSEARCHHISTORY);


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

  let location = useLocation();


  //////////// Search History Begin//////////////////

  // Search History Queries and Mutations

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
    if (!value && searchInputValue && value !== searchInputValue) {
      setValue(searchInputValue)
      if (lastSearch?.Source === ownerCogIndexName && lastSearch?.Id) {
        getOwnerWells({
          variables: {
            ownerId: lastSearch.Id,
          },
        });
      }
      else if (lastSearch?.Source === operatorIndexName && lastSearch?.Operator) {
        getOperatorWells({
          variables: {
            operatorName: lastSearch.Operator,
          },
        });
      }
      else if (lastSearch?.Source === contactIndexName && lastSearch?._id) {
        getContactsWells({
          variables: {
            contactId: lastSearch._id,
          },
        });
      }
    }
  }, []);

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
          searchId: searchHistoryList[100]._id,
        },
        refetchQueries: ["getSearchHistory"],
        awaitRefetchQueries: true,
      });
    }
  }, [searchHistoryList]);

  const [getPaginatedWells, { data: constDataWells }] = useLazyQuery(
    PAGINATEDWELLSQUERY,
    { fetchPolicy: "network-only", skip: true }
  );

  const [getPaginatedOwners, { data: constDataOwners }] = useLazyQuery(
    PAGINATEDOWNERSQUERY,
    { fetchPolicy: "network-only", skip: true }
  );

  const [getPaginatedOperators, { data: constDataOperators }] = useLazyQuery(
    PAGINATEDOPERATORSQUERY,
    { fetchPolicy: "network-only", skip: true }
  );

  const [getPaginatedLeases, { data: constDataLeases }] = useLazyQuery(
    PAGINATEDLEASESQUERY,
    { fetchPolicy: "network-only", skip: true }
  );

  //////////// Search History End//////////////////


  const callWellSearch = React.useMemo(
    () =>
      debounce((request, top, callback) => {

        getPaginatedWells({
          variables: {
            search: request.input,
            pageOverride: top
          }
        })

      }, 500),
    []
  );

  const callOwnerSearch = React.useMemo(
    () =>
      debounce((request, top, callback) => {
        getPaginatedOwners({
          variables: {
            search: request.input,
            pageOverride: top
          }
        })
      }, 500),
    []
  );

  const callOperatorSearch = React.useMemo(
    () =>
      debounce((request, top, callback) => {

        getPaginatedOperators({
          variables: {
            search: request.input,
            pageOverride: top
          }
        })
      }, 500),
    []
  );

  const callLeaseSearch = React.useMemo(
    () =>
      debounce((request, top, callback) => {


        getPaginatedLeases({
          variables: {
            search: request.input,
            pageOverride: top
          }
        })

      }, 500),
    []
  );



  ///////// CALLING DATA FOR CONTACTS SEARCH VIA MONGO ////////

  const [getPaginatedContacts, { data: constDataContacts }] = useLazyQuery(
    PAGINATEDCONTACTSQUERY,
    { fetchPolicy: "cache-and-network", skip: true }
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
    let newOptions = []
    if (constDataOperators) {

      newOptions = [
        ...constDataOperators.paginatedOperators.edges.map((result) => {
          return {
            ...result,
            Source: operatorIndexName,
            Primary: result.Operator,
            Secondary: null,
          };
        }),
      ];

      setMaxMinOperatosScore(maxMinScore(constDataOperators.paginatedOperators.edges));

      setOptions(newOptions);
      setLoadingOperators(false);
    }

  }, [constDataOperators])

  useEffect(() => {

    if (constDataWells) {

      let newOptions = [];
      newOptions = [
        ...constDataWells.paginatedWells.edges.map((well) => {
          return {
            ...well,
            Source: wellCogIndexName,
            Primary: well.WellName,
            Secondary: well.ApiNumber,
          };
        })
      ]
      setMaxMinWellsScore(maxMinScore(constDataWells.paginatedWells.edges));

      setOptions(newOptions);
      setLoadingWells(false);

    }
  }, [constDataWells])
  useEffect(() => {
    if (constDataLeases) {
      let newOptions = []

      newOptions = [
        ...constDataLeases.paginatedLeases.edges.map((result) => {
          return {
            ...result,
            Source: leaseIndexName,
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
      ];
      setMaxMinLeasesScore(maxMinScore(constDataLeases.paginatedLeases.edges));

      setOptions(newOptions);
      setLoadingLeases(false);
    }

  }, [constDataLeases])

  useEffect(() => {

    if (constDataOwners) {
      let newOptions
      newOptions = [
        ...constDataOwners.paginatedOwners.edges.map((result) => {
          return {
            ...result,
            Source: ownerCogIndexName,
            Primary: result.OwnerName,
            Secondary: `${result.StreetAddress}\n${result.City}\n${result.State}\n${result.Zip}`,
          };
        }),
      ];

      setMaxMinOwnersScore(maxMinScore(constDataOwners.paginatedOwners.edges));
      setOptions(newOptions);
      setLoadingOwners(false);
    }
  }, [constDataOwners])

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

          result = { ...result.node };
          result.Source = contactIndexName;

          if (result.name) {
            result.Primary = result.name
          } else {
            result.Primary = "--"
          };

          if (result.address1 || result.city || result.state) {
            result.Secondary = result.address1 + ' ' + result.city + ', ' + result.state + ' ' + result.zip
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
    constDataContacts
  ]);

  //////// >>>>>>>>> END 






  const callMapboxSearch = React.useMemo(
    () =>
      debounce((request, top, callback) => {
        const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${request.input
          }.json?access_token=${stateApp.mapboxglAccessToken
          }&autocomplete=true&country=us%2Cca&limit=${top > 50 ? 50 : top}`;

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

            )
            : null,
          searchOption == "all" || searchOption == "owners"
            ? callOwnerSearch(
              { input: searchInputValue },
              searchTop,

            )
            : null,
          searchOption == "all" || searchOption == "operators"
            ? callOperatorSearch(
              { input: searchInputValue },
              searchTop,

            )
            : null,
          searchOption == "all" || searchOption == "leases"
            ? callLeaseSearch(
              { input: searchInputValue },
              searchTop,

            )
            : null,

          searchOption == "all" || searchOption == "contacts"
            ? callContactsSearch(
              { input: searchInputValue },
              searchTop,
            )
            : null,


          // searchOption == "all" || searchOption == "parcels"
          //   ? callParcelSearch(
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
    callContactsSearch,
    // callParcelSearch,
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



  //// getting wells data from contacts ////
  useEffect(() => {
    if (dataContactWells && dataContactWells.contactWells) {
      if (dataContactWells.contactWells.length !== 0) {

        setStateApp((stateApp) =>
          dataContactWells.contactWells.length === 1
            ? {
              ...stateApp,
              selectedWell: null,
              fitBounds: null,
              wellListFromSearch: [...dataContactWells.contactWells],
            }
            : {
              ...stateApp,
              fitBounds: null,
              wellListFromSearch: [...dataContactWells.contactWells],
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
  }, [dataContactWells]);



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
          lastSearch: newValue
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
        newValue.Source === operatorIndexName &&
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


      // if contact
      if (
        newValue &&
        newValue.Source === contactIndexName
        && newValue._id
      ) {
        getContactsWells({
          variables: {
            contactId: newValue._id,
          },
        });
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
        loadingContacts ||
        loadingMapboxSearch)) ||
    (searchOption === "wells" && loadingWells) ||
    (searchOption === "owners" && loadingOwners) ||
    (searchOption === "operators" && loadingOperators) ||
    (searchOption === "leases" && loadingLeases) ||
    (searchOption === "contacts" && loadingContacts) ||
    (searchOption === "locations" && loadingMapboxSearch)
  ) {
    optionsWithHeader = [header, { ...header, Source: "loader" }];
  }
  console.log("orig optionsWithHeader", optionsWithHeader)

  return (
    <div className={classes.root} style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>

      {/* {location.pathname === '/documents' && (
        <Accordion style={{ width: '40px', backgroundColor: 'transparent', display: 'flex', flexDirection: 'column', padding: '0px', }}>

          <AccordionSummary
            // expandIcon={<SearchIcon style={{color:'white',backgroundColor:'transparent'}}></SearchIcon>}

            style={{ maxHeight: '43px', backgroundColor: 'transparent', marginTop: '0px !important' }}
          >
            <SearchIcon style={{ color: 'white', backgroundColor: 'transparent', padding: '0px' }}></SearchIcon>
          </AccordionSummary>
          <AccordionDetails style={{ width: '300px', backgroundColor: 'white', display: 'flex', flexDirection: 'column', padding: '0px', border: '2px solid #d1cfcf', marginTop: '-11px' }}>

            <Typography style={{ padding: '9px', color: 'rgb(24, 170, 221)', cursor: 'pointer' }} variant='subtitle2'>
              All Documents
            </Typography>

            <Typography style={{ padding: '6px', paddingLeft: '9px', backgroundColor: '#f2f2f2', width: '100%', borderTop: '1px solid #d1cfcf' }} variant='subtitle2'>
              Agreements
            </Typography>
            <Typography style={{ padding: '9px', cursor: 'pointer' }} variant='subtitle2'>
              Shapefiles
            </Typography>
          </AccordionDetails>
        </Accordion>
      )
      } */}
      <Autocomplete
        id="cognitive-search-autocomplete"
        getOptionLabel={(option, value) => option.Primary || searchInputValue}
        forcePopupIcon
        filterOptions={(x) => x}
        options={optionsWithHeader}
        groupBy={(option) => {
          if (option.Source === ownerCogIndexName) return "Owners";
          if (option.Source === wellCogIndexName) return "Wells";
          if (option.Source === operatorIndexName) return "Operators";
          if (option.Source === leaseIndexName) return "Leases";
          if (option.Source === contactIndexName) return "Contacts";
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

          return (option.group === "header" && location.pathname !== '/documents') ? (
            <div >
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
                        loadingContacts ||
                        loadingMapboxSearch)) ||
                      (searchOption === "wells" && loadingWells) ||
                      (searchOption === "owners" && loadingOwners) ||
                      (searchOption === "operators" && loadingOperators) ||
                      (searchOption === "leases" && loadingLeases) ||
                      (searchOption === "contacts" && loadingContacts) ||
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
                  {/* <Button

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
                  </Button> */}

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
                  {/* <Button
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
                </Button> */}
                  <Button
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
            </div>
          ) : (
            (searchOption === "all" ||
              searchOption === option.group.toLowerCase()) && location.pathname !== '/documents' && (
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
                                    : option.group === "Contacts"
                                      ? "contacts"
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
        freeSolo
        // autoComplete
        includeInputInList
        value={value}

        // handle change also acts like onClick here 
        onChange={(event, newValue) => {
          if (event.key === 'Enter')
            handleChange(options[0])
          else
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
                setLoadingContacts(true);
                setLoadingMapboxSearch(true);
              }
              if (searchOption === "wells") setLoadingWells(true);
              if (searchOption === "owners") setLoadingOwners(true);
              if (searchOption === "operators") setLoadingOperators(true);
              if (searchOption === "leases") setLoadingLeases(true);
              if (searchOption === "contacts") setLoadingContacts(true);
              if (searchOption === "locations") setLoadingMapboxSearch(true);
            } else {
              // setValue(null);
              setOptions([]);
              setLoadingWells(false);
              setLoadingOwners(false);
              setLoadingOperators(false);
              setLoadingLeases(false);
              setLoadingContacts(false);
              setLoadingMapboxSearch(false);
            }
          }
        }}
        renderInput={(params) => (

          <div>
            {location.pathname === '/documents' ? (
              <div style={{ display: 'flex', justifyContent: "center", alignItems: 'center', backgroundColor: 'transparent' }}>
                {/* <IconButton>
              <SearchIcon style={{color:'white'}}></SearchIcon>
              </IconButton> */}

                <TextField
                  {...params}
                  variant="outlined"
                  fullWidth
                  placeholder={"Search for documents by name"}
                  className={classes.textF}
                >
                </TextField></div>
            ) : (
              <TextField
                {...params}
                variant="outlined"
                fullWidth
                placeholder="Search by well name, API, owner, operator or a location"

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
                  endAdornment: (
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
                                                : option.Source === contactIndexName
                                                  ? "contacts"
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
                                          {option.Source === contactIndexName && (
                                            //will need to change this to something different 
                                            <PersonIcon className={classes.icon} />
                                          )}
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
            )}
          </div>
        )}
        renderOption={(option) => {
          console.log("orig renderOption option", option);
          if (option.Source === "header" || option.group === "loader")
            return null;
          const parts = parse(option.Primary, Array());

          return (
            <Grid container spacing={0} >
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
                      <LeaseGrayIcon className={classes.icon} />
                    </div>
                  )}
                  {option.Source === contactIndexName && (
                    //will need to change this to something different
                    <PersonIcon className={classes.icon} color={"#757575"} />
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
                        option.Source === ownerCogIndexName
                          ? maxMinOwnersScore
                          : option.Source === wellCogIndexName
                            ? maxMinWellsScore
                            : option.Source === operatorIndexName
                              ? maxMinOperatosScore
                              : option.Source === leaseIndexName
                                ? maxMinLeasesScore
                                : option.Source === contactIndexName
                                  ? maxMinContactsScore
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
