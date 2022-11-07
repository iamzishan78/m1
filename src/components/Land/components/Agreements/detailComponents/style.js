import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { FormControl, InputLabel, InputBase } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  root: {
    padding: "10px 25px",
  },
  accordionRoot: {
    borderRadius: "5px",
    margin: "10px 0px",
    boxShadow: "none",
    "& .MuiButtonBase-root.MuiAccordionSummary-root": {
      maxHeight: "50px",
      minHeight: "50px",
      padding: 0,
    },
    "&.MuiAccordion-root.Mui-expanded": {
      margin: 0,
    },
  },
  accordionHeading: {
    display: "flex !important",
    alignItems: "center",
    "& .MuiChip-root": {
      width: "auto",
      fontSize: "1.2rem",
      fontWeight: "bold",
      color: "#fff",
      borderRadius: "3px !important",
      backgroundColor: "#18aadd",
    },
  },
  accordionDetails: {
    padding: 0,
  },
  titleText: {
    marginRight: "40px",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  fieldsSection: {
    margin: "0px 0px",
    "& .MuiOutlinedInput-root": {
      height: `46px !important`,
      borderRadius: "6px !important",
      paddingTop: `0 !important`,
      paddingBottom: `0 !important`,
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
    flex:'1',
    minWidth:'540px',
  },
  mapSection: {
    height: "382px",
    minWidth:'540px',
    flex:'1',
    margin: "10px 0px 0px 0px",
  },
  adornmentAutocomplete: {
    "& .MuiAutocomplete-endAdornment": {
      right: "60px !important",
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
    margin: "5px",
    "&& span": {
      pointerEvents: "none",
    },
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
    fontWeight: "bold",
    width: "51%",
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
    marginTop: "8px",
    "& .heading": {
      fontWeight: "bold",
      fontSize: "larger",
    },
    "& .MuiGrid-item": {
      padding: "0px 5px",
      marginTop: "20px",
    },
  },

  descriptionInput: {
    width: "100%",
    margin: "20px 0 0",
    "& .MuiTextField-root": {
      backgroundColor: "#fffcdc",
      borderRadius: 4,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "& textarea": {
      height: "323px",
    },
  },

  foodText: {
    position: "absolute",
    bottom: "20px",
    right: "0px",
    fontSize: "10px",
    color: "#6e6e6e",
    margin: "0 !important",
    textAlign: "right",
    height: "0",
    paddingRight: "10px",
    "& span": {
      fontWeight: "bold",
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
