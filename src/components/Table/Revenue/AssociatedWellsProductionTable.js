import React, { useEffect } from 'react';
import moment from 'moment';
// context
import { Container } from '@material-ui/core';
import Table from 'components/Shared/M1nTable/components/Table';
import TableESHOC from 'components/Table/TableESHOC';

import { deepEqualObjects, copy } from 'components/Shared/functions';

// Header Schemas
import TableHeader from 'components/Table/constants/production-detail-header-schema';

// Utilities
import { usetableStyles } from '../Styles';

function AssociatedWellsProductionTable(props) {
	const classes = usetableStyles();

	const formatHits = hits => {
		return hits.map(hit => {
			return { ...hit.data, ReportDate: moment(hit.data.ReportDate).format('MM/YYYY'), sort: hit.sort };
		});
	};

	const getFilters = () => {
		return props.associatedWellIds.length > 0
			? [{ field: 'well._id.keyword', value: props.associatedWellIds, onlyInclude: true }]
			: [];
	};

	useEffect(() => {
		if (props.associatedWellIds.length > 0) {
			props.setTableMeta({
				searchFields: ['_all'],
				filters: getFilters(),
				TableHeader: copy(TableHeader),
				esIndex: 'mywellproduction_flats',
				startPaginationAt: 25,
				defaultSort: { field: 'data.ReportDate', order: 'desc' },
				formatHits,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.associatedWellIds]);

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
				options={props.options}
				parent={props.parent}
				setColumnsBase={[]}
				{...props.esHocProps}
			/>
		</Container>
	);
}

export default React.memo(TableESHOC(AssociatedWellsProductionTable), deepEqualObjects);
