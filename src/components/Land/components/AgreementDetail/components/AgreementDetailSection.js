import React, { useState, useEffect } from "react";
import moment from "moment";
import { makeStyles, Grid, Accordion, AccordionSummary, AccordionDetails, TextField } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { KeyboardDatePicker } from "@material-ui/pickers";
import StateCard from "components/ParcelsDetailCard/components/StateCard";
import CountyCard from "components/ParcelsDetailCard/components/CountyCard";
import StatusCard from "components/Shared/components/Cards/StatusCard";
import PropStatusCard from "components/Shared/components/Cards/PropStatusCard";
import SurveyCard from "components/ParcelsDetailCard/components/SurveyCard";
import BlockCard from "components/ParcelsDetailCard/components/BlockCard";
import SectionCard from "components/ParcelsDetailCard/components/SectionCard";
import AbstractCard from "components/ParcelsDetailCard/components/AbstractCard";
import AltSurvey from "components/ParcelsDetailCard/components/AltSurveyCard";
import AutoComplete from "components/Shared/components/Fields/AutoComplete";
import { useMutation } from "@apollo/client";
import { UPDATE_AGREEMENT } from "graphQL/useMutatioAgreement";

const useStyles = makeStyles(() => ({
  accordionRoot: {
    color: "black",
    "&.MuiAccordion-root.Mui-expanded": {
      margin: 0,
    },
  },
  accordionSummary: {
    backgroundColor: "#F2F2F2",
    minHeight: "70px",
    padding: "10px 30px 10px 30px",
    "& .MuiAccordionSummary-content": {
      margin: "0px !important",
    },
  },
  detailFieldsRow2: {
    marginRight: 30,
    marginTop: "40px",
  },
}));

function AgreementDetailSection({ setTitle, newAgreement }) {
  const classes = useStyles();
  const [title, setHeaderTitle] = useState({ name: "", number: "" });
  const [status, setStatus] = useState("");
  const [hbp, setPropStatus] = useState("");
  const [dates, setDates] = useState({
    effectiveDate: "",
    term: 0,
    expirationDate: "",
  });
  const [extensionExpirationDate, setExtensionDate] = useState("");
  const [isExtendable, setExtendable] = useState(false);

  const [updateAgreement] = useMutation(UPDATE_AGREEMENT);

  useEffect(() => {
    if (!title.number && title.name) {
      setTitle(`${title.name}`);
    } else if (!title.name && title.number) {
      setTitle(`${title.number}`);
    } else if (title.name && title.number) {
      setTitle(`${title.number}-${title.name}`);
    } else if (!title.number && !title.name) {
      setTitle("New Agreement");
    }
  }, [title, setTitle]);

  useEffect(() => {
    if (dates.effectiveDate) {
      let addedDate = moment(dates.effectiveDate).add(dates.term, "M");
      addedDate = moment(addedDate, "DD MM YYYY hh:mm:ss").toDate();
      setDates({ ...dates, expirationDate: addedDate });
      handleUpdateAgreement({ effectiveDate: String(dates.effectiveDate), term: dates.term, expirationDate: String(addedDate) });
    }
  }, [dates.effectiveDate, dates.term]);

  useEffect(() => { }, [dates.expirationDate]);

  const handleUpdateAgreement = (agreementKey) => {
    updateAgreement({
      variables: {
        agreement: { ...newAgreement, ...agreementKey },
      },
    });
  };

  return (
    <>
      <Accordion className={classes.accordionRoot} defaultExpanded="true">
        <AccordionSummary
          aria-controls="panel1a-content"
          id="panel1a-header"
          expandIcon={<ExpandMoreIcon />}
          className={classes.accordionSummary}
        >
          <Grid container direction="center" display="flex" justify="space-between" style={{ marginLeft: "20px" }}>
            <Grid item>
              <StateCard />
            </Grid>
            <Grid item>
              <CountyCard />
            </Grid>
            <Grid item>
              <SurveyCard />
            </Grid>
            <Grid item>
              <BlockCard />
            </Grid>
            <Grid item>
              <SectionCard />
            </Grid>
            <Grid item>
              <AbstractCard />
            </Grid>
            <Grid item>
              <AltSurvey />
            </Grid>
            <Grid item>
              <StatusCard status={status} label="Agreement" />
            </Grid>
            <Grid item>
              <PropStatusCard status={hbp} label="Property" />
            </Grid>
            <Grid item></Grid>
            <Grid item></Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container direction="row" justify="flex-start" alignItems="center" style={{ width: "100%", margin: "5px 5px 5px 20px" }}>
            <Grid item style={{ width: "13%", marginRight: 50 }}>
              <TextField
                margin="dense"
                label="Agreement Number"
                fullWidth
                onChange={({ target }) => setHeaderTitle({ ...title, number: target.value })}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleUpdateAgreement({ number: event.target.value });
                  }
                }}
                onBlur={(event) => handleUpdateAgreement({ number: event.target.value })}
              />
            </Grid>
            <Grid item style={{ width: "40%", marginRight: 50 }}>
              <TextField
                margin="dense"
                label="Agreement Name"
                fullWidth
                onChange={({ target }) => setHeaderTitle({ ...title, name: target.value })}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleUpdateAgreement({ name: event.target.value });
                  }
                }}
                onBlur={(event) => handleUpdateAgreement({ name: event.target.value })}
              />
            </Grid>
            <Grid item style={{ width: "20%", marginRight: 50 }}>
              <AutoComplete
                classes={classes}
                onChange={(value) => handleUpdateAgreement({ agreementType: value })}
                label="Agreement Type"
                options={["Lease - Oil, Gas, Minerals"]}
              />
            </Grid>
            <Grid item style={{ width: "15%", marginRight: 45 }}>
              <AutoComplete
                classes={classes}
                label="Agreement Status"
                options={["Active", "Inactive"]}
                onChange={(value) => {
                  setStatus(value);
                  handleUpdateAgreement({ status: value });
                }}
              />
            </Grid>
            <Grid item style={{ minWidth: "10%" }} className={classes.detailFieldsRow2}>
              <AutoComplete
                classes={classes}
                onChange={(value) => {
                  handleUpdateAgreement({ rights: value });
                }}
                label="Rights"
                options={["Oil & Gas"]}
              />
            </Grid>
            <Grid item style={{ minWidth: "14%" }} className={classes.detailFieldsRow2}>
              <AutoComplete
                classes={classes}
                onChange={(value) => {
                  setPropStatus(value);
                  handleUpdateAgreement({ propertyStatus: value });
                }}
                label="Property Status"
                options={["Active - Held By Production", "Active - Undeveloped", "Inactive"]}
              />
            </Grid>
            <Grid item className={classes.detailFieldsRow2}>
              <KeyboardDatePicker
                className={classes.maxWidth}
                disableToolbar
                label="Agreement Date"
                variant="inline"
                format="MM/DD/YYYY"
                margin="normal"
                id="date-picker-inline"
                onChange={(date) => {
                  handleUpdateAgreement({ createdAt: date ? String(date["_d"]) : "" });
                }}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </Grid>
            <Grid item className={classes.detailFieldsRow2}>
              <KeyboardDatePicker
                className={classes.maxWidth}
                label="Effective Date"
                disableToolbar
                variant="inline"
                format="MM/DD/YYYY"
                margin="normal"
                id="date-picker-inline"
                value={dates.effectiveDate || null}
                onChange={(date) => {
                  setDates({
                    ...dates,
                    effectiveDate: date ? date["_d"] : "",
                  });
                }}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </Grid>
            <Grid item className={classes.detailFieldsRow2} style={{ maxWidth: "5%" }}>
              <TextField
                margin="dense"
                label="Term (mo.)"
                fullWidth
                type="number"
                value={dates.term}
                onChange={({ target }) =>
                  setDates({
                    ...dates,
                    term: target.value,
                  })
                }
                defaultValue={0}
              />
            </Grid>
            <Grid item className={classes.detailFieldsRow2}>
              <KeyboardDatePicker
                className={classes.maxWidth}
                label="Expiration Date"
                disableToolbar
                variant="inline"
                format="MM/DD/YYYY"
                margin="normal"
                id="date-picker-inline"
                value={dates.expirationDate || null}
                onChange={(date) => {
                  setDates({
                    ...dates,
                    expirationDate: date ? String(date["_d"]) : "",
                  });
                }}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </Grid>
            <Grid item className={classes.detailFieldsRow2}>
              <AutoComplete
                classes={classes}
                label="Extended?"
                options={["Yes", "No"]}
                defaultValue="No"
                canAdd={false}
                onChange={(value) => setExtendable(value === "Yes")}
              />
            </Grid>
            <Grid item className={classes.detailFieldsRow2}>
              <KeyboardDatePicker
                className={classes.maxWidth}
                label="Extension Expiration Date"
                disableToolbar
                variant="inline"
                format="MM/DD/YYYY"
                margin="normal"
                id="date-picker-inline"
                disabled={!isExtendable}
                value={extensionExpirationDate || null}
                onChange={(date) => {
                  setExtensionDate(String(date["_d"]));
                  handleUpdateAgreement({ extensionExpirationDate: date ? String(date["_d"]) : "" });
                }}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </>
  );
}

export default AgreementDetailSection;
