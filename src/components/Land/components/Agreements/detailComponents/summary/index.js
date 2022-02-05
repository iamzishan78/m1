import React, { useEffect } from "react";
import { get, set } from "lodash";
import { useSelector } from "react-redux";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useForm, Controller } from "react-hook-form";
import { Grid, Typography, Box } from "@material-ui/core";
import { useStyles as summaryStyles, StyledTextField } from "./style";

import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";

import FieldsSection from "./fieldsSection";

import { GET_STANDARD_PROVISIONS } from "graphQL/useQueryGetStandardProvisions";
import { GET_AGREEMENT_PROVISIONS } from "graphQL/useQueryGetAgreementProvisions";
import { UPDATECUSTOMLAYER } from "graphQL/useMutationUpdateCustomLayer";

export default function Summary({ agreementDetails }) {
  const classes = summaryStyles();
  const { control, reset } = useForm();
  const activeAgreement = useSelector(({ Land }) => Land.agreement?.activeAgreement);

  const [getStandardProvisions, { data: dataStandardProvisions = [] }] = useLazyQuery(GET_STANDARD_PROVISIONS);
  const [getAgreementProvisions, { data: agreementProvisions }] = useLazyQuery(GET_AGREEMENT_PROVISIONS);
  const [updateCustomLayer] = useMutation(UPDATECUSTOMLAYER);

  useEffect(() => {
    if (agreementDetails) {
      reset(agreementDetails);
      getAgreementProvisions({ variables: { agreementId: activeAgreement._id } });
    }
  }, [reset, agreementDetails, getAgreementProvisions]);

  useEffect(() => {
    getStandardProvisions();
  }, [getStandardProvisions]);

  const updateAgreement = (field, value, isCustom) => {
    if (agreementDetails[field] == value) return;
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

  const hasCustomProvision = get(agreementProvisions, "getAgreementProvisions", []).find((provision) => !provision.templateRef);

  return (
    <Grid container direction="row" justify="space-between" alignItems="center" className={classes.root}>
      <Grid item className={classes.infoSection}>
        <FieldsSection agreementDetails={{ ...agreementDetails, _id: activeAgreement?._id }} updateAgreement={updateAgreement} control={control} />
      </Grid>
      <Grid item className={classes.mapSection}>
        <Grid item md={12} className={classes.provisionCard}>
          <Typography className="heading">Provisions</Typography>
          <Grid container direction="row">
            {get(dataStandardProvisions, "getStandardProvisions", []).map((provision) => {
              const found = get(agreementProvisions, "getAgreementProvisions", []).find((p) => p.type === provision.type);
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
  );
}
