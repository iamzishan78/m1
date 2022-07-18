import React, { useContext, useEffect, useState } from "react";
import get from "lodash/get";
// context
import { Container, Dialog } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableESHOC from "components/Table/TableESHOC";
import { useMutation } from "@apollo/client";

import { AppContext } from "AppContext";
import { deepEqualObjects } from "components/Shared/functions";
// Header Schemas
import CampaignsHeader from "components/Table/constants/campaign-table-header-schema";
import DeleteConfirmationDialogContent from "components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";

// Utilities
import { usetableStyles } from "../Styles";
import { UPDATE_PROPERTY_INTEREST } from "graphQL/useMutationUpdatepropertyInterest";
import { activityTypes } from "utils/data";
import { getRangeFilters } from "utils/helper";

// value formatters 
import convert_date from "components/Shared/valueformatters/convert_date.js";

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
  }
  return filters;
};

function CampaignsTable(props) {
  const classes = usetableStyles();
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
    return hits.map((hit, i) => ({
      ...hit,
      owner: hit.owner.displayName,
      createdAt: hit.createdAt ? convert_date(hit.createdAt) : null,
      tags: hit?.tags?.length > 0 ? [[hit.tags.map((tag) => tag.tag)], hit.tags.length] : [[], 0],
      commentsCounter: hit.comments ? hit.comments.length : 0
    }));
  };

  useEffect(() => {
    props.setTableMeta({
      filters: [],
      extendSearchQuery: stateApp.contactSearchQuery ? stateApp.contactSearchQuery : null,
      searchFields,
      TableHeader: CampaignsHeader,
      esIndex,
      startPaginationAt: 25,
      formatHits,
      setAppliedFilters: props.filtersChange,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateApp.contactSearchQuery, props.filterToggle]);

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

  const onModalOpen = () => {
    setStateApp((stateApp) => ({
      ...stateApp,
      activityDialog: true,
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
          customToolbar: () => <div></div>,
          customToolbarSelect: () => <div></div>,
        }}
        parent={props.parent}
        setColumnsBase={[]}
      />
    </Container>
  );
}

export default React.memo(TableESHOC(CampaignsTable), deepEqualObjects);
