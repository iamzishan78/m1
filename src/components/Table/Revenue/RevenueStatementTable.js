import React, { useState, useEffect, useCallback } from "react";
import moment from "moment";
import { Container, Dialog } from "@material-ui/core";
import TableESHOC from "components/Table/TableESHOC";
import Table from "components/Shared/M1nTable/components/Table";

import { usetableStyles } from "../Styles";
import { useLazyQuery, useMutation } from "@apollo/client";
import { REMOVE_CHECKS } from "graphQL/useMutationRemoveChecks";
import { GET_ES_SIMPLE_COUNT } from "graphQL/useQueryESCount";
import TableHeader from "components/Table/constants/revenue-statement-header-schema";
import { deepEqualObjects, copy } from "components/Shared/functions";
import DeleteConfirmationDialogContent from "components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";

const genericDataActions = [];

function RevenueStatementTable(props) {
  const classes = usetableStyles({ isRevenueTable: true });

  const { setTableMeta, onGettingPotentialIssues, onGettingStatements, setGenricData, esFilters, revenueSearchQuery, filterToggle, setCustomFilterChanged } = props;

  const [approvedCount, setApprovedCount] = useState(0);
  const [unApprovedCount, setUnApprovedCount] = useState(0);
  const [removeChecks] = useMutation(REMOVE_CHECKS, {
    refetchQueries: ["getESSimpleSearch"],
    awaitRefetchQueries: true,
  });

  React.useEffect(() => {
    setCustomFilterChanged?.(true);
  }, [esFilters]);

  const [getESSimpleCount] = useLazyQuery(GET_ES_SIMPLE_COUNT, {
    // context: { batch: true },
    fetchPolicy: "no-cache",
  });

  const formatHits = useCallback(
    (hits) => {
      hits = hits.map((hit) => {
        hit.checkDate = hit.checkDate ? moment(new Date(hit.checkDate)).format("MM/DD/YYYY") : null;
        hit.depositDate = hit.depositDate ? moment(new Date(hit.depositDate)).format("MM/DD/YYYY") : null;
        hit.ownerName = hit.payee?.name || ''
        hit.ownerNumber = hit.payee?.number || ''
        hit = setGenricData(hit, hit._id, genericDataActions, genericDataActions);
        hit.tags =
          hit?.tags?.length > 0
            ? [[hit.tags.map((tag) => tag.tag)], hit.tags.length]
            : [[], 0];
        return hit;
      });
      return hits;
    },
    [setGenricData]
  );

  const formatedFilter = esFilters ? copy(esFilters) : [];
  const fixedFilters = [];

  if (formatedFilter[0] && formatedFilter[0].value.range) {
    formatedFilter[0].type = "range";
    formatedFilter[0].value = formatedFilter[0].value.range[formatedFilter[0].field];
    fixedFilters.push(formatedFilter[0]);
  }

  useEffect(() => {
    setTableMeta({
      TableHeader: copy(TableHeader),
      esIndex: "checks_flat",
      filters: fixedFilters,
      extendSearchQuery: revenueSearchQuery,
      searchFields: ["checkNumber", "_all"],
      startPaginationAt: 50,
      defaultSort: { field: "checkDate", order: "desc" },
      formatHits,
      downloadAll: { exportPx: '121px' },
      initializeGenericData: { key: "_id", actions: genericDataActions },
    });
  }, [setTableMeta, formatHits, revenueSearchQuery, filterToggle]);

  useEffect(() => {
    getCounts();
  }, [props.rows]);

  useEffect(() => {
    if (props.total > 0) {
      onGettingStatements({
        approvedCount: approvedCount,
        unApprovedCount: unApprovedCount,
        statementCount: props.total,
      });
    }
  }, [approvedCount, unApprovedCount, props.total]);

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

  const getCounts = async () => {
    const approvedCounts = await getESCounts("approvalStatus.keyword", "Approved");
    const unApprovedCounts = await getESCounts("approvalStatus.keyword", "Unapproved");
    const potentialIssuesCounts = await getESCounts("isAmountValidated", false, "term");

    setApprovedCount(approvedCounts);
    setUnApprovedCount(unApprovedCounts);
    onGettingPotentialIssues(potentialIssuesCounts);
  };

  const getESCounts = (key, value, type) => {
    return new Promise((resolve, reject) => {
      getESSimpleCount({
        variables: {
          index: "checks_flat",
          filters: [...fixedFilters, { field: key, value: value, type }, ...props.selectedFilters.current],
          search: {
            query: revenueSearchQuery,
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
    <Container maxWidth={false} className={classes.container} id={props.id ? props.id : props.parent}>
      <Dialog open={props.openDialog ? true : false} onClose={() => props.setOpenDialog(null)} fullWidth={true} maxWidth={"sm"}>
        {props.openDialog === "delete" && (
          <DeleteConfirmationDialogContent
            header={`Delete Revenue Statement(s)`}
            onClose={() => props.setOpenDialog(null)}
            deleteFunc={deleteFunc}
            m1nSelectedRowsIds={props.selectedRows.map((sR) => props.rows[sR.dataIndex]?._id)}
            setM1nSelectedRowsIndexes={props.setSelectedRows}
          >
            {`Do you want to delete the selected revenue statement${props.selectedRows && props.selectedRows.length > 1 && props.selectedRows.length > 1 ? "s" : ""
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
        {...props.esHocProps}
      />
    </Container>
  );
}

export default React.memo(TableESHOC(RevenueStatementTable), deepEqualObjects);
