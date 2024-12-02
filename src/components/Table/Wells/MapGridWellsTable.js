import React, { useEffect, useContext } from 'react';
import { Container } from '@material-ui/core';
import { useSelector } from 'react-redux';
import debounce from 'lodash/debounce';

// context
import { AppContext } from 'AppContext';
import TableESHOC from 'components/Table/TableESHOC';
import Table from 'components/Shared/M1nTable/components/Table';
import { NavigationContext } from 'components/Navigation/NavigationContext';

// QUERIES
import { deepEqualObjects, copy } from 'components/Shared/functions';

// Header Schemas
import TableHeader from 'components/Table/constants/map-grid-wells-header-schema';

// Utilities
import { usetableStyles } from '../Styles';
import { getMapFilters } from 'utils/helper';

const genericDataActions = ['tags', 'comments', 'tracks'];

function MapGridWellsTable(props) {
	const classes = usetableStyles();
	const searchInput = useSelector(state => state.MapGridCard.searchInputValue);
	const [stateNav] = useContext(NavigationContext);
	const [stateApp] = useContext(AppContext);

	const formatColumns = (headers, hits) => {
		if (stateNav.operatorName?.length > 0) {
			const index = headers.findIndex(header => header.name === 'operator');
			headers[index].options.display = true;
		}
		if (stateNav.profileName?.length > 0) {
			const index = headers.findIndex(header => header.name === 'wellBoreProfile');
			headers[index].options.display = true;
		}
		return headers;
	};

	const formatHits = hits => {
		hits = hits.map(hit => {
			hit.coordinates = {};
			if (hit.Longitude && hit.Latitude) {
				hit.coordinates.center = [hit.Longitude, hit.Latitude];
				hit.coordinates.wellId = hit.Id;
			}
			hit.globalWell = hit.Id;
			hit = props.setGenricData(hit, hit.id, genericDataActions, genericDataActions);
			return hit;
		});
		return hits;
	};

	const setTableMeta = React.useMemo(
		() =>
			debounce((request, top, callback) => {
				props.setTableMeta(request);
			}, 500),
		// eslint-disable-next-line
		[]
	);

	useEffect(() => {
		const { filters } = getMapFilters(stateNav, '', stateApp.gridPolygonString, 'simple');
		setTableMeta({
			addBtnText: 'Well',
			extendSearchQuery: searchInput,
			searchFields: ['wellName', 'api'],
			filters,
			polygon: stateApp?.currentFeature?.geometry && {
				type: 'geo_intersects',
				field: 'geoJSON',
				value: stateApp?.currentFeature?.geometry,
			},
			TableHeader: copy(TableHeader),
			esIndex: 'platformData:wells',
			startPaginationAt: 25,
			formatColumns,
			formatHits,
			initializeGenericData: { key: 'id', actions: genericDataActions },
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
		stateNav.stateName,
		stateNav.countyName,
		stateApp.gridPolygonString,
		stateNav.completetionDateFrom,
		stateNav.completetionDateTo,
		stateNav.firstProdDateFrom,
		stateNav.firstProdDateTo,
	]);

	return (
		<Container maxWidth={false} className={classes.container} id={props.id ? props.id : props.parent}>
			<Table
				style={{ backgroundColor: '#fff' }}
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

export default React.memo(TableESHOC(MapGridWellsTable), deepEqualObjects);
