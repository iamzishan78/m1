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
    let requiredEsFilters = props.esFilters.filter(
      (esFilter) =>
        esFilter.field === "property.state.keyword" ||
        esFilter.type === "range"
    );
    props.setTableMeta({
      filters: requiredEsFilters,
      TableHeader: copy(TableHeader),
      esIndex: "checkdetailsinterestscomparison_flat",
      startPaginationAt: 50,
      formatHits,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.setTableMeta, props.esFilters]);

  const formatHits = (hits) => {
    return hits.map((hit) => {
      hit.propertyNumber = hit.property.number;
      hit.propertyName = hit.property.name;
      hit.date = hit.date ? convert_date(hit.date) : null;
      hit.apiNumber = get(hit, "wells", []).map((w) => w.apiNumber);
      hit.wellName = get(hit, "wells", []).map((w) => w.wellName);
      let [pVolume, reportDate, oilProduction, gasProduction] = [0, null, null, null];
      get(hit, "wells", []).forEach((well) => {
        const matchedProduction = well.production.find((p) => convert_date(p.data.ReportDate) === hit.date);

        if (matchedProduction) {
          reportDate = matchedProduction.data.ReportDate;
          oilProduction = matchedProduction.data.allocatedOil;
          gasProduction = matchedProduction.data.allocatedGas;
        } 

        const prod = well.production.find((p) => moment(p.data.ReportDate).format("MM/yyyy") === moment(hit.date).format("MM/yyyy"));
        if (prod) pVolume = pVolume + prod.data[`allocated${hit.product.charAt(0).toUpperCase() + hit.product.slice(1).toLowerCase()}`];
      });
      hit.reportDate = convert_date(reportDate);
      hit.oilProduction = oilProduction;
      hit.gasProduction = gasProduction;
      hit.statementVolume = hit.grossPropertyVolume;
      hit.reportedVolume = pVolume;
      hit.overShort = hit.statementVolume - pVolume;
      hit.difference = pVolume > 0 ? `${Math.round((hit.overShort * 100) / pVolume)}%` : null;
      return hit;
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
