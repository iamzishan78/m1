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

const genericDataActions = ['comments', 'tracks'];
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
      hit._id = hit?.contact?._id
      hit.commentsCounter = hit.comments ? hit.comments.length : 0;
      hit.qualifier = hit?.shape?.shapeJson?.properties?.qualifier?.name;
      hit.reviewer = hit?.shape?.shapeJson?.properties?.reviewer?.name;
      hit.uUnitPricing = hit?.shape?.shapeJson?.properties?.uUnitPricing;
      //remove until max offer price logic is fixed
      //hit.uMaxUnitPricing = hit?.shape?.shapeJson?.properties?.uMaxUnitPricing;
      hit.uNumber = hit?.shape?.shapeJson?.properties?.uNumber;
      hit.shapeArea = hit?.shape?.shapeJson?.properties?.shapeArea;
      hit.uAcres = hit?.shape?.shapeJson?.properties?.uAcres;

      hit.contactStatus = hit?.contact?.contactStatus;
      hit.status = hit?.contact?.status;
      hit.block = hit?.shape?.shapeJson?.properties?.originalProperties?.Block;
      hit.township = hit?.shape?.shapeJson?.properties?.originalProperties?.Township;
      hit.description = hit?.shape?.shapeJson?.properties?.description;
      hit.contactOwners = (hit?.contactOwners && hit?.contactOwners.length > 0) ? Array.isArray(hit?.contactOwners) ? hit?.contactOwners[0] : hit?.contactOwners : null;

      if (hit?.tags?.length > 0) {
        const tags = hit.tags.map((tag) => tag.tag);
        if (tags[0]) {
          hit.tags = [[tags], hit.tags.length];
        }
      } else {
        hit.tags = [[], 0];
      }

      hit = props.setGenricData(hit, hit.id, genericDataActions, genericDataActions);

      return hit;
    });
    return hits;
  };

  useEffect(() => {
    const search = esExtentedSearch(props.landSearchQuery, searchInput)

    props.setInitialFilters([
      {
        field: 'shape.layer.keyword',
        value: 'unit',
      },
      ...(props.campaignName ? [{
        field: 'campaignName.keyword',
        value: props.campaignName
      }] : [])
    ]);

    setTableMeta({
      extendSearchQuery: isNaN(parseFloat(search.replaceAll('*', ''))) ? search : search.replaceAll('*', ''),
      TableHeader: copy(TableHeader(!!props.isSnapGrid)),
      esIndex: 'shapeowners_flat',
      selectedGridView: GridViewModule || defaultView,
      typeKeyword: { gridViewCategory: 'UnitInterest' },
      startPaginationAt: 50,
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
  }, [searchInput, props.landSearchQuery, userGridViewSettings, props.campaignName]);

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
