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
import { deepEqualObjects } from "../../../Shared/functions";

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

const useStyles = makeStyles((theme) => ({
  tapsPanels: {
    "& .MuiBox-root": { padding: "0" },
  },
  tapsLabelsButtons: {
    boxShadow: "none",
    backgroundColor: "#fff",
    color: "#757575",
    "&:hover": { boxShadow: "none !important" },
  },
  tapsLabelsButtonsSelected: {
    boxShadow: "none",
    color: "#fff",
    backgroundColor: theme.palette.secondary.main,
    "&:hover": { color: "#757575", boxShadow: "none !important" },
  },
  parcelInterestsTableHigh: {
    "& div": {
      "&>.MuiPaper-root": {
        "&>:nth-child(3)": { minHeight: "calc(100vh - 370px) !important" },
      },
    },
  },
}));

const TabLabels = ({ labels, value, setValue }) => {
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

function tabPanelsPropsAreEqual(prevProps, nextProps) {
  return Object.is(prevProps.value, nextProps.value);
}

const TabPanels = React.memo(({ panels, value }) => {
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
}, tabPanelsPropsAreEqual);

function ContactsWellInterestsParcelInterests(props) {
  const [tapValue, TapValue] = useState(props.activeTap);
  const setTapValue = (state) => {
    if (tapValue != state) {
      TapValue(state);
    }
  };

  const classes = useStyles({});

  return (
    <div>
      <Search />
      <div style={{ position: "relative" }}>
        <TabPanels
          value={tapValue}
          panels={[
            // <M1nTable
            //   dense
            //   parent="trackWells"
            //   header={
            //     <TabLabels
            //       labels={["Well Interests", "Parcel Interests"]}
            //       value={tapValue}
            //       setValue={setTapValue}
            //     />
            //   }
            // />
            <TabLabels
              labels={["Well Interests", "Parcel Interests"]}
              value={tapValue}
              setValue={setTapValue}
            />,

            <div className={classes.parcelInterestsTableHigh}>
              <M1nTable
                dense
                parent="contactParcelInterests"
                contactId={props.contactData ? props.contactData._id : null}
                entityId={props.contactData ? props.contactData.entity : null}
                header={
                  <TabLabels
                    labels={["Well Interests", "Parcel Interests"]}
                    value={tapValue}
                    setValue={setTapValue}
                  />
                }
              />
            </div>,
          ]}
        />
      </div>
    </div>
  );
}

export default React.memo(
  ContactsWellInterestsParcelInterests,
  deepEqualObjects
);
