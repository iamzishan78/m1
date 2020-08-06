import React, { useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { FormLabel } from "@material-ui/core";
import { useLazyQuery } from "@apollo/react-hooks";
import { GETPERSONDATA, GETPERSONDATALOOKUP } from "../../../../../graphQL/useQueryGetPersonData";
import { Grid } from "@material-ui/core";
import { Modals } from "../../../../../styles/Modal";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import DialogContent from "@material-ui/core/DialogContent";
import DeleteIcon from "@material-ui/icons/Delete";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import ReactJson from 'react-json-view'

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
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
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

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const joinAddress = (row) => {
  let rowData =
    row.address1 ||
    row.address2 ||
    row.city ||
    row.state ||
    row.zip ||
    row.country
      ? {
          address1: row.address1,
          address2: row.address2,
          city: row.city,
          state: row.state,
          zip: row.zip,
          country: row.country,
        }
      : {
          address1: row.address1Alt,
          address2: row.address2Alt,
          city: row.cityAlt,
          state: row.stateAlt,
          zip: row.zipAlt,
          country: row.countryAlt,
        };
  let textArray = [];
  for (const key in rowData) {
    if (rowData.hasOwnProperty(key) && rowData[key] && rowData[key] !== "") {
      if (key === "zip" || key === "country") {
        textArray = [
          [textArray.join(", "), capitalizeFirstLetter(rowData[key])].join(" "),
        ];
      } else textArray.push(capitalizeFirstLetter(rowData[key]));
    }
  }

  return textArray.join(", ");
};

export default function BuyContactsInfoDialogContent(props) {
  const modalClass = Modals();
  const [getPersonDataQuery, { data: personsData }] = useLazyQuery(GETPERSONDATA)
  const [getPersonDataLookupQuery, { data: personsDataLookup }] = useLazyQuery(GETPERSONDATALOOKUP)

  function loadPersonData(type) {
    let persons = []
    for (const row of props.rows) {
      let person = {
        firstName: row.name.split(" ")[0], // remove `firstName`, `lastName`, make `name`
        lastName: row.name.split(" ")[1],
        address: joinAddress(row),
        city: '',
        state: '',
      }
      persons.push(person)
    }

    if (type == 'lookup') {
      getPersonDataLookupQuery({
        variables: { persons }
      })
    } else {
      getPersonDataQuery({
        variables: { persons }
      })
    }
    
  }

  useEffect(() => {
    if (!props.rows || props.rows.length === 0) props.onClose();
  }, [props.rows]);

  const currentCredits = 20;

  return (
    <React.Fragment>
      <DialogTitle className={modalClass.title} id="customized-dialog-title">
        Contact Info Purchase
        <HighlightOffIcon fontSize="large" className={modalClass.titleClose} onClick={props.onClose}/>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <h3 style={{padding: 0, marginTop: '20px', marginBottom: 0}}>Credits</h3>
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
          <Grid item xs={12}>
            <h3 style={{margin: "0"}}>
              Contact To Purchase
            </h3>
          </Grid>
          <Grid item xs={12} style={{margin: 0, paddingTop: 0}}>
            <FormLabel>
              {props.rows && props.rows.length ? props.rows.length : ""} selected at 1 Credit each
            </FormLabel>
          </Grid>
          {props.rows &&
            props.rows.map((row, index) => (
              <Grid item xs={12} className={modalClass.inputContainer}>
                <FormLabel className={modalClass.inputLabel}>
                  {row.name}
                </FormLabel>
                <FormLabel className={modalClass.inputContent}>
                 <DeleteIcon fontSize="small" style={{cursor:'pointer', float:'right'}} onClick={()=> {
                    let reducedRows = [...props.rows];
                    reducedRows.splice(index, 1);
                    props.setRows(reducedRows);
                 }}/>
                </FormLabel>
              </Grid>
            ))}
          <Grid item xs={6}>
            <h3 style={{ margin: "0" }}>TOTAL</h3>
          </Grid>
          <Grid
            item
            xs={6}
            style={{
              display: "flex",
              placeContent: "flex-end",
              alignSelf: "flex-end",
            }}
          >
            <h3 style={{ margin: "0 3px" }}>
              {props.rows && props.rows.length ? props.rows.length : ""} CREDIT
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
        <Button onClick={() => { loadPersonData('api'); }} color="secondary" variant="contained">
          Buy Now
        </Button>
        <Button onClick={() => { loadPersonData('lookup'); }} color="secondary" variant="contained">
          Buy Now (Lookup)
        </Button>
      </DialogActions>
      <DialogContent>
      { personsData && personsData.getPersonData &&
        personsData.getPersonData.map((personData, index) => (
          <DialogContent>
            <h4>Records for person with index {index}</h4>
            <ReactJson src={personData} />
          </DialogContent>
      ))}
      { personsDataLookup && personsDataLookup.getPersonDataLookup &&
        personsDataLookup.getPersonDataLookup.map((personData, index) => (
          <DialogContent>
            <h4>Records for person with index {index}</h4>
            <ReactJson src={personData} />
          </DialogContent>
      ))}
      </DialogContent>

    </React.Fragment>
  );
}
