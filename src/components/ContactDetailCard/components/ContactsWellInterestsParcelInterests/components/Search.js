import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { AppContext } from "../../../../../AppContext";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Button from "@material-ui/core/Button";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import PersonIcon from "@material-ui/icons/Person";
import WellIcon from "../../../../Shared/svgIcons/well";
import OperatorIcon from "../../../../Shared/svgIcons/operator";
import LeaseIcon from "../../../../Shared/svgIcons/lease";
import IconButton from "@material-ui/core/IconButton";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
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
  /*root: {
    height: "42px",
    width: "100%",
    "& .MuiAutocomplete-inputRoot": { maxHeight: "42px" },
  },*/
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
  /*inputAdornment: {
    padding: "0 8px",
    cursor: "context-menu",
    height: "100%",
  },*/
  headerButtons: {
    margin: "0 4px",
    minWidth: "max-content",
    float: "left",
  },
  floatRight: {
    float: "right",
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
  viewSwitcher: {
    height: 30,
    marginRight: 8,
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
  const [searchOption, setSearchOption] = React.useState("all");
  const [searchResultData, setSearchResultData] = React.useState([]);
  const [loadingWells, setLoadingWells] = React.useState(false);
  const [searchTop, setSearchTop] = React.useState(5);

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  let selectedWellIds = [];

  const callWellSearch = React.useMemo(
    () =>
      debounce((request, callback) => {
        const endpoint =
          "https://m1search.search.windows.net/indexes/wellheader-index-en-ms/docs?api-version=2020-06-30&queryType=full&count=true&searchFields=WellName%2CApiNumber&$top=" +
          request.top +
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
          "https://m1search.search.windows.net/indexes/globalowner-index/docs?api-version=2020-06-30&queryType=full&count=true&searchFields=OwnerName&$top=" +
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
      if (searchResultData.length !== 0 && loadingWells !== false) {
        setSearchResultData([]);
        setLoadingWells(false);
      }
      return undefined;
    }

    (async () => {
      let newOptions = [];

      Promise.all([
        callWellSearch({ input: inputValue, top: searchTop }, (results) => {
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

            //setMaxMinWellsScore(maxMinScore(results.value));
          }

          setSearchResultData([...newOptions]);
          setLoadingWells(false);
        }),
        /*props.searchOption == "owner"
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
              setLoadingWells(false);
            })
          : null,*/
      ]);
    })();
  }, [inputValue, searchTop, callWellSearch, callOwnerSearch, props.searchOption]);

  const header = {
    Source: "header",
    Score: 0,
    Id: "0",
    Primary: "",
    Secondary: "",
  };
  let optionsWithHeader = [header, ...searchResultData];
  //// adding loader ////
  if (
    (searchOption === "all" && loadingWells) ||
    (searchOption === "wells" && loadingWells)
  ) {
    optionsWithHeader = [header, { ...header, Source: "loader" }];
  }
  
  const selectWellId = (WellId, selected) => {
    if (!selected) {
      selectedWellIds.push(WellId);
    } else {
      selectedWellIds = selectedWellIds.filter(e => e !== WellId)
    }
  }

  const addSelectedWellsToContact = () => {

    console.log("selectedWellIds", selectedWellIds);
  };

  return (
    <form
      className={classes.root}
    >
      {<Autocomplete
        id="cognitive-search-autocomplete"
        multiple
        disableCloseOnSelect
        getOptionLabel={(option, value) => option.Primary}
        forcePopupIcon
        filterOptions={(x) => x}
        options={optionsWithHeader}
        groupBy={(option) => {
          if (option.Source === "wellheader-index-en-ms") return "Wells";
          if (option.Source === "loader") return "loader";
          return "header";
        }}
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
                  (searchOption === "all" && loadingWells) ||
                  (searchOption === "wells" && loadingWells) ||
                  searchResultData.length === 0
                    ? "0"
                    : "9px",
              }}
            >
              <Grid
                item
                xs={12}
                style={{
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
                    setSearchOption("wells");
                  }}
                >
                  Well Interests
                </Button>
                <Button
                  className={classes.headerButtons}
                  variant={searchOption === "owners" ? "contained" : "outlined"}
                  size="small"
                  color={searchOption === "owners" ? "secondary" : "primary"}
                  onClick={() => {
                    setSearchOption("owners");
                  }}
                >
                  Parcel Interests
                  {/* TODO */}
                </Button>
                <Button
                  className={[classes.headerButtons, classes.floatRight]}
                  variant="contained"
                  size="small"
                  color="secondary"
                  onClick={() => {
                    addSelectedWellsToContact();
                  }}
                >
                  Add to Contact
                </Button>
              </Grid>
            </Grid>
          ) : (
            (searchOption === "all" ||
              searchOption === option.group.toLowerCase()) && (
              <Grid key={option.group} container item>
                <Grid container item xs={12} className={classes.groupsHeaders}>
                  <Grid item item xs={6}>
                    <h3 className={classes.groupsHeadersText}>
                      {option.group === "Wells"
                        ? "Well Interests"
                        : option.group === "Owners"
                        ? "Parcel Interests"
                        : option.group
                      }
                    </h3>
                  </Grid>
                  <Grid item xs={6} style={{ textAlign: "right" }}>
                    {searchTop === 5 ? (
                      <Button
                        size="small"
                        className={classes.groupsButton}
                        onClick={() => {
                          if (searchOption === "all" || searchOption === "wells") {
                            setLoadingWells(true);
                          }
                          setSearchTop(200);
                          setSearchOption(
                            option.group === "Owners"
                              ? "owners"
                              : option.group === "Wells"
                              ? "wells"
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
                          if (searchOption === "all" || searchOption === "wells") {
                            setLoadingWells(true);
                          }
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
        includeInputInList
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            fullWidth
            placeholder="Search existing interests or click the plus icon button in the grid below to add new associated interests manually"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  <InputAdornment
                    className={classes.inputAdornment}
                    position="start"
                  >
                    <SearchIcon htmlColor="#757575" />
                  </InputAdornment>
                  { params.InputProps.startAdornment }
                </>
              ),
            }}
            //onClick={props.ativateSearchPanel}
            //value={"meow"}
            onChange={(event) => {
              if (searchOption === "all" || searchOption === "wells") {
                setLoadingWells(true);
              }
              setInputValue(event.target.value);
              // if (!searchLoading) {
              // dispatch(
              //   setMapGridCardState({
              //     searchLoading: true,
              //     searchInputValue: event.target.value,
              //   })
              // );
              // }
            }}
          />
        )}
        renderOption={(option, { selected }) => {
          if (option.Source === "header" || option.group === "loader")
            return null;
          const parts = parse(option.Primary, Array());

          return (
            <Grid container spacing={0}>
              <Grid container item xs={11} alignItems="center">
                <Grid item>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                    color="primary"
                    onChange={(e) => {
                      selectWellId(option.Id, selected);
                    }}
                  />
                </Grid>
                <Grid item>
                  {option.Source === "globalowner-index" && (
                    <PersonIcon className={classes.icon} />
                  )}
                  {option.Source === "operator-index" && (
                    <OperatorIcon className={classes.icon} color={"#757575"} />
                  )}
                  {option.Source === "wellheader-index-en-ms" && (
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
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          );
        }}
      />}
    </form>
  );
}

export default React.memo(Search, deepEqualObjects);
