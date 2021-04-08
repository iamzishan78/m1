import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { AppContext } from "../../../../AppContext";
import PropTypes from "prop-types";
import Box from "@material-ui/core/Box";
import Search from "./components/Search";
import M1nTable from "../../../Shared/M1nTable/M1nTable";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Button from "@material-ui/core/Button";
//import { setMapGridCardState } from "../../../../actions";
//import TabLabels from "../../../MapGridCard/MapGridCard";
//import TabPanels from "../../../MapGridCard/MapGridCard";

const TabPanels = ({ panels, value }) => {
  console.log(`ue mapgridcard tabpanels ${(panels, value)}`);

  const classes = useStyles();
  return (
    panels &&
    panels.length &&
    panels.map((panel, i) => (
      <TabPanel key={i} value={value} index={i} className={classes.tapsPanels}>
        {panel}
      </TabPanel>
    ))
  );
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const TabLabels = ({ labels, value, setValue }) => {
  console.log(`ue mapgridcard tablabels ${(labels, value, setValue)}`);
  const classes = useStyles();

  return (
    <>
      {labels &&
        labels.length &&
        labels.map((label, i) => (
          <Button
            key={i}
            size="small"
            variant="contained"
            className={
              value === i
                ? classes.tapsLabelsButtonsSelected
                : classes.tapsLabelsButtons
            }
            onClick={() => {
              setValue(i);
            }}
          >
            {label}
          </Button>
        ))}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  tapsPanels: {
    "& .MuiBox-root": { padding: "0" },
  },
  parcelInterestsTableHigh: {
    "& div": {
      "&>.MuiPaper-root": {
        "&>:nth-child(3)": { minHeight: "calc(100vh - 370px) !important" },
      },
    },
  },
  tapsLabelsButtons: {
    boxShadow: "none",
    backgroundColor: "#fff",
    color: "#757575",
    marginRight: "10px",
    "&:hover": { boxShadow: "none !important" },
  },
  tapsLabelsButtonsSelected: {
    boxShadow: "none",
    color: "#fff",
    backgroundColor: theme.palette.secondary.main,
    "&:hover": { color: "#757575", boxShadow: "none !important" },
  },
}));


function ContactsWellInterestsParcelInterests(props) {
  const [assocTapValue, AssocTapValue] = useState(0);
  const setAssocTapValue = (state) => {
    if (assocTapValue != state) {
      AssocTapValue(state);
    }
  };

  //temporarily commented out until we have other tabs to show such as parcels, leases, etc.
  // const header = <TabLabels
  //   labels={[
  //     `Tax Roll Interests`,
  //   ]}
  //   value={assocTapValue}
  //   setValue={setAssocTapValue}
  // />

  const header = "Well Interests";


  const classes = useStyles({});

  /*const handleMainTapChange = (event, newValue) => {
    console.log(`contacts well interests handlemaintapchange newValue: ${newValue}`);
    console.log(`contacts well interests handlemaintapchange event: ${event}`);

    dispatch(
      setMapGridCardState({
        mapGridCardActiveTap: newValue,
        selectedOwner: null,
        selectedOwnerWellIntsSummary: null,
      })
    );
  };*/

  return (
    <div>
      {/* temporarily comment search out until we have a chance to build it out fully */}
      <Search contactId={props.contactData._id} />


      {/* 
      <Search
        searchOption="owner"
        contactId={props.contactData._id}
        ativateSearchPanel={() => {
          // if (mapGridCardActiveTap !== 0) handleMainTapChange(null, 0);
          // if (mapGridCardActivated === "min") {
          //   dispatch(
          //     setMapGridCardState({ mapGridCardActivated: true })
          //   );
          // }
        }}
      />
      <div style={{ position: "relative" }}>
        <M1nTable
          parent="assocTaxRollInterests"
          contactId={props.contactData._id}
        />
      </div> */}

      <div style={{ position: "relative" }}>

        <TabPanels
          value={assocTapValue}
          panels={[
            <M1nTable
              parent="assocTaxRollInterests"
              header={header}
              contactId={props.contactData._id}
            />,
            // <M1nTable
            //   parent="assocTaxRollInterests"
            //   header={header}
            //   contactId={ props.contactData._id }
            // />,
          ]}
        />
      </div>
    </div>
  );
}

export default React.memo(
  ContactsWellInterestsParcelInterests,
);
