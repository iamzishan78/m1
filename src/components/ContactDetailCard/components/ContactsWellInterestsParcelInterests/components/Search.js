import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { AppContext } from "../../../../../AppContext";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import parse from "autosuggest-highlight/parse";
import throttle from "lodash/throttle";
import debounce from "lodash/debounce";
import { useLazyQuery, useMutation } from "@apollo/client";
import { USERSEARCHHISTORY } from "../../../../../graphQL/useQueryUserSearchHistory";
import { ADDSEARCHHISTORY } from "../../../../../graphQL/useMutationAddSearchHistory";
import { UPDATESEARCHHISTORY } from "../../../../../graphQL/useMutationUpdateSearchHistory";
import { REMOVESEARCHHISTORY } from "../../../../../graphQL/useMutationRemoveSearchHistory";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { setMapGridCardState } from "../../../../../actions";
import { deepEqualObjects } from "../../../../Shared/functions";

// import value formatters 
import joinAddress from "../../../../Shared/valueformatters/join-address.js";


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




function Search(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  // const { searchInputValue, searchLoading, searchResultData } = useSelector(
  //   ({ MapGridCard }) => MapGridCard,
  //   shallowEqual
  // );
  const [stateApp, setStateApp] = useContext(AppContext);
  const [inputValue, setInputValue] = React.useState("");
  const [searchResultData, setSearchResultData] = React.useState([]);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [searchTop] = React.useState(100);

  const callWellSearch = React.useMemo(
    () =>
      debounce((request, callback) => {
        const endpoint =
          "https://m1search.search.windows.net/indexes/wellheader-index-en-ms/docs?api-version=2020-06-30&queryType=full&count=true&searchFields=WellName%2CApiNumber&top=" +
          searchTop +
          "&search=" +
          encodeURIComponent(request.input.replace(/\b(?<=\w)(?=\s+)|$(?<=\w)/g, "~"));

        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("api-key", "1AE3C6346B38CEB007191D51CFDDFF65");

        const options = {
          method: "GET",
          headers: headers,
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

  const callOwnerSearch = React.useMemo(
    () =>
      debounce((request, callback) => {
        const endpoint =
          "https://m1search.search.windows.net/indexes/globalowner-index/docs?api-version=2020-06-30&queryType=full&count=true&searchFields=OwnerName&top=" +
          searchTop +
          "&search=" +
          encodeURIComponent(request.input.replace(/\b(?<=\w)(?=\s+)|$(?<=\w)/g, "~"));

        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("api-key", "1AE3C6346B38CEB007191D51CFDDFF65");

        const options = {
          method: "GET",
          headers: headers,
        };

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

  React.useEffect(() => {
    if (inputValue === "") {
      if (searchResultData.length !== 0 && searchLoading !== false) {
        setSearchResultData([]);
        setSearchLoading(false);
      }
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
                newOptions = [...results.value];
              }

              setSearchResultData([...newOptions]);
              setSearchLoading(false);
            })
          : null,
        props.searchOption == "owner"
          ? callOwnerSearch({ input: inputValue }, (results) => {
              if (results) {
                const indexSource = results["@odata.context"].substring(
                  results["@odata.context"].indexOf("('") + 2,
                  results["@odata.context"].indexOf("')")
                );
                newOptions = [
                  ...results.value.map((result) => {
                    return {
                      ...result,
                      id: result.Id,
                      FullAddress: joinAddress(result),
                    };
                  }),
                ];
              }

              setSearchResultData([...newOptions]);
              setSearchLoading(false);
            })
          : null,
      ]);
    })();
  }, [inputValue, callWellSearch, callOwnerSearch, props.searchOption]);

  return (
    <form
      className={classes.root}
      // noValidate
      // autoComplete="off"
    >
      <TextField
        type="search"
        placeholder="Search existing interests or click the plus icon button in the grid below to add new associated interests manually"
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
        }}
      />
    </form>
  );
}

export default React.memo(Search, deepEqualObjects);
