import React, { useState, useContext, useEffect } from "react";
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

// import value formatters 
import joinAddress from "../../Shared/valueformatters/join-address.js";


import { useLazyQuery, useMutation } from "@apollo/client";
import { PAGINATEDCONTACTSQUERY } from "../../../graphQL/useQueryPaginatedContacts";
import { PAGINATEDWELLSQUERY } from "graphQL/useQueryPaginatedWells";
import { PAGINATEDOWNERSQUERY } from "graphQL/useQueryPaginatedOwner";
import { PAGINATEDOPERATORSQUERY } from "graphQL/useQueryPaginatedOperators";
import { PAGINATEDLEASESQUERY } from "graphQL/useQueryPaginatedLeases";

const leaseIndexName = 'lease-index-v2';
const operatorIndexName = 'operator-index';
const wellCogIndexName = "wellheader-index";

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
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState([]);
  const [searchTop] = React.useState(100);




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
          //result.Source = contactIndexName;

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

      // dispatch(
      setMapGridCardState({
        searchResultData: [...newOptions],
        searchloading: false,
      })
      // )

    }
  }, [
    constDataContacts,
  ]);



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
      dispatch(
        setMapGridCardState({
          searchResultData: [...newOptions],
          searchloading: false,
        })
      );
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
      dispatch(
        setMapGridCardState({
          searchResultData: [...newOptions],
          searchloading: false,
        })
      );

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
      dispatch(
        setMapGridCardState({
          searchResultData: [...newOptions],
          searchloading: false,
        })
      );
    }

  }, [constDataLeases])

  useEffect(() => {

    if (constDataOwners) {
      let newOptions
      newOptions = [
        ...constDataOwners.paginatedOwners.edges.map((result) => {
          return {
            ...result,
            Source: 'globalowner-index',
            Primary: result.OwnerName,
            Secondary: `${result.StreetAddress}\n${result.City}\n${result.State}\n${result.Zip}`,
          };
        }),
      ];

      dispatch(
        setMapGridCardState({
          searchResultData: [...newOptions],
          searchloading: false,
        })
      );
    }
  }, [constDataOwners])

  React.useEffect(() => {
    (async () => {
      let newOptions = [];

      Promise.all([
        props.searchOption == "well"
          ? callWellSearch({
            input: searchInputValue,
            searchTop
          })
          : null,
        props.searchOption == "owner"
          ? callOwnerSearch({
            input: searchInputValue,
            searchTop
          })
          : null,
        props.searchOption == "operator"
          ? callOperatorSearch({
            input: searchInputValue,
            searchTop
          })
          : null,
        props.searchOption == "lease"
          ? callLeaseSearch({
            input: searchInputValue,
            searchTop
          })
          : null,

        props.searchOption == "contacts"
          ? callContactsSearch(
            { input: searchInputValue },
            searchTop,
          )
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
    callContactsSearch,
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
          dispatch(
            setMapGridCardState({
              searchloading: true,
              searchInputValue: event.target.value,
            })
          );
          setStateGrid((state) => ({
            ...state,
            gridSearchTarget: event.target.value,
          }));
        }}
      />
    </form>
  );
}

function areEqual(prevProps, nextProps) {
  return Object.is(prevProps.searchOption, nextProps.searchOption);
}

export default React.memo(MapGridCardSearch, areEqual);