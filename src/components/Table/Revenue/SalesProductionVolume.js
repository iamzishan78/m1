import React, { useEffect } from 'react';
import get from 'lodash/get';
// context
import { Container } from '@material-ui/core';
import Table from 'components/Shared/M1nTable/components/Table';
import TableESHOC from 'components/Table/TableESHOC';
import moment from 'moment';

import { deepEqualObjects, copy } from 'components/Shared/functions';

// Header Schemas
import TableHeader from 'components/Table/constants/sales-production-header-schema';

// Utilities
import { usetableStyles } from '../Styles';

function SalesProductionVolumeTable(props) {
	const classes = usetableStyles();

	const formatHits = hits => {
		return hits.map(hit => {
			hit.propertyNumber = hit.property.number;
			hit.propertyName = hit.property.name;
			hit.apiNumber = get(hit, 'wells', []).map(w => w.apiNumber);
			hit.wellName = get(hit, 'wells', []).map(w => w.wellName);
			let pVolume = 0;
			get(hit, 'wells', []).forEach(well => {
				const prod = well.production.find(
					p => moment(p.data.ReportDate).format('MM/yyyy') === moment(hit.date).format('MM/yyyy')
				);
				if (prod)
					pVolume =
						pVolume + prod.data[`allocated${hit.product.charAt(0).toUpperCase() + hit.product.slice(1).toLowerCase()}`];
			});
			hit.statementVolume = hit.grossPropertyVolume;
			hit.reportedVolume = pVolume;
			hit.overShort = hit.statementVolume - pVolume;
			hit.difference = pVolume > 0 ? `${Math.round((hit.overShort * 100) / pVolume)}%` : null;
			return hit;
		});
	};

	const getFilters = () => {
		return props.propertyId ? [{ field: 'property._id.keyword', value: props.propertyId }] : [];
	};

	useEffect(() => {
		if (props.propertyId) {
			props.setTableMeta({
				filters: getFilters(),
				TableHeader: copy(TableHeader),
				esIndex: 'checkdetails_flat',
				startPaginationAt: 25,
				formatHits,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.propertyId]);

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

export default React.memo(TableESHOC(SalesProductionVolumeTable), deepEqualObjects);
