import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Grid, Typography, Box, Accordion, AccordionSummary, AccordionDetails, IconButton } from "@material-ui/core";
import { useStyles as summaryStyles } from "../style";

import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import WellIcon from "components/Shared/svgIcons/well";
import TractIcon from "components/Shared/svgIcons/tract";
import InsertDriveFileOutlinedIcon from "@material-ui/icons/InsertDriveFileOutlined";

import FieldsSection from "./fieldsSection";
import ProgressBar from "components/Shared/ui/ProgressBar";
import Acreage from "./Acreage";

export default function Summary({
  agreementDetails,
  activeAgreement,
  agreementProvisions,
  standardProvisions,
  updateAgreement,
  shapeSummaryDetails,
}) {
  const classes = summaryStyles();
  const { control, reset } = useForm();

  useEffect(() => {
    if (agreementDetails) {
      reset(agreementDetails);
    }
  }, [reset, agreementDetails]);

  const hasCustomProvision = agreementProvisions.find((provision) => !provision.templateRef);

  return (
    <>
      <div className={classes.root}>
        <Accordion className={classes.accordionRoot} defaultExpanded={true}>
          <AccordionSummary
            expandIcon={
              <IconButton>
                <ExpandMoreIcon fontSize="large" />
              </IconButton>
            }
            onClick={(e) => { }}
          >
            <Grid container direction="row" justify="space-between" alignItems="center">
              <Grid item className={classes.summaryHeader}>
                <div style={{ display: "flex", width: "55%" }}>
                  <Typography variant="h5" className={classes.titleText}>
                    Summary
                  </Typography>
                  <ProgressBar value={35} height="3px" isNumeric />
                </div>
                <div style={{ width: "40%" }}>
                  <Grid container spacing={2} justify="flex-end" className={classes.summaryHeaderIcons}>
                    <Grid item>
                      <div className={classes.summaryValue}> {shapeSummaryDetails?.shapeWells || 0} </div>
                      <WellIcon opacity="1.0" small color="#757575" />
                    </Grid>
                    <Grid item>
                      <div className={classes.summaryValue}> {shapeSummaryDetails?.shapeOwners || 0} </div>
                      <TractIcon opacity="1.0" small />
                    </Grid>
                    <Grid item>
                      <div className={classes.summaryValue}> {shapeSummaryDetails?.documents || 0} </div>
                      <InsertDriveFileOutlinedIcon opacity="1.0" small />
                    </Grid>
                  </Grid>
                </div>
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails className={classes.accordionDetails}>
            <Grid container direction="row" justify="space-between" alignItems="center" style={{ padding: "10px 0px" }}>
              <Grid item className={classes.infoSection}>
                <FieldsSection
                  agreementDetails={{ ...agreementDetails, _id: activeAgreement?._id }}
                  updateAgreement={updateAgreement}
                  control={control}
                />
              </Grid>
              <Grid item className={classes.mapSection}>
                <Grid item md={12} className={classes.provisionCard}>
                  <Typography className="heading">Provisions</Typography>
                  <Grid container direction="row">
                    {standardProvisions.map((provision) => {
                      const found = agreementProvisions.find((p) => p.type === provision.type);
                      return (
                        <Grid item md={6} className="provisionRow">
                          <Box display="inline-flex" className={found ? "" : "uncheck"}>
                            {found ? <CheckIcon fontSize="medium" style={{ color: "#00b050" }} /> : <CloseIcon />}
                            <Typography className="text">{provision.type}</Typography>
                          </Box>
                        </Grid>
                      );
                    })}
                    <Grid item md={6} className="provisionRow">
                      <Box display="inline-flex" className={hasCustomProvision ? "" : "uncheck"}>
                        {hasCustomProvision ? <CheckIcon fontSize="medium" style={{ color: "#00b050" }} /> : <CloseIcon />}
                        <Typography className="text">Other</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
                <Acreage properties={agreementDetails} />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </div>
    </>
  );
}
