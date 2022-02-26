import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "AppContext";
import AnalyticsCards from "components/Revenue/components/Statements/AnalyticsCards";
import RevenueStatementTable from "components/Table/Revenue/RevenueStatementTable";
import { ADD_CHECK_DATA } from "graphQL/useMutationAddCheck";
import LastCheckDateFilter from "../Common/LastCheckDateFilter";
import { useMutation } from "@apollo/client";

export default function RevenueStatements() {
  const [stateApp] = useContext(AppContext);

  const [statements, setStatements] = useState([]);
  const [approvedCount, setApprovedCount] = useState(0);
  const [unapprovedCount, setUnapprovedCount] = useState(0);
  const [potentialIssuesList, setPotentialIssuesList] = useState([]);
  const [esFilters, ESFilters] = useState([]);
  const [filterToggle, setFilterToggle] = React.useState(false);

  const [addCheck] = useMutation(ADD_CHECK_DATA);

  // useEffect(() => {
  //   addCheck({
  //     variables: {
  //       checkInput: {
  //         checkAmount: 1.86,
  //         checkDate: "2021-07-28T00:00:00.000Z",
  //         checkDetail: {
  //           lines: 8,
  //         },
  //         checkNumber: "543252352",
  //         depositDate: "2021-08-01T00:00:00.000Z",
  //         payee: {
  //           _id: {
  //             $oid: "619ada7eb5a69178952b6a87",
  //           },
  //           number: "244913-11",
  //           name: "ABC Minerals, LLC",
  //         },
  //         payor: {
  //           _id: {
  //             $oid: "619adb36b5a69178952b6a8a",
  //           },
  //           name: "PIONEER NATURAL RESOURCES",
  //         },
  //         source: "ENERGYLINK",
  //         status: "APPROVED",
  //         sourceId: "224453",
  //         isDeleted: false,
  //       },
  //     },
  //     refetchQueries: ["addCheck"],
  //     awaitRefetchQueries: true,
  //   });
  // }, []);

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
  };

  const onGettingPotentialIssues = (issues) => {
    setPotentialIssuesList(issues);
  };

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

        <div style={{ marginTop: 40 }}>
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
