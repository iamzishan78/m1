import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import parse from "autosuggest-highlight/parse";
import throttle from "lodash/throttle";
import { AppContext } from "../../../AppContext";
import Button from "@material-ui/core/Button";
import PersonIcon from "@material-ui/icons/Person";
import WellIcon from "../../Shared/svgIcons/well";
import OperatorIcon from "../../Shared/svgIcons/operator";

function loadScript(src, position, id) {
  if (!position) {
    return;
  }

  const script = document.createElement("script");
  script.setAttribute("async", "");
  script.setAttribute("id", id);
  script.src = src;
  position.appendChild(script);
}

// const autocompleteService = { current: null };

const maxMinScore = (options) => {
  let max = 0;
  let min = 1000000;
  for (let i = 0; i < options.length; i++) {
    if (options[i]["@search.score"] > max) max = options[i]["@search.score"];
    if (options[i]["@search.score"] < min) min = options[i]["@search.score"];
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
  textF: {
    "& input": { color: "#ffffffc9" },
    height: '35px',
    //width: '30%',
    //top: "-20px"
  },
  score: {
    position: "absolute",
    top: "-8px",
    width: "17px",
    height: "16px",
    borderRadius: "50%",
    marginLeft: "10px",
  },
}));

export default function Search() {
  const classes = useStyles();
  const [stateApp, setStateApp] = React.useContext(AppContext);
  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState("");
  const [searchOption, setSearchOption] = React.useState("all");
  const [options, setOptions] = React.useState([]);
  const [maxMinWellsScore, setMaxMinWellsScore] = React.useState([0, 0]);
  const [maxMinOwnersScore, setMaxMinOwnersScore] = React.useState([0, 0]);
  const loaded = React.useRef(false);

  //   if (typeof window !== 'undefined' && !loaded.current) {
  //     if (!document.querySelector('#google-maps')) {
  //       loadScript(
  //         'https://maps.googleapis.com/maps/api/js?key=AIzaSyBwRp1e12ec1vOTtGiA4fcCt2sCUS78UYc&libraries=places',
  //         document.querySelector('head'),
  //         'google-maps',
  //       );
  //     }

  //     loaded.current = true;
  //   }

  const callWellSearch = React.useMemo(
    () =>
      throttle((request, callback) => {
        // autocompleteService.current.getPlacePredictions(request, callback);

        const endpoint =
          "https://m1search.search.windows.net/indexes/wellheader-index/docs?api-version=2019-05-06&$count=true&searchFields=WellName,ApiNumber&$top=5&search=" +
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
        // autocompleteService.current.getPlacePredictions(request, callback);

        const endpoint =
          "https://m1search.search.windows.net/indexes/lod2019-index/docs?api-version=2019-05-06&%24count=true&searchFields=OwnerName%2CAddress1&%24top=5&search=" +
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
          "https://m1search.search.windows.net/indexes/operator-index/docs?api-version=2019-05-06&$count=true&searchFields=Name&$top=5&search=" +
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

  React.useEffect(() => {
    // if (!autocompleteService.current && window.google) {
    //   autocompleteService.current = new window.google.maps.places.AutocompleteService();
    // }
    // if (!autocompleteService.current) {
    //   return undefined;
    // }

    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }

    (async () => {
      let newOptions = [];

      Promise.all([
        searchOption == "all" || searchOption == "wells"
          ? callWellSearch({ input: inputValue }, (results) => {
              if (results) {
                const indexSource = results["@odata.context"].substring(
                  results["@odata.context"].indexOf("('") + 2,
                  results["@odata.context"].indexOf("')")
                );

                console.log(indexSource);
                newOptions = [
                  ...newOptions,
                  ...results.value.map((result) => ({
                    ...result,
                    Source: indexSource,
                    Primary: result.WellName,
                    Secondary: result.ApiNumber,
                  })),
                ];

                setMaxMinWellsScore(maxMinScore(results.value));
              }

              setOptions(newOptions);
            })
          : null,
        searchOption == "all" || searchOption == "owners"
          ? callOwnerSearch({ input: inputValue }, (results) => {
              if (results) {
                const indexSource = results["@odata.context"].substring(
                  results["@odata.context"].indexOf("('") + 2,
                  results["@odata.context"].indexOf("')")
                );
                console.log(indexSource);
                newOptions = [
                  ...newOptions,
                  ...results.value.map((result) => ({
                    ...result,
                    Source: indexSource,
                    Primary: result.OwnerName,
                    Secondary: `${result.Address1}\n${result.Address2}\n${result.City}\n${result.State}\n${result.Zip}`,
                  })),
                ];

                setMaxMinOwnersScore(maxMinScore(results.value));
              }

              setOptions(newOptions);
            })
          : null,
        searchOption == "all" || searchOption == "operators"
          ? callOperatorSearch({ input: inputValue }, (results) => {
              if (results) {
                const indexSource = results["@odata.context"].substring(
                  results["@odata.context"].indexOf("('") + 2,
                  results["@odata.context"].indexOf("')")
                );
                console.log(indexSource);
                newOptions = [
                  ...newOptions,
                  ...results.value.map((result) => ({
                    ...result,
                    Source: indexSource,
                    Primary: result.Name,
                    Secondary: null,
                  })),
                ];

                setMaxMinOwnersScore(maxMinScore(results.value));
              }

              setOptions(newOptions);
            })
          : null,
      ]);
    })();
  }, [
    inputValue,
    callWellSearch,
    callOwnerSearch,
    callOperatorSearch,
    searchOption,
  ]);

  const header = {
    Source: "header",
    "@search.score": 0,
    Id: "0",
    WellName: "",
    ApiNumber: "",
    Latitude: 0,
    Longitude: 0,
    Primary: "",
    Secondary: "",
  };
  const optionsWithHeader = [header, ...options];

  return (
    <Autocomplete
      id="cognitive-search-autocomplete"
      getOptionLabel={(option) => option.Primary}
      filterOptions={(x) => x}
      options={optionsWithHeader}
      groupBy={(option) => {
        return option.Source === "lod2019-index"
          ? "Owners"
          : option.Source === "wellheader-index"
          ? "Wells"
          : option.Source === "operator-index"
          ? "Operators"
          : "header";
      }}
      renderGroup={(option) => {
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
              paddingBottom: options.length === 0 ? "0" : "9px",
            }}
          >
            <Grid
              item
              xs={12}
              style={{
                display: "flex",
                justifyContent: "space-evenly",
              }}
            >
              <Button
                variant={searchOption === "all" ? "contained" : "outlined"}
                size="small"
                color={searchOption === "all" ? "secondary" : "primary"}
                style={{
                  width: "22%",
                }}
                onClick={() => {
                  setSearchOption("all");
                }}
              >
                All
              </Button>
              <Button
                variant={searchOption === "wells" ? "contained" : "outlined"}
                size="small"
                color={searchOption === "wells" ? "secondary" : "primary"}
                style={{
                  width: "22%",
                }}
                onClick={() => {
                  setSearchOption("wells");
                }}
              >
                Wells
              </Button>
              <Button
                variant={searchOption === "owners" ? "contained" : "outlined"}
                size="small"
                color={searchOption === "owners" ? "secondary" : "primary"}
                style={{
                  width: "22%",
                }}
                onClick={() => {
                  setSearchOption("owners");
                }}
              >
                Owners
              </Button>
              <Button
                variant={
                  searchOption === "operators" ? "contained" : "outlined"
                }
                size="small"
                color={searchOption === "operators" ? "secondary" : "primary"}
                style={{
                  width: "25%",
                }}
                onClick={() => {
                  setSearchOption("operators");
                }}
              >
                Operators
              </Button>
            </Grid>
          </Grid>
        ) : (
          (searchOption === "all" ||
            searchOption === option.group.toLowerCase()) && (
            <Grid key={option.group} container item>
              <Grid container item xs={12} className={classes.groupsHeaders}>
                <Grid item item xs={6}>
                  <h3 className={classes.groupsHeadersText}>{option.group}</h3>
                </Grid>
                <Grid item xs={6} style={{ textAlign: "right" }}>
                  <Button size="small" className={classes.groupsButton}>
                    See All Results
                  </Button>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                {option.children}
              </Grid>
            </Grid>
          )
        );
      }}
      autoComplete
      includeInputInList
      value={value}
      onChange={(event, newValue) => {
        //setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);

        if (newValue && newValue.Longitude && newValue.Latitude) {
          setStateApp((stateApp) => ({
            ...stateApp,
            popupOpen: false,
            selectedWell: null,
            selectedWellId: newValue ? newValue.Id.toLowerCase() : null,
            flyTo: newValue
              ? { longitude: newValue.Longitude, latitude: newValue.Latitude }
              : null,
          }));
        }
      }}
      onInputChange={(event, newInputValue, reason) => {
        if (reason == "input") {
          setInputValue(newInputValue);
        }
      }}

      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          fullWidth
          placeholder="Search by well name, API, owner, operator"
          className={classes.textF}
        />
      )}
      renderOption={(option) => {
        if (option.Source === "header") return null;
        const matches = option.WellName;
        const parts = parse(option.Primary, Array());

        return (
          <Grid container spacing={0}>
            <Grid container item xs={11} alignItems="center">
              <Grid item>
                {option.Source === "lod2019-index" && (
                  <PersonIcon className={classes.icon} />
                )}
                {option.Source === "operators-index" && (
                  <OperatorIcon
                    className={classes.icon}
                    color={"#757575"}
                    small
                  />
                )}
                {option.Source === "wellheader-index" && (
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
                      option.Source === "lod2019-index"
                        ? maxMinOwnersScore
                        : maxMinWellsScore,
                      option["@search.score"]
                    ).toString(),
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        );
      }}
    />
  );
}
