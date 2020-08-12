import React, { useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import { Modals } from "../../../../../styles/Modal";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import DialogContent from "@material-ui/core/DialogContent";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormLabel from "@material-ui/core/FormLabel";

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

const useStyles = makeStyles({});

export default function PrintLabelsDialogContent(props) {
  const classes = useStyles();
  const modalClass = Modals();

  const recipientData = [
    `Contact Name${props.rows && props.rows.length > 1 ? "s" : ""}`,
    "“Current Owner”",
  ];
  const labelTypeData = [
    'Avery 5160: 2 5/8" X 1"',
    'Avery 5161: 4" X 1"',
    'Avery 5162: 4" X 1.33"',
  ];
  const [recipientValue, setRecipientValue] = React.useState(recipientData[0]);

  useEffect(() => {
    if (!props.rows || props.rows.length === 0) props.onClose();
  }, [props.rows]);

  return (
    <React.Fragment>
      <DialogTitle className={modalClass.title} id="customized-dialog-title">
        Printing Mailing Labels
        <HighlightOffIcon fontSize="large" className={modalClass.titleClose} onClick={props.onClose}/>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={1} style={{ paddingBottom: "10px" }}>
          <h3 style={{padding: 0, marginTop: '20px', marginBottom: 0}}>Recipient Name</h3>
          <Grid item xs={12}>
            <Autocomplete
              options={recipientData}
              getOptionLabel={(option) => option}
              style={{ marginBottom: "10px" }}
              value={recipientValue}
              onChange={(event, newValue) => {
                setRecipientValue(newValue);
              }}
              renderInput={(params) => (
                <TextField {...params}/>
              )}
            />
          </Grid>
          <h3 style={{padding: 0, marginTop: 0, marginBottom: 0}}>Label Type</h3>
          <Grid item xs={12}>
            <Autocomplete
              options={labelTypeData}
              getOptionLabel={(option) => option}
              style={{ marginBottom: "10px" }}
              defaultValue={labelTypeData[0]}
              renderInput={(params) => (
                <TextField {...params}/>
              )}
            />
          </Grid>
          <Grid item xs={12} style={{marginTop: '15px'}}>
            <h3 style={{margin: "0"}}>
              Label To Print
            </h3>
          </Grid>
          <Grid item xs={12}>
            <FormLabel>
              {props.rows && props.rows.length ? props.rows.length : ""} selected
            </FormLabel>
          </Grid>
          {props.rows &&
            props.rows.map((row, index) => (
              <Grid item xs={12} className={modalClass.inputContainer}>
                <FormLabel className={modalClass.inputLabel}>
                  {row.name}
                </FormLabel>
                <FormLabel className={modalClass.inputContent}>
                 <DeleteOutlinedIcon fontSize="small" style={{cursor:'pointer', float:'right'}} onClick={()=> {
                    let reducedRows = [...props.rows];
                    reducedRows.splice(index, 1);
                    props.setRows(reducedRows);
                 }}/>
                </FormLabel>
              </Grid>
            ))}
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
        <Button onClick={() => {}} color="secondary" variant="contained">
          Print Labels
        </Button>
      </DialogActions>
    </React.Fragment>
  );
}
