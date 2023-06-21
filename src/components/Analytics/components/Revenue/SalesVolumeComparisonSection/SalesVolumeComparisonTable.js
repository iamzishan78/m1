import React, { useEffect } from "react";
import get from "lodash/get";
// context
import { Container } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableESHOC from "components/Table/TableESHOC";
import moment from "moment";
import convert_date from "components/Shared/valueformatters/convert_date";

import { deepEqualObjects, copy } from "components/Shared/functions";
// Header Schemas
import TableHeader from "components/Table/constants/sales-production-header-schema";

// Utilities
import { usetableStyles } from "components/Table/Styles";

function SalesVolumeComparisonTable(props) {
  const classes = usetableStyles();

  useEffect(() => {
    if ((props.recordCount && !props.options.count) || props.recordCount > props.options.count) return;
    props.setRecordCount(props.options.count);
  }, [props.options.count]);

  useEffect(() => {
    props.setTableMeta({
      filters: props.esFilters,
      TableHeader: copy(TableHeader),
      esIndex: "checkdetailsinterestscomparison_flat",
      startPaginationAt: 50,
      formatHits,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.setTableMeta, props.esFilters]);

  const formatHits = (hits) => {
    return hits.map((hit) => {
      let pVolume = 0;
      get(hit, "wells", []).forEach((well) => {
        const prod = well.production.find((p) => moment(p.data.ReportDate).format("MM/yyyy") === moment(hit.date).format("MM/yyyy"));
        if (prod) pVolume = pVolume + prod.data[`allocated${hit.product.charAt(0).toUpperCase() + hit.product.slice(1).toLowerCase()}`];
      });
      return {
        ...hit,
        propertyNumber: hit.property.number,
        propertyName: hit.property.name,
        date: hit.date ? convert_date(hit.date) : null,
        apiNumber: get(hit, "wells", []).map((w) => w.apiNumber),
        wellName: get(hit, "wells", []).map((w) => w.wellName),
        statementVolume: hit.grossPropertyVolume,
        reportedVolume: pVolume,
        overShort: hit.statementVolume - pVolume,
        difference: pVolume > 0 ? `${Math.round((hit.overShort * 100) / pVolume)}%` : null,
      };
    });
  };

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
        options={props.options}
        parent={props.parent}
        setColumnsBase={[]}
        {...props.esHocProps}
      />
    </Container>
  );
}

export default React.memo(TableESHOC(SalesVolumeComparisonTable), deepEqualObjects);
