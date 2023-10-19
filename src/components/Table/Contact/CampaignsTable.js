import React, { useEffect, useState } from "react";
// context
import { Container, Dialog } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableESHOC from "components/Table/TableESHOC";

import { deepEqualObjects } from "components/Shared/functions";
// Header Schemas
import CampaignsHeader from "components/Table/constants/campaign-table-header-schema";

// Utilities
import { usetableStyles } from "../Styles";
import { getRangeFilters } from "utils/helper";

// value formatters
import convert_date from "components/Shared/valueformatters/convert_date.js";
import DeleteConfirmationDialogContent from "components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";
import { UPDATE_CAMPAIGN } from "graphQL/useMutationCampaign";
import { useMutation } from "@apollo/client";
import { resetESTableToggle } from "hookstate";

export const getFilters = (appliedFilters) => {
  let filters = [];
  if (appliedFilters) {
    let range = [];
    range = getRangeFilters(
      {
        createdAt: {
          from: appliedFilters.fromDate ? new Date(appliedFilters.fromDate).toISOString() : null,
          to: appliedFilters.toDate ? new Date(appliedFilters.toDate).toISOString() : null,
        },
      },
      "simple"
    );
    if (range.length > 0) filters = [...filters, ...range];
    if (appliedFilters.status) {
      filters.push({
        field: "status.keyword",
        value: appliedFilters.status,
      });
    }
    if (appliedFilters.owner) {
      filters.push({
        field: "owner.name.keyword",
        value: appliedFilters.owner,
      });
    }
  }
  return filters;
};

function CampaignsTable(props) {
  const classes = usetableStyles();
  const { appliedFilters, esIndex, searchFields, contactSearchQuery } = props;
  const [resetSelectedRow, setResetSelectedRow] = useState(false);

  const [upsertCampaign] = useMutation(UPDATE_CAMPAIGN, {
    onCompleted: () => {
      resetESTableToggle.set(!resetESTableToggle.get())
    }
  });

  const formatHits = (hits) => {
    return hits.map((hit, i) => ({
      ...hit,
      owner: hit.owner?.displayName,
      createdAt: hit.createdAt ? convert_date(hit.createdAt) : null,
      tags: hit?.tags?.length > 0 ? [[hit.tags.map((tag) => tag.tag)], hit.tags.length] : [[], 0],
      commentsCounter: hit.comments ? hit.comments.length : 0,
    }));
  };

  useEffect(() => {
    props.setTableMeta({
      filters: getFilters(appliedFilters),
      extendSearchQuery: contactSearchQuery ? contactSearchQuery : null,
      searchFields,
      TableHeader: CampaignsHeader,
      esIndex,
      startPaginationAt: 25,
      formatHits,
      downloadAll: { exportPx: '121px' },
      setAppliedFilters: props.filtersChange,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactSearchQuery, props.filterToggle, appliedFilters]);


  const deleteFunc = (ids) => {
    if (ids.length > 0) {
      props.setLoading(true);
      setResetSelectedRow(!resetSelectedRow);

      ids.forEach(id => {
        upsertCampaign({
          variables: {
            campaign: {
              _id: id,
              isDeleted: true
            }
          },
          refetchQueries: ["getCampaign", 'getESSimpleSearch', 'getCampaignAnalytics'],
        });
      });
    }
  };

  return (
    <Container maxWidth={false} className={classes.container} id={props.id ? props.id : props.parent}>
      <Dialog open={props.openDialog ? true : false} onClose={() => props.setOpenDialog(null)} fullWidth={true} maxWidth={"sm"}>
        {props.openDialog === "delete" && (
          <DeleteConfirmationDialogContent
            header={`Delete Campaign(s)`}
            onClose={() => props.setOpenDialog(null)}
            deleteFunc={deleteFunc}
            m1nSelectedRowsIds={props.selectedRows.map((sR) => props.rows[sR.dataIndex]?._id)}
            setM1nSelectedRowsIndexes={props.setSelectedRows}
          >
            {`Do you want to delete the selected campaign${props.selectedRows && props.selectedRows.length > 1 && props.selectedRows.length > 1 ? "s" : ""
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
          // customToolbarSelect: () => <div></div>,
        }}
        resetSelectedRow={resetSelectedRow}
        parent={props.parent}
        setColumnsBase={[]}
        {...props.esHocProps}
      />
    </Container>
  );
}

export default React.memo(TableESHOC(CampaignsTable), deepEqualObjects);