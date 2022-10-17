import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Typography } from "@material-ui/core";
import debounce from "lodash/debounce";
import parse from "autosuggest-highlight/parse";
import PropTypes from "prop-types";
import NumberFormat from "react-number-format";

// contexts
import { AppContext } from "AppContext";

function NumberFormatCustom(props) {
  const { inputRef, onChange, name, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      // thousandSeparator
      // isNumericString
      // prefix="$"
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
function CurrencyFormatCustom(props) {
  const { inputRef, onChange, name, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
      prefix="$"
    />
  );
}

CurrencyFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const useStyles = makeStyles((theme) => ({
  dialogFooter: {
    display: "flex",
    justifyContent: "flex-end",
    paddingTop: "10px",
  },
  footerButton: {
    letterSpacing: "1px",
    textTransform: "capitalize",
    fontWeight: "bold",
    padding: "8px 20px",
  },
  dialog: {
    zIndex: "9999999999 !important",
  },
  royaltyAcres: {
    "& .MuiInputBase-input": {
      color: "red",
    },
  },
  menu: {
    "& .MuiListItem-root": {
      "& .MuiListItemIcon-root": {
        minWidth: "30px",
        "& .MuiSvgIcon-root": {
          fill: "red !important",
        },
      },
    },
  },
}));

const wellParams = [
  { type: "text", label: "API Number", key: "api" },
  { type: "text", label: "Well Name", key: "wellName" },
  { type: "text", label: "Operator", key: "operator" },
  { type: "text", label: "Well Type", key: "wellTyoe" },
  { type: "text", label: "Well Profile", key: "wellProfile" },
  { type: "text", label: "Well Status", key: "wellStatus" },
  { type: "text", label: "Basin", key: "basin" },
  { type: "text", label: "Field", key: "" },
  { type: "text", label: "State", key: "state" },
  { type: "text", label: "County", key: "county" },
  { type: "text", label: "Survey", key: "survey" },
  { type: "text", label: "Block/Twsp", key: "" },
  { type: "text", label: "Sec/Range", key: "" },
  { type: "text", label: "Abstract/Sec", key: "abstract" },
  { type: "text", label: "Permit Date", key: "permitApprovedDate" },
  { type: "text", label: "Spud Date", key: "spudDate" },
  { type: "text", label: "Completion Date", key: "completionDate" },
  { type: "text", label: "First Prod", key: "" },
  { type: "text", label: "Measured Depth", key: "measuredDepth" },
  { type: "text", label: "TVD", key: "" },
  { type: "text", label: "Lateral Length", key: "lateralLength" },
  { type: "text", label: "Formation", key: "" },
];

function AddWellInterestDialog({ handleWellDetail, platformWell, showSearch }) {
  const classes = useStyles();

  const [foundWells, setFoundWells] = useState([]);

  const callWellSearch2 = React.useMemo(
    () =>
      debounce((request, callback) => {
        const endpoint =
          "https://m1search.search.windows.net/indexes/wellheader-index/docs?api-version=2020-06-30&queryType=full&count=true&%24filter=Latitude%20ne%20null%20and%20Longitude%20ne%20null&searchFields=WellName%2CApiNumber&$top=" +
          50 +
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

  // const handleSave = () => {};

  return (
    <div style={{ padding: "10px 30px" }}>
      <div style={{ marginTop: "15px" }}>
        {showSearch && (
          <FormControl variant="outlined" fullWidth size="small">
            <Autocomplete
              options={foundWells || []}
              onChange={(e, well) => handleWellDetail(well)}
              value={platformWell}
              getOptionLabel={(option, value) => option.Primary}
              filterOptions={(x) => x}
              renderOption={(option) => {
                const parts = parse(option.Primary, Array());

                return (
                  <Grid container spacing={0}>
                    <Grid container item xs={11} alignItems="center">
                      <Grid item xs>
                        {parts.map((part, index) => (
                          <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
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
                            backgroundImage: "repeating-linear-gradient(135deg, #ffffff , #ffffffb7 4.5%, #ffffff 15%)",
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                );
              }}
              renderInput={(params) => (
                <TextField
                  margin="dense"
                  {...params}
                  required
                  variant="outlined"
                  label="Search for a well by name or API"
                  InputLabelProps={{ shrink: true }}
                  onChange={(event) => {
                    callWellSearch2({ input: event.target.value }, (results) => {
                      if (results) {
                        const indexSource = results["@odata.context"].substring(
                          results["@odata.context"].indexOf("('") + 2,
                          results["@odata.context"].indexOf("')")
                        );

                        let newOptions = [
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
                        ];

                        setFoundWells(newOptions);
                      }
                    });
                  }}
                />
              )}
            />
          </FormControl>
        )}

        <h4
          style={
            {
              //margin: "0 0 15px 0",
              //float: "left",
              //fontSize: "1.1rem",
            }
          }
        >
          Selected well and lease information
        </h4>
        {wellParams.map((param, index) => (
          <TextField
            variant="outlined"
            margin="dense"
            value={platformWell?.[param.key] || ""}
            label={param.label}
            InputLabelProps={{ shrink: true }}
            fullWidth
            defaultValue=""
          />
        ))}
      </div>
    </div>
  );
}

export default AddWellInterestDialog;
