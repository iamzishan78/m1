import React, { useEffect, useContext } from "react";
import { Container } from "@material-ui/core";
import { useSelector } from "react-redux";
import debounce from "lodash/debounce";
import moment from "moment";

// context
import { AppContext } from "AppContext";
import TableESHOC from "components/Table/TableESHOC";
import Table from "components/Shared/M1nTable/components/Table";
import { NavigationContext } from "components/Navigation/NavigationContext";

// QUERIES
import { deepEqualObjects, copy } from "components/Shared/functions";

// Header Schemas
import TableHeader from "components/Table/constants/map-grid-wells-header-schema";

// Utilities
import { usetableStyles } from "../Styles";
import { getSearchQuery, getFilters, getShapeFilter } from "utils/helper";

function MapGridWellsTable(props) {
  const classes = usetableStyles();
  const searchInput = useSelector(
    (state) => state.MapGridCard.searchInputValue
  );
  const [stateNav] = useContext(NavigationContext);
  const [stateApp] = useContext(AppContext);

  const formatColumns = (headers, hits) => {
    if(stateNav.operatorName?.length > 0) {
      const index = headers.findIndex(header => header.name === 'operator')
      headers[index].options.display = true
    }
    if(stateNav.profileName?.length > 0) {
      const index = headers.findIndex(header => header.name === 'wellBoreProfile')
      headers[index].options.display = true
    }
    return headers;
  };

  const setTableMeta = React.useMemo(
    () =>
      debounce((request, top, callback) => {
        props.setTableMeta(request);
      }, 500),
    []
  );

  const getMapFilters = () => {
    const extendSearchQuery = searchInput
      ? `((wellName:*${searchInput}*) OR (api:*${searchInput}*))`
      : "";
    const search = getSearchQuery(extendSearchQuery, {
      wellType: stateNav.typeName,
      operator: stateNav.operatorName,
      wellStatus: stateNav.statusName,
      wellBoreProfile: stateNav.profileName,
    });
    const filters = getFilters({
      spudDate: {
        from: stateNav.spudDateFrom
          ? moment.parseZone(stateNav.spudDateFrom).utc(true).valueOf()
          : moment
              .parseZone(new Date("1900-01-01T00:00:00"))
              .utc(true)
              .valueOf(),
        to: stateNav.spudDateTo
          ? moment.parseZone(stateNav.spudDateTo).utc(true).valueOf()
          : moment.parseZone(moment()).utc(true).valueOf(),
      },
      permitApprovedDate: {
        from: stateNav.permitDateFrom
          ? moment.parseZone(stateNav.permitDateFrom).utc(true).valueOf()
          : moment
              .parseZone(new Date("1900-01-01T00:00:00"))
              .utc(true)
              .valueOf(),
        to: stateNav.permitDateTo
          ? moment.parseZone(stateNav.permitDateTo).utc(true).valueOf()
          : moment.parseZone(moment()).utc(true).valueOf(),
      },
      completionDate: {
        from: stateNav.completetionDateFrom
          ? moment.parseZone(stateNav.completetionDateFrom).utc(true).valueOf()
          : moment
              .parseZone(new Date("1900-01-01T00:00:00"))
              .utc(true)
              .valueOf(),
        to: stateNav.completetionDateTo
          ? moment.parseZone(stateNav.completetionDateTo).utc(true).valueOf()
          : moment.parseZone(moment()).utc(true).valueOf(),
      },
      firstProductionDate: {
        from: stateNav.firstProdDateFrom
          ? moment.parseZone(stateNav.firstProdDateFrom).utc(true).valueOf()
          : moment
              .parseZone(new Date("1900-01-01T00:00:00"))
              .utc(true)
              .valueOf(),
        to: stateNav.firstProdDateTo
          ? moment.parseZone(stateNav.firstProdDateTo).utc(true).valueOf()
          : moment.parseZone(moment()).utc(true).valueOf(),
      },
    });
    const polygon = getShapeFilter(stateApp.gridPolygonString);
    return { search, filters, polygon };
  };

  useEffect(() => {
    const { filters, search, polygon } = getMapFilters();
    setTableMeta({
      addableName: "Wells",
      extendSearchQuery: search,
      filters: filters,
      polygon: polygon,
      TableHeader: copy(TableHeader),
      esIndex: "platformData:wells",
      startPaginationAt: 25,
      formatColumns,
    });
    // eslint-disable-next-line
  }, [
    searchInput,
    stateNav.operatorName,
    stateNav.typeName,
    stateNav.profileName,
    stateNav.statusName,
    stateNav.statusName,
    stateNav.spudDateFrom,
    stateNav.spudDateTo,
    stateNav.permitDateFrom,
    stateNav.permitDateTo,
    stateApp.gridPolygonString,
    stateNav.completetionDateFrom,
    stateNav.completetionDateTo,
    stateNav.firstProdDateFrom,
    stateNav.firstProdDateTo,
  ]);

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
        options={{
          ...props.options,
          ...props.customOptions,
        }}
        parent={props.parent}
        setColumnsBase={[]}
      />
    </Container>
  );
}

export default React.memo(TableESHOC(MapGridWellsTable), deepEqualObjects);
