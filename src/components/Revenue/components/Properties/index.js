import React, { useState, useContext } from "react";
import { AppContext } from "AppContext";
import { Grid, Button } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import AnalyticsCards from "components/Revenue/components/Common/AnalyticsCards";
import CustomDates from "components/Revenue/components/Common/CustomDates";
import RevenuePropertiesTable from "components/Table/Revenue/RevenuePropertiesTable";
import { GET_ES_PAGINATED_LIST } from "graphQL/useQueryESPaginatedList";
import { useLazyQuery } from "@apollo/client";
import { setStateIfDeepEqual } from "components/Shared/functions";
// actions
import { setRevenuePropertyData } from "actions";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  actionBar: {
    backgroundColor: "#f7f7f7",
    width: "100%",
    minHeight: "65px",
    marginTop: "100px",
  },
  actionsGrid: {
    marginTop: "6px",
    "& .MuiButtonBase-root": {
      width: "149px",
      height: "35px",
      fontWeight: "bold",
    },
  },
  propertyTableContainer: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: "38px",
    paddingRight: "38px",
    marginTop: theme.spacing(2),
  },
}));


export default function Properties() {
  const classes = useStyles();
  const [stateApp] = useContext(AppContext);
  // redux
  const dispatch = useDispatch();
  const [fromDate, setFromDate] = React.useState(moment().subtract(1, 'months').startOf('month').format('yyyy-MM-DD'));
  const [toDate, setToDate] = React.useState(moment().subtract(1, 'months').endOf('month').format('yyyy-MM-DD'));
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
      <div className={classes.actionBar}>
        <Grid container direction="row" display="flex" justify="space-between" style={{ padding: "0px 78px" }}>

          <CustomDates fromDate={fromDate} setFromDate={setFromDate} toDate={toDate} setToDate={setToDate} />
          <Grid item xs={4} md={4}>
            <Grid container display="flex" justify="flex-end" direction="row" spacing={2} className={classes.actionsGrid}>
              <Grid item>
                {/* hiding until we have views for properties - kc */}
                {/* <Button variant="contained" color="secondary">
                  Save View
                </Button> */}
              </Grid>
              <Grid item>
                <Button variant="contained" color="secondary" onClick={() => setFilterToggle(!filterToggle)}>
                  Filter
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>

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
          fromDate={fromDate}
          toDate={toDate}
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
