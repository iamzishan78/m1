import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import CampaignsTable from "components/Table/Contact/CampaignsTable";
import { makeStyles } from "@material-ui/core/styles";
import CampaignNameField from "components/ContactDetailCard/components/FieldContent/CampaignNameField";

import { AppContext } from "AppContext";

import CampaignAnalytics from "components/Contacts/components/CampaignAnalytics";
import CustomDatesActivities from "components/Contacts/components/CampaignFilter";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "0px 30px",
    marginTop: "90px",
    "& div": {
      "&>.MuiPaper-root": {
        "&>:nth-child(3)": {
          maxHeight: "59vh",
          minHeight: "59vh",
          "@media (max-height:900px)": {
            maxHeight: "53vh",
            minHeight: "53vh",
          },
          "@media (max-height:800px)": {
            maxHeight: "51vh",
            minHeight: "51vh",
          },
          "@media (max-height:768px)": {
            maxHeight: "51vh",
            minHeight: "51vh",
          },
        },
      },
    },
  },
}));

const CampaignManagement = () => {
  const classes = useStyles();
  const { activeModule } = useSelector(({ common }) => common);

  const esIndex = "campaigns_flat";
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
      <CustomDatesActivities
        setToDate={(value) => setAppliedFilters({ ...appliedFilters, toDate: value })}
        setFromDate={(value) => setAppliedFilters({ ...appliedFilters, fromDate: value })}
        esIndex={esIndex}
        searchFields={searchFields}
        tableFilters={tableFilters}
        appliedFilters={appliedFilters}
      />
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
