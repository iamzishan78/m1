import React, { useEffect, useContext, useState } from "react";
import { useDispatch } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { FormLabel } from "@material-ui/core";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Grid } from "@material-ui/core";
import { Modals } from "../../../../../styles/Modal";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import DialogContent from "@material-ui/core/DialogContent";
import KeyboardTabIcon from '@material-ui/icons/KeyboardTab';

import { AppContext } from "../../../../../AppContext";
import { GET_IDICORE_DATA } from "graphQL/useQueryGetIdiCoreData";
import { GET_FEATURE_QUOTA } from "graphQL/useQueryGetFeatureQuota";
import { showSuccessMessage, showErrorMessage } from "../../../../../actions";
import { FEATURES } from "components/Shared/FeatureFlag/common";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import ErrorIcon from "@material-ui/icons/Error";
import { Tooltip } from "@material-ui/core";
import { tableGlobalController } from "hookstate/tableController";

const styles = (theme) => ({
  dialogTitle: {
    padding: "25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }
});

const useStyles = makeStyles((theme) => ({
  iconsSuccess: {
    "& svg": {
      fill: '#04b004 !important'
    }
  },
  iconsError: {
    "& svg": {
      fill: 'red !important'
    }
  },
  label: {
    background: "rgba(0,0,0,0.65)",
    color: "#ffffff",
    padding: "4px 10px",
    margin: 3,
    borderRadius: 4,
    boxShadow: "0 0 3px rgb(0 0 0 / 10%)",
    fontWeight: 700
  }
}));

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, updateMelissaTable, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.dialogTitle} {...other}>
      <Typography variant="h5" style={{ fontWeight: "bold" }}>
        {children}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          size="medium"
        >
          <KeyboardTabIcon fontSize="large" />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

export default function BuyContactsInfoDialogContent(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [featureQuota, setFeatureQuota] = useState(null);
  const [contactDataMissing, setContactDataMissing] = useState([]);
  const [validContactData, setValidContactData] = useState([]);
  const [buyNowClicked, setBuyNowClicked] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [currentCredits, setCurrentCredits] = useState(-1);
  const [rowsLoading, setRowsLoading] = useState(false);
  const modalClass = Modals();

  const [getFeatureQuota, { loading, data: quota }] =
    useLazyQuery(GET_FEATURE_QUOTA);

  useEffect(() => {
    const feature = stateApp?.user?.features?.find(
      (f) => f.name === FEATURES.IDICORE
    );
    getFeatureQuota({
      variables: {
        featureId: feature.id,
        tenantId: stateApp.user.tenantId,
      },
    });
  }, []);

  useEffect(() => {
    if (quota && quota.featureQuota) {
      setFeatureQuota(quota.featureQuota);
      setCurrentCredits(
        quota.featureQuota.QuotaLimit -
        (quota.featureQuota.QuotaPending + quota.featureQuota.QuotaUsed)
      );
    }
  }, [quota]);

  const [getIdICoreData, { data: idiCoreData, loading: idiLoading }] =
    useMutation(GET_IDICORE_DATA);

  useEffect(() => {
    if (
      idiCoreData?.getIdiCoreData?.success &&
      idiCoreData?.getIdiCoreData?.data?.length > 0
    ) {
      setDataFetched(true)
      dispatch(showSuccessMessage("Contact data fetched successfully"));
      tableGlobalController.refetch();
    } else if (idiCoreData?.getIdiCoreData?.success === false) {
      setDataFetched(true)
      dispatch(showErrorMessage("An error occurred - please try again"));
    } else if (idiCoreData?.getIdiCoreData?.success === true) {
      setDataFetched(true)
      dispatch(showErrorMessage("No data found for selected contact(s)"));
    }
  }, [idiCoreData]);

  function loadPersonData() {
    if (validContactData.length > currentCredits) {
      dispatch(showErrorMessage(`Requested amount of ${validContactData.length} is greater than remaining credit balance of ${currentCredits} `));
    } else {

      setBuyNowClicked(true)
      const feature = stateApp?.user?.features?.find(
        (f) => f.name === FEATURES.IDICORE
      );
      getIdICoreData({
        variables: {
          featureId: feature.id,
          tenantId: stateApp.user.tenantId,
          persons: validContactData,
        },
        refetchQueries: ["featureQuota", "getCheckPurchaseData", "getContactPurchaseData", "getESSimpleSearch"],
        awaitRefetchQueries: true,
      });
    }
  }

  const setMissingLabelsFunc = (contact) => {
    const labels = [];
    if (!contact.firstName) {
      labels.push('F');
    }

    if (!contact.lastName) {
      labels.push('L');
    }

    if (!contact.address1) {
      labels.push('A');
    }
    return labels;
  }

  useEffect(() => {
    if (!props.rows || props.rows.length === 0) {
      setRowsLoading(true);
    } else {
      setRowsLoading(false);
      const missingContacts = [];
      let validContacts = [];
      for (const row of props.rows) {
        if (!row.firstName || !row.lastName || !row.address1) {
          missingContacts.push(row);
        } else if (row.firstName && row.lastName && row.address1) {
          let person = {
            id: row.contactId || row.contact?._id || row._id,
            firstName: row.firstName,
            lastName: row.lastName,
            address: row.address1,
            city: row.city,
            state: row.state,
            country: row.country,
            postal: row.zip,
          };
          validContacts.push(person);
        }

      }
      setContactDataMissing(missingContacts);
      setValidContactData(validContacts);

    }
  }, [props.rows]);

  return (
    <React.Fragment>
      {rowsLoading ? (
        <div className={modalClass.loaderWrapper}>
          <CircularProgress color="secondary" className={modalClass.loader} size={80} disableShrink />
        </div>
      ) : (
        <>
          <DialogTitle
            id="customized-dialog-title"
            onClose={props.onClose}
          >
            {props.header ? props.header : "Contact Info Purchase"}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={1}>
              {props.header === "Contact Data Integration" && (
                <>
                  <Grid item xs={12}>
                    <h3
                      style={{ padding: 0, marginTop: "20px", marginBottom: 0 }}
                    >
                      Available search credits
                    </h3>
                  </Grid>
                  <Grid item xs={12} className={modalClass.inputContainer}>
                    <FormLabel className={modalClass.inputLabel}>
                      Current Balance
                    </FormLabel>
                    <FormLabel className={modalClass.inputContent}>
                      {currentCredits} Credit
                      {currentCredits && currentCredits > 1 ? "s" : ""}
                    </FormLabel>
                  </Grid>
                </>
              )}

              <Grid item xs={12} style={{ marginTop: "50px" }}>
                <h3 style={{ margin: "0" }}>Contacts missing required information (will be excluded)</h3>
              </Grid>

              {contactDataMissing &&
                contactDataMissing.map((row, index) => (
                  <Grid item xs={12} className={modalClass.inputContainer}>
                    <FormLabel className={modalClass.inputLabel}>
                      {`${row.name}`}
                    </FormLabel>
                    <FormLabel className={modalClass.inputContent}>
                      <div className="flex jusifyEnd alignCenter">
                        {setMissingLabelsFunc(row) && setMissingLabelsFunc(row).map((label, index) => (
                          <p key={index + 1} className={classes.label}>{label}</p>
                        ))}
                      </div>

                    </FormLabel>
                  </Grid>
                ))}

              <Grid item xs={12}>
                <p style={{ margin: "0" }}>Note: contact data enrichment integration requires contacts to have a valid first name, last name and address entered.</p>
              </Grid>

              <Grid item xs={12} style={{ marginTop: "50px" }}>
                {validContactData && validContactData.length > 0 && (<h3 style={{ margin: "0" }}>Selected contacts with valid information</h3>)}
                {validContactData && validContactData.length === 0 && (
                  <div className="flex justifyStart alignCenter" style={{ margin: "0 0 8px 0" }}>
                    <WarningRoundedIcon style={{ fill: "#000000" }} />
                    <h3 style={{ margin: "0 0 0 8px" }}>No selected contacts with valid information</h3>
                  </div>
                )}
              </Grid>
              {validContactData &&
                validContactData.map((row, index) => (
                  <Grid item xs={12} className={modalClass.inputContainer}>
                    <FormLabel className={modalClass.inputLabel}>
                      {`${row.firstName} ${row.lastName}`}
                    </FormLabel>
                    <FormLabel className={modalClass.inputContent}>
                      {dataFetched && (
                        <>
                          {idiCoreData.getIdiCoreData.data?.find(contact => contact.contactId === row.id) ? (
                            <span className={classes.iconsSuccess}>
                              <Tooltip title='Data found for contact' >
                                <CheckCircleIcon />
                              </Tooltip>
                            </span>
                          ) : (
                            <span className={classes.iconsError}>
                              <Tooltip title='No data found for contact' >
                                <ErrorIcon />
                              </Tooltip>
                            </span>
                          )}
                        </>
                      )}
                      {!dataFetched && (
                        <DeleteOutlinedIcon
                          fontSize="small"
                          style={{ cursor: "pointer", float: "right" }}
                          onClick={() => {
                            let reducedRows = [...props.rows];
                            reducedRows.splice(index, 1);
                            props.setRows(reducedRows);
                          }}
                        />
                      )}
                    </FormLabel>
                  </Grid>
                ))}

              {validContactData && validContactData.length > 0 && (
                <Grid item xs={12} className={modalClass.greyedInputContainer}>
                  <h3 style={{ float: "left", margin: "5px" }}>TOTAL</h3>
                  <h3 style={{ float: "right", margin: "5px" }}>
                    {validContactData && validContactData.length ? validContactData.length : ""}{" "}
                    CREDIT
                    {validContactData && validContactData.length && validContactData.length > 1
                      ? "S"
                      : ""}
                  </h3>
                </Grid>
              )}

            </Grid>
          </DialogContent>
          <DialogActions className={modalClass.actionButtons}>
            <Button
              onClick={() => {
                props.onClose();
              }}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                loadPersonData();
              }}
              disabled={buyNowClicked || idiLoading || validContactData.length === 0}
              color="secondary"
              variant="contained"
            >
              Buy Now
            </Button>
            {idiLoading && (
              <CircularProgress
                size={24}
                style={{
                  position: 'absolute',
                  marginTop: '2px',
                  marginRight: '35px',
                  color: 'green',
                }}
              />
            )}

          </DialogActions>
        </>
      )
      }
    </React.Fragment>
  );
}
