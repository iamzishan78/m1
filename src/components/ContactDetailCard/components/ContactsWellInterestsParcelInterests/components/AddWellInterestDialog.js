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
import AutorenewIcon from '@material-ui/icons/Autorenew';
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import { AppContext } from "../../../../../AppContext";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { CircularProgress, Dialog, OutlinedInput, InputAdornment, Typography } from "@material-ui/core";
import RightDialog from "../../RightDialog";
import { useDispatch, useSelector } from "react-redux";
import { showErrorMessage, showSuccessMessage } from "../../../../../actions";
import debounce from "lodash/debounce";
import parse from "autosuggest-highlight/parse";
import PropTypes from "prop-types";
import NumberFormat from "react-number-format";
import { INTERESTOWNERTYPESQUERY } from "../../../../../graphQL/useQueryInterestOwnerTypes";
import { INTERESTTYPESQUERY } from "../../../../../graphQL/useQueryInterestTypes";
import { TENANTWELL } from "../../../../../graphQL/useQueryTenantWell";
import { ADDWELLINTEREST } from "../../../../../graphQL/useMutationAddWellInterest";
import { UPDATEWELLINTEREST } from "../../../../../graphQL/useMutationUpdateWellInterest";
import { REMOVEWELLINTEREST } from "../../../../../graphQL/useMutationRemoveWellInterest";
import DeleteConfirmationDialogContent from "../../../../Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";


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
    '& .MuiInputBase-input': {
      color: 'red'
    }
  }
}));

function AddWellInterestDialog(props) {
  const dispatch = useDispatch();
  const classes = useStyles();

  const [stateApp, setStateApp] = useContext(AppContext);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [foundWells, setFoundWells] = useState([]);
  const [selectedWell, setSelectedWell] = useState(null);
  const [formLeaseName, setFormLeaseName] = useState("");
  const [formLeaseAcres, setFormLeaseAcres] = useState(null);
  const [formOwnerName, setFormOwnerName] = useState("");
  const [formInterestOwnerType, setFormInterestOwnerType] = useState("");
  const [formInterestType, setFormInterestType] = useState("");
  const [formInterestAmount, setFormInterestAmount] = useState(null);
  const [formRoyaltyAcres, setFormRoyaltyAcres] = useState(null);
  const [formTaxValue, setFormTaxValue] = useState(null);
  const [interestOwnerTypes, setInterestOwnerTypes] = useState([]);
  const [interestTypes, setInterestTypes] = useState([]);

  const [getInterestOwnerTypes, { data: dataInterestOwnerTypes }] = useLazyQuery(INTERESTOWNERTYPESQUERY, {
    fetchPolicy: "cache-and-network",
  });
  const [getInterestTypes, { data: dataInterestTypes }] = useLazyQuery(INTERESTTYPESQUERY, {
    fetchPolicy: "cache-and-network",
  });
  const [getTenantWell, { data: dataTenantWell }] = useLazyQuery(TENANTWELL, {
    // must be network-only to trigger state change for field updates
    fetchPolicy: "network-only",
  });
  const [addWellInterest] = useMutation(ADDWELLINTEREST, {
    onCompleted: () => {
      setLoading(false);
      handleClose();
    },
    refetchQueries: [
      "getContactWells",
    ],
    awaitRefetchQueries: true,
  });
  const [updateWellInterest] = useMutation(UPDATEWELLINTEREST, {
    onCompleted: () => {
      setLoading(false);
      handleClose();
    },
    refetchQueries: [
      "getContactWells",
    ],
    awaitRefetchQueries: true,
  });
  const [removeWellInterest] = useMutation(REMOVEWELLINTEREST, {
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

  useEffect(() => {
    setInterestOwnerTypes(dataInterestOwnerTypes?.interestOwnerTypes?.res?.map(e => e.Desc));
  }, dataInterestOwnerTypes);

  useEffect(() => {
    setInterestTypes(dataInterestTypes?.interestTypes?.res?.map(e => e.Desc));
  }, dataInterestTypes);

  useEffect(() => {
    if (!dataTenantWell?.tenantWell) return;

    const leaseToSet = dataTenantWell?.tenantWell?.lease || "";
    const leaseAcresToSet = dataTenantWell?.tenantWell?.leaseAcres;

    setSelectedWell({
      ...selectedWell,
      Lease: leaseToSet,
      LeaseAcreage: leaseAcresToSet
    });

    setFormLeaseName(leaseToSet);
    setFormLeaseAcres(leaseAcresToSet);
  }, dataTenantWell);

  useEffect(() => {
    if (stateApp.activeWellInterest) {
      setInitializing(true)
      setSelectedWell({
        Id: stateApp.activeWellInterest.wellId,
        WellName: stateApp.activeWellInterest.wellName,
        ApiNumber: stateApp.activeWellInterest.api,
        LeaseId: stateApp.activeWellInterest.leaseId,
        Lease: stateApp.activeWellInterest.lease,
        LeaseAcreage: stateApp.activeWellInterest.leaseAcres
      });
      setFormLeaseName(stateApp.activeWellInterest.lease);
      setFormLeaseAcres(stateApp.activeWellInterest.leaseAcres);
      setFormOwnerName(stateApp.activeWellInterest.interestOwner);
      setFormInterestOwnerType(stateApp.activeWellInterest.interestOwnerType);
      setFormInterestType(stateApp.activeWellInterest.type);
      setFormInterestAmount(stateApp.activeWellInterest.amount);
      setFormRoyaltyAcres(stateApp.activeWellInterest.nra);
      setFormTaxValue(stateApp.activeWellInterest.taxValue);
    }
  }, [stateApp.activeWellInterest]);

  useEffect(() => {
    // if launched from grid row set initializing based on selectedWell state
    setInitializing(false)
  }, [selectedWell]);

  const handleClose = () => {
    setFoundWells([]);
    setSelectedWell(null);
    setFormLeaseName("");
    setFormLeaseAcres(null);
    setFormOwnerName("");
    setFormInterestOwnerType("");
    setFormInterestType("");
    setFormInterestAmount(null);
    setFormRoyaltyAcres(null);
    setFormTaxValue(null);
    setStateApp((stateApp) => ({
      ...stateApp,
      wellInterestDialog: false,
      activeWellInterest: null,
    }));
    setInitializing(false)
  }

  const handleRecalcNRA = (leaseAcres, interest) => {
    if (initializing || leaseAcres == null || interest == null) return;

    setFormRoyaltyAcres(leaseAcres * interest);
  }

  const handleSave = () => {
    setLoading(true);
    if (stateApp.activeWellInterest) {
      console.log("formLeaseName", formLeaseName);
      updateWellInterest({
        variables: {
          wellInterest: {
            id: stateApp.activeWellInterest._id,
            globalWellId: selectedWell.Id,
            // ...(selectedWell?.LeaseId !== formLeaseId) && {leaseId: formLeaseId},
            ...(selectedWell?.Lease !== formLeaseName) && { lease: formLeaseName },
            ...(selectedWell?.LeaseAcreage !== formLeaseAcres) && { leaseAcres: formLeaseAcres },
            interestOwner: formOwnerName,
            interestOwnerType: formInterestOwnerType,
            type: formInterestType,
            interest: formInterestAmount,
            value: formTaxValue,
            nra: formRoyaltyAcres,
          },
        },
        refetchQueries: [
          "getContactWells",
        ],
        awaitRefetchQueries: true,
      });
    } else {
      addWellInterest({
        variables: {
          wellInterest: {
            globalWellId: selectedWell.Id,
            userId: stateApp.user.mongoId,
            contactId: props.contactId,
            // ...(selectedWell?.LeaseId !== formLeaseId) && {leaseId: formLeaseId},
            ...(selectedWell?.Lease !== formLeaseName) && { lease: formLeaseName },
            ...(selectedWell?.LeaseAcreage !== formLeaseAcres) && { leaseAcres: formLeaseAcres },
            interestOwner: formOwnerName,
            interestOwnerType: formInterestOwnerType,
            type: formInterestType,
            interest: formInterestAmount,
            value: formTaxValue,
            nra: formRoyaltyAcres,
          }
        },
        refetchQueries: [
          "getContactWells",
        ],
        awaitRefetchQueries: true,
      });
    }
  }

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const openConfirmationDialog = () => {
    setDeleteDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
  };

  const deleteFunc = async () => {
    try {
      setLoading(true);
      removeWellInterest({
        variables: {
          id: stateApp.activeWellInterest._id,
        },
        refetchQueries: [
          "getContactWells",
        ],
        awaitRefetchQueries: true,
      });
    } catch {
      setLoading(false);
    }
  };

  return (
    <>
      {deleteDialogOpen && (
        <Dialog
          className={classes.dialog}
          open={deleteDialogOpen ? true : false}
          onClose={handleCloseDialog}
          fullWidth={false}
          maxWidth="sm"
        >
          <DeleteConfirmationDialogContent
            header={`Delete Well Interest`}
            onClose={handleCloseDialog}
            deleteFunc={deleteFunc}
            m1nSelectedRowsIds={null}
            setM1nSelectedRowsIndexes={() => { }}
          >
            Do you want to delete the selected well interest?
          </DeleteConfirmationDialogContent>
        </Dialog>
      )}
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
                cssFloat: "left",
                fontSize: "1.1rem",
              }}
            >
              {stateApp.activeWellInterest ? "Update Well Interest" : "Add Well Interest"}
            </h4>
            <div style={{ cssFloat: "right" }}>
              {(stateApp.activeWellInterest && (
                <>
                  <IconButton
                    disabled={loading}
                    onClick={openConfirmationDialog}
                    size="small"
                    style={{ margin: "0 8px" }}
                  >
                    {loading ? (
                      <CircularProgress size={20} color="secondary" />
                    ) : (
                      <DeleteIcon
                        className={classes.closeIcon}
                        fontSize="small"
                      />
                    )}
                  </IconButton>
                </>
              ))}
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
                options={foundWells || []}
                onChange={(e, well) => {
                  setSelectedWell(well);
                  getTenantWell({
                    variables: {
                      globalWellId: well.Id,
                    },
                  })
                }}
                value={selectedWell}
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


            <h4
              style={{
                //margin: "0 0 15px 0",
                //float: "left",
                //fontSize: "1.1rem",
              }}
            >
              Selected well and lease information
            </h4>

            <TextField
              variant="outlined"
              margin="dense"
              value={selectedWell?.WellName || ""}
              //label={selectedWell?.WellName ? "Well Name" : "Well Name"}
              label={"Well Name"}
              InputLabelProps={{ shrink: true }}
              fullWidth
              disabled
              defaultValue=""
            />

            <TextField
              variant="outlined"
              margin="dense"
              value={selectedWell?.ApiNumber || ""}
              //label={selectedWell?.ApiNumber ? "API Number" : "API Number"}
              label="API Number"
              InputLabelProps={{ shrink: true }}
              fullWidth
              disabled
              defaultValue=""
            />

            <TextField
              variant="outlined"
              margin="dense"
              value={formLeaseName}
              onChange={event => setFormLeaseName(event.target.value)}
              label={"Lease Name"}
              fullWidth
              //disabled
              defaultValue=""
            />

            <TextField
              // type="number"
              variant="outlined"
              margin="dense"
              // error={isNaN(formLeaseAcres)}
              value={formLeaseAcres === 0 || formLeaseAcres ? formLeaseAcres : ''}
              onChange={(event) => {
                const leaseAcresToSet = parseFloat(event.target.value);
                setFormLeaseAcres(leaseAcresToSet);
                handleRecalcNRA(leaseAcresToSet, formInterestAmount);
              }}
              label={"Lease Acres"}
              // InputLabelProps={{ shrink: true }}
              fullWidth
              //disabled
              defaultValue=""
              InputProps={{
                inputComponent: NumberFormatCustom,
              }}
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
              onChange={event => setFormOwnerName(event.target.value)}
              label="Interest Owner Name"
              fullWidth
              defaultValue=""
            />

            <FormControl
              variant="outlined"
              fullWidth
              size="small"
            >

              <Autocomplete
                options={interestOwnerTypes || []}
                onChange={(e, interestOwnerType) => {
                  setFormInterestOwnerType(interestOwnerType)
                }}
                value={formInterestOwnerType}
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
                options={interestTypes || []}
                onChange={(e, interestType) => {
                  setFormInterestType(interestType)
                }}
                value={formInterestType}
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
                    // type="number"
                    variant="outlined"
                    margin="dense"
                    // error={isNaN(formInterestAmount)}
                    value={formInterestAmount === 0 || formInterestAmount ? formInterestAmount : ''}
                    onChange={(event) => {
                      const interestAmountToSet = parseFloat(event.target.value);
                      setFormInterestAmount(interestAmountToSet);
                      handleRecalcNRA(formLeaseAcres, interestAmountToSet);
                    }}
                    //label={formInterestAmount ? "" : "Interest Amount"}
                    label="Interest Amount"
                    // InputLabelProps={{ shrink: true }}
                    fullWidth
                    defaultValue=""
                    InputProps={{
                      inputComponent: NumberFormatCustom,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth margin="dense" variant="outlined" >
                    <InputLabel htmlFor="royality-acres">Net Royalty Acres</InputLabel>
                    <OutlinedInput
                      id="royality-acres"
                      inputComponent={NumberFormatCustom}
                      className={formRoyaltyAcres !== (formInterestAmount * formLeaseAcres) ? classes.royaltyAcres : ''}
                      value={formRoyaltyAcres === 0 || formRoyaltyAcres ? formRoyaltyAcres : ''}
                      onChange={event => setFormRoyaltyAcres(parseFloat(event.target.value))}
                      labelWidth={140}
                      endAdornment={
                        <InputAdornment position="end" style={{ position: 'absolute', right: "-3px" }}>
                          {
                            formRoyaltyAcres !== '' && formRoyaltyAcres !== (formInterestAmount * formLeaseAcres) && <IconButton
                              aria-label="toggle royality-acres"
                              onClick={() => setFormRoyaltyAcres(formInterestAmount * formLeaseAcres)}
                            >
                              <AutorenewIcon />
                            </IconButton>
                          }
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>


              </Grid>

              <TextField
                variant="outlined"
                margin="dense"
                // error={isNaN(formTaxValue)}
                // value={selectedWell?.acres}
                label="Tax Appraisal Value"
                fullWidth
                InputProps={{
                  inputComponent: CurrencyFormatCustom,
                }}
                value={formTaxValue === 0 || formTaxValue ? formTaxValue : ''}
                onChange={event => setFormTaxValue(parseFloat(event.target.value))}
                defaultValue=""
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
