import React, { useState, useEffect, useContext } from "react";
import { useLazyQuery } from "@apollo/client";
import CampaignsTable from "components/Table/Contact/CampaignsTable";
import { makeStyles } from "@material-ui/core/styles";

import { AppContext } from "AppContext";

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
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [stateApp] = useContext(AppContext);

  const [getESMinValue] = useLazyQuery(GET_ES_MIN_VALUE, {
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      if (data?.getESMinValue) {
        const date = new Date(data?.getESMinValue)
        if (date?.toString() !== "Invalid Date")
          setLastCampaignMinDate(data?.getESMinValue);
      }
    },
  });

  useEffect(() => {
    getESMinValue({
      variables: {
        esIndex,
        field: "createdAt",
        value_as_string: true,
      },
    });
  }, [getESMinValue]);

  useEffect(() => {
    setAppliedFilters({
      ...appliedFilters,
      fromDate,
      toDate
    })
  }, [fromDate, toDate, setAppliedFilters]);

  const filtersChange = (filters) => {
    setTableFilters(filters);
  };

  return (
    <div className={classes.root}>
      <CustomCampaignFilters
        setFromDate={setFromDate}
        setToDate={setToDate}
        esIndex={esIndex}
        searchFields={searchFields}
        tableFilters={tableFilters}
        appliedFilters={{ ...appliedFilters, fromDate, toDate }}
        setAppliedFilters={setAppliedFilters}
        minDate={lastCampaignMinDate}
        contactSearchQuery={stateApp.contactSearchQuery}
      />
      <div style={{ padding: "0px 30px" }}>
        <CampaignAnalytics appliedFilters={appliedFilters} contactSearchQuery={stateApp.contactSearchQuery} />
        <CampaignsTable
          esIndex={esIndex}
          searchFields={searchFields}
          filtersChange={filtersChange}
          appliedFilters={appliedFilters}
          filterToggle={filterToggle}
          targetLabel="Campaign"
          header="Campaigns"
          contactSearchQuery={stateApp.contactSearchQuery}
        />
      </div>
    </div>
  );
};

export default CampaignManagement;
