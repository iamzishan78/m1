import React, { useEffect } from 'react';
import { Container } from '@material-ui/core';
import { useSelector } from 'react-redux';
import debounce from 'lodash/debounce';

// context
import TableESHOC from 'components/Table/TableESHOC';
import Table from 'components/Shared/M1nTable/components/Table';

// QUERIES
import { deepEqualObjects, copy } from 'components/Shared/functions';

// Header Schemas
import TableHeader from 'components/Table/constants/map-grid-operator-header-schema';

// Utilities
import { usetableStyles } from '../Styles';

function MapGridOperatorTable(props) {
	const classes = usetableStyles();
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
		return hits;
	};

	useEffect(() => {
		setTableMeta({
			addableName: 'Operator',
			extendSearchQuery: searchInput,
			searchFields: ['operator', '_all'],
			TableHeader: copy(TableHeader),
			esIndex: 'platformData:operator',
			startPaginationAt: 25,
			formatHits,
		});
		// eslint-disable-next-line
	}, [searchInput]);

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

export default React.memo(TableESHOC(MapGridOperatorTable), deepEqualObjects);
