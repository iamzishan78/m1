import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import _ from "lodash";
import {
  Grid,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  TextField,
} from "@material-ui/core";
import { useStyles as summaryStyles } from "../style";

import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import WellIcon from "components/Shared/svgIcons/well";
import TractIcon from "components/Shared/svgIcons/tract";
import InsertDriveFileOutlinedIcon from "@material-ui/icons/InsertDriveFileOutlined";
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';

import FieldsSection from "./fieldsSection";
import Acreage from "./Acreage";
import AgreementIcon from "components/Shared/svgIcons/agreements";

export default function Summary({
  agreementDetails,
  activeAgreement,
  agreementProvisions,
  standardProvisions,
  updateAgreement,
  shapeSummaryDetails,
}) {
  const [description, setDescription] = useState("");
  const [onFocusDescription, setFocusSate] = useState(false);
  const classes = summaryStyles();
  const { control, reset } = useForm();

  useEffect(() => {
    if (agreementDetails) {
      reset(agreementDetails);
    }
  }, [reset, agreementDetails]);

  useEffect(() => {
    const description = agreementDetails?.metaDescription || "";

    setDescription(description);
  }, [agreementDetails]);

  const hasCustomProvision = agreementProvisions.find(
    (provision) => !provision.templateRef
  );

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
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <Grid item className={classes.summaryHeader}>
                <Typography variant="h5" className={classes.titleText}>
                  Summary
                </Typography>
                <Grid
                  container
                  spacing={1}
                  justify="flex-start"
                  className={classes.summaryHeaderIcons}
                >

                  <Grid item>
                    <div className={classes.summaryValue}>
                      {" "}
                      {shapeSummaryDetails?.relatedParties || 0}{" "}
                    </div>
                    <PeopleAltIcon opacity="1.0" />
                  </Grid>
                  <Grid item>
                    <div className={classes.summaryValue}>
                      {" "}
                      {agreementProvisions?.length || 0}{" "}
                    </div>
                    <AgreementIcon opacity="1.0" />
                  </Grid>
                  <Grid item>
                    <div className={classes.summaryValue}>
                      {" "}
                      {shapeSummaryDetails?.shapeWells || 0}{" "}
                    </div>
                    <WellIcon opacity="1.0" small color="#757575" />
                  </Grid>
                  <Grid item>
                    <div className={classes.summaryValue}>
                      {" "}
                      {shapeSummaryDetails?.shapeOwners || 0}{" "}
                    </div>
                    <TractIcon opacity="1.0" small />
                  </Grid>
                  <Grid item>
                    <div className={classes.summaryValue}>
                      {" "}
                      {shapeSummaryDetails?.documents || 0}{" "}
                    </div>
                    <InsertDriveFileOutlinedIcon opacity="1.0" small />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails className={classes.accordionDetails}>
            <Grid
              container
              direction="row"
              justify="space-between"
              style={{ padding: "10px 0px" }}
            >
              <Grid item className={classes.infoSection}>
                <FieldsSection
                  agreementDetails={{
                    ...agreementDetails,
                    _id: activeAgreement?._id,
                  }}
                  updateAgreement={updateAgreement}
                  control={control}
                />
              </Grid>
              <Grid item className={classes.mapSection}>
                <Grid item md={12} className={classes.provisionCard}>
                  <Typography className="heading">Provisions</Typography>
                  <Grid container direction="row">
                    {standardProvisions.map((provision) => {
                      const found = agreementProvisions.find(
                        (p) => p.type === provision.type
                      );
                      return (
                        <Grid item md={6} className="provisionRow">
                          <Box
                            display="inline-flex"
                            className={found ? "" : "uncheck"}
                          >
                            {found ? (
                              <CheckIcon
                                fontSize="medium"
                                style={{ color: "#00b050" }}
                              />
                            ) : (
                              <CloseIcon />
                            )}
                            <Typography className="text">
                              {provision.type}
                            </Typography>
                          </Box>
                        </Grid>
                      );
                    })}
                    <Grid item md={6} className="provisionRow">
                      <Box
                        display="inline-flex"
                        className={hasCustomProvision ? "" : "uncheck"}
                      >
                        {hasCustomProvision ? (
                          <CheckIcon
                            fontSize="medium"
                            style={{ color: "#00b050" }}
                          />
                        ) : (
                          <CloseIcon />
                        )}
                        <Typography className="text">Other</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
                <div style={{ padding: "0px 5px 5px 5px", backgroundColor: '#F6F8F9' }}>
                  <Acreage properties={agreementDetails} />
                </div>
                <Grid item className={classes.descriptionInput}>
                  <TextField
                    id="outlined-multiline-static"
                    label="Description"
                    value={description}
                    multiline
                    fullWidth
                    rows={5}
                    variant="outlined"
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                    onKeyPress={(event) => {
                      if (event.key === "Enter") {
                        document.activeElement.blur();
                        updateAgreement(
                          "metaDescription", event.target.value,
                        );
                      }
                    }}
                    onFocus={() => setFocusSate(true)}
                    onBlur={() => setFocusSate(false)}
                    InputProps={{
                      endAdornment: onFocusDescription === true && (
                        <p className={classes.foodText}>
                          <span>Return</span> to save
                        </p>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </div>
    </>
  );
}
