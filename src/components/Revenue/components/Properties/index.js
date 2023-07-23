import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "AppContext";
import { makeStyles } from "@material-ui/styles";
import AnalyticsCards from "components/Revenue/components/Common/AnalyticsCards";
import RevenuePropertiesTable from "components/Table/Revenue/RevenuePropertiesTable";
import { setStateIfDeepEqual } from "components/Shared/functions";

import LastCheckDateFilter from "components/Revenue/components/Common/LastCheckDateFilter";
import { useLazyQuery } from "@apollo/client";
import { GET_UNMAPPED_PROPERTY_COUNT } from "graphQL/useQueryGetProperty";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "75px 0 10px",
  },
  propertyTableContainer: {
    paddingTop: theme.spacing(1),
    // paddingLeft: "38px",
    // paddingRight: "38px",
    marginLeft: "-8px",
    "& div": {
      "&>.MuiPaper-root": {
        "&>:nth-child(3)": {
          maxHeight: "67vh",
          minHeight: "67vh",
          "@media (max-height:1600px)": {
            maxHeight: "65vh",
            minHeight: "65vh",
          },
          "@media (max-height:1400px)": {
            maxHeight: "63vh",
            minHeight: "63vh",
          },
          "@media (max-height:1300px)": {
            maxHeight: "61vh",
            minHeight: "61vh",
          },
          "@media (max-height:1200px)": {
            maxHeight: "58vh",
            minHeight: "58vh",
          },
          "@media (max-height:1100px)": {
            maxHeight: "53vh",
            minHeight: "53vh",
          },
          "@media (max-height:1000px)": {
            maxHeight: "49vh",
            minHeight: "49vh",
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

  propertyTableInfContainer: {
    paddingTop: theme.spacing(1),
    // paddingLeft: "38px",
    // paddingRight: "38px",
    marginLeft: "-8px",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
}));

export default function Properties() {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  // redux
  const [filterToggle, setFilterToggle] = React.useState(false);

  // props to pass in table
  const esIndex = "properties_flat";
  const startPaginationAt = 50;

  const [esFilters, ESFilters] = useState([]);
  const [propertiesCount, setPropertiesCount] = useState(0);

  // waypointKey should any key of Table Header which do not have customRender in schema file
  const loadMore = { type: "infiniteScroll", height: "calc(100vh - 347px)" };

  const setESFilters = (newFilter) => {
    setStateIfDeepEqual(ESFilters, newFilter);
  };

  const onPropertiesCount = (count) => {
    setPropertiesCount(count);
  };

  const [getUnmappedPropertyCount, { data: getUnmappedPropertyCountResult }] = useLazyQuery(GET_UNMAPPED_PROPERTY_COUNT, {
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    getUnmappedPropertyCount();
  }, []);

  useEffect(() => {
    return () => {
      setStateApp((state, props) => {
        return { ...state, revenueSearchQuery: "" };
      });
    };
  }, []);

  // cards default
  const cardsDefault = [
    {
      heading: "Total Properties",
      points: 0,
    },
    {
      heading: "In Pay",
      points: 0,
      key: "inpay",
      filterable: true,
    },
    {
      heading: "Not In Pay",
      points: 0,
      key: "notinpay",
      filterable: true,
    },
    {
      heading: "Unmapped",
      key: "unmapped",
      points: 0,
      type: "warning",
      filterable: true,
    },
  ];

  return (
    <div className={classes.root}>
      <LastCheckDateFilter
        field={"lastCheck.checkDate"}
        esIndex={esIndex}
        esFilters={esFilters}
        setESFilters={setESFilters}
        setFilterToggle={setFilterToggle}
        filterToggle={filterToggle}
        extraFitlers={["status", "propertyGroup"]}
      />

      <AnalyticsCards
        parent={"Properties"}
        esIndex={esIndex}
        esFilters={esFilters}
        cardsDefault={cardsDefault}
        totalCount={propertiesCount}
        landSearchQuery={stateApp.revenueSearchQuery}
        setESFilters={setESFilters}
        filterToggle={filterToggle}
        setFilterToggle={setFilterToggle}
        unmappedPropertyCount={getUnmappedPropertyCountResult?.getUnmappedPropertyCount?.unmappedCount}
      />
      {/* use propertyTableContainer class as container if not using infinite scroll */}
      <div className={classes.propertyTableInfContainer}>
        <RevenuePropertiesTable
          searchBar={false}
          esIndex={esIndex}
          header="Properties"
          esFilters={esFilters}
          targetLabel="Revenue Properties"
          parent="RevenuePropertiesTable"
          loading={false}
          filterToggle={filterToggle}
          setESFilters={setESFilters}
          isCheckboxSticky={true}
          onPropertiesCount={onPropertiesCount}
          startPaginationAt={startPaginationAt}
          revenueSearchQuery={stateApp.revenueSearchQuery}
          actionColumns={[" ", "Tags", "Comments"]}
          loadMore={loadMore}
        />
      </div>
    </div>
  );
}
