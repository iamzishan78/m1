import React, { useState, Fragment, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import moment from "moment";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Typography } from "@material-ui/core";
import debounce from "lodash/debounce";
import parse from "autosuggest-highlight/parse";
import PropTypes from "prop-types";
import NumberFormat from "react-number-format";
import { wellParams } from "./helpers";
import { addMyWellStyles as useStyles } from "./styles";

import { UPSERT_MY_WELL } from "graphQL/useMutationUpsertMyWell";
import { useMutation } from "@apollo/client";

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

function AddWellInterestDialog({ handleWellDetail, platformWell, showSearch }) {
  const classes = useStyles();

  const [foundWells, setFoundWells] = useState([]);
  const [upsertMyWell, { loading: upsertWellLoading }] = useMutation(UPSERT_MY_WELL);

  const { control, reset } = useForm();

  useEffect(() => {
    if (platformWell) reset(platformWell);
  }, [platformWell, reset]);

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

  const handleSave = React.useMemo(
    () =>
      debounce((key, value) => {
        upsertMyWell({
          variables: {
            myWell: { ...platformWell, _id: platformWell.id, [key]: value },
          },
          refetchQueries: ["getESSimpleSearch"],
          awaitRefetchQueries: true,
        });
      }, 500),
    [platformWell]
  );

  return (
    <div style={{ padding: "10px 30px" }}>
      <div style={{ marginTop: "15px" }}>
        {showSearch && (
          <FormControl variant="outlined" fullWidth size="small">
            <Autocomplete
              options={foundWells || []}
              onChange={(e, well) => {
                handleWellDetail(well);
                upsertMyWell({
                  variables: {
                    myWell: well,
                  },
                  refetchQueries: ["getESSimpleSearch"],
                  awaitRefetchQueries: true,
                });
              }}
              disabled={!!upsertWellLoading}
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

        <h4>
          Selected well and lease information
        </h4>
        {wellParams.map((param, index) => (
          <Fragment key={index}>
            <Controller
              control={control}
              name={param.esKey ?? param.key}
              render={(params) => (
                <TextField
                  {...params}
                  label={param.label}
                  variant="outlined"
                  margin="dense"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  defaultValue=""
                  value={
                    param.type === "text"
                      ? params.value
                      : params.value
                        ? moment(new Date(params.value)).format("MM/DD/YYYY") === "Invalid date"
                          ? ""
                          : moment(new Date(params.value)).format("MM/DD/YYYY")
                        : ""
                  }
                  onChange={(event) => {
                    const value = event.target.value;
                    params.onChange(value);
                    handleSave(param.esKey ?? param.key, value);
                  }}
                  disabled={upsertWellLoading}
                />
              )}
            ></Controller>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default AddWellInterestDialog;
