import React, { useState, useEffect, useContext, useCallback } from "react";
import { AppContext } from "AppContext";
import AnalyticsCards from "components/Revenue/components/Statements/AnalyticsCards";
import RevenueStatementTable from "components/Table/Revenue/RevenueStatementTable";
import LastCheckDateFilter from "../Common/LastCheckDateFilter";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
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

  const [statementCount, setStatementCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [unapprovedCount, setUnapprovedCount] = useState(0);
  const [potentialIssuesList, setPotentialIssuesList] = useState([]);
  const [esFilters, ESFilters] = useState([]);
  const [filterToggle, setFilterToggle] = React.useState(false);

  // waypointKey should any key of Table Header which do not have customRender in schema file
  const loadMore = { type: 'infiniteScroll', height: 'calc(100vh - 381px)' }

  useEffect(() => {
    return () => {
      setStateApp((state, props) => {
        return { ...state, revenueSearchQuery: '' };
      });
    }
  }, []);

  const setESFilters = (newFilter) => {
    ESFilters(newFilter);
  };

  const onGettingStatements = useCallback((statementsList) => {
    if (statementsList.statementCount) {
      const checks = statementsList.statementCount;
      const approved = statementsList?.approvedCount;
      const unApprovedCount = statementsList.unApprovedCount;
      setApprovedCount(approved);
      setStatementCount(checks)
      setUnapprovedCount(unApprovedCount);
    } else {
      setStatementCount(0)
      setApprovedCount(0);
      setUnapprovedCount(0);
    }
  }, []);

  const onGettingPotentialIssues = useCallback((issues) => {
    setPotentialIssuesList(issues);
  }, []);

  return (
    <>
      <LastCheckDateFilter
        field={"checkDate"}
        esIndex={"checks_flat"}
        setESFilters={setESFilters}
        setFilterToggle={setFilterToggle}
        filterToggle={filterToggle}
      />

      <div
      // style={{ padding: 40 }}
      >

        <div
          style={{ padding: 40 }}
        >

          <AnalyticsCards
            checks={statementCount}
            approvedCount={approvedCount}
            unapprovedCount={unapprovedCount}
            potentialIssues={potentialIssuesList}
            revenueSearchQuery={stateApp.revenueSearchQuery}
          />

        </div>

        <div
          classes={classes.revenueContainer}
          style={{
            marginLeft: "-10px"
          }}
        >
          <RevenueStatementTable
            header="Revenue Statements"
            targetLabel="check"
            onGettingPotentialIssues={onGettingPotentialIssues}
            onGettingStatements={onGettingStatements}
            esFilters={esFilters}
            filterToggle={filterToggle}
            parent="RevenueStatementTable"
            revenueSearchQuery={stateApp.revenueSearchQuery}
            loadMore={loadMore}
          />
        </div>
      </div>
    </>
  );
}
