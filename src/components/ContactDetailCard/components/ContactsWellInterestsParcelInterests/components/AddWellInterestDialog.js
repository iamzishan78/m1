import React, { useState, useEffect, useContext, useRef } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import uuid from "uuid";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import { AppContext } from "../../../../../AppContext";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { CircularProgress, Dialog, Typography } from "@material-ui/core";
import RightDialog from "../../RightDialog";
import { useDispatch, useSelector } from "react-redux";
import { showErrorMessage, showSuccessMessage } from "../../../../../actions";
import debounce from "lodash/debounce";
import parse from "autosuggest-highlight/parse";
import PropTypes from "prop-types";
import NumberFormat from "react-number-format";
import { INTERESTOWNERTYPESQUERY } from "../../../../../graphQL/useQueryInterestOwnerTypes";
import { INTERESTTYPESQUERY } from "../../../../../graphQL/useQueryInterestTypes";
import { ADDWELLINTEREST } from "../../../../../graphQL/useMutationAddWellInterest";

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
      thousandSeparator
      isNumericString
      prefix="$"
    />
  );
}

NumberFormatCustom.propTypes = {
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
}));

function AddWellInterestDialog(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  
  const [stateApp, setStateApp] = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [foundWells, setFoundWells] = useState([]);
  const [selectedWell, setSelectedWell] = useState(null);
  const [formOwnerName, setFormOwnerName] = useState("");
  const [formInterestOwnerType, setFormInterestOwnerType] = useState("");
  const [formInterestType, setFormInterestType] = useState("");
  const [formInterestAmount, setFormInterestAmount] = useState(null);
  const [formRoyaltyAcres, setFormRoyaltyAcres] = useState(null);
  const [formTaxValue, setFormTaxValue] = useState(null);

  const [getInterestOwnerTypes, { data: interestOwnerTypes }] = useLazyQuery(INTERESTOWNERTYPESQUERY, {
    fetchPolicy: "cache-and-network",
  });
  const [getInterestTypes, { data: interestTypes }] = useLazyQuery(INTERESTTYPESQUERY, {
    fetchPolicy: "cache-and-network",
  });
  const [addWellInterest, ] = useMutation(ADDWELLINTEREST, {
    onCompleted: () => {
      setLoading(false);
      handleClose();
    },
    refetchQueries: [
      "getContactWells",
    ],
    awaitRefetchQueries: true,
  });

  const callWellSearch2 = React.useMemo(
    () =>
      debounce((request, callback) => {
        const endpoint =
          "https://m1search.search.windows.net/indexes/wellheader-index-en-ms/docs?api-version=2020-06-30&queryType=full&count=true&searchFields=WellName%2CApiNumber&$top=" +
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
  
        console.log(
          "request made to wellheader-index-en-ms search at: " + new Date().toString()
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
      }, 500),
    []
  );

  useEffect(() => {
    getInterestOwnerTypes();
    getInterestTypes();
  }, []);

  const handleClose = () => {
    setFoundWells([]);
    setSelectedWell({});
    setFormOwnerName("");
    setFormInterestOwnerType({});
    setFormInterestType({});
    setFormInterestAmount("");
    setFormRoyaltyAcres("");
    setFormTaxValue("");
    setStateApp((stateApp) => ({
      ...stateApp,
      wellInterestDialog: false,
    }));
  }

  const handleSave = () => {
    setLoading(true);
    addWellInterest({
      variables: {
        globalWellId: selectedWell.Id,
        userId: stateApp.user.mongoId,
        contactId: props.contactId,
        entity: formInterestOwnerType,
        type: formInterestType,
        interest: formInterestAmount,
        value: formTaxValue,
        nra: formRoyaltyAcres,
      },
      refetchQueries: [
        "getContactWells",
      ],
      awaitRefetchQueries: true,
    });
  }

  return (
    <>
      <RightDialog
        open={props.open}
        handleClickDialogClose={handleClose}
        width={props.width}
      >
        <div style={{ padding: "30px" }}>
          <Grid item xs={12} style={{ minHeight: "35px" }}>
            <h4
              style={{
                margin: "0 0 15px 0",
                float: "left",
                fontSize: "1.1rem",
              }}
            >
              Add Well Interest
            </h4>
            <div style={{ float: "right" }}>
              <IconButton
                onClick={handleClose}
                size="small"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>
          </Grid>

          <div>
            <FormControl
              variant="outlined"
              fullWidth
              size="small"
            >
              <Autocomplete
                options={foundWells}
                onChange={(e, well) => {
                  setSelectedWell(well);
                }}
                getOptionLabel={(option, value) => option.Primary}
                filterOptions={(x) => x}
                renderOption={(option) => {
                  const parts = parse(option.Primary, Array());
        
                  return (
                    <Grid container spacing={0}>
                      <Grid container item xs={11} alignItems="center">
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
                //value={selectedWell}
                //getOptionLabel={(option) => option.text}
                renderInput={(params) => (
                  <TextField
                    margin="dense"
                    {...params}
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
                            })
                          ];
              
                          setFoundWells(newOptions)
                        }
                      });
                    }}
                  />
                )}
              />
            </FormControl>

            <TextField
              variant="outlined"
              margin="dense"
              value={selectedWell?.WellName}
              label={selectedWell ? "" : "Well Name"}
              fullWidth
              disabled
            />

            <TextField
              variant="outlined"
              margin="dense"
              value={selectedWell?.ApiNumber}
              label={selectedWell ? "" : "API Number"}
              fullWidth
              disabled
            />

            <TextField
              variant="outlined"
              margin="dense"
              value={selectedWell?.lease}
              label="Lease Name"
              fullWidth
              disabled
            />

            <TextField
              variant="outlined"
              margin="dense"
              value={selectedWell?.acres}
              label="Lease Acres"
              fullWidth
              disabled
            />
          </div>

          <div>
            <h4
              style={{
                //margin: "0 0 15px 0",
                //float: "left",
                //fontSize: "1.1rem",
              }}
            >
              Enter information for new interest owner
            </h4>

            <TextField
              variant="outlined"
              margin="dense"
              value={formOwnerName}
              onChange={event => setFormOwnerName(event.target.value) }
              label="Interest Owner Name"
              fullWidth
            />

            <FormControl
              variant="outlined"
              fullWidth
              size="small"
            >

              <Autocomplete
                options={interestOwnerTypes?.interestOwnerTypes?.res?.map(e => e.Desc)}
                onChange={(e, interestOwnerType) => {
                  setFormInterestOwnerType(interestOwnerType)
                }}
                renderInput={(params) => (
                  <TextField
                    margin="dense"
                    {...params}
                    variant="outlined"
                    label="Interest Owner Type"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />

              <Autocomplete
                options={interestTypes?.interestTypes?.res?.map(e => e.Desc)}
                onChange={(e, interestType) => {
                  setFormInterestType(interestType)
                }}
                //value={users.find((user) => user?.value === ownerId) || null}
                //getOptionLabel={(option) => option.text}
                //getOptionSelected={(option) => option.value === ownerId}
                renderInput={(params) => (
                  <TextField
                    margin="dense"
                    {...params}
                    variant="outlined"
                    label="Interest Type"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    type="number"
                    variant="outlined"
                    margin="dense"
                    value={formInterestAmount}
                    onChange={event => setFormInterestAmount(parseFloat(event.target.value)) }
                    label="Interest Amount"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="number"
                    variant="outlined"
                    margin="dense"
                    value={formRoyaltyAcres}
                    onChange={event => setFormRoyaltyAcres(parseFloat(event.target.value)) }
                    label="Net Royalty Acres"
                    fullWidth
                    
                  />
                </Grid>
              </Grid>

              <TextField
                variant="outlined"
                margin="dense"
                value={selectedWell?.acres}
                label="Tax Appraisal Value"
                fullWidth
                InputProps={{
                  inputComponent: NumberFormatCustom,
                }}
                value={formTaxValue}
                onChange={event => setFormTaxValue(parseFloat(event.target.value)) }
              />
            </FormControl>
          </div>

          <div className={classes.dialogFooter}>
            <Button
              variant="contained"
              color="default"
              size="medium"
              disableElevation
              onClick={handleClose}
              disabled={loading}
              className={classes.footerButton}
              style={{
                margin: "0px 15px 0px 0px",
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              color="secondary"
              size="medium"
              disableElevation
              onClick={handleSave}
              className={classes.footerButton}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={14} />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </RightDialog>
    </>
  );
}

export default AddWellInterestDialog;
