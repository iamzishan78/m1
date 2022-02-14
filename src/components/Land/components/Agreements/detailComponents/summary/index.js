import React, { useEffect } from "react";
import { set } from "lodash";
import { useSelector } from "react-redux";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useForm, Controller } from "react-hook-form";
import { Grid, Typography, Box, Accordion, AccordionSummary, AccordionDetails, IconButton } from "@material-ui/core";
import { useStyles as summaryStyles, StyledTextField } from "../style";

import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import WellIcon from "components/Shared/svgIcons/well";
import TractIcon from "components/Shared/svgIcons/tract";
import InsertDriveFileOutlinedIcon from "@material-ui/icons/InsertDriveFileOutlined";

import FieldsSection from "./fieldsSection";
import ProgressBar from "components/Shared/ui/ProgressBar";

import { UPDATECUSTOMLAYER } from "graphQL/useMutationUpdateCustomLayer";
import { SHAPE_SUMMARY_DETAILS } from "graphQL/useQueryShapeSummaryDetail";

export default function Summary({ agreementDetails, agreementProvisions, standardProvisions }) {
  const classes = summaryStyles();
  const { control, reset } = useForm();
  const activeAgreement = useSelector(({ Land }) => Land.agreement?.activeAgreement);

  const [getShapeSummaryDetails, { data: dataShapeSummaryDetails }] = useLazyQuery(SHAPE_SUMMARY_DETAILS);
  const [updateCustomLayer] = useMutation(UPDATECUSTOMLAYER);

  useEffect(() => {
    if (activeAgreement?._id) {
      getShapeSummaryDetails({ variables: { shapeId: activeAgreement._id } });
    }
  }, [activeAgreement, getShapeSummaryDetails]);

  useEffect(() => {
    if (agreementDetails) {
      reset(agreementDetails);
    }
  }, [reset, agreementDetails, getShapeSummaryDetails]);

  const updateAgreement = (field, value, isCustom) => {
    if (agreementDetails[field] === value) return;
    const shape = activeAgreement.shape;
    if (!isCustom) {
      set(shape.properties, field, value);
      shape.properties[field] = value;
    } else {
      const customData = { ...agreementDetails.custom_data };
      customData[field] = value;
      shape.properties.custom_data = customData;
    }

    const customLayer = {};
    let shapeLabel = shape.properties.shapeLabel;
    if (field === "agreementNumber") shapeLabel = `${value}${shape.properties.agreementName ? `-${shape.properties.agreementName}` : ""}`;

    if (field === "agreementName") shapeLabel = `${shape.properties.agreementNumber ? `${shape.properties.agreementNumber}-` : ""}${value}`;

    if (field === "agreementType") {
      customLayer.layer = value;
    }

    shape.properties.shapeLabel = shapeLabel;
    shape.name = shapeLabel;
    shape.properties.name = shapeLabel;
    customLayer.shape = JSON.stringify(shape);
    customLayer.shapeJson = shape;

    updateCustomLayer({
      variables: {
        customLayerId: activeAgreement._id,
        customLayer,
      },
      refetchQueries: ["customLayer"],
    });
  };

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
            onClick={(e) => {}}
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
                      <div className={classes.summaryValue}> {dataShapeSummaryDetails?.shapeSummaryDetails?.shapeWells || 0} </div>
                      <WellIcon opacity="1.0" small color="#757575" />
                    </Grid>
                    <Grid item>
                      <div className={classes.summaryValue}> {dataShapeSummaryDetails?.shapeSummaryDetails?.shapeOwners || 0} </div>
                      <TractIcon opacity="1.0" small />
                    </Grid>
                    <Grid item>
                      <div className={classes.summaryValue}> {dataShapeSummaryDetails?.shapeSummaryDetails?.documents || 0} </div>
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
                <Grid item md={12} className={classes.acreageCard}>
                  <Typography className="heading">Acreage</Typography>

                  <Grid container direction="row" display="flex" justify="space-between" alignItems="center">
                    <Grid item xs={4}>
                      <Controller control={control} name="reportGross" label="Report Gross" as={StyledTextField} disabled />
                    </Grid>
                    <Grid item xs={4}>
                      <Controller control={control} name="gross" label="Gross" as={StyledTextField} disabled />
                    </Grid>
                    <Grid item xs={4}>
                      <Controller control={control} name="companyNet" label="Company Net" as={StyledTextField} disabled />
                    </Grid>
                    <Grid item xs={4}>
                      <Controller control={control} name="reportNet" label="Report Net" as={StyledTextField} disabled />
                    </Grid>
                    <Grid item xs={4}>
                      <Controller control={control} name="net" label="Net" as={StyledTextField} disabled />
                    </Grid>
                    <Grid item xs={4}>
                      <Controller control={control} name="netRoyaltyAcres" label="Net Royalty Acres" as={StyledTextField} disabled />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </div>
    </>
  );
}
