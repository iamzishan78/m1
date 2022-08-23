import React, { useEffect } from "react";
// context
import { Container } from "@material-ui/core";
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
      setAppliedFilters: props.filtersChange,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactSearchQuery, props.filterToggle, appliedFilters]);

  return (
    <Container maxWidth={false} className={classes.container} id={props.id ? props.id : props.parent}>
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
        {...props.esHocProps}
      />
    </Container>
  );
}

export default React.memo(TableESHOC(CampaignsTable), deepEqualObjects);
