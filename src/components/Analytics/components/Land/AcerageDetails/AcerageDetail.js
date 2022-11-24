import React, { useEffect, useState } from "react";
import { Container } from "@material-ui/core";
import { useDispatch } from "react-redux";
import Table from "components/Shared/M1nTable/components/Table";
import TableHeader from "components/Table/constants/analytics-land-acerage-details-schema";
import get from 'lodash/get';
// QUERIES
import { deepEqualObjects, copy } from "components/Shared/functions";
// Utilities
import { usetableStyles } from "components/Table/Styles";
// actions
import { setRevenuePropertyData } from "actions";
import TableESHOC from "components/Table/TableESHOC";
import convert_date from "components/Shared/valueformatters/convert_date.js";

function AcerageDetail(props) {
  const classes = usetableStyles();
  const { esIndex, setESFilters } = props;
  // redux
  const dispatch = useDispatch();
  const [refetchData, setRefetchData] = useState(false);

  const esFilters = props.esFilters ? props.esFilters : [];

  const formatHits = (hits) => {
    
    hits = hits.map((hit) => {
      hit.agreementNumber = hit.shape.shapeJson.properties.agreementNumber;
      hit.agreementName = hit.shape.shapeJson.properties.agreementName;
      hit.agreementSubtype = hit.shape.shapeJson.properties.agreementSubtype;
      hit.layerSubType = hit.shape.shapeJson.properties.layerSubType;
      hit.rightsType = hit.shape.shapeJson.properties.rightsType;
      hit.agreementState = hit?.shape?.shapeJson?.properties?.originalProperties?.State || hit?.shape?.shapeJson?.properties?.originalProperties?.StateAbbreviation
      hit.agreementCounty = hit?.shape?.shapeJson?.properties?.originalProperties?.County
      hit.tractName = hit.parcel.name;
      hit.tractStatus = hit?.parcel?.shapeJson?.properties?.tractStatus;
      hit.reportGrossAcres = hit?.parcel?.shapeJson?.properties?.reportGrossAcres;
      hit.sdGrossAcres = hit?.parcel?.shapeJson?.properties?.sdGrossAcres;
      hit.netAcres = hit?.parcel?.shapeJson?.properties?.netAcres;
      hit.companyNetAcres = hit?.parcel?.shapeJson?.properties?.companyNetAcres;
      hit.netRoyalty = hit?.parcel?.shapeJson?.properties?.netRoyalty;

      hit.internalCompany = hit.shape.shapeJson.properties.internalCompany;
      hit.prospectID = hit.shape.shapeJson.properties.prospectID;
      hit.acquisitionID = hit.shape.shapeJson.properties.acquisitionID;
      return hit;
    });
    return hits;
  };

  useEffect(() => {
    const formatedFilter = esFilters ? copy(esFilters) : [];
    const fixedFilters = [];
    if (formatedFilter[0] && formatedFilter[0].value.range) {
      formatedFilter[0].type = "range";
      formatedFilter[0].value = formatedFilter[0].value.range[formatedFilter[0].field];
      fixedFilters.push(formatedFilter[0]);
    }
    fixedFilters.push({ field: "shape.shapeJson.properties.type", value: 'agreement' });
    // fixedFilters.push({ field: "shape._id", value: '637180f3ddaf4a47251a35b5' });
    
    props.setInitialFilters(formatedFilter);
    props.setTableMeta({
      extendSearchQuery: props.landSearchQuery || "",
      TableHeader: copy(TableHeader),
      esIndex: esIndex,
      filters: fixedFilters,
      selectedGridView: { filters: [] },
      startPaginationAt: 25,
      // defaultSort: { field: "name.keyword", order: "asc" },
      formatHits,
    });
    // eslint-disable-next-line
  }, [props.landSearchQuery, props.filterToggle, refetchData]);

  useEffect(() => {
    // setESFilters(props.initialFilters);
    // eslint-disable-next-line
  }, [props.initialFilters]);

  useEffect(() => {
    dispatch(
      setRevenuePropertyData({ loading: props.loading, data: props.rows })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.rows]);

  useEffect(() => {
    if ((props?.total === 0 || props?.total) && props.onPropertiesCount) {
      props.onPropertiesCount(props.total);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.total, props.dependencyUpdate]);

  delete props.options.customToolbar;
  delete props.options.customToolbarSelect;
  delete props.options.onRowClick;
  props.options.search = props.searchBar;

  return (
    <>
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
          potentialIssues={[]}
          addAble={{ type: "RevenueProperties" }}
          loading={props.loading}
          targetLabel={props.targetLabel}
          uploadIcon={null}
          dense={props.dense ? props.dense : undefined}
          orderByTracks={false}
          startPaginationAt={props.startPaginationAt}
          onTableChange={props.onTableChange}
          options={{ ...props.options, ...props.customOptions }}
          parent={props.parent}
          setColumnsBase={[]}
          setRefetchData={setRefetchData}
          refetchData={refetchData}
        />
      </Container>
    </>
  );
}

export default React.memo(TableESHOC(AcerageDetail), deepEqualObjects);
