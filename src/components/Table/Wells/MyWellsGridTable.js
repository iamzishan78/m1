import React, { useEffect, useContext } from "react";
import { Container } from "@material-ui/core";
import { debounce, get } from "lodash";

// context
import { AppContext } from "AppContext";
import TableESHOC from "components/Table/TableESHOC";
import Table from "components/Shared/M1nTable/components/Table";

// QUERIES
import { deepEqualObjects, copy } from "components/Shared/functions";

// Header Schemas
import TableHeader from "components/Table/constants/my-wells-grid-header-schema";

// Utilities
import { usetableStyles } from "../Styles";

// value formatters
import convert_date from "components/Shared/valueformatters/convert_date.js";

const startPaginationAt = 50;
function MyWellsGridTable(props) {
  const classes = usetableStyles();
  const [stateApp] = useContext(AppContext);

  useEffect(() => {
    setTableMeta({
      filters: props.filters,
      addBtnText: "WELLS",
      extendSearchQuery: stateApp.landSearchQuery,
      searchFields: ["wellData.wellName", "wellData.api"],
      TableHeader: copy(TableHeader),
      esIndex: "mywells_flat",
      startPaginationAt,
      defaultSort: { field: "lastUpdateAt", order: "desc" },
      formatHits,
    });
    // eslint-disable-next-line
  }, [stateApp.landSearchQuery, props.filters]);

  const setTableMeta = React.useMemo(
    () =>
      debounce((request, top, callback) => {
        props.setTableMeta(request);
      }, 500),
    []
  );

  const formatHits = (hits) => {
    hits = hits.map((hit) => {
      const properties = get(hit, "properties", []);
      const propertiesKeys = {
        internalID: [],
        propertiesNames: [],
        prospectID: [],
        status: [],
        acquisitionID: [],
        internalCompany: [],
        divOrderStatus: [],
        costFree: [],
        effectiveDate: [],
        interestAmount: [],
        interestType: [],
      };
      properties.forEach((property) => {
        propertiesKeys.internalID.push(property.internalID);
        propertiesKeys.propertiesNames.push(property.name);
        propertiesKeys.prospectID.push(property.prospectID);
        propertiesKeys.internalCompany.push(property.internalCompany);
        propertiesKeys.divOrderStatus.push(property.divOrderStatus);
        propertiesKeys.status.push(startCase(property.status));
        propertiesKeys.acquisitionID.push(startCase(property.acquisitionID));
        propertiesKeys.costFree.push(startCase(property.costFree));
        Object.keys(propertiesKeys).forEach((key) => {
          const _key = key === "name" ? "propertiesNames" : key,
            _value = key.includes("Date") ? convert_date(property[key]) : property[key];
          propertiesKeys[_key].push(_value);
        });
      });
      hit = {
        ...hit.wellData,
        ...propertiesKeys,
        sort: hit.sort,
        permitApprovedDate: hit.wellData.permitApprovedDate ? convert_date(hit.wellData.permitApprovedDate) : null,
        spudDate: hit.wellData.spudDate ? convert_date(hit.wellData.spudDate) : null,
        completionDate: hit.wellData.completionDate ? convert_date(hit.wellData.completionDate) : null,
        firstProdDate: hit.wellData.FirstProdDate ? convert_date(hit.wellData.FirstProdDate) : null,
      };
      return hit;
    });
    return hits;
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
        startPaginationAt={startPaginationAt}
        onTableChange={props.onTableChange}
        options={{
          ...props.options,
          ...props.customOptions,
        }}
        parent={props.parent}
        setColumnsBase={[]}
        {...props.esHocProps}
      />
    </Container>
  );
}

export default React.memo(TableESHOC(MyWellsGridTable), deepEqualObjects);
