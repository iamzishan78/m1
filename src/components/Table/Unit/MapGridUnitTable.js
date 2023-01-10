import React, { useEffect, useContext } from "react";
import { Container } from "@material-ui/core";
import { useSelector } from "react-redux";
import debounce from "lodash/debounce";
import get from "lodash/get";
import { useLazyQuery } from "@apollo/client";
import moment from "moment";

// context
import { AppContext } from "AppContext";
import TableESHOC from "components/Table/TableESHOC";
import Table from "components/Shared/M1nTable/components/Table";

// QUERIES
import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";
import { GET_SHAPE_OWNERS_DATA_BY_ID } from "graphQL/useQueryShapeOwnersDataById";
import { deepEqualObjects, copy, esExtentedSearch } from "components/Shared/functions";

// Header Schemas
import TableHeader from "components/Table/constants/map-grid-unit-header-schema";

// Utilities
import { usetableStyles } from "../Styles";

function MapGridUnitTable(props) {
  // const defaultView = {
  //   name: `All Units`,
  //   type: "Default",
  // };

  const classes = usetableStyles();
  const [stateApp] = useContext(AppContext);
  const searchInput = useSelector(
    (state) => state.MapGridCard.searchInputValue
  );
  // const userGridViewSettings = useSelector(({ session }) => session.userGridViewSettings);

  // const GridViewModule = userGridViewSettings[`Agreements`];

  // const [selectedGridView, setSelectedGridView] = useState(defaultView);

  const [getShapeOwnerDataById, { data: owners }] = useLazyQuery(
    GET_SHAPE_OWNERS_DATA_BY_ID,
    { fetchPolicy: "no-cache" }
  );
  const [getStatus, { data: status }] = useLazyQuery(
    GET_ES_FILTER_LIST,
    { fetchPolicy: "no-cache" }
  );

  const setTableMeta = React.useMemo(
    () =>
      debounce((request, top, callback) => {
        props.setTableMeta(request);
      }, 500),
    []
  );

  const formatHits = (hits) => {
    hits = hits.map((hit) => {
      hit.coordinates = {
        objToPopulateSearchLayer: {
          objectType: props.targetLabel,
          objectId: hit.Id,
          objectName: hit.Operator,
        },
      };
      hit.ownersCount = get(hit, "interestSummary.unitInterestCount", "");
      hit.qualifier = get(hit, "qualifier.name", "");
      hit.reviewer = get(hit, "reviewer.name", "");
      hit.lastUpdated = moment(hit._ts).format('MM/DD/YYYY');
      hit = props.setGenricData(hit, hit._id, [], []);
      hit.tags =
        hit?.tags?.length > 0
          ? [[hit.tags.map((tag) => tag.tag)], hit.tags.length]
          : [[], 0];
      hit.commentsCounter = hit.comments ? hit.comments.length : 0;
      return hit;
    });
    return hits;
  };

  useEffect(() => {
    setTableMeta({
      extendSearchQuery: esExtentedSearch(stateApp.landSearchQuery, searchInput),
      // selectedGridView: GridViewModule || defaultView,
      // searchFields: ["*"],
      TableHeader: copy(TableHeader),
      esIndex: "shapes_flat",
      startPaginationAt: 50,
      // typeKeyword: { gridViewCategory: "Units", metaModule: "Unit" },
      filters: [
        {
          field: "layer.keyword",
          value: "unit",
        },
      ],
      defaultSort: { field: '_ts', order: 'desc' },
      polygon: stateApp?.currentFeature?.geometry && {
        type: "geo_intersects",
        field: "shapeGeometry",
        value: stateApp?.currentFeature?.geometry
      },
      formatHits,
    });
    // eslint-disable-next-line
  }, [searchInput, stateApp.landSearchQuery]);

  useEffect(() => {
    if (owners?.getShapeOwnerDataById && get(status, "getESFilterList.hits", [])) {
      const rows = JSON.parse(JSON.stringify(props.rows));
      const contactStatuses = get(status, "getESFilterList.hits", []).map(s => ({ name: s.key, data: [] }));

      for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < contactStatuses.length; j++) {
          const data = owners?.getShapeOwnerDataById[rows[i]._id].status[contactStatuses[j].name]
          contactStatuses[j].data = data ? [data] : [0]
        }
        rows[i].unitStatus = { series: contactStatuses, xaxis: [''] }
      }
      props.setRows(rows);
    }
  }, [owners]);

  useEffect(() => {
    if (props.rows.length > 0) {
      const ids = props.rows
        .filter((row) => !row.unitStatus)
        .map((row) => row._id);
      if (ids.length > 0) {
        getShapeOwnerDataById({
          variables: {
            ids,
          },
        });
      }
    }
  }, [props.rows]);

  useEffect(() => {
    getStatus({
      variables: {
        esIndex: "contacts_flat",
        filterKey: "contactStatus.keyword",
        size: 50,
      }
    });
  }, []);

  // console.log('FISHBRAIN -1', props)

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
        {...props.esHocProps}
      />
    </Container>
  );
}

export default React.memo(TableESHOC(MapGridUnitTable), deepEqualObjects);
