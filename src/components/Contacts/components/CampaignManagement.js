import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import CampaignsTable from "components/Table/Contact/CampaignsTable";
import { makeStyles } from "@material-ui/core/styles";

import { AppContext } from "AppContext";

import CampaignAnalytics from "components/Contacts/components/CampaignAnalytics";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "0px 30px",
    "& div": {
      "&>.MuiPaper-root": {
        "&>:nth-child(3)": {
          maxHeight: "78vh",
          minHeight: "78vh",
          "@media (max-height:900px)": {
            maxHeight: "72vh",
            minHeight: "72vh",
          },
          "@media (max-height:800px)": {
            maxHeight: "70vh",
            minHeight: "70vh",
          },
          "@media (max-height:768px)": {
            maxHeight: "70vh",
            minHeight: "70vh",
          },
        },
      },
    },
  },
}));

const CampaignManagement = () => {
  const classes = useStyles();
  const [stateApp] = useContext(AppContext);
  const { activeModule } = useSelector(({ contact }) => contact);

  const esIndex = "activities_flat";
  const searchFields = ["name", "_all"];
  const [filterToggle, setFilterToggle] = useState(false);
  const [tableFilters, setTableFilters] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState({
    toDate: null,
    fromDate: null,
  });

  const getCustomAppliedFilters = () => {
    if (activeModule?.filterValue) {
      return [
        {
          field: "status.keyword",
          value: activeModule.filterValue,
        },
      ];
    }
  };

  const filtersChange = (filters) => {
    setTableFilters(filters);
  };

  return (
    <div className={classes.root}>
      <CampaignAnalytics />
      <CampaignsTable
        esIndex={esIndex}
        searchFields={searchFields}
        filtersChange={filtersChange}
        appliedFilters={appliedFilters}
        filterToggle={filterToggle}
        targetLabel="campaignManagement"
        header="Campaigns"
      />
    </div>
  );
};

export default CampaignManagement;
