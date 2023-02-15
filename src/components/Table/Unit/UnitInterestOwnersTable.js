import React, { useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import debounce from 'lodash/debounce';
import { Container } from '@material-ui/core';
import { AppContext } from 'AppContext';
import Table from 'components/Shared/M1nTable/components/Table';
import TableHeader from 'components/Table/constants/units-interest-owners-header-schema';
import TableESHOC from 'components/Table/TableESHOC';
import { deepEqualObjects, copy, esExtentedSearch } from 'components/Shared/functions';
import { usetableStyles } from '../Styles';

const genericDataActions = ['tags', 'comments', 'tracks'];
function UnitInterestOwnersTable(props) {
  const classes = usetableStyles();
  const [stateApp] = useContext(AppContext);

  const userGridViewSettings = useSelector(({ session }) => session.userGridViewSettings);

  const GridViewModule = userGridViewSettings?.UnitInterest;
  const defaultView = {
    name: `All Unit Interest`,
    type: 'Default',
  };

  const searchInput = useSelector(state => state.MapGridCard.searchInputValue);

  const setTableMeta = React.useMemo(
    () =>
      debounce((request, top, callback) => {
        props.setTableMeta(request);
      }, 500),
    []
  );

  const formatHits = hits => {
    hits = hits.map(hit => {
      hit.tags =
        hit?.tags?.length > 0
          ? [[hit.tags.map(tag => tag.tag)], hit.tags.length]
          : [[], 0];
      hit._id = hit?.contact?._id
      hit.commentsCounter = hit.comments ? hit.comments.length : 0;
      hit.qualifier = hit?.shape?.shapeJson?.properties?.qualifier?.name;
      hit.reviewer = hit?.shape?.shapeJson?.properties?.reviewer?.name;
      hit.uUnitPricing = hit?.shape?.shapeJson?.properties?.uUnitPricing;
      hit.uNumber = hit?.shape?.shapeJson?.properties?.uNumber
      hit.shapeArea = hit?.shape?.shapeJson?.properties?.shapeArea

      hit.contactStatus = hit?.contact?.contactStatus
      hit = props.setGenricData(hit, hit.id, genericDataActions, genericDataActions);
      return hit;
    });
    return hits;
  };

  useEffect(() => {
    setTableMeta({
      extendSearchQuery: esExtentedSearch(props.landSearchQuery, searchInput),
      searchFields: [
        'contact.entityDetail.name.keyword',
        'shape.shapeJson.properties.uName.keyword',
        'shape.shapeJson.properties.uNumber.keyword',
        'shape.shapeJson.properties.shapeArea.keyword',
        'working_interest',
        'royalty_interest',
        'orri',
        'nra',
        'shape.shapeJson.properties.uUnitPricing.keyword',
        'offer_price',
        'contact.contactStatus.keyword',
        'campaignName.keyword',
        'shape.shapeJson.properties.reviewer.name.keyword',
        'shape.shapeJson.properties.qualifier.name.keyword',
      ],
      TableHeader: copy(TableHeader),
      esIndex: 'shapeowners_flat',
      selectedGridView: GridViewModule || defaultView,
      typeKeyword: { gridViewCategory: 'UnitInterest' },
      startPaginationAt: 50,
      filters: [
        {
          field: 'shape.layer.keyword',
          value: 'unit',
        },
      ],

      defaultSort: { field: '_ts', order: 'desc' },
      polygon: stateApp?.currentFeature?.geometry && {
        type: 'geo_intersects',
        field: 'geoJSON',
        value: stateApp?.currentFeature?.geometry,
      },
      formatHits,
      downloadAll: { exportPx: '121px' }
    });
    // eslint-disable-next-line
  }, [searchInput, props.landSearchQuery, userGridViewSettings]);

  return (
    <Container
      maxWidth={false}
      className={classes.container}
      id={props.id ? props.id : props.parent}
    >
      <Table
        style={{ backgroundColor: '#fff' }}
        header={props.header}
        columns={props.columns}
        rows={props.rows}
        total={false}
        addAble={{ type: 'UnitInterests' }}
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

export default React.memo(TableESHOC(UnitInterestOwnersTable), deepEqualObjects);
