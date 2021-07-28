import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { Breadcrumbs, Typography, Grid, IconButton } from "@material-ui/core";
import PrintIcon from "@material-ui/icons/Print";
import AgreementDetailSection from "./AgreementDetailSection";
import LegalDescription from "./LegalDescription";
import RelatedParties from "./RelatedParties";
import TaggerWithIcon from "components/Shared/TaggerWithIcon";
import CommentsWithIcon from "components/Shared/CommentsWithIcon";
import { useMutation } from "@apollo/client";
import { ADD_AGREEMENT } from "graphQL/useMutatioAgreement";

const useStyles = makeStyles((theme) => ({
  headerRoot: {
    padding: "11px 22px 7px 11px",
    backgroundColor: "#F2F2F2",
    minHeight: "64px",
    borderBottom: "1px solid rgba(224, 224, 224, 1)",
  },
  headerIcon: {
    "& .MuiIconButton-root": {
      color: "black",
      backgroundColor: "#D4E8F1",
      borderRadius: "50%",
      margin: 1,
      "&:hover": {
        backgroundColor: "#D4E8F1 !important",
      },
    },
  },
}));

function Agreement(props) {
  const classes = useStyles();
  const [breadcrumbTitle, setTitle] = useState();
  const [newAgreement, setNewAgreement] = useState({});
  const [addAgreement, { data: addedAgreement }] = useMutation(ADD_AGREEMENT);

  useEffect(() => {
    addAgreement({
      variables: {
        agreement: { type: "agreement" },
      },
    });
  }, [addAgreement]);

  useEffect(() => {
    if (addedAgreement?.addAgreement) {
      setNewAgreement(addedAgreement.addAgreement);
    }
  }, [addedAgreement]);

  return (
    <>
      {/**
       * Here is header
       */}
      <Grid container direction="row" justify="space-between" alignItems="center" className={classes.headerRoot}>
        <Grid item style={{ display: "flex" }}>
          <DescriptionOutlinedIcon />
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            <Typography
              style={{
                marginLeft: "10px",
                fontSize: "16px",
              }}
              color="inherit"
            >
              Documents
            </Typography>
            <Typography style={{ color: "#18AADD", fontSize: "16px" }}>{breadcrumbTitle}</Typography>
          </Breadcrumbs>
        </Grid>
        <Grid item className={classes.headerIcon}>
          <CommentsWithIcon objectId={newAgreement._id} targetLabel="agreement" iconZiseSmall={false} />
          <TaggerWithIcon objectId={newAgreement._id} targetLabel="agreement" iconZiseSmall={false} />
          <IconButton>
            <PrintIcon />
          </IconButton>
        </Grid>
      </Grid>

      {/**
       * Here is Agreement Detail header
       */}
      <AgreementDetailSection setTitle={setTitle} newAgreement={newAgreement} />
      <RelatedParties />
      {/* <LegalDescription /> */}
    </>
  );
}

export default Agreement;
