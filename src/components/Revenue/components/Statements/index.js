import React, { useState, useEffect } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import AnalyticsCards from "components/Revenue/components/Statements/AnalyticsCards";
import RevenueStatementTable from "components/Table/Revenue/RevenueStatementTable";

import { useLazyQuery } from "@apollo/client";
import { GET_ES_POTENTIAL_ISSUES } from "graphQL/useQueryPotentialIssue";


export default function RevenueStatements() {

  const [statements, setStatements] = useState([]);
  const [approvedCount, setApprovedCount] = useState(0);
  const [unapprovedCount, setUnapprovedCount] = useState(0);
  const [potentialIssuesList, setPotentialIssuesList] = useState([]);

  const [getPotentialIssues, { data: potentialIssues }] = useLazyQuery(GET_ES_POTENTIAL_ISSUES, { fetchPolicy: "no-cache" });

  useEffect(() => {
    // Potential Issues
    getPotentialIssues({
      variables: {
        esIndex: "checkdetails_flat",
        size: 50,
      },
    });
  }, []);

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


  const onGettingStatements = (statementsList) => {
    setStatements(statementsList);
  }

  //  potential issues
  useEffect(() => {
    if (potentialIssues?.getPotentialIssuesSummary?.hits?.length > 0) {
      const allIssues = potentialIssues?.getPotentialIssuesSummary?.hits;
      const issues = allIssues.filter((issue) => {
        const checkAmt = issue?.checkAmt?.value.toFixed(2);
        const checkDetailAmt = issue?.checkDetailAmt?.value.toFixed(2);
        if (Number(checkAmt) !== Number(checkDetailAmt)) {
          return issue;
        }
      });
      setPotentialIssuesList(issues);
    } else {
      setPotentialIssuesList([]);
    }
  }, [potentialIssues]);

  return (
    <div style={{ padding: "75px" }}>
      <AnalyticsCards checks={statements?.length || 0} approvedCount={approvedCount} unapprovedCount={unapprovedCount} potentialIssues={potentialIssuesList} />
      <div style={{ marginTop: 40 }}>
        <RevenueStatementTable onGettingStatements={onGettingStatements} parent="RevenueStatementTable" />
      </div>
    </div>
  );
}