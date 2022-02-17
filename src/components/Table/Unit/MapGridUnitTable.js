
import React, { useEffect } from "react";
import { Container } from "@material-ui/core";
import { useSelector } from "react-redux";
import debounce from "lodash/debounce";
import { useLazyQuery } from "@apollo/client";

// context
import TableESHOC from "components/Table/TableESHOC";
import Table from "components/Shared/M1nTable/components/Table";

// QUERIES
import { GET_SHAPE_OWNERS_DATA_BY_ID } from "graphQL/useQueryShapeOwnersDataById";
import { deepEqualObjects, copy } from "components/Shared/functions";

// Header Schemas
import TableHeader from "components/Table/constants/map-grid-unit-header-schema";

// Utilities
import { usetableStyles } from "../Styles";

function MapGridUnitTable(props) {
  const classes = usetableStyles();
  const searchInput = useSelector(
    (state) => state.MapGridCard.searchInputValue
  );

  const [getShapeOwnerDataById, { data: owners }] = useLazyQuery(GET_SHAPE_OWNERS_DATA_BY_ID, { fetchPolicy: "no-cache" });

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
      hit = props.setGenricData(hit, hit.id, [], []);
      return hit;
    });
    return hits
  }

  useEffect(() => {
    setTableMeta({
      addableName: "Unit",
      extendSearchQuery: `layer:unit AND (name:${searchInput}* OR shapeJson.properties.uNumber:${searchInput}*)`,
      TableHeader: copy(TableHeader),
      esIndex: "shapes_flat",
      startPaginationAt: 25,
      formatHits,
    });
    // eslint-disable-next-line
  }, [
    searchInput,
  ]);

  useEffect(() => {
    if(owners?.getShapeOwnerDataById){
      const rows = JSON.parse(JSON.stringify(props.rows))
      for(let i=0; i<rows.length; i++){
        rows[i].ownersCount = owners?.getShapeOwnerDataById[rows[i]._id].total
      }
      props.setRows(rows)
    }
  },[owners])
  
  useEffect(() => {
      if(props.rows.length > 0) {
        const ids = props.rows.filter(row => typeof row.ownersCount !== 'number').map(row => row._id)
        if(ids.length > 0){
          getShapeOwnerDataById({
            variables: {
                ids
            }
        })
        }
      }
  },[props.rows])

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

export default React.memo(TableESHOC(MapGridUnitTable), deepEqualObjects);
