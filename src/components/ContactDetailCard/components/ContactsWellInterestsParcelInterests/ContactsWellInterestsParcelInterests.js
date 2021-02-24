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
//import TabLabels from "../../../MapGridCard/MapGridCard";
//import TabPanels from "../../../MapGridCard/MapGridCard";

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
}));


function ContactsWellInterestsParcelInterests(props) {
  const [assocTapValue, AssocTapValue] = useState(0);
  const setAssocTapValue = (state) => {
    if (assocTapValue != state) {
      AssocTapValue(state);
    }
  };

  /*const header = <TabLabels
    labels={[
      `Tax Roll Interests`,
      `Parcel Interests`,
    ]}
    value={assocTapValue}
    setValue={setAssocTapValue}
  />;*/

  const classes = useStyles({});

  return (
    <div>
      <div style={{ position: "relative" }}>
        <M1nTable
          parent="assocTaxRollInterests"
          contactId={ props.contactData._id }
        />
      </div>
    </div>
  );
}

export default React.memo(
  ContactsWellInterestsParcelInterests,
);
