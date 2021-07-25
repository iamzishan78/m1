import React, { useState, useEffect } from "react";
import { makeStyles, Grid, Accordion, AccordionSummary, AccordionDetails, TextField } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { KeyboardDatePicker } from "@material-ui/pickers";
import StateCard from "components/ParcelsDetailCard/components/StateCard";
import CountyCard from "components/ParcelsDetailCard/components/CountyCard";
import MeridianCard from "components/ParcelsDetailCard/components/MeridianCard";
import TownshipCard from "components/ParcelsDetailCard/components/TownshipCard";
import RangeCard from "components/ParcelsDetailCard/components/RangeCard";
import StatusCard from 'components/Shared/components/Cards/StatusCard';
import SurveyCard from "components/ParcelsDetailCard/components/SurveyCard";
import BlockCard from "components/ParcelsDetailCard/components/BlockCard";
import SectionCard from "components/ParcelsDetailCard/components/SectionCard";
import AbstractCard from "components/ParcelsDetailCard/components/AbstractCard";
import AltSurvey from "components/ParcelsDetailCard/components/AltSurveyCard";

const useStyles = makeStyles((theme) => ({
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
    marginRight: 45,
    marginTop: "40px",
  },
}));

function AgreementDetailSection({ setTitle }) {
  const classes = useStyles();
  const [title, setHeaderTitle] = useState({ name: "", number: "" });
  const [status, setStatus] = useState("");

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

  return (
    <>
      <Accordion className={classes.accordionRoot}>
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
              />
            </Grid>
            <Grid item style={{ width: "40%", marginRight: 50 }}>
              <TextField
                margin="dense"
                label="Agreement Name"
                fullWidth
                onChange={({ target }) => setHeaderTitle({ ...title, name: target.value })}
              />
            </Grid>
            <Grid item style={{ width: "20%", marginRight: 50 }}>
              <TextField
                select
                label="Agreement Type"
                fullWidth
                style={{ minWidth: 200 }}
              // onChange={({ target }) => setHeaderTitle({ ...title, name: target.value })}
              >
                <option key="Oil, gas" value="Oil, gas........">
                  Oil, gas
                </option>
              </TextField>
            </Grid>
            <Grid item style={{ width: "15%", marginRight: 45 }}>
              <TextField
                select
                label="Agreement Status"
                fullWidth
                style={{ minWidth: 200 }}
                onChange={({ target }) => setStatus(target.value)}
              >
                <option key="Active" value="Active">
                  Active
                </option>
                <option key="DeActive" value="DeActive">
                  DeActive
                </option>
              </TextField>
            </Grid>
            <Grid item style={{ minWidth: "10%" }} className={classes.detailFieldsRow2}>
              <TextField
                select
                margin="dense"
                label="Rights"
                fullWidth
              // onChange={({ target }) => setHeaderTitle({ ...title, number: target.value })}
              >
                <option key="Oil, gas" value="Oil, gas........">
                  Oil, gas
                </option>
              </TextField>
            </Grid>
            <Grid item style={{ minWidth: "15%" }} className={classes.detailFieldsRow2}>
              <TextField
                margin="dense"
                label="Property Status"
                fullWidth
              // onChange={({ target }) => setHeaderTitle({ ...title, name: target.value })}
              >
                <option key="Oil, gas" value="Oil, gas........">
                  Held by Production
                </option>
              </TextField>
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
                // value={newDocument?.dateTime ? new Date(newDocument.dateTime): null}
                onChange={(date) => {
                  // setNewDocument({
                  //   ...newDocument,
                  //   dateTime: date ? String(date["_d"]) : '',
                  // });
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
                // value={newDocument?.dateTime ? new Date(newDocument.dateTime): null}
                onChange={(date) => {
                  // setNewDocument({
                  //   ...newDocument,
                  //   dateTime: date ? String(date["_d"]) : '',
                  // });
                }}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </Grid>
            <Grid item className={classes.detailFieldsRow2}>
              <TextField
                margin="dense"
                label="Term"
                fullWidth
                number
                onChange={({ target }) => setHeaderTitle({ ...title, name: target.value })}
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
                // value={newDocument?.dateTime ? new Date(newDocument.dateTime): null}
                onChange={(date) => {
                  // setNewDocument({
                  //   ...newDocument,
                  //   dateTime: date ? String(date["_d"]) : '',
                  // });
                }}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
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
                // value={newDocument?.dateTime ? new Date(newDocument.dateTime): null}
                onChange={(date) => {
                  // setNewDocument({
                  //   ...newDocument,
                  //   dateTime: date ? String(date["_d"]) : '',
                  // });
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
