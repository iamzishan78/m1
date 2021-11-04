import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import GavelIcon from '@material-ui/icons/Gavel';
import TabButtons from "components/Shared/TabPanels/TabButtons"

const useStyles = makeStyles((theme) => ({
  documentHeader: {
    display: "flex",
    "& span": {
      marginTop: "2px",
      marginLeft: "5px"

    }
  }
}));

export const OwnershipHeader = ({ selectedTab, setSelectedTab }) => (
  <TabButtons
    labels={["Unit Ownership", "Potential Ownership"]}
    value={selectedTab}
    setValue={(n) => { setSelectedTab(n) }}
  />
);

export const DocumentHeader = () => {
  const classes = useStyles();
  return (

    <div className={classes.documentHeader}>
      <DescriptionOutlinedIcon />
      <span>Documents</span>
    </div>
  )
};

export const RunsheetHeader = () => {
  const classes = useStyles();
  return (
    <div className={classes.documentHeader}>
      <GavelIcon />
      <span>LIMITED TITLE RUNSHEET</span>
    </div>
  )
};


export const WellHeader = ({ selectedWellTab, setWellSelectedTab }) => (
  <TabButtons
    labels={["Unit Wells", "Potential Wells"]}
    value={selectedWellTab}
    setValue={(n) => { setWellSelectedTab(n) }}
  />
);

export const TractHeader = ({ selectedTractTab, setTractSelectedTab }) => (
  <TabButtons
    labels={["Unit Tracts", "Potential Tracts"]}
    value={selectedTractTab}
    setValue={(n) => { setTractSelectedTab(n) }}
  />
);