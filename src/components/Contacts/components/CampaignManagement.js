import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
import { useLazyQuery } from "@apollo/client";
import CampaignsTable from "components/Table/Contact/CampaignsTable";
import { makeStyles } from "@material-ui/core/styles";
// import CampaignNameField from "components/ContactDetailCard/components/FieldContent/CampaignNameField";

// import { AppContext } from "AppContext";

import CampaignAnalytics from "components/Contacts/components/CampaignAnalytics";
import CustomCampaignFilters from "components/Contacts/components/CampaignFilter";
import { GET_ES_MIN_VALUE } from "graphQL/useQueryESMinValue";

const useStyles = makeStyles((theme) => ({
  root: {
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
  // const { activeModule } = useSelector(({ common }) => common);

  const esIndex = "campaigns_flat";
  const searchFields = ["name", "_all"];
  const [filterToggle, setFilterToggle] = useState(false);
  const [lastCampaignMinDate, setLastCampaignMinDate] = useState("");
  const [tableFilters, setTableFilters] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState({
    fromDate: null,
    toDate: null,
  });

  const [getESMinValue] = useLazyQuery(GET_ES_MIN_VALUE, {
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      if (data?.getESMinValue) {
        setLastCampaignMinDate(data?.getESMinValue);
      }
    },
  });

  useEffect(() => {
    getESMinValue({
      variables: {
        esIndex,
        field: 'createdAt',
        value_as_string: true
      }
    })
  }, [getESMinValue])

  // const getCustomAppliedFilters = () => {
  //   if (activeModule?.filterValue) {
  //     return [
  //       {
  //         field: "status.keyword",
  //         value: activeModule.filterValue,
  //       },
  //     ];
  //   }
  // };

  const filtersChange = (filters) => {
    setTableFilters(filters);
  };

  return (
    <div className={classes.root}>
      <CustomCampaignFilters
        setFromDate={(value) => setAppliedFilters({ ...appliedFilters, fromDate: value })}
        setToDate={(value) => setAppliedFilters({ ...appliedFilters, toDate: value })}
        esIndex={esIndex}
        searchFields={searchFields}
        tableFilters={tableFilters}
        appliedFilters={appliedFilters}
        setAppliedFilters={setAppliedFilters}
        minDate={lastCampaignMinDate}
      />
      <div style={{ padding: "0px 30px" }}>
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
    </div>
  );
};

export default CampaignManagement;
