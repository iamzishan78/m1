import React, { useContext } from "react";
import { AppContext } from "AppContext";
import { Grid, Button } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import AnalyticsCards from "components/Revenue/components/Common/AnalyticsCards";
import CustomDates from "components/Revenue/components/Common/CustomDates";
import RevenuePropertiesTable from "components/Table/Revenue/RevenuePropertiesTable";
import { GET_ES_PAGINATED_LIST } from "graphQL/useQueryESPaginatedList";
import { useLazyQuery } from "@apollo/client";
// actions
import { setRevenuePropertyData } from "actions";

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

const cards = [
  {
    heading: "Total Properties",
    points: "1,463",
  },
  {
    heading: "Active",
    points: "992",
  },
  {
    heading: "Inactive",
    points: "471",
  },
  {
    heading: "Unmapped",
    points: "17",
    type: "warning",
  },
];

export default function Properties() {
  const classes = useStyles();
  const [stateApp] = useContext(AppContext);
  // redux
  const dispatch = useDispatch();
  const [fromDate, setFromDate] = React.useState(null);
  const [toDate, setToDate] = React.useState(null);
  // props to pass in table
  const esIndex = "properties_flat";
  const startPaginationAt = 25;

  // query for Properties Table
  const [getESPaginatedList, { data: elasticData, loading }] = useLazyQuery(GET_ES_PAGINATED_LIST, {
    fetchPolicy: "no-cache",
    onCompleted: () => {
      console.log("compeleted");
    },
  });

  // dipatching to redux
  React.useEffect(() => {
    dispatch(setRevenuePropertyData({ loading: loading, data: elasticData }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getESPaginatedList, elasticData]);

  // on filter click
  const filterProperties = () => {
    getESPaginatedList({
      variables: {
        esIndex,
        pagination: {
          first: startPaginationAt,
          keep_alive: "1micros",
        },
        search: ``,
        sort: [],
        filters: [
          {
            field: "lastCheck.checkDate",
            value: {
              range: {
                "lastCheck.checkDate": {
                  gte: `${fromDate}-01T00:00:00.000Z`,
                  lte: `${toDate}-01T00:00:00.000Z`,
                },
              },
            },
          },
        ],
      },
    });
  };
  return (
    <>
      <div className={classes.actionBar}>
        <Grid container direction="row" display="flex" justify="space-between" style={{ padding: "0px 78px" }}>
          <CustomDates fromDate={fromDate} setFromDate={setFromDate} toDate={toDate} setToDate={setToDate} />
          <Grid item xs={5} md={4}>
            <Grid container display="flex" justify="flex-end" direction="row" spacing={2} className={classes.actionsGrid}>
              <Grid item>
                <Button variant="contained" color="secondary">
                  Save View
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" onClick={() => filterProperties()}>
                  Filter
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <AnalyticsCards cards={cards} />
      <div className={classes.propertyTableContainer}>
        <RevenuePropertiesTable
          header="Properties"
          parent="RevenuePropertiesTable"
          targetLabel="Revenue Properties"
          loading={false}
          dense={true}
          revenueSearchQuery={stateApp.revenueSearchQuery}
          esIndex={esIndex}
          startPaginationAt={startPaginationAt}
        />
      </div>
    </>
  );
}
