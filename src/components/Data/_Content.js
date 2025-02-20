import React from 'react';

import { Box } from '@mui/material';

import PropTypes from 'prop-types';

import MRTTable from 'components/MRTTable';

import ShapeFile from './ShapeFile';

const typeMaapping = {
	PlatformWells: 'WellsTable',
	Agreements: 'AgreementTable',
	Units: 'UnitTable',
	Tracts: 'TractsTable',
	MyWells: 'MyWellsTable',
	ShapeFile: 'shapeFile',
};

const _Content = ({ type }) => {
	const mappedType = typeMaapping[type];

	if (!mappedType) {
		return null;
	}

	if (mappedType === 'shapeFile') {
		return <ShapeFile />;
	}

	return (
		<Box
			sx={{
				margin: '5rem 1rem 1rem 1rem',
			}}
		>
			<MRTTable
				name={mappedType}
				overrideMeta={{
					maxTableHeight: 'calc(100vh - 290px)',
				}}
			/>
		</Box>
	);
};

_Content.propTypes = {
	type: PropTypes.string.isRequired,
};

export default _Content;
