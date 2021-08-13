import React, { useState, Fragment } from "react";
import {
  makeStyles,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Button,
  TextField,
  Tooltip,
  IconButton,
  Badge,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon, Chat as ChatIcon } from "@material-ui/icons";
import AutoComplete from "components/Shared/components/Fields/AutoComplete";
import ContactCard from "components/Shared/svgIcons/contact_card";

const useStyles = makeStyles((theme) => ({
  accordionRoot: {
    color: "black",
    "&.MuiAccordion-root.Mui-expanded": {
      margin: 0,
    },
  },
  accordionSummary: {
    backgroundColor: "#F2F2F2",
    maxHeight: "50px",
    padding: "10px 30px 10px 30px",
    fontSize: "medium",
    fontWeight: "bold",
    textTransform: "uppercase",
    "& .MuiAccordionSummary-content": {
      margin: "0px !important",
    },
  },
}));

export default function RelatedParties({ relatedParties = [] }) {
  const classes = useStyles();

  const [parties, setParties] = useState(relatedParties);

  const handleNewParty = () => {
    setParties([
      ...parties,
      ...[
        {
          type: "",
          name: "",
          address: "",
        },
      ],
    ]);
  };

  const PartyFields = (party) => {
    return (
      <Grid container direction="row" justify="space-between" alignItems="center" style={{ margin: "5px 10px 5px 15px" }}>
        <Grid item xs={2}>
          <AutoComplete
            classes={classes}
            defaultValue={party.type}
            // onChange={(value) => handleUpdateAgreement({ agreementType: value })}
            label="Party Type"
            options={["Lesse", "Lessor"]}
          />
        </Grid>
        <Grid item xs={3}>
          <AutoComplete
            classes={classes}
            defaultValue={party.name}
            // onChange={(value) => handleUpdateAgreement({ agreementType: value })}
            label="Name"
            options={["Ali", "Tahir"]}
          />
        </Grid>
        <Grid item xs={5}>
          <TextField
            margin="dense"
            label="Address"
            fullWidth
            defaultValue={party.address}
          // onChange={({ target }) => setHeaderTitle({ ...title, name: target.value })}
          // onKeyDown={(event) => {
          //   if (event.key === "Enter") {
          //     event.preventDefault();
          //     handleUpdateAgreement({ name: event.target.value });
          //   }
          // }}
          // onBlur={(event) => handleUpdateAgreement({ name: event.target.value })}
          />
        </Grid>
        <Grid item xs={1} style={{ margin: "20px 20px 0px 0px" }}>
          <Tooltip title="Contact Details" placement="top">
            <IconButton size="small" color="primary" aria-label="show contact">
              <ContactCard style={{ margin: "4px" }} />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={!party.comments || party.comments?.length === 0 ? "Add Comments" : "Comments"}
            placement="top"
            style={{ marginRight: "10px" }}
          >
            <Badge badgeContent={party.comments?.length || null} color="secondary">
              <IconButton
                id={party._id}
                size="small"
                color="primary"
                // className={`${classes.icons} ${!value || value === 0 ? classes.noCommentsIcon : ""} ${
                //   colInd === tableMeta.columnIndex && rowInd === tableMeta.rowIndex ? classes.iconSelected : ""
                // }`}
                // onClick={(e) => {
                //   e.stopPropagation();
                //   handleExpandClick(tableMeta.columnIndex, tableMeta.rowIndex, targetSourceId, "comment");
                // }}
                aria-label="show comments"
              // onMouseOver={() => {
              //   console.log("hover Effect Table");
              //   if (m1nSelectedRowsIndexes.indexOf(tableMeta.rowIndex) !== -1 && m1nSelectedRowsIndexes.length > 1)
              //     multiSelectMouseHoverColor(id, "#dadbde");
              // }}
              // onMouseOut={() => {
              //   if (m1nSelectedRowsIndexes.indexOf(tableMeta.rowIndex) !== -1 && m1nSelectedRowsIndexes.length > 1)
              //     multiSelectMouseHoverColor(id, "#efefef");
              // }}
              >
                <ChatIcon />
              </IconButton>
            </Badge>
          </Tooltip>
        </Grid>
      </Grid>
    );
  };

  return (
    <Accordion className={classes.accordionRoot} defaultExpanded="true" >
      <AccordionSummary
        aria-controls="panel1a-content"
        id="panel1a-header"
        expandIcon={<ExpandMoreIcon />}
        className={classes.accordionSummary}
      >
        Related Parties
      </AccordionSummary>
      <AccordionDetails>
        <div style={{ width: "100%" }}>
          {parties.map((party, index) => (
            <Fragment key={index}>
              <PartyFields party={party} />
            </Fragment>
          ))}
          <div style={{ margin: "25px 0px 0px 12px" }}>
            <Button onClick={handleNewParty}>+ Add Another Party</Button>
          </div>
        </div>
      </AccordionDetails>
    </Accordion>
  );
}
