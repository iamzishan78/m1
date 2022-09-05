import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Chip, IconButton } from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon, DescriptionOutlined as DescriptionOutlinedIcon } from "@material-ui/icons";
import { useStyles as customStyles } from "../style";

import RelatedAgreementsTable from "./RelatedAgreementsTable";

import { useLazyQuery } from "@apollo/client";
import { GET_PARCELS_FILES_COUNT } from "graphQL/useQueryGetParcelFiles";

const useStyles = makeStyles((theme) => ({
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
    padding: "30px 18px",
  },
  numberField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
    },
    "& input[type=number]": {
      "-moz-appearance": "textfield",
    },
    "& input[type=number]::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    "& input[type=number]::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
  },
  documentHeader: {
    fontSize: "1.25rem",
    "& svg": {
      transform: "translate(-4%, 22%)",
    },
  },
}));

const RelatedAgreements = (props) => {
  const { uniObj } = props;
  const classes = useStyles();
  const customClasses = customStyles();

  return (
    <div className={classes.root}>
      <Accordion className={classes.accordionRoot} defaultExpanded={true}>
        <AccordionSummary
          expandIcon={
            <IconButton>
              <ExpandMoreIcon fontSize="large" />
            </IconButton>
          }
          onClick={(e) => {}}
        >
          <Grid container direction="row" justify="space-between" alignItems="center">
            <Grid item xs={6} className={classes.accordionHeading}>
              <Typography variant="h5" className={customClasses.titleText}>
                Related Agreements
              </Typography>
              <Chip color="info" label={0} />
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetails}>
          <Grid container direction="column" alignItems="center" spacing={4} style={{ display: "block" }}>
            {uniObj?._id && (
              <Grid item xs={12} style={{ padding: "35px 20px 0px 0px" }}>
                <RelatedAgreementsTable
                  customLayer={uniObj}
                  relatedObjectType="Shape"
                  name="Agreement"
                  addAble={{ type: "AgreementDocument" }}
                  dense
                  isPdfViewer={false}
                  targetLabel={"documents"}
                  documentSearchQuery={`shapeObj._id:${uniObj?._id}`}
                  setNewAgmtState={props.setNewAgmtState}
                />
              </Grid>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default RelatedAgreements;
