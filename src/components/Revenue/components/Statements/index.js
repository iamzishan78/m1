import React, { useState, useEffect, useContext, useCallback } from "react";
import { AppContext } from "AppContext";
import AnalyticsCards from "components/Revenue/components/Statements/AnalyticsCards";
import RevenueStatementTable from "components/Table/Revenue/RevenueStatementTable";
import { ADD_CHECK_DATA } from "graphQL/useMutationAddCheck";
import LastCheckDateFilter from "../Common/LastCheckDateFilter";
import { useMutation } from "@apollo/client";

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

  const [statements, setStatements] = useState([]);
  const [approvedCount, setApprovedCount] = useState(0);
  const [unapprovedCount, setUnapprovedCount] = useState(0);
  const [potentialIssuesList, setPotentialIssuesList] = useState([]);
  const [esFilters, ESFilters] = useState([]);
  const [filterToggle, setFilterToggle] = React.useState(false);

  useEffect(() => {
    if (statements.length > 0) {
      const checks = statements?.length;
      const approved = statements?.filter((statement) => statement.status === "APPROVED" && statement)?.length;
      setApprovedCount(approved);
      setUnapprovedCount(Number(checks) - Number(approved));
    } else {
      setApprovedCount(0);
      setUnapprovedCount(0);
    }
  }, [statements]);

  useEffect(() => {
    return () => {
      setStateApp((state, props) => {
        return { ...state, revenueSearchQuery: '' };
      });
    }
  }, []);

  const onGettingStatements = useCallback((statementsList) => {
    setStatements(statementsList);
  }, []);

  const onGettingPotentialIssues = useCallback((issues) => {
    setPotentialIssuesList(issues);
  }, []);

  return (
    <>
      <LastCheckDateFilter field={"checkDate"} esIndex={'checks_flat'} setESFilters={ESFilters} setFilterToggle={setFilterToggle} filterToggle={filterToggle} />

      <div style={{ padding: 40 }}>
        <AnalyticsCards
          checks={statements?.length || 0}
          approvedCount={approvedCount}
          unapprovedCount={unapprovedCount}
          potentialIssues={potentialIssuesList}
          revenueSearchQuery={stateApp.revenueSearchQuery}
        />

        <div classes={classes.revenueContainer} style={{ marginTop: 40 }}>
          <RevenueStatementTable
            header="Revenue Statements"
            targetLabel="check"
            onGettingPotentialIssues={onGettingPotentialIssues}
            onGettingStatements={onGettingStatements}
            esFilters={esFilters}
            filterToggle={filterToggle}
            parent="RevenueStatementTable"
            revenueSearchQuery={stateApp.revenueSearchQuery}
          />
        </div>
      </div>
    </>
  );
}
