import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Grid from "@material-ui/core/Grid";
import { Popper } from '@material-ui/core';
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import parse from "autosuggest-highlight/parse";
import debounce from "lodash/debounce";
import Button from "@material-ui/core/Button";
// contexts
import { AppContext } from "AppContext";
// queries
import { useLazyQuery, useMutation } from "@apollo/client";
import { USERSEARCHHISTORY } from "graphQL/useQueryUserSearchHistory";
import { REMOVESEARCHHISTORY } from "graphQL/useMutationRemoveSearchHistory";
import { GET_ES_SIMPLE_SEARCH } from "graphQL/useQueryESSimpleSearch";
import { UPSERT_WELL_DESCRIPTOR } from "graphQL/useMutationWellDescriptor";
// custom components
import { deepEqualObjects } from "../../Shared/functions";
import WellIcon from "../../Shared/svgIcons/well";
// 3rd party components
import { CircularProgress } from "@material-ui/core";


const wellCogIndexName = "wellheader-index-m1corev3";

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
    // eslint-disable-next-line no-dupe-keys
    position: "sticky",
    top: "-9px",
    zIndex: "4000",
    margin: "auto",
    backgroundColor: "white",
    boxShadow: "rgba(33, 35, 38, 0.1) 0px 10px 10px -10px",
    padding: theme.spacing(1),
    paddingLeft: "0px",
    maxWidth: "98%",
  },
  groupsButton: {
    margin: "3px",
    zIndex: "2000",
    color: "#5f5f5f",
  },
  myWellBtn: {
    backgroundColor: theme.palette.info.main,
    color: "white",
    width: "100%",
    padding: theme.spacing(1),
    fontWeight: "bold",
  },
  allWellBtn: {
    backgroundColor: "#e0e0e0",
    width: "100%",
    padding: theme.spacing(1),
    fontWeight: "bold",
  },
  root: {
    // maxHeight: "40px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    // "& .MuiAutocomplete-inputRoot": { maxHeight: "42px" },
  },
  autoCompleteInput: {
    width: "336px !important",
    position: "absolute",
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none"
    },
    "& .MuiAutocomplete-input": {
      padding: "0px !important"
    },
    "& .MuiAutocomplete-inputRoot": {
      color: "#c99229",
      fontWeight: "regular",
      cursor: "pointer",
      textAlign: "center",
      minWidth: "150px",
      border: "2px solid #c99229",
      padding: theme.spacing(1),
      borderRadius: "5px",
      marginRight: theme.spacing(2),
    }
  },
  textF: {
    "& input": {
      color: "#d3d3d3",
      height: "5px",
      minWidth: "0 !important",
      visibility: "unset",
      opacity: "1",
    },

    "& .MuiInputBase-adornedStart, .MuiInputBase-adornedEnd": {
      padding: "9px 0 !important",
    },
  },
  endAdornmentIcon: {
    opacity: "1",
    transition: "opacity 1.2s linear",
    "& button": {
      width: "",
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
  placeholderDiv: {
    color: "#c99229",
    fontWeight: "bold",
    cursor: "pointer",
    textAlign: "center",
    minWidth: "150px",
    border: "1px solid #c99229",
    padding: theme.spacing(1),
    borderRadius: "5px",
    marginRight: theme.spacing(2),
  },
  closeIcon: {
    cursor: "pointer",
  },
  popperClass: {
    "& .MuiAutocomplete-listbox": {
      maxHeight: '300px',
      height: '300px',
    }
  }
}));

function Search(props) {
  const [stateApp] = React.useContext(AppContext);
  const [searchText, setSearchText] = useState("");
  const [searchOption, setSearchOption] = React.useState("wells");
  const [options, setOptions] = React.useState([]);
  const [searchTop, setSearchTop] = React.useState(5);

  const [maxMinMapboxSearchScore] = React.useState([0, 0]);
  const [searchHistoryList, setSearchHistoryList] = React.useState([]);

  // loaders
  const [loadingWells, setLoadingWells] = React.useState(false);

  const classes = useStyles();

  const [getSearchHistory, { data: searchHistoryData }] =
    useLazyQuery(USERSEARCHHISTORY);

  //////////// Search History Begin//////////////////

  // Search History Queries and Mutations
  const [removeSearchHistory] = useMutation(REMOVESEARCHHISTORY);
  const [upsertWellDescriptor] = useMutation(UPSERT_WELL_DESCRIPTOR);

  useEffect(() => {
    if (stateApp && stateApp.user && stateApp.user.mongoId) {
      getSearchHistory({
        variables: {
          userId: stateApp.user.mongoId,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          searchId: searchHistoryList[100]._id,
        },
        refetchQueries: ["getSearchHistory"],
        awaitRefetchQueries: true,
      });
    }
  }, [removeSearchHistory, searchHistoryList]);

  // const [getPaginatedWells, { data: constDataWells }] = useLazyQuery(PAGINATEDWELLSQUERY, { fetchPolicy: "network-only", skip: true });
  const [getESSimpleSearch, { data: constDataWells }] = useLazyQuery(
    GET_ES_SIMPLE_SEARCH,
    { fetchPolicy: "no-cache" }
  );

  //////////// Search History End//////////////////
  const startPaginationAt = 25;

  const callWellSearch = React.useMemo(
    () =>
      debounce((request, top, callback) => {
        getESSimpleSearch({
          variables: {
            index: "platformData:wells",
            pagination: {
              first: request.searchTop ? request.searchTop : startPaginationAt,
              keep_alive: "1micros"
            },
            search: {
              query: request.input,
              fields: ["wellName", "api"],
            },
            sort: [],
          }
        })
      }, 500),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (constDataWells) {
      let newOptions = [];
      newOptions = [
        ...constDataWells.getESSimpleSearch.hits.map((well) => {
          return {
            ...well,
            Source: wellCogIndexName,
            Primary: well.WellName,
            Secondary: well.ApiNumber,
          };
        }),
      ];

      setOptions(newOptions);
      setLoadingWells(false);
    }
  }, [constDataWells]);

  React.useEffect(() => {
    if (searchText === "") {
      setOptions([]);
      return undefined;
    }
    (async () => {
      Promise.all([callWellSearch({ input: searchText }, searchTop)]);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, callWellSearch, searchTop]);

  const handleChange = (newValue) => {
    let wellData = {
      ...newValue,
      createdBy: stateApp?.user?._id,
    };
    upsertWellDescriptor({
      variables: {
        well: wellData,
        relatedObject: props.relatedObject,
        relatedObjectType: props.relatedObjectType
      },
      // refetchQueries: ["getWellsDescriptors"],
    }).then((res) => {
      if (props.setRefetchData)
        props.setRefetchData(!props.refetchData);
    });
    handleClose();
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
    (searchOption === "all" && loadingWells) ||
    (searchOption === "wells" && loadingWells)
  ) {
    optionsWithHeader = [header, { ...header, Source: "loader" }];
  }

  const handleClose = () => {
    setSearchText('')
    setOptions([]);
  };

  return (
    <div className={classes.root}>
      <>
        <Autocomplete
          className={classes.autoCompleteInput}
          id="cognitive-search-autocomplete"
          getOptionLabel={(option, value) => option.Primary || value}
          // forcePopupIcon
          onBlur={() => {
            setSearchText('')
            setOptions([]);
          }} // for clearing the value
          filterOptions={(x) => x}
          options={optionsWithHeader}
          style={{ width: "100%" }}
          groupBy={(option) => {
            if (option.Source === wellCogIndexName) return "Wells";
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

            return (
              (searchOption === "all" ||
                searchOption === option.group.toLowerCase()) && (
                <Grid key={option.group}>
                  <Grid item xs={12}>
                    {option.children}
                  </Grid>
                </Grid>
              )
            );
          }}
          // freeSolo
          // autoComplete
          // includeInputInList
          // value={searchText}
          // handle change also acts like onClick here
          onChange={(event, newValue) => {
            if (event.key === "Enter") handleChange(options[0]);
            else handleChange(newValue);
          }}
          onInputChange={(event, newInputValue, reason) => {
            if (reason === "input") {
              if (newInputValue !== "") {
                //// setting loader
                setLoadingWells(true);
              } else {
                setOptions([]);
                setLoadingWells(false);
              }
            }
          }}
          PopperComponent={(props) => {
            return <Popper {...props} style={{ height: '2px' }} className={classes.popperClass} placement='bottom-start' />
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              fullWidth
              style={{ width: "85%" }}
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value)
              }}
              placeholder="Search by well name or API"
              InputProps={{
                ...params.InputProps,
              }}
            />
          )}
          renderOption={(option) => {
            if (option.Source === "header" || option.group === "loader")
              return null;
            // eslint-disable-next-line no-array-constructor
            const parts = parse(option.Primary, Array());

            return (
              <Grid container spacing={0}>
                <Grid container item xs={11} alignItems="center">
                  <Grid item>
                    {option.Source === wellCogIndexName && (
                      <WellIcon
                        className={classes.icon}
                        color={"#757575"}
                        opacity="1.0"
                        small
                      />
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
                          maxMinMapboxSearchScore,
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
      </>
    </div>
  );
}

export default React.memo(Search, deepEqualObjects);
