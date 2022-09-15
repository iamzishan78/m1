import React, { useMemo } from "react";
import { get } from "lodash";
import { useLazyQuery, useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/styles";
import { Button, DialogContent, DialogActions } from "@material-ui/core";
import { Typography, TextField, Grid, FormControl } from "@material-ui/core";
import FolderIcon from "@material-ui/icons/Folder";
import parse from "autosuggest-highlight/parse";
import debounce from "lodash/debounce";

import capitalizeFirstLetter from "components/Shared/valueformatters/capitalize-first-letter";
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

const filterKey = ["shapeJson.properties.agreementName.keyword", "shapeJson.properties.agreementNumber.keyword", "shapeJson.properties.layerSubType.keyword"];

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiDialogContent-root": {
      padding: "9px",
    },
  },
  titleText: {
    marginLeft: 16,
  },
  gridStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "10px",
    "& .MuiAutocomplete-popper": {
      width: "560px !important",
    }
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
  },
  score: {
    position: "absolute",
    top: "-8px",
    width: "17px",
    height: "16px",
    borderRadius: "50%",
    marginLeft: "10px",
  },
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
}));

const calcScoreOpacity = (maxMin, score) => {
  if (maxMin[0] === maxMin[1]) return 0;
  if (score === maxMin[1]) return 1;

  return 1 - (score - maxMin[1]) / (maxMin[0] - maxMin[1]);
};

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
                  // open={true}
                  renderOption={(option) => {
                    const parts = parse([option.key[0], option.key[1]], Array());

                    return (
                      <Grid container spacing={0}>
                        <Grid container item xs={11} alignItems="center">
                          <Grid item>
                            <FolderIcon className={classes.icon} color={"#757575"} />
                          </Grid>
                          <Grid item xs>
                            {parts.map((part, index) => (
                              <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                                {part.text}
                              </span>
                            ))}

                            {option && option.key[2] && (
                              <Typography variant="body2" color="textSecondary">
                                {option.key[2]}
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
                                backgroundImage: "repeating-linear-gradient(135deg, #ffffff , #ffffffb7 4.5%, #ffffff 15%)",
                                opacity: calcScoreOpacity(
                                  [0, 0],
                                  0
                                ).toString(),
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    );
                  }}
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
