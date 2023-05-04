import React, { useContext, useEffect, useState } from "react";
import get from "lodash/get";
import moment from "moment";
// context
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { Container, Dialog, IconButton, ButtonGroup, Button } from "@material-ui/core";
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
import Chip from '@material-ui/core/Chip';
import { TableFilterList } from "mui-datatables";

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


const CustomChip = ({ label, onDelete }) => {
  if (["Expiration", "Option to Extend"].includes(label))
    return null
  return (
    <Chip
      label={label}
      onDelete={onDelete}
    />
  );
};

const CustomFilterList = (props) => {
  return <TableFilterList {...props} ItemComponent={CustomChip} />;
};

function ActivitiesTable(props) {
  const classes = usetableStyles();
  const dispatch = useDispatch();
  const client = useApolloClient();
  const [stateApp, setStateApp] = useContext(AppContext);
  const { appliedFilters, esIndex, searchFields, clickedRow, applyCustomClasses } = props;

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
    const filters = [
      ...getFilters(appliedFilters),
      { field: 'type.keyword', value: 'Expiration', notInclude: true },
      { field: 'type.keyword', value: 'Option to Extend', notInclude: true },
    ]

    if (props?.activityFilterByType && props?.activityFilterByType !== "all") {
      filters.push({ field: "type.keyword", value: props.activityFilterByType })
    }
    if (props?.activityFilterByType && props?.activityFilterByOwner !== "all") {
      filters.push({ field: "ownerId.keyword", value: props.activityFilterByOwner })
    }
    const today = moment().format("yyyy-MM-DD");
    switch (props.activityFilterByTime) {

      case "upcoming":
        filters.push({
          field: 'dateTime',
          value: {
            gte: `${today}T00:00:00.000Z`,
          },
          type: "range"
        });
        break;
      case "overdue":
        filters.push({
          field: 'endDateTime',
          value: {
            lte: `${today}T00:00:00.000Z`,
          },
          type: "range"
        });
        filters.push({ field: "isClosed", value: false });
        break;
      case "open":
        filters.push({
          field: "isClosed",
          value: false
        });
        break;
      case "closed":
        filters.push({
          field: "isClosed",
          value: true
        });
        break;

      default:
        break;
    }


    props.setTableMeta({
      filters: [
        ...getFilters(appliedFilters),
        { field: 'category.keyword', value: 'CRM', includeEmpty: true },
        { field: 'type.keyword', value: 'Expiration', notInclude: true },
        { field: 'type.keyword', value: 'Option to Extend', notInclude: true }
      ],
      extendSearchQuery: stateApp.activitySearchQuery,
      filters,
      searchFields,
      TableHeader: copy(TableHeader),
      esIndex,
      startPaginationAt: 25,
      formatHits,
      exportPx: props.parent === 'Contact' ? "121px" : undefined,
      defaultSort: { field: "lastUpdateAt", order: "desc" },
      setAppliedFilters: props.filtersChange,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateApp.activitySearchQuery, props.filterToggle, props.activityFilterByType, props.activityFilterByTime, props.activityFilterByOwner]);

  useEffect(() => {
    if (clickedRow) {
      const activity = {
        ...clickedRow,
        type: get(
          activityTypes.find((type) => type.label === clickedRow.type),
          "value",
          ""
        ),
      };

      setStateApp(() => ({ ...stateApp, selectedActivity: activity }));
      onModalOpen(props.dialogType);
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

  const onModalOpen = (type = "activityDialog") => {
    setStateApp((stateApp) => ({
      ...stateApp,
      [type]: true,
    }));
  };

  const setSelectedActivityId = (id) => {
    setStateApp((stateApp) => ({
      ...stateApp,
      selectedActivityId: id,
    }));
  };

  return (
    <Container
      maxWidth={false}
      className={`${classes.container} ${!applyCustomClasses && classes.subComponentsClasses}`}
      id={props.id ? props.id : props.parent || "activitiesTable"}
    >
      <Dialog open={props.openDialog ? true : false} onClose={() => props.setOpenDialog(null)} fullWidth={true} maxWidth={"sm"}>
        {props.openDialog === "delete" && (
          <DeleteConfirmationDialogContent
            header={`Delete Interest(s)`}
            onClose={() => props.setOpenDialog(null)}
            deleteFunc={deleteFunc}
            m1nSelectedRowsIds={props.selectedRows.map((sR) => props.rows[sR.dataIndex]._id)}
            setM1nSelectedRowsIndexes={props.setSelectedRows}
          >
            {`Do you want to delete the selected interest${props.selectedRows && props.selectedRows.length > 1 && props.selectedRows.length > 1 ? "s" : ""
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
                {props.addable && props.addAble?.type === "contactActivity" && (
                  <ButtonGroup variant="contained" style={{ height: "40px", margin: "4px" }} color="primary" aria-label="split button">
                    <Button
                      id="addActivityButton"
                      color="primary"
                      size="small"
                      aria-label="select merge strategy"
                      aria-haspopup="menu"
                      onClick={() => props.onAddActivity(true)}
                    >
                      + Add Activity
                    </Button>
                  </ButtonGroup>
                )}
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
        {...props.esHocProps}
        component={{
          TableFilterList: CustomFilterList,
        }}
      />
      <ActivitiesModal setSelectedActivityId={setSelectedActivityId} events={events} />
    </Container>
  );
}

export default React.memo(TableESHOC(ActivitiesTable), deepEqualObjects);
