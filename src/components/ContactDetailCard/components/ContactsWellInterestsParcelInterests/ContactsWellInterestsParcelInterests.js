import React, { useState } from "react";
import Search from "./components/Search";
import { useHistory } from "react-router-dom";
import ContactWellInterestTable from "components/Table/Contact/ContactWellInterestTable";
import ContactParcelInterestTable from "components/Table/Contact/ContactParcelInterestTable";
import ContactTaxRollInterestTable from "components/Table/Contact/ContactTaxRollInterestTable";
import TabPanels from "components/Shared/TabPanels";
import TabButtons from "components/Shared/TabPanels/TabButtons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    "& div": {
      "&>.MuiPaper-root": {
        display: "flex",
        "flex-direction": "column",
        height: "calc(100vh - 176px)",
        "align-items": "stretch",
        "&>.MuiPaper-root": { 
          display: "contents",
        },
        "&>:nth-child(3)": { 
          height: "inherit !important",
        },
        "&> table": {
          bottom: 0,
        }
      },
    },
  },
  rootSearch: {
    "& div": {
      "&>.MuiPaper-root": {
        display: "flex",
        "flex-direction": "column",
        height: "calc(100vh - 375px)",
        "align-items": "stretch",
        "&>.MuiPaper-root": { 
          display: "contents",
        },
        "&>:nth-child(3)": { 
          height: "inherit !important",
        },
        "&> table": {
          bottom: 0,
        }
      },
    },
  }
}));

function ContactsWellInterestsParcelInterests(props) {
  const classes = useStyles();
  let history = useHistory();
  const type =
    history.location.pathname.split("/")[
    history.location.pathname.split("/").length - 1
    ];

  const [selectedTab, setSelectedTab] = useState(type === 'wells' ? 0 : type === 'parcels' ? 2 : 1);

  const Header = () => (
    <TabButtons
      labels={["Tax Roll Interests", "Well Interests", "Parcel Interests"]}
      value={selectedTab}
      setValue={(n) => {
        setSelectedTab(n);
      }}
    />
  );

  return (
    <div>
      {/* temporarily comment search out until we have a chance to build it out fully */}
      <div className={classes.rootSearch}>
        <Search contactId={props.contactData._id} />
      </div>
      

      <div className={classes.root} style={{ position: "relative" }}>
        <TabPanels
          value={selectedTab}
          panels={[
            <ContactTaxRollInterestTable
              parent="assocTaxRollInterests"
              header={<Header />}
              targetLabel="well"
              contactId={props.contactData._id}
              showTracks
            />,
            <ContactWellInterestTable
              parent="assocTaxRollInterests"
              header={<Header />}
              targetLabel="well"
              contactId={props.contactData._id}
              showTracks
            />,
            <ContactParcelInterestTable
              parent="assocTaxRollInterests"
              header={<Header />}
              targetLabel="parcel"
              contactId={props.contactData._id}
              showTracks
            />,
          ]}
        />
      </div>
    </div>
  );
}

export default React.memo(ContactsWellInterestsParcelInterests);
