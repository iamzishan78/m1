import React, { useEffect, useContext, useState } from "react";
import { useDispatch } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles } from "@material-ui/core/styles";
import { FormLabel } from "@material-ui/core";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Grid } from "@material-ui/core";
import { Modals } from "../../../../../styles/Modal";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import DialogContent from "@material-ui/core/DialogContent";

import { AppContext } from "../../../../../AppContext";
import { GETPERSONDATA } from "../../../../../graphQL/useQueryGetPersonData";
import { GET_IDICORE_DATA } from "graphQL/useQueryGetIdiCoreData";
import { GET_FEATURE_QUOTA } from "graphQL/useQueryGetFeatureQuota";
import { showSuccessMessage, showErrorMessage } from "../../../../../actions";
import { FEATURES } from "components/Shared/FeatureFlag/common";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import Close from "@material-ui/icons/Close";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, updateMelissaTable, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h4" style={{ fontWeight: "bold" }}>
        {children}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

export default function BuyContactsInfoDialogContent(props) {
  const dispatch = useDispatch();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [featureQuota, setFeatureQuota] = useState(null);
  const [currentCredits, setCurrentCredits] = useState(-1);
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

  const [getPersonData, { data: personsData }] = useMutation(GETPERSONDATA, {
    onCompleted: (data) => {
      props.onClose();
      if (data.getPersonData.allSuccess) {
        if (props.updateMelissaTable) {
          props.updateMelissaTable();
        }
        dispatch(showSuccessMessage("All records saved successfully"));
      } else {
        dispatch(showErrorMessage("Error occurred"));
      }
    },
  });

  const [getIdICoreData, { data: idiCoreData, loading: idiLoading }] =
    useMutation(GET_IDICORE_DATA);

  useEffect(() => {
    if (
      idiCoreData?.getIdiCoreData?.success &&
      idiCoreData?.getIdiCoreData?.data?.length > 0
    ) {
      dispatch(showSuccessMessage("Data fetched successfully"));
      props.onClose();
    } else if (idiCoreData?.getIdiCoreData?.success === false) {
      dispatch(showErrorMessage("Error occurred"));
    } else if (idiCoreData?.getIdiCoreData?.success === true) {
      dispatch(showErrorMessage("No data found against the contact"));
    }
  }, [idiCoreData]);

  function loadPersonData() {
    let persons = [];
    for (const row of props.rows) {
      let person = {
        id: row._id,
        firstName: row.firstName,
        lastName: row.lastName,
        address: row.address1,
        city: row.city,
        state: row.state,
        country: row.country,
        postal: row.zip,
      };

      // if (
      //   (!person.address || !person.city || !person.state) &&
      //   !person.postal
      // ) {
      //   dispatch(
      //     showErrorMessage(
      //       "Invalid data: [state, city, address] or [ZIP code] required"
      //     )
      //   );
      //   return;
      // }

      persons.push(person);
    }

    // getPersonData({
    //   variables: { persons },
    //   refetchQueries: [
    //     "getLastMelissaRecord",
    //     "getMelissaRecordsCountForContactIds",
    //   ],
    //   awaitRefetchQueries: true,
    // });

    getIdICoreData({
      variables: {
        tenantId: stateApp.user.tenantId,
        persons,
      },
      refetchQueries: ["getContactPurchaseData"],
      awaitRefetchQueries: true,
    });
  }

  useEffect(() => {
    if (!props.rows || props.rows.length === 0) props.onClose();
  }, [props.rows]);

  // const currentCredits = 20;

  return (
    <React.Fragment>
      {idiLoading ? (
        <CircularProgress
          size={80}
          disableShrink
          color="secondary"
        />
      ) : (
        <>
          <DialogTitle
            style={{ backgroundColor: "#fff" }}
            id="customized-dialog-title"
          >
            {props.header ? props.header : "Contact Info Purchase"}
            <Close
              fontSize="large"
              className={modalClass.closeIcon}
              onClick={props.onClose}
            />
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
                <h3 style={{ margin: "0" }}>Selected contacts</h3>
              </Grid>
              {/* <Grid item xs={12} style={{ margin: 0, paddingTop: 0 }}>
            <FormLabel>
              {props.rows && props.rows.length ? props.rows.length : ""}{" "}
              selected 
            </FormLabel>
          </Grid> */}
              {props.rows &&
                props.rows.map((row, index) => (
                  <Grid item xs={12} className={modalClass.inputContainer}>
                    <FormLabel className={modalClass.inputLabel}>
                      {`${row.firstName} ${row.lastName}`}
                    </FormLabel>
                    <FormLabel className={modalClass.inputContent}>
                      <DeleteOutlinedIcon
                        fontSize="small"
                        style={{ cursor: "pointer", float: "right" }}
                        onClick={() => {
                          let reducedRows = [...props.rows];
                          reducedRows.splice(index, 1);
                          props.setRows(reducedRows);
                        }}
                      />
                    </FormLabel>
                  </Grid>
                ))}
              <Grid item xs={12} className={modalClass.greyedInputContainer}>
                <h3 style={{ float: "left", margin: "5px" }}>TOTAL</h3>
                <h3 style={{ float: "right", margin: "5px" }}>
                  {props.rows && props.rows.length ? props.rows.length : ""}{" "}
                  CREDIT
                  {props.rows && props.rows.length && props.rows.length > 1
                    ? "S"
                    : ""}
                </h3>
              </Grid>
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
              color="secondary"
              variant="contained"
            >
              Buy Now
            </Button>
          </DialogActions>
        </>
      )}
    </React.Fragment>
  );
}
