import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "AppContext";
import { Grid, Button } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import AnalyticsCards from "components/Revenue/components/Common/AnalyticsCards";
import CustomDates from "components/Revenue/components/Common/CustomDates";
import RevenuePropertiesTable from "components/Table/Revenue/RevenuePropertiesTable";
import { GET_ES_PAGINATED_LIST } from "graphQL/useQueryESPaginatedList";
import { GET_ES_MIN_VALUE } from "graphQL/useQueryESMinValue";
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
  const [selectedFilter, setSelectedFilter] = useState('');
  const [fromDate, setFromDate] = React.useState('');
  const [toDate, setToDate] = React.useState(moment().subtract(1, 'months').endOf('month').format('yyyy-MM-DD'));
  const [filterToggle, setFilterToggle] = React.useState(false);
  const [lastCheckMinDate, setLastCheckMinDate] = useState('');

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

  const [getESMinValue] = useLazyQuery(GET_ES_MIN_VALUE, {
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      if (data?.getESMinValue) {
        setFilterToggle(!filterToggle)
        setLastCheckMinDate(data?.getESMinValue);
        setFromDate(`${moment(data.getESMinValue).startOf('month').format("yyyy-MM-DD")}`);
      }
    },
  });

  useEffect(() => {
    getESMinValue({
      variables:{
        esIndex,
        field: "lastCheck.checkDate",
        value_as_string: true
      }
    })
  },[getESMinValue])
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
        <Grid container direction="row" display="flex" justify="space-between" style={{ padding: "0px 36px" }}>
          {/* <Grid style={{ marginTop: "2px", padding: 0 }}>
            <label className={classes.label}>Last Check Date</label>
          </Grid> */}
          <Grid item xs={8} md={8} lg={9} xl={8} style={{ marginTop: "4px" }}>
            <CustomDates fromDate={fromDate} setFromDate={setFromDate} toDate={toDate} setToDate={setToDate} label="Last Check Date" isProperties lastCheckMinDate={lastCheckMinDate} onChange={setSelectedFilter} />
          </Grid>
          <Grid item xs={3} md={3} lg={3} xl={4}>
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
          selectedFilter={selectedFilter}
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
