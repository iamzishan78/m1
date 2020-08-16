import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { AppContext } from "../../../AppContext";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import parse from "autosuggest-highlight/parse";
import throttle from "lodash/throttle";
import debounce from "lodash/debounce";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { USERSEARCHHISTORY } from "../../../graphQL/useQueryUserSearchHistory";
import { ADDSEARCHHISTORY } from "../../../graphQL/useMutationAddSearchHistory";
import { UPDATESEARCHHISTORY } from "../../../graphQL/useMutationUpdateSearchHistory";
import { REMOVESEARCHHISTORY } from "../../../graphQL/useMutationRemoveSearchHistory";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { setMapGridCardState } from "../../../actions";

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

function MapGridCardSearch(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { searchInputValue, searchloading, searchResultData } = useSelector(
    ({ MapGridCard }) => MapGridCard,
    shallowEqual
  );
  const [stateApp, setStateApp] = useContext(AppContext);
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState([]);
  const [searchTop] = React.useState(100);

  const callWellSearch = React.useMemo(
    () =>
      debounce((request, callback) => {
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
      }, 500),
    []
  );

  const callOwnerSearch = React.useMemo(
    () =>
      debounce((request, callback) => {
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
      }, 500),
    []
  );

  const callOperatorSearch = React.useMemo(
    () =>
      debounce((request, callback) => {
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
      }, 500),
    []
  );

  const callLeaseSearch = React.useMemo(
    () =>
      debounce((request, callback) => {
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
      }, 500),
    []
  );

  const callMapboxSearch = React.useMemo(
    () =>
      debounce((request, callback) => {
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
      }, 500),
    []
  );

  React.useEffect(() => {
    if (searchInputValue === "") {
      if (searchResultData.length !== 0 && searchloading !== false) {
        dispatch(
          setMapGridCardState({ searchResultData: [], searchloading: false })
        );
      }
      return undefined;
    }

    (async () => {
      let newOptions = [];

      Promise.all([
        props.searchOption == "well"
          ? callWellSearch({ input: searchInputValue }, (results) => {
              if (results) {
                const indexSource = results["@odata.context"].substring(
                  results["@odata.context"].indexOf("('") + 2,
                  results["@odata.context"].indexOf("')")
                );

                console.log(indexSource);
                newOptions = [...results.value];
              }

              dispatch(
                setMapGridCardState({
                  searchResultData: [...newOptions],
                  searchloading: false,
                })
              );
            })
          : null,
        props.searchOption == "owner"
          ? callOwnerSearch({ input: searchInputValue }, (results) => {
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

              dispatch(
                setMapGridCardState({
                  searchResultData: [...newOptions],
                  searchloading: false,
                })
              );
            })
          : null,
        props.searchOption == "operator"
          ? callOperatorSearch({ input: searchInputValue }, (results) => {
              if (results) {
                const indexSource = results["@odata.context"].substring(
                  results["@odata.context"].indexOf("('") + 2,
                  results["@odata.context"].indexOf("')")
                );
                console.log(indexSource);
                newOptions = [...results.value];
              }

              dispatch(
                setMapGridCardState({
                  searchResultData: [...newOptions],
                  searchloading: false,
                })
              );
            })
          : null,
        props.searchOption == "lease"
          ? callLeaseSearch({ input: searchInputValue }, (results) => {
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

              dispatch(
                setMapGridCardState({
                  searchResultData: [...newOptions],
                  searchloading: false,
                })
              );
            })
          : null,
        props.searchOption == "location"
          ? callMapboxSearch({ input: searchInputValue }, (results) => {
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

              dispatch(
                setMapGridCardState({
                  searchResultData: [...newOptions],
                  searchloading: false,
                })
              );
            })
          : null,
      ]);
    })();
  }, [
    searchInputValue,
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
        value={searchInputValue}
        onChange={(event) => {
          // setInputValue(event.target.value);
          // if (!searchloading) {
            dispatch(
              setMapGridCardState({
                searchloading: true,
                searchInputValue: event.target.value,
              })
            );
          // }
        }}
      />
    </form>
  );
}

function areEqual(prevProps, nextProps) {
  console.log(`${prevProps.searchOption} ... ${nextProps.searchOption}`)
  return Object.is(prevProps.searchOption, nextProps.searchOption);
}

export default React.memo(MapGridCardSearch, areEqual);