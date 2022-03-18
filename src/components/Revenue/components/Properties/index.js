import React, { useState, useContext } from "react";
import { AppContext } from "AppContext";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import AnalyticsCards from "components/Revenue/components/Common/AnalyticsCards";
import RevenuePropertiesTable from "components/Table/Revenue/RevenuePropertiesTable";
import { GET_ES_PAGINATED_LIST } from "graphQL/useQueryESPaginatedList";
import { useLazyQuery } from "@apollo/client";
import { setStateIfDeepEqual } from "components/Shared/functions";
// actions
import { setRevenuePropertyData } from "actions";
import LastCheckDateFilter from "../Common/LastCheckDateFilter";

const useStyles = makeStyles((theme) => ({
  propertyTableContainer: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: "38px",
    paddingRight: "38px",
    "& div": {
      "&>.MuiPaper-root": {
        "&>:nth-child(3)": {
          maxHeight: "48vh",
          minHeight: "48vh",
          "@media (max-height:1200px)": {
            maxHeight: "48vh",
            minHeight: "48vh",
          },
          "@media (max-height:1300px)": {
            maxHeight: "56vh",
            minHeight: "56vh",
          },
          "@media (max-height:1400px)": {
            maxHeight: "57vh",
            minHeight: "57vh",
          },
          "@media (max-height:1100px)": {
            maxHeight: "48vh",
            minHeight: "48vh",
          },
          "@media (max-height:1000px)": {
            maxHeight: "46vh",
            minHeight: "46vh",
          },
          "@media (max-height:900px)": {
            maxHeight: "44vh",
            minHeight: "44vh",
          },
          "@media (max-height:850px)": {
            maxHeight: "42vh",
            minHeight: "42vh",
          },
          "@media (max-height:800px)": {
            maxHeight: "40vh",
            minHeight: "40vh",
          },
          "@media (max-height:768px)": {
            maxHeight: "37vh",
            minHeight: "37vh",
          },
        },
      },
    },
    // marginTop: theme.spacing(2),
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
}));

export default function Properties() {
  const classes = useStyles();
  const [stateApp] = useContext(AppContext);
  // redux
  const dispatch = useDispatch();
  const [filterToggle, setFilterToggle] = React.useState(false);


  // props to pass in table
  const esIndex = "properties_flat";
  const startPaginationAt = 25;

  const [propertiesCount, setPropertiesCount] = useState(0);
  const [esFilters, ESFilters] = useState([]);

  const setESFilters = (newState) => {
    setStateIfDeepEqual(ESFilters, newState);
  };

  const onPropertiesCount = (count) => {
    setPropertiesCount(count);
  };

  // query for Properties Table
  const [getESPaginatedList, { data: elasticData, loading }] = useLazyQuery(GET_ES_PAGINATED_LIST, {
    fetchPolicy: "no-cache",
    onCompleted: (filteredData) => {
      if (filteredData?.getESPaginatedList) {
        const count = filteredData?.getESPaginatedList?.total;
        onPropertiesCount(count);
      }
    },
  });

  // dipatching to redux
  React.useEffect(() => {
    dispatch(setRevenuePropertyData({ loading: loading, data: elasticData }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getESPaginatedList, elasticData]);


  // cards default
  const cardsDefault = [
    {
      heading: "Total Properties",
      points: 0,
    },
    {
      heading: "Active",
      points: 0,
    },
    {
      heading: "Inactive",
      points: 0,
    },
    {
      heading: "Unmapped",
      points: 0,
      type: "warning",
    },
  ]

  return (
    <>
      <LastCheckDateFilter field={"lastCheck.checkDate"} esIndex={esIndex} setESFilters={setESFilters} setFilterToggle={setFilterToggle} filterToggle={filterToggle} />

      <AnalyticsCards
        parent={"Properties"}
        esIndex={esIndex}
        esFilters={esFilters}
        cardsDefault={cardsDefault}
        totalCount={propertiesCount}
        landSearchQuery={stateApp.revenueSearchQuery}
      />

      <div className={classes.propertyTableContainer}>
        <RevenuePropertiesTable
          esIndex={esIndex}
          header="Properties"
          esFilters={esFilters}
          targetLabel="Revenue Properties"
          parent="RevenuePropertiesTable"
          loading={false}
          dense={true}
          filterToggle={filterToggle}
          setESFilters={setESFilters}
          onPropertiesCount={onPropertiesCount}
          startPaginationAt={startPaginationAt}
          revenueSearchQuery={stateApp.revenueSearchQuery}
        />
      </div>
    </>
  );
}
