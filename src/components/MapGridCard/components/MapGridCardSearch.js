import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { AppContext } from "../../../AppContext";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import parse from "autosuggest-highlight/parse";
import throttle from "lodash/throttle";
import Button from "@material-ui/core/Button";
import PersonIcon from "@material-ui/icons/Person";
import WellIcon from "../../Shared/svgIcons/well";
import OperatorIcon from "../../Shared/svgIcons/operator";
import LeaseIcon from "../../Shared/svgIcons/lease";
import IconButton from "@material-ui/core/IconButton";
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
import Popover from "@material-ui/core/Popover";
import Tooltip from "@material-ui/core/Tooltip";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    "& .MuiInput-root": {
      height: "50px",
      paddingRight: "8px",
    },
    "& > div": {
      width: "100%",
    },
  },
  inputAdornment: {
    padding: "0 8px",
    cursor: "context-menu",
    height: "100%",
  },
}));

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const joinAddress = (row) => {
  let rowData = {
    Address1: row.Address1,
    Address2: row.Address2,
    City: row.City,
    State: row.State,
    Zip: row.Zip,
    Country: row.Country,
  };
  let textArray = [];
  for (const key in rowData) {
    if (rowData.hasOwnProperty(key) && rowData[key] && rowData[key] !== "") {
      if (key === "Zip" || key === "Country") {
        textArray = [
          [textArray.join(", "), capitalizeFirstLetter(rowData[key])].join(" "),
        ];
      } else textArray.push(capitalizeFirstLetter(rowData[key]));
    }
  }

  return textArray.join(", ");
};

export default function MapGridCardSearch(props) {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState([]);
  const [searchTop] = React.useState(100);

  const callWellSearch = React.useMemo(
    () =>
      throttle((request, callback) => {
        const endpoint =
          "https://m1search.search.windows.net/indexes/wellheader-index/docs?api-version=2019-05-06&$count=true&searchFields=WellName,ApiNumber&$top=" +
          searchTop +
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
      throttle((request, callback) => {
        const endpoint =
          "https://m1search.search.windows.net/indexes/lod2019-index/docs?api-version=2019-05-06&%24count=true&searchFields=OwnerName%2CAddress1&%24top=" +
          searchTop +
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
      throttle((request, callback) => {
        const endpoint =
          "https://m1search.search.windows.net/indexes/operator-index/docs?api-version=2019-05-06&$count=true&searchFields=Operator&$top=" +
          searchTop +
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
      throttle((request, callback) => {
        const endpoint =
          "https://m1search.search.windows.net/indexes/lease-index/docs?api-version=2019-05-06&$count=true&searchFields=Lease,LeaseId&$top=" +
          searchTop +
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
      throttle((request, callback) => {
        const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${
          request.input
        }.json?access_token=${
          stateApp.mapboxglAccessToken
        }&autocomplete=true&country=us%2Cca&limit=${
          searchTop > 10 ? 10 : searchTop
        }`;

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
    if (inputValue === "") {
      setStateApp((state) => ({
        ...state,
        searchResultData: [],
        searchloading: false,
      }));
      return undefined;
    }

    (async () => {
      let newOptions = [];

      Promise.all([
        props.searchOption == "well"
          ? callWellSearch({ input: inputValue }, (results) => {
              if (results) {
                const indexSource = results["@odata.context"].substring(
                  results["@odata.context"].indexOf("('") + 2,
                  results["@odata.context"].indexOf("')")
                );

                console.log(indexSource);
                newOptions = [...results.value];
              }
              setStateApp((state) => ({
                ...state,
                searchResultData: [...newOptions],
                searchloading: false,
              }));
            })
          : null,
        props.searchOption == "owner"
          ? callOwnerSearch({ input: inputValue }, (results) => {
              if (results) {
                const indexSource = results["@odata.context"].substring(
                  results["@odata.context"].indexOf("('") + 2,
                  results["@odata.context"].indexOf("')")
                );
                console.log(indexSource);
                newOptions = [
                  ...results.value.map((result) => {
                    return {
                      ...result,
                      FullAddress: joinAddress(result),
                    };
                  }),
                ];
              }

              setStateApp((state) => ({
                ...state,
                searchResultData: [...newOptions],
                searchloading: false,
              }));
            })
          : null,
        props.searchOption == "operator"
          ? callOperatorSearch({ input: inputValue }, (results) => {
              if (results) {
                const indexSource = results["@odata.context"].substring(
                  results["@odata.context"].indexOf("('") + 2,
                  results["@odata.context"].indexOf("')")
                );
                console.log(indexSource);
                newOptions = [...results.value];
              }

              setStateApp((state) => ({
                ...state,
                searchResultData: [...newOptions],
                searchloading: false,
              }));
            })
          : null,
        props.searchOption == "lease"
          ? callLeaseSearch({ input: inputValue }, (results) => {
              if (results) {
                const indexSource = results["@odata.context"].substring(
                  results["@odata.context"].indexOf("('") + 2,
                  results["@odata.context"].indexOf("')")
                );
                console.log(indexSource);
                newOptions = [
                  ...results.value.map((result) => {
                    return {
                      ...result,
                      Lease:
                        result.Lease &&
                        (result.Lease === "N/A" || result.Lease === "(N/A)")
                          ? null
                          : result.Lease,
                      LeaseId:
                        result.LeaseId &&
                        (result.LeaseId === "N/A" || result.LeaseId === "(N/A)")
                          ? null
                          : result.LeaseId,
                    };
                  }),
                ];
              }

              setStateApp((state) => ({
                ...state,
                searchResultData: [...newOptions],
                searchloading: false,
              }));
            })
          : null,
        props.searchOption == "location"
          ? callMapboxSearch({ input: inputValue }, (results) => {
              if (results && results.features) {
                newOptions = [
                  ...results.features.map((result) => {
                    return {
                      ...result,
                      Id: result.id,
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
                  }),
                ];
              }

              setStateApp((state) => ({
                ...state,
                searchResultData: [...newOptions],
                searchloading: false,
              }));
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
    props.searchOption,
  ]);

  return (
    <form
      className={`cancelDraggableEffect ${classes.root}`}
      noValidate
      autoComplete="off"
    >
      <TextField
        id="mapGridCardSearch-basic"
        type="search"
        InputProps={{
          startAdornment: (
            <InputAdornment
              className={classes.inputAdornment}
              position="start"
              onClick={(e) => {
                e.stopPropagation();
                props.ativateSearchPanel();
              }}
            >
              <SearchIcon htmlColor="#757575" />
            </InputAdornment>
          ),
        }}
        onClick={props.ativateSearchPanel}
        value={inputValue}
        onChange={(event) => {
          setInputValue(event.target.value);
          if (!stateApp.searchloading)
            setStateApp((state) => ({
              ...state,
              searchloading: true,
            }));
        }}
      />
    </form>
  );
}
