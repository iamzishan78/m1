import React, { useContext, useEffect } from "react";
import get from "lodash/get";
// context
import { Container, Dialog } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableESHOC from "components/Table/TableESHOC";
import { useMutation } from "@apollo/client";

import { AppContext } from "AppContext";
import { deepEqualObjects, copy } from "components/Shared/functions";
import { anyToDate } from "@amcharts/amcharts4/.internal/core/utils/Utils";
// Header Schemas
import TableHeader from "components/Table/constants/activity-table-header-schema";
import DeleteConfirmationDialogContent from "components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";

// Utilities
import { usetableStyles } from "../Styles";
import { UPDATE_PROPERTY_INTEREST } from "graphQL/useMutationUpdatepropertyInterest";
import { activityTypes } from "utils/data";
import { getRangeFilters } from "utils/helper";

export const getFilters = (appliedFilters) => {
  let filters = []
  if (appliedFilters) {
    let range = []
    range = getRangeFilters({
      dateTime: {
        from: appliedFilters.fromDate ? new Date(appliedFilters.fromDate).toISOString() : null,
        to: appliedFilters.toDate ? new Date(appliedFilters.toDate).toISOString() : null,
      },
    }, 'simple');
    if(range.length > 0) filters = [...filters, ...range]
    range = getRangeFilters({
      endDateTime: {
        from: appliedFilters.fromDate ? new Date(appliedFilters.fromDate).toISOString() : null,
        to: appliedFilters.toDate ? new Date(appliedFilters.toDate).toISOString() : null,
      },
    }, 'simple');
    if(range.length > 0) filters = [...filters, ...range]
    if(appliedFilters.campaignName){
      filters.push({ field: 'contact.campaignName.keyword', value: appliedFilters.campaignName})
    }
  }
  return filters;
};


function ActivitiesTable(props) {
  const classes = usetableStyles();
  const [stateApp] = useContext(AppContext);
  const { appliedFilters, esIndex, searchFields } = props;
  const [updatePropertyInterest] = useMutation(UPDATE_PROPERTY_INTEREST, {
    refetchQueries: ["getESPaginatedList", "getESFilterList"],
    awaitRefetchQueries: true,
  });

  const formatHits = (hits) => {
    return hits.map((hit) => {
      hit.type = get(
        activityTypes.find((type) => type.value === hit.type),
        "label",
        ""
      );
      hit.dealName = get(hit, "deal.name", "");
      hit.start = anyToDate(new Date(hit.dateTime)).toLocaleString("en-US", {
        year: "numeric",
        day: "numeric",
        month: "numeric",
        minute: "2-digit",
        hour: "2-digit",
      });
      hit.end = anyToDate(
        hit.endDateTime ? new Date(hit.endDateTime) : hit.start
      ).toLocaleString("en-US", {
        year: "numeric",
        day: "numeric",
        month: "numeric",
        minute: "2-digit",
        hour: "2-digit",
      });

      return hit;
    });
  };

  useEffect(() => {
    props.setTableMeta({
      filters: getFilters(appliedFilters),
      extendSearchQuery: stateApp.activitySearchQuery,
      searchFields,
      TableHeader: copy(TableHeader),
      esIndex,
      startPaginationAt: 25,
      formatHits,
      setAppliedFilters: props.filtersChange,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateApp.activitySearchQuery, props.filterToggle]);

  const deleteFunc = (ids) => {
    if (ids.length > 0) {
      props.setLoading(true);
      for (let i = 0; i < ids.length; i++) {
        updatePropertyInterest({
          variables: {
            propertyInterest: {
              _id: ids[i],
              isDeleted: true,
            },
          },
        });
      }
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
            header={`Delete Interest(s)`}
            onClose={() => props.setOpenDialog(null)}
            deleteFunc={deleteFunc}
            m1nSelectedRowsIds={props.selectedRows.map(
              (sR) => props.rows[sR.dataIndex]._id
            )}
            setM1nSelectedRowsIndexes={props.setSelectedRows}
          >
            {`Do you want to delete the selected interest${
              props.selectedRows &&
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
      />
    </Container>
  );
}

export default React.memo(TableESHOC(ActivitiesTable), deepEqualObjects);
