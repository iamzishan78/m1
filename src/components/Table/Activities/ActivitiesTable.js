import React, { useContext, useEffect, useState } from "react";
import get from "lodash/get";
// context
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { Container, Dialog, IconButton } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableESHOC from "components/Table/TableESHOC";
import { useMutation, useApolloClient } from "@apollo/client";
import { useDispatch } from "react-redux";

import { AppContext } from "AppContext";
import { deepEqualObjects, copy } from "components/Shared/functions";
import { anyToDate } from "@amcharts/amcharts4/.internal/core/utils/Utils";
import { execCommonAsyncExportJobAction } from "store/actions/commonActions";
// Header Schemas
import TableHeader from "components/Table/constants/activity-table-header-schema";
import DeleteConfirmationDialogContent from "components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";
import ActivitiesModal from "components/Activities/components/ActivitiesModal";

// Utilities
import { usetableStyles } from "../Styles";
import { UPDATE_PROPERTY_INTEREST } from "graphQL/useMutationUpdatepropertyInterest";
import { activityTypes } from "utils/data";
import { getRangeFilters } from "utils/helper";

export const getFilters = (appliedFilters) => {
  let filters = [];
  if (appliedFilters) {
    let range = [];
    range = getRangeFilters(
      {
        dateTime: {
          from: appliedFilters.fromDate ? new Date(appliedFilters.fromDate).toISOString() : null,
          to: appliedFilters.toDate ? new Date(appliedFilters.toDate).toISOString() : null,
        },
      },
      "simple"
    );
    if (range.length > 0) filters = [...filters, ...range];
    range = getRangeFilters(
      {
        endDateTime: {
          from: appliedFilters.fromDate ? new Date(appliedFilters.fromDate).toISOString() : null,
          to: appliedFilters.toDate ? new Date(appliedFilters.toDate).toISOString() : null,
        },
      },
      "simple"
    );
    if (range.length > 0) filters = [...filters, ...range];
    if (appliedFilters.campaignName) {
      filters.push({
        field: "contact.campaignName.keyword",
        value: appliedFilters.campaignName,
      });
    }
    if (appliedFilters.qualifier) {
      filters.push({
        field: "ownerName.keyword",
        value: appliedFilters.qualifier,
      });
    }
    if (!filters.length && appliedFilters.length) filters = appliedFilters;
  }
  return filters;
};

function ActivitiesTable(props) {
  const classes = usetableStyles();
  const dispatch = useDispatch();
  const client = useApolloClient();
  const [stateApp, setStateApp] = useContext(AppContext);
  const { appliedFilters, esIndex, searchFields, clickedRow } = props;

  const [selectedActivity, setSelectedActivity] = useState(null);
  const [events, setEvents] = useState([]);

  const [updatePropertyInterest] = useMutation(UPDATE_PROPERTY_INTEREST, {
    refetchQueries: ["getESPaginatedList", "getESSimpleSearch", "getESFilterList"],
    awaitRefetchQueries: true,
  });

  const formatHits = (hits) => {
    setEvents(
      hits.map((hit) => ({ ...hit, start: new Date(hit.dateTime), end: new Date(hit.endDateTime ? hit.endDateTime : hit.dateTime) }))
    );
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
      hit.end = anyToDate(hit.endDateTime ? new Date(hit.endDateTime) : hit.start).toLocaleString("en-US", {
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
      defaultSort: { field: "lastUpdateAt", order: "desc" },
      setAppliedFilters: props.filtersChange,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateApp.activitySearchQuery, props.filterToggle]);

  useEffect(() => {
    if (clickedRow) {
      setSelectedActivity({
        ...clickedRow,
        type: get(
          activityTypes.find((type) => type.label === clickedRow.type),
          "value",
          ""
        ),
      });
      onModalOpen();
    }
  }, [clickedRow]);

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

  const onDownload = (e) => {
    dispatch(
      execCommonAsyncExportJobAction.STARTED({
        jobType: "EXPORTCSV",
        client,
        setStateApp,
        userId: stateApp.user.mongoId,
        requestPayload: {
          esIndex,
          filters: getFilters(appliedFilters),
          search: { query: stateApp.activitySearchQuery, fields: searchFields },
          datasets: {
            exportActivities: true,
          },
          counts: {
            exportActivities: props.total,
          },
        },
      })
    );
  };

  const onModalOpen = () => {
    setStateApp((stateApp) => ({
      ...stateApp,
      activityDialog: true,
    }));
  };

  const setSelectedActivityId = (id) => {
    setStateApp((stateApp) => ({
      ...stateApp,
      selectedActivityId: id,
    }));
  };

  return (
    <Container maxWidth={false} className={classes.container} id={props.id ? props.id : props.parent}>
      <Dialog open={props.openDialog ? true : false} onClose={() => props.setOpenDialog(null)} fullWidth={true} maxWidth={"sm"}>
        {props.openDialog === "delete" && (
          <DeleteConfirmationDialogContent
            header={`Delete Interest(s)`}
            onClose={() => props.setOpenDialog(null)}
            deleteFunc={deleteFunc}
            m1nSelectedRowsIds={props.selectedRows.map((sR) => props.rows[sR.dataIndex]._id)}
            setM1nSelectedRowsIndexes={props.setSelectedRows}
          >
            {`Do you want to delete the selected interest${
              props.selectedRows && props.selectedRows.length > 1 && props.selectedRows.length > 1 ? "s" : ""
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
        options={{
          ...props.options,
          customToolbar: () => {
            return (
              <div
                style={{
                  display: "inline",
                  float: "left",
                }}
              >
                <IconButton onClick={onDownload}>
                  <CloudDownloadIcon />
                </IconButton>
              </div>
            );
          },
          customToolbarSelect: () => <div></div>,
        }}
        parent={props.parent}
        setColumnsBase={[]}
      />
      <ActivitiesModal selectedActivity={selectedActivity} setSelectedActivityId={setSelectedActivityId} events={events} />
    </Container>
  );
}

export default React.memo(TableESHOC(ActivitiesTable), deepEqualObjects);
