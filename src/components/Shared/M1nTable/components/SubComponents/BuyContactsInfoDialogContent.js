import React, { useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import DialogContent from "@material-ui/core/DialogContent";
import { Grid } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import { FormLabel } from "@material-ui/core";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import Tooltip from "@material-ui/core/Tooltip";

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

const useStyles = makeStyles({
  divBorders: {
    padding: "15px",
    border: "1px solid #C4C4C4",
    borderRadius: "4px",
    "&:hover": {
      border: "1px solid black",
    },
    alignItems: "center",
    marginBottom: "10px",
    textAlign: "center",
  },
  inputContent: {
    marginLeft: "30px",
    verticalAlign: "middle",
    color: "#17AADD",
  },
  inputLabel: {
    float: "left",
    display: "block",
    width: "200px",
    textAlign: "center",
    lineHeight: "1.2",
    paddingTop: "3px",
  },
});

export default function BuyContactsInfoDialogContent(props) {
  const classes = useStyles();

  useEffect(() => {
    if (!props.rows || props.rows.length === 0) props.onClose();
  }, [props.rows]);

  const currentCredits = 20;

  return (
    <React.Fragment>
      <DialogTitle id="customized-dialog-title" onClose={props.onClose}>
        Contact Info Purchase
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div className={classes.divBorders}>
              <FormLabel className={classes.inputLabel}>
                Current Balance:
              </FormLabel>

              <FormLabel className={classes.inputContent}>
                {currentCredits} Credit
                {currentCredits && currentCredits > 1 ? "s" : ""}
              </FormLabel>
              <Tooltip title="Add Credits">
                <IconButton
                  aria-label="add"
                  className={classes.inputContent}
                  // onClick={}
                  size="small"
                >
                  <AddCircleRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
          </Grid>
          <Grid item xs={6}>
            <h3 style={{ margin: "0" }}>
              {props.rows && props.rows.length ? props.rows.length : ""} Contact
              {props.rows && props.rows.length && props.rows.length > 1
                ? "s"
                : ""}{" "}
              To Purchase
            </h3>
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
            <p style={{ margin: "0 3px" }}>@ 1 Credit each</p>
          </Grid>
          <Grid item xs={12}>
            <Table size="small" aria-label="a dense table">
              <TableBody
                style={{ borderTop: "1px solid rgba(224, 224, 224, 1)" }}
              >
                {props.rows &&
                  props.rows.map((row, index) => (
                    <TableRow key={row._id}>
                      <TableCell
                        component="th"
                        scope="row"
                        style={{ padding: "0 0 0 10px", fontSize: "0.8rem" }}
                      >
                        {row.name}
                      </TableCell>

                      <TableCell
                        align="right"
                        style={{ padding: "0 0 0 10px", fontSize: "0.8rem" }}
                      >
                        {joinAddress(row)}
                      </TableCell>
                      <TableCell
                        align="right"
                        style={{ padding: "0 0 0 10px", fontSize: "0.8rem" }}
                      >
                        <IconButton
                          aria-label="delete"
                          onClick={() => {
                            let reducedRows = [...props.rows];
                            reducedRows.splice(index, 1);
                            props.setRows(reducedRows);
                          }}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Grid>
          <Grid item xs={6}>
            <h3 style={{ margin: "0" }}>Total</h3>
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
            <p style={{ margin: "0 3px" }}>
              {props.rows && props.rows.length ? props.rows.length : ""} Credit
              {props.rows && props.rows.length && props.rows.length > 1
                ? "s"
                : ""}
            </p>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            props.onClose();
          }}
          color="primary"
        >
          Cancel
        </Button>
        <Button onClick={() => {}} color="secondary" variant="contained">
          Buy Now
        </Button>
      </DialogActions>
    </React.Fragment>
  );
}
