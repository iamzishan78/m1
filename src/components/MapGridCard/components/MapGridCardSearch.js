import React, { useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

// context 
import { AppContext } from "../../../AppContext";
import { MapGridContext } from "../../../components/MapGridCard/MapGridContext.js";


import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import debounce from "lodash/debounce";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { setMapGridCardState } from "../../../actions";

import { useLazyQuery } from "@apollo/client";
import { GET_ES_SIMPLE_SEARCH } from "graphQL/useQueryESSimpleSearch";

const leaseIndexName = 'lease-index-v2';
const operatorIndexName = 'operator-index';
const wellCogIndexName = "wellheader-index";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    "& .MuiInput-root": {
      height: "41px",
      paddingRight: "8px",
      backgroundColor: "white"
    },
    "& > div": {
      width: "350px",
    },
  },
  inputAdornment: {
    padding: "0 8px",
    cursor: "context-menu",
    height: "100%",
  },
}));

function MapGridCardSearch(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { searchInputValue, searchloading, searchResultData } = useSelector(
    ({ MapGridCard }) => MapGridCard,
    shallowEqual
  );

  // contexts 
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateGrid, setStateGrid] = useContext(MapGridContext);


  // function states 
  const [searchTop] = React.useState(100);

  const [getESSimpleSearch, { data: esSearchData }] = useLazyQuery(GET_ES_SIMPLE_SEARCH, { fetchPolicy: "no-cache" });

  const startPaginationAt = 50;

  const setSearchInputValue = React.useMemo(
    () =>
      debounce((request, top, callback) => {
        dispatch(
          setMapGridCardState({
            searchloading: true,
            searchInputValue: `"*${request}*"`,
          })
        );
        setStateGrid((state) => ({
          ...state,
          gridSearchTarget: `"*${request}*"`,
        }));
      }, 500),
    []
  );

  const esCallData = React.useMemo(
    () => ({
      "well": {
        esIndex: "platformData:wells",
        search: (request) => `${request.input}`,
        formatOptions: (data) => {
          return { ...data, Source: wellCogIndexName, Primary: data.WellName, Secondary: data.ApiNumber }
        }
      },
      "contacts": {
        esIndex: "contacts_flat",
        search: (request) => `${request.input}`,
        formatOptions: (data) => {
          return {
            ...data, ...data.node, Primary: data.name || "--",
            Secondary: data.address1 || data.city || data.state ? data.address1 + ' ' + data.city + ', ' + data.state + ' ' + data.zip : "--"
          }
        }
      },
      "owner": {
        esIndex: "platformData:globalowner",
        search: (request) => request.input ? `ownerName:*${request.input}*` : '',
        formatOptions: (data) => {
          return {
            ...data, Source: 'globalowner-index', Primary: data.OwnerName, Secondary: `${data.StreetAddress}\n${data.City}\n${data.State}\n${data.Zip}`,
          }
        }
      },
      "operator": {
        esIndex: "platformData:operator",
        search: (request) => request.input ? `operator:*${request.input}*` : '',

        formatOptions: (data) => {
          return { ...data, Source: operatorIndexName, Primary: data.Operator, Secondary: null }
        }
      },
      "lease": {
        esIndex: "platformData:lease",
        search: (request) => request.input ? `lease:*${request.input}*` : '',
        formatOptions: (data) => {
          return {
            ...data, Source: leaseIndexName, Primary: data.Lease && ["", "N/A", "(N/A)"].includes(data.Lease) ? "--" : data.Lease,
            Secondary: data.LeaseId && ["", "N/A", "(N/A)"].includes(data.LeaseId) ? null : data.LeaseId
          }
        }
      },
      "unit": {
        esIndex: "shapes_flat",
        search: (request) => request.input ? `layer:unit AND name:*${request.input}*` : '',
        formatOptions: (data) => {
          return {
            ...data, Source: 'shapes_flat', Primary: data.name, Secondary: null
          }
        }
      }
    }), [props.searchOption]);

  const callMapboxSearch = React.useMemo(
    () =>
      debounce((request, callback) => {
        const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${request.input
          }.json?access_token=${stateApp.mapboxglAccessToken
          }&autocomplete=true&country=us%2Cca&limit=${searchTop > 50 ? 50 : searchTop
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

  useEffect(() => {
    let newOptions = []
    if (esSearchData) {
      const { formatOptions } = esCallData[props.searchOption]
      newOptions = [
        ...esSearchData.getESSimpleSearch.hits.map((result) => {
          return formatOptions(result);
        }),
      ];
      dispatch(
        setMapGridCardState({
          searchResultData: [...newOptions],
          searchloading: false,
        })
      );
    }
  }, [esSearchData])


  useEffect(() => {
    if (props.searchOption === "location") {
      callMapboxSearch({ input: searchInputValue }, (results) => {
        let newOptions = [];
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchInputValue,
    callMapboxSearch,
    props.searchOption,
  ]);

  return (
    <form
      className={`cancelDraggableEffect ${classes.root}`}
      noValidate
      autoComplete="off"
      onSubmit={(e) => { e.preventDefault(); }}
    >
      <TextField
        id="mapGridCardSearch-basic"
        type="search"
        placeholder={`Search across ${props.searchOption} datasets`}
        InputProps={{
          disableUnderline: true,
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
        // value={searchInputValue}
        defaultValue={searchInputValue}
        onChange={(event) => setSearchInputValue(event.target.value)}
      />
    </form>
  );
}

function areEqual(prevProps, nextProps) {
  return Object.is(prevProps.searchOption, nextProps.searchOption);
}

export default React.memo(MapGridCardSearch, areEqual);