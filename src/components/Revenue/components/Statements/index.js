import React, { useState, useEffect } from "react";
import AnalyticsCards from "components/Revenue/components/Statements/AnalyticsCards";
import RevenueStatementTable from "components/Table/Revenue/RevenueStatementTable";

export default function RevenueStatements() {

  const [statements, setStatements] = useState([]);
  const [approvedCount, setApprovedCount] = useState(0);
  const [unapprovedCount, setUnapprovedCount] = useState(0);
  const [potentialIssuesList, setPotentialIssuesList] = useState([]);

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

  const onGettingPotentialIssues = (issues) => {
    setPotentialIssuesList(issues);
  }

  return (
    <div style={{ padding: "75px 56px", marginTop: 56 }}>
      <AnalyticsCards checks={statements?.length || 0} approvedCount={approvedCount} unapprovedCount={unapprovedCount} potentialIssues={potentialIssuesList} />
      <div style={{ marginTop: 40 }}>
        <RevenueStatementTable header="Revenue Checks" onGettingPotentialIssues={onGettingPotentialIssues} onGettingStatements={onGettingStatements} parent="RevenueStatementTable" />
      </div>
    </div>
  );
}