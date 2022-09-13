import React, { useMemo } from "react";
import { get } from "lodash";
import { useLazyQuery, useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/styles";
import { Button, DialogContent, DialogActions } from "@material-ui/core";
import { Typography, TextField, Grid, FormControl } from "@material-ui/core";

import ArrowForwardIcon from "components/Shared/svgIcons/KeyboardTabBlackIcon";
import AutoCompleteESField from "components/Shared/Forms/Fields/AutoCompleteESField";
import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";
import { CUSTOMLAYER } from "graphQL/useQueryCustomLayer";
import { UPSERT_RELATED_AGREEMENT_DESSCRIPTOR } from "graphQL/useMutationsRelatedAgreement";

const agreementParams = [
  { key: "agreementNumber", label: "Agreement Number" },
  { key: "agreementName", label: "Agreement Name" },
  { key: "type", label: "Type" },
  { key: "layerSubType", label: "Subtype" },
  { key: "grantor", label: "Grantor" },
  { key: "grantee", label: "Grantee" },
  { key: "agreementDate", label: "Agreement Date" },
  { key: "effectiveDate", label: "Effective Date" },
  { key: "expirationDate", label: "Expiration Date" },
  { key: "agreementStatus", label: "Status" },
];

const filterKey = ["shapeJson.properties.agreementName.keyword", "shapeJson.properties.agreementNumber.keyword"];

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiDialogContent-root": {
      padding: "9px",
    },
  },
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
    padding: "10px",
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
  dialogContent: {
    width: "100%",
    "& header": {
      position: "absolute",
      left: "0",
      top: "55px",
    },
  },
  primary: {
    color: "black",
    backgroundColor: "#E0E0E0",
  },
  secondary: {
    color: "white",
    backgroundColor: "#26ACD8",
  },
  dialogAction: {
    width: "100%",
    "& .Mui-disabled": {
      backgroundColor: "transparent",
    },
  },
  dialogHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: "0px 20px",
    "& svg": {
      fontSize: 18,
      cursor: "pointer",
      fill: "#808080 !important",
    },
  }
}));

const AddNewRelatedAgreementDialog = (props) => {
  const classes = useStyles();
  const [getCustomLayer, { data: agreement }] = useLazyQuery(CUSTOMLAYER);
  const [upsertRelatedAgreementDescriptor, { loading: upsertLoading }] = useMutation(UPSERT_RELATED_AGREEMENT_DESSCRIPTOR);

  const { customLayerId, setNewAgmtState } = props;

  const selectedAgreement = useMemo(() => get(agreement, "customLayer.shapeJson.properties"), [agreement]);

  const fetchAgreementDetails = (value, key) => {
    getCustomLayer({
      variables: {
        key,
        value,
      },
    });
  };

  const addNewRelatedAgreement = () => {
    upsertRelatedAgreementDescriptor({
      variables: {
        descriptorObject: customLayerId,
        relatedObject: get(agreement, "customLayer._id"),
      },
      refetchQueries: ["getESSimpleSearch"],
      awaitRefetchQueries: true,
    });
  };

  return (
    <div
      className={`flex column justifyStart alignStart w-100 ${classes.root}`}
      style={{
        padding: "16px 10px",
        background: "#ffffff",
        borderRadius: 8,
        overflow: "auto",
        height: "100%",
        width: "100%",
      }}
    >
      <div className={classes.dialogHeader}>
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

        <div className="flex alignCenter c-pointer">
          {props.menuComponent}
          <span onClick={() => setNewAgmtState(false)}>
            <ArrowForwardIcon />
          </span>
        </div>
      </div>
      <DialogContent className={classes.dialogContent}>
        <div className={classes.contentRoot}>
          <div style={{ marginTop: 10, marginLeft: 4 }}>
            <FormControl variant="outlined" fullWidth size="small">
              <Grid container className={classes.gridStyle}>
                <AutoCompleteESField
                  placeholder="Search for agreement by name or number"
                  value=""
                  column={{
                    label: "",
                    filterKey,
                  }}
                  onChange={(value, index) => fetchAgreementDetails(value, filterKey[index].replace(".keyword", ""))}
                  query={GET_ES_FILTER_LIST}
                  esIndex="shapes_flat"
                  extendSearchQuery="*"
                  variant="outlined"
                />
              </Grid>
              {agreementParams.map((params, index) => (
                <Grid key={index} container className={classes.gridStyle}>
                  <TextField
                    id={`outlined-multiline-static-${index}`}
                    label={params.label}
                    value={get(selectedAgreement, params.key, "")}
                    fullWidth
                    disabled
                  />
                </Grid>
              ))}
            </FormControl>
          </div>
        </div>
      </DialogContent>
      <DialogActions className={classes.dialogAction}>
        <Button className={classes.primary} color="primary" style={{ marginBottom: "40px" }} onClick={() => setNewAgmtState(false)}>
          Cancel
        </Button>
        <Button
          className={classes.secondary}
          color="secondary"
          style={{ marginBottom: "40px", marginRight: "20px" }}
          onClick={addNewRelatedAgreement}
          disabled={!!upsertLoading}
        >
          Add
        </Button>
      </DialogActions>
    </div>
  );
};

export default AddNewRelatedAgreementDialog;
