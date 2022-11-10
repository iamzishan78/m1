import React, { useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import debounce from "lodash/debounce";
import { Container } from "@material-ui/core";
import { AppContext } from "AppContext";
import Table from "components/Shared/M1nTable/components/Table";
import TableHeader from "components/Table/constants/tract-interests-header-schema";
import TableESHOC from "components/Table/TableESHOC";
import { deepEqualObjects, copy, esExtentedSearch } from "components/Shared/functions";
import { usetableStyles } from "../Styles";

const genericDataActions = ['tags', 'comments', 'tracks']
function TractInterestTable(props) {
  const classes = usetableStyles();
  const [stateApp] = useContext(AppContext);

  const userGridViewSettings = useSelector(({ session }) => session.userGridViewSettings);
  const GridViewModule = userGridViewSettings?.TractInterest
  const defaultView = {
    name: `All Tracts Interest`,
    type: "Default",
  };

  const searchInput = useSelector(
    (state) => state.MapGridCard.searchInputValue
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
      hit.tags =
        hit?.tags?.length > 0
          ? [[hit.tags.map((tag) => tag.tag)], hit.tags.length]
          : [[], 0];
      hit.commentsCounter = hit.comments ? hit.comments.length : 0;
      hit = props.setGenricData(hit, hit.id, genericDataActions, genericDataActions);
      return hit;
    });
    return hits
  }

  useEffect(() => {
    setTableMeta({
      extendSearchQuery: esExtentedSearch(props.landSearchQuery, searchInput),
      searchFields: ["*"],
      TableHeader: copy(TableHeader),
      esIndex: "shapeowners_flat",
      selectedGridView: GridViewModule || defaultView,
      typeKeyword: { gridViewCategory: "TractInterest" },
      startPaginationAt: 10,
      filters: [
        {
          field: "shape.layer.keyword",
          value: "parcel",
        },
      ],

      defaultSort: { field: '_ts', order: 'desc' },
      polygon: stateApp?.currentFeature?.geometry && {
        type: "geo_intersects",
        field: "geoJSON",
        value: stateApp?.currentFeature?.geometry
      },
      formatHits,
    });
    // eslint-disable-next-line
  }, [searchInput, props.landSearchQuery, userGridViewSettings]);

  useEffect(() => {
    props?.onTractCount && props?.onTractCount(props?.options?.count || 0);
  }, [props?.options?.count])

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
        addAble={{ type: "TractInterests" }}
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

export default React.memo(TableESHOC(TractInterestTable), deepEqualObjects);
