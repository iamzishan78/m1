import React, { useEffect } from "react";
import get from 'lodash/get'
// context
import { Container } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableESHOC from "components/Table/TableESHOC";
import moment from "moment";
import { useLazyQuery } from "@apollo/client";

import { deepEqualObjects, copy } from "components/Shared/functions";
import { GET_ES_SIMPLE_FILTER } from "graphQL/useQueryESSimpleFilter";
// Header Schemas
import TableHeader from "components/Table/constants/sales-production-header-schema";

// Utilities
import { usetableStyles } from "components/Table/Styles";

function SalesVolumeComparisonTable(props) {
  const classes = usetableStyles();

  const [getESSimpleFilter] = useLazyQuery(GET_ES_SIMPLE_FILTER, {
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    props.setTableMeta({
      filters: [],
      TableHeader: copy(TableHeader),
      esIndex: "checkdetailsinterestscomparison_flat",
      startPaginationAt: 50,
      formatHits,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.setTableMeta]);

  useEffect(() => {
    (async () => {
      const { properties } = await getDistinctProperties(
        "property.IsDeleted",
        false,
        "term"
      );
      const propertyIds = properties?.map(obj => obj.key);
      if(propertyIds) props.setPropertiesIds(propertyIds);
    })();
  }, [props.rows, props.esFilters]);

  const getDistinctProperties = async () => {
    const formattedFilters = props.esFilters.map((filter) => {
      return filter.field === "check.checkDate" ? { ...filter, field: "date" } : filter;
    });
    const propertiesPromise = new Promise((resolve, reject) => {
      getESSimpleFilter({
        variables: {
          index: "checkdetailsinterestscomparison_flat",
          filters: [
            ...formattedFilters,
            { field: "property.IsDeleted", value: false, type: "term" },
          ],
          filterKey: "property._id.keyword",
          filterAggs: { query: "", field: "property._id.keyword", size: props.total || 0 },
        },
        onCompleted: (res) => resolve(res?.getESSimpleFilter?.hits),
        onError: (error) => reject(error),
      });
    });
    const [properties] = await Promise.all([
      propertiesPromise,
    ]);
    return { properties };
  };

  const formatHits = (hits) => {
    return hits.map((hit) => {
      hit.propertyNumber = hit.property.number;
      hit.propertyName = hit.property.name;
      hit.apiNumber = get(hit, "wells", []).map((w) => w.apiNumber);
      hit.wellName = get(hit, "wells", []).map((w) => w.wellName);
      let pVolume = 0;
      get(hit, "wells", []).forEach((well) => {
        const prod = well.production.find(
          (p) => moment(p.data.ReportDate).format("MM/yyyy") === moment(hit.date).format("MM/yyyy")
        );
        if (prod)
          pVolume =
            pVolume +
            prod.data[
              `allocated${hit.product.charAt(0).toUpperCase() + hit.product.slice(1).toLowerCase()}`
            ];
      });
      hit.statementVolume = hit.grossPropertyVolume;
      hit.reportedVolume = pVolume;
      hit.overShort = hit.statementVolume - pVolume;
      hit.difference = pVolume > 0 ? `${Math.round((hit.overShort * 100) / pVolume)}%` : null;
      return hit;
    });
  };

  return (
    <Container
      maxWidth={false}
      className={classes.container}
      id={props.id ? props.id : props.parent}
    >
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

export default React.memo(
  TableESHOC(SalesVolumeComparisonTable),
  deepEqualObjects
);
