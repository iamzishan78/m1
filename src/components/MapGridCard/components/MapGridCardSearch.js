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
          //result.Source = contactIndexName;
          
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

        // setMapGridCardState({
        //   searchResultData: [...newOptions],
        //   searchloading: false,
        // })

    }
  }, [
    constDataContacts,
  ]);






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
          "https://m1search.search.windows.net/indexes/operator-index/docs?api-version=2020-06-30&queryType=full&count=true&searchFields=Operator&top=" +
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

  const callLeaseSearch = React.useMemo(
    () =>
      debounce((request, callback) => {
        const endpoint =
          "https://m1search.search.windows.net/indexes/lease-index-v2/docs?api-version=2020-06-30&queryType=full&count=true&searchFields=Lease%2CLeaseId&top=" +
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

  const callMapboxSearch = React.useMemo(
    () =>
      debounce((request, callback) => {
        const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${
          request.input
        }.json?access_token=${
          stateApp.mapboxglAccessToken
        }&autocomplete=true&country=us%2Cca&limit=${
          searchTop > 50 ? 50 : searchTop
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
      onSubmit={(e)=> {e.preventDefault();}}
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