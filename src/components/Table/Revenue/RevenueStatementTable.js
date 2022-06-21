import React, { useState, useEffect, useCallback } from "react";
import moment from "moment";
import { Container, Dialog } from "@material-ui/core";
import TableESHOC from "components/Table/TableESHOC";
import Table from "components/Shared/M1nTable/components/Table";

import { usetableStyles } from "../Styles";
import { useLazyQuery, useMutation } from "@apollo/client";
import { REMOVE_CHECKS } from "graphQL/useMutationRemoveChecks";
// import { GET_VALIDATION_CHECK } from "graphQL/useQueryValidationCheck";
import { GET_ES_POTENTIAL_ISSUES_SUMMARY } from "graphQL/useQueryESSummary";
import TableHeader from "components/Table/constants/revenue-statement-header-schema";
import { deepEqualObjects, copy } from "components/Shared/functions";
import DeleteConfirmationDialogContent from "components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";

const genericDataActions = ["tags", "comments"];

function RevenueStatementTable(props) {
  const classes = usetableStyles({ isRevenueTable: true });

  const [potentialIssuesList, setPotentialIssuesList] = useState([]);
  const [pIssuesArr, setIssuesArr] = useState([]);

  const {
    // rows,
    searchedRows,
    // setRows,
    setTableMeta,
    onGettingPotentialIssues,
    onGettingStatements,
    setGenricData,
    esFilters,
    revenueSearchQuery,
    filterToggle
  } = props;

  const [removeChecks] = useMutation(REMOVE_CHECKS, {
    refetchQueries: ["getESSimpleSearch"],
    awaitRefetchQueries: true,
  });

  // const [getRevenueValidationCheck, { data: validationData }] = useLazyQuery(
  //   GET_VALIDATION_CHECK,
  //   {
  //     context: { batch: true },
  //     fetchPolicy: "no-cache",
  //   }
  // );

  const [getPotentialIssues, { data: potentialIssues }] = useLazyQuery(
    GET_ES_POTENTIAL_ISSUES_SUMMARY,
    {
      context: { batch: true },
      fetchPolicy: "no-cache",
    }
  );

  const issues = potentialIssues?.getESPotentialIssuesSummary;

  const formatHits = useCallback(
    (hits) => {
      hits = hits.map((hit) => {
        hit.checkDate = hit.checkDate
          ? moment(new Date(hit.checkDate)).format("MM/DD/YYYY")
          : null;
        hit.depositDate = hit.depositDate
          ? moment(new Date(hit.depositDate)).format("MM/DD/YYYY")
          : null;
        hit = setGenricData(
          hit,
          hit._id,
          genericDataActions,
          genericDataActions
        );
        return hit;
      });
      onGettingStatements(hits);
      return hits;
    },
    [onGettingStatements, setGenricData]
  );

  const formatedFilter = esFilters ? copy(esFilters) : [];
  const fixedFilters = [];

  if (formatedFilter[0] && formatedFilter[0].value.range) {
    formatedFilter[0].type = 'range'
    formatedFilter[0].value = formatedFilter[0].value.range[formatedFilter[0].field]
    fixedFilters.push(formatedFilter[0])
  }

  useEffect(() => {
    setTableMeta({
      TableHeader: copy(TableHeader),
      esIndex: "checks_flat",
      filters: fixedFilters,
      extendSearchQuery: revenueSearchQuery,
      searchFields: ["checkNumber", "_all"],
      startPaginationAt: 24,
      defaultSort: { field: "checkDate", order: "desc" },
      formatHits,
      initializeGenericData: { key: "_id", actions: genericDataActions },
    });
  }, [setTableMeta, formatHits, revenueSearchQuery, filterToggle]);

  useEffect(() => {
    // Potential Issues
    getPotentialIssues({
      variables: {
        esIndex: "checkdetails_flat",
        size: 50,
        extendSearchQuery: "potentialIssues",
      },
    });
  }, [getPotentialIssues]);

  //  Potential issues
  useEffect(() => {
    if (issues?.hits?.length > 0) {
      const allIssues = issues?.hits.filter((issue) => {
        const checkAmt = issue?.checkAmt?.value?.toFixed(2);
        const checkDetailAmt = issue?.checkDetailAmt?.value?.toFixed(2);
        if (Number(checkAmt) !== Number(checkDetailAmt)) {
          return issue;
        }
      });
      setIssuesArr(allIssues);
      setPotentialIssuesList(allIssues);
    } else {
      setPotentialIssuesList([]);
    }
  }, [potentialIssues, issues]);

  useEffect(() => {
    if (issues?.hits?.length > 0 && searchedRows?.length > 0) {
      const issuesArr = issues?.hits.filter((issue) => {
        for (let i = 0; i < searchedRows?.length; i++) {
          if (searchedRows[i]._id === issue.key) {
            return issue;
          }
        }
      });
      setIssuesArr(issuesArr);
    } else {
      setIssuesArr([])
    }
  }, [issues, searchedRows]);

  useEffect(() => {
    if (pIssuesArr.length > 0) {
      const allIssues = pIssuesArr?.filter((issue) => {
        const checkAmt = issue?.checkAmt?.value?.toFixed(2);
        const checkDetailAmt = issue?.checkDetailAmt?.value?.toFixed(2);
        if (Number(checkAmt) !== Number(checkDetailAmt)) {
          return issue;
        }
      });
      setPotentialIssuesList(allIssues);
      onGettingPotentialIssues(allIssues);
    } else {
      onGettingPotentialIssues([]);
      setPotentialIssuesList([]);
    }
  }, [pIssuesArr, onGettingPotentialIssues]);

  const deleteFunc = (ids) => {
    if (ids.length > 0) {
      props.setLoading(true);
      removeChecks({
        variables: {
          checkIds: ids,
        },
      }).then(() => {
        props.setLoading(false);
      });
    }
  };

  return (
    <Container
      maxWidth={false}
      className={classes.container}
      id={props.id ? props.id : props.parent}
    >
      <Dialog
        open={props.openDialog ? true : false}
        onClose={() => props.setOpenDialog(null)}
        fullWidth={true}
        maxWidth={"sm"}
      >
        {props.openDialog === "delete" && (
          <DeleteConfirmationDialogContent
            header={`Delete Revenue Statement(s)`}
            onClose={() => props.setOpenDialog(null)}
            deleteFunc={deleteFunc}
            m1nSelectedRowsIds={props.selectedRows.map(
              (sR) => props.rows[sR.dataIndex]._id
            )}
            setM1nSelectedRowsIndexes={props.setSelectedRows}
          >
            {`Do you want to delete the selected revenue statement${props.selectedRows &&
              props.selectedRows.length > 1 &&
              props.selectedRows.length > 1
              ? "s"
              : ""
              }?`}
          </DeleteConfirmationDialogContent>
        )}
      </Dialog>
      <Table
        style={{ backgroundColor: "#fff" }}
        header={props.header}
        columns={props.columns}
        rows={props.rows}
        total={false}
        potentialIssues={potentialIssuesList}
        loading={props.loading}
        targetLabel={props.targetLabel}
        uploadIcon={null}
        dense={props.dense ? props.dense : undefined}
        orderByTracks={false}
        startPaginationAt={null}
        onTableChange={props.onTableChange}
        options={props.options}
        parent={props.parent}
        setColumnsBase={[]}
        headerZIndex={0}
      />
    </Container>
  );
}

export default React.memo(TableESHOC(RevenueStatementTable), deepEqualObjects);
