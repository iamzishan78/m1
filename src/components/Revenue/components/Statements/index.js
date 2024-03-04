import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "AppContext";
import AnalyticsCards from "components/Revenue/components/Statements/AnalyticsCards";
import LastCheckDateFilter from "components/Revenue/components/Common/LastCheckDateFilter";

import { makeStyles } from "@material-ui/core/styles";
import { useLazyQuery } from "@apollo/client";
import { copy } from "components/Shared/functions";
import MRTTable from "components/MRTTable";
import { GET_ES_SIMPLE_COUNT } from "graphQL/useQueryESCount";
import { tableController } from "hookstate/tableController";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "75px 0 10px",
  },
  revenueContainer: {
    "& .MuiTableRow-root": {
      backgroundColor: 'red',
      color: 'red',
      zIndex: 0
    }
  }
}));

export default function RevenueStatements() {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  const revenueStatmentTableState = tableController("RevenueStatementsTable").useState(['filters', 'data', 'globalFilter']).stateValues;

  const [approvedCount, setApprovedCount] = useState(0);
  const [unapprovedCount, setUnapprovedCount] = useState(0);
  const [potentialIssuesCount, setPotentialIssuesCount] = useState(0);
  const [esFilters, ESFilters] = useState([]);
  const [filterToggle, setFilterToggle] = React.useState(false);

  const [getESSimpleCount] = useLazyQuery(GET_ES_SIMPLE_COUNT, {
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    return () => {
      setStateApp((state, props) => {
        return { ...state, revenueSearchQuery: '' };
      });
    }
  }, []);

  useEffect(() => {
    tableController("RevenueStatementsTable").setFilters(esFilters);
  }, [esFilters]);

  useEffect(() => {
    getCounts();
  }, [revenueStatmentTableState?.filters, stateApp.revenueSearchQuery]);

  useEffect(() => {
    tableController("RevenueStatementsTable").setGlobalFilter(stateApp.revenueSearchQuery === "*" ? "" : stateApp.revenueSearchQuery);
  }, [stateApp.revenueSearchQuery]);

  const setESFilters = (newFilter) => {
    ESFilters(newFilter);
  };

  const setAnalyticFilters = (filter, status) => {
    let filters = copy(esFilters);
    filters = filters.filter((f) => f.field !== filter.field)
    if (status)
      filters.push(filter)
    setESFilters(filters)
    setFilterToggle(!filterToggle)
  }

  const onGettingPotentialIssues = (count) => setPotentialIssuesCount(count);


  const getCounts = async () => {
    const approvedCounts = await getESCounts("approvalStatus.keyword", "Approved");
    const unApprovedCounts = await getESCounts("approvalStatus.keyword", "Unapproved");
    const potentialIssuesCounts = await getESCounts("isAmountValidated", false, "term");

    setApprovedCount(approvedCounts);
    setUnapprovedCount(unApprovedCounts);
    onGettingPotentialIssues(potentialIssuesCounts);
  };

  const getESCounts = (key, value, type) => {
    const gridFilters = revenueStatmentTableState?.filters ? revenueStatmentTableState?.filters : [];
    return new Promise((resolve, reject) => {
      getESSimpleCount({
        variables: {
          index: "checks_flat",
          filters: [...gridFilters, { field: key, value: value, type }],
          search: {
            query: stateApp.revenueSearchQuery,
            fields: ["checkNumber", "_all"],
          },
        },
        onCompleted: (res) => {
          resolve(res.getESSimpleCount.total);
        },
        onError: (error) => {
          console.log(error);
          reject(0);
        },
      });
    });
  };

  return (
    <div className={classes.root}>
      <LastCheckDateFilter
        field={"checkDate"}
        esIndex={"checks_flat"}
        setESFilters={setESFilters}
        setFilterToggle={setFilterToggle}
        filterToggle={filterToggle}
      />

      <div>
        <div
          style={{ padding: 40 }}
        >

          <AnalyticsCards
            checks={revenueStatmentTableState?.data?.total}
            approvedCount={approvedCount}
            unapprovedCount={unapprovedCount}
            potentialIssuesCount={potentialIssuesCount}
            revenueSearchQuery={stateApp.revenueSearchQuery}
            setAnalyticFilters={setAnalyticFilters}
          />

        </div>

        <div
          classes={classes.revenueContainer}
          style={{
          }}
        >
          <MRTTable name="RevenueStatementsTable" />
        </div>
      </div>
    </div>
  );
}
