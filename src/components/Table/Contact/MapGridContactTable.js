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
import TableHeader from 'components/Shared/constants/contacts-header-schema.js';

// Utilities
import { usetableStyles } from '../Styles';
import { getContactsAddress } from 'utils/helper';

function MapGridContactTable(props) {
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
		const updatedHits = hits.map(hit => {
			hit = getContactsAddress(props.setGenricData(hit, hit._id, ['tracks']));
			hit.tags = hit?.tags?.length > 0 ? [[hit.tags.map(tag => tag.tag)], hit.tags.length] : [[], 0];
			hit.commentsCounter = hit.comments ? hit.comments.length : 0;
			return hit;
		});
		return updatedHits;
	};

	useEffect(() => {
		setTableMeta({
			addableName: 'Contact',
			extendSearchQuery: searchInput,
			searchFields: ['name', '_all'],
			TableHeader: copy(TableHeader),
			esIndex: 'contacts_flat',
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

export default React.memo(TableESHOC(MapGridContactTable), deepEqualObjects);
