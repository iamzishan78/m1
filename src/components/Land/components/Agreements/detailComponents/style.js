import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { FormControl, InputLabel, InputBase } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  root: {
    padding: "10px 25px",
  },
  titleText: {
    marginRight: "15px",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  fieldsSection: {
    margin: "0px 0px",
    "& .MuiOutlinedInput-root": {
      height: `46px !important`,
      borderRadius: "6px !important",
    },
  },
  gridStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  fieldLabel: {
    fontWeight: "bold",
    fontSize: "15px",
  },
  field: {
    "& .MuiAutocomplete-clearIndicator": {
      marginRight: "10px",
    },
    "& .MuiFormControl-marginNormal": {
      margin: "0px",
    },
    "& .MuiFormControl-marginDense": {
      margin: "0px",
    },
  },
  wellsSelectField: {
    "& .MuiInputBase-root": {
      borderRadius: "8px",
    },
  },
  formControl: {
    width: "100%",
  },
  dateRoot: {
    color: "grey",
    "& input": {
      marginLeft: "20px",
    },
  },
  infoSection: {
    maxWidth: "50%",
  },
  mapSection: {
    height: "382px",
    width: "45%",
  },
  adornmentAutocomplete: {
    "& .MuiAutocomplete-endAdornment": {
      right: "50px !important",
      "& .MuiAutocomplete-clearIndicator": {
        display: "none",
      },
    },
  },
  contactCardIcon: {
    position: "absolute",
    right: "6px !important",
    marginTop: "4px !important",
    cursor: "pointer",
  },
  textArea: {
    margin: "0px 0px",
    "& .MuiOutlinedInput-root": {
      height: `auto !important`,
      borderRadius: "6px !important",
    },
  },
  datePicker: {
    "& .MuiIconButton-root": {
      padding: "12px 0px",
    },
  },
  summaryHeaderIcons: {
    "& .MuiGrid-item": {
      display: "flex",
      alignItems: "center",
      "& div": {
        marginRight: "5px",
      },
    },
    "& .MuiSvgIcon-root": {
      fill: "#757575",
    },
  },
  summaryHeader: {
    display: "flex",
    justify: "space-between",
    marginBottom: 20,
    fontWeight: "bold",
  },
  addDataButton: {
    backgroundColor: "white",
    color: "black",
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: theme.palette.common.white,
      opacity: 0.15,
    },
  },
  provisionCard: {
    backgroundColor: "#F6F8F9",
    padding: "10px",
    "& .heading": {
      fontWeight: "bold",
      paddingBottom: "20px",
      fontSize: "larger",
    },
    "& .text": {
      fontWeight: "bold",
    },
    "& .MuiSvgIcon-root": {
      marginRight: "10px",
    },
    "& .uncheck": {
      opacity: 0.5,
    },
    "& .provisionRow": {
      paddingBottom: "10px",
    },
  },
  acreageCard: {
    backgroundColor: "#F6F8F9",
    padding: "10px",
    marginTop: 20,
    "& .heading": {
      fontWeight: "bold",
      fontSize: "larger",
    },
    "& .MuiGrid-item": {
      padding: "0px 5px",
      marginTop: "20px",
    },
  },
  pencilIcon: {
    cursor: "pointer",
  },
}));

export const BootstrapInput = withStyles((theme) => ({
  root: {
    "label + &": {
      marginTop: theme.spacing(2),
    },
  },
  input: {
    width: "100%",
    borderRadius: 6,
    backgroundColor: "#fff",
    fontSize: 16,
    padding: "10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    borderColor: "##b3b4b5",
    border: "1px solid",
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      border: "2px solid",
    },
  },
}))(InputBase);

export const StyledTextField = (props) => (
  <FormControl variant="standard">
    <InputLabel shrink>{props.label}</InputLabel>
    <BootstrapInput type="text" {...props} />
  </FormControl>
);
