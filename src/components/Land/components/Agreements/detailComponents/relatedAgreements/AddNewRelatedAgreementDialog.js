import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Typography, TextField, Grid, FormControl } from "@material-ui/core";

import ArrowForwardIcon from "components/Shared/svgIcons/KeyboardTabBlackIcon";
import AutoCompleteESField from "components/Shared/Forms/Fields/AutoCompleteESField";
import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";

const useStyles = makeStyles((theme) => ({
  titleText: {
    marginLeft: 16,
  },
  metaPanelCloseIcon: {
    "& svg": {
      fontSize: 18,
      cursor: "pointer",
      fill: "#808080 !important",
    },
  },
  gridStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  dealOwnerRoot: {
    border: "1px solid #EBEBEB",
    '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child': {
      paddingLeft: 26,
    },

    "& .MuiOutlinedInput-notchedOutline": {
      border: 0,
    },
    "&:hover.MuiOutlinedInput-root": {
      backgroundColor: "#EBEBEB",
    },
    "&:hover .MuiAutocomplete-popupIndicator": {
      visibility: "visible",
      padding: "2px",
      marginRight: "-2px",
    },
  },
  dealOwnerRootFocused: {
    "& .MuiOutlinedInput-notchedOutline": {
      border: "1px solid black",
    },
  },
  popupIndicator: {
    visibility: "hidden",
    padding: "2px",
    marginRight: "-2px",
    "&:hover": {
      visibility: "visible",
    },
  },
  inputFieldOwner: {
    marginBottom: "7px",
  },
  dealOwnerAvatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    color: "#fff",
    fontSize: "0.6rem",
    backgroundColor: "#4880F6",
    padding: "0.5em",
  },
  dealOwnerLabel: {
    marginLeft: 4,
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
  viewAll: {
    textDecoration: "underline",
    margin: "0 0 8px 0",
    float: "right",
    color: theme.palette.secondary.main,
    cursor: "pointer",
    fontWeight: "normal",
    "&:hover": { color: "#757575" },
    transition: "color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  },
  contentRoot: {
    overflow: "overlay",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
  },
}));

const AddNewRelatedAgreementDialog = (props) => {
  const classes = useStyles();

  return (
    <div
      className="flex column justifyStart alignStart w-100"
      style={{
        padding: "16px 10px",
        background: "#ffffff",
        borderRadius: 8,
        overflow: "auto",
        height: "100%",
        width: "100%",
      }}
    >
      <div className="flex justifyBetween alignCenter w-100">
        <Typography
          varient="h5"
          className={classes.titleText}
          style={{
            fontWeight: "bold",
            marginLeft: "5px",
            fontSize: 19,
          }}
        >
          Add Related Agreement
        </Typography>

        <div className="flex alignCenter">
          {props.menuComponent}
          <span onClick={() => {}}>
            <ArrowForwardIcon />
          </span>
        </div>
      </div>

      <div className={classes.contentRoot}>
        <div>
          <div style={{ marginTop: 10, marginLeft: 4 }}>
            <FormControl variant="outlined" fullWidth size="small">
              <Grid container className={classes.gridStyle}>
                <AutoCompleteESField
                  placeholder="Search for agreement by name or number"
                  value=""
                  column={{
                    label: "",
                    filterKey: ["shapeJson.properties.agreementNumber.keyword", "shapeJson.properties.agreementName.keyword"],
                  }}
                  onChange={() => {}}
                  query={GET_ES_FILTER_LIST}
                  esIndex="shapes_flat"
                  extendSearchQuery="*"
                />
              </Grid>
              <Grid container className={classes.gridStyle}>
                <TextField id="outlined-multiline-static" label="Agreement Number" value={"100032"} fullWidth />
              </Grid>
            </FormControl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewRelatedAgreementDialog;
