import React, { useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import parse from "autosuggest-highlight/parse";
import debounce from "lodash/debounce";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
// contexts
import { AppContext } from "../../../AppContext";
// queries
import { useLazyQuery, useMutation } from "@apollo/client";
import { USERSEARCHHISTORY } from "../../../graphQL/useQueryUserSearchHistory";
import { ADDSEARCHHISTORY } from "../../../graphQL/useMutationAddSearchHistory";
import { UPDATESEARCHHISTORY } from "../../../graphQL/useMutationUpdateSearchHistory";
import { REMOVESEARCHHISTORY } from "../../../graphQL/useMutationRemoveSearchHistory";
import { GET_ES_PAGINATED_LIST } from "graphQL/useQueryESPaginatedList";
// custom components
import { setMapGridCardState } from "../../../actions";
import { deepEqualObjects } from "../../Shared/functions";
import WellIcon from "../../Shared/svgIcons/well";
// 3rd party components
import Popover from "@material-ui/core/Popover";
import Tooltip from "@material-ui/core/Tooltip";
import Box from "@material-ui/core/Box";
import { CircularProgress } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import { useDispatch, useSelector } from "react-redux";

const wellCogIndexName = "wellheader-index";
const ownerCogIndexName = "globalowner-index";

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
    maxHeight: "40px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    "& .MuiAutocomplete-inputRoot": { maxHeight: "42px" },
  },
  autoCompleteInput: {
    minWidth: "250px",
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
    border: "1px solid #c99229 ",
    padding: theme.spacing(1),
    borderRadius: "5px",
    marginRight: theme.spacing(2),
  },
  closeIcon: {
    cursor: "pointer",
  },
}));

function Search(props) {
  const dispatch = useDispatch();
  const { mapGridCardActivated, mapGridCardActiveTap, searchInputValue } =
    useSelector(({ MapGridCard }) => MapGridCard);
  const [enableSearch, setEnableSearch] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [stateApp, setStateApp] = React.useContext(AppContext);
  const [value, setValue] = React.useState(null);
  const [searchOption, setSearchOption] = React.useState("wells");
  const [options, setOptions] = React.useState([]);
  const [searchTop, setSearchTop] = React.useState(5);

  const [maxMinMapboxSearchScore] = React.useState([0, 0]);
  const [searchHistoryList, setSearchHistoryList] = React.useState([]);

  // loaders
  const [loadingWells, setLoadingWells] = React.useState(false);

  const classes = useStyles({ mapGridCardActivated });

  const [getSearchHistory, { data: searchHistoryData }] =
    useLazyQuery(USERSEARCHHISTORY);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateApp.user]);

  useEffect(() => {
    if (!value && searchInputValue && value !== searchInputValue) {
      setValue(searchInputValue);
    }
  }, [searchInputValue, value]);

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
  const [getESWellsPaginatedList, { data: constDataWells }] = useLazyQuery(
    GET_ES_PAGINATED_LIST,
    { fetchPolicy: "no-cache" }
  );

  //////////// Search History End//////////////////
  const startPaginationAt = 25;

  const callWellSearch = React.useMemo(
    () =>
      debounce((request, top, callback) => {
        getESWellsPaginatedList({
          variables: {
            esIndex: "platformData:wells",
            pagination: {
              first: startPaginationAt,
              keep_alive: "1micros",
            },
            search: request.input ? `wellName:*${request.input}*` : "",
            sort: [],
          },
        });
      }, 500),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (constDataWells) {
      let newOptions = [];
      newOptions = [
        ...constDataWells.getESPaginatedList.hits.map((well) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        Promise.all([
          searchOption === "all" || searchOption === "wells"
            ? callWellSearch({ input: searchInputValue }, searchTop)
            : null,
        ]);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchInputValue,
    callWellSearch,
    callMapboxSearch,
    searchOption,
    searchTop,
  ]);

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
          lastSearch: newValue,
        })
      );

      //// setting map loader
      setStateApp((stateApp) => ({
        ...stateApp,
        mapCircularLoaderAct: true,
        searchLoader: true,
      }));

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
    (searchOption === "all" && loadingWells) ||
    (searchOption === "wells" && loadingWells)
  ) {
    optionsWithHeader = [header, { ...header, Source: "loader" }];
  }

  return (
    <div className={classes.root}>
      {!enableSearch ? (
        <div
          className={classes.placeholderDiv}
          onClick={() => setEnableSearch(!enableSearch)}
        >
          {props.value}
        </div>
      ) : (
        <>
          <Autocomplete
            className={classes.autoCompleteInput}
            id="cognitive-search-autocomplete"
            getOptionLabel={(option, value) =>
              option.Primary || searchInputValue
            }
            forcePopupIcon
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
                    <Grid
                      container
                      spacing={2}
                      className={classes.groupsHeaders}
                      justifyContent="center"
                    >
                      <Grid item xs={6}>
                        <Button
                          size="small"
                          className={classes.myWellBtn}
                          onClick={() => null}
                          type="primary"
                        >
                          My Wells
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        {searchTop === 5 ? (
                          <Button
                            size="small"
                            className={classes.allWellBtn}
                            onClick={() => {
                              setSearchTop(200);
                              setSearchOption("wells");
                            }}
                          >
                            All WELLS
                          </Button>
                        ) : (
                          <Button
                            size="small"
                            className={classes.allWellBtn}
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
              if (event.key === "Enter") handleChange(options[0]);
              else handleChange(newValue);
            }}
            onInputChange={(event, newInputValue, reason) => {
              if (reason === "input") {
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
                  setLoadingWells(true);
                } else {
                  // setValue(null);
                  setOptions([]);
                  setLoadingWells(false);
                }
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                fullWidth
                style={{ width: "100%" }}
                onBlur={() => setEnableSearch(!enableSearch)}
                placeholder="Search by well name, API, owner, operator or a location"
                InputProps={{
                  ...params.InputProps,

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
                                  setValue("");
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
                              // eslint-disable-next-line no-array-constructor
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
                                      <Grid
                                        container
                                        item
                                        xs={9}
                                        alignItems="center"
                                      >
                                        <Grid item>
                                          {option.Source ===
                                            wellCogIndexName && (
                                              <WellIcon
                                                className={classes.icon}
                                                color={"#757575"}
                                                opacity="1.0"
                                                small
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
                                      <Grid
                                        container
                                        item
                                        xs={3}
                                        alignItems="center"
                                      >
                                        <Grid item>
                                          <Typography
                                            variant="body2"
                                            style={{
                                              color: "rgb(80, 187, 223)",
                                            }}
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
            renderOption={(option) => {
              console.log("orig renderOption option", option);
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
          &nbsp;{" "}
          <CloseRoundedIcon
            onClick={() => setEnableSearch(!enableSearch)}
            className={classes.closeIcon}
          />
        </>
      )}
    </div>
  );
}

export default React.memo(Search, deepEqualObjects);
