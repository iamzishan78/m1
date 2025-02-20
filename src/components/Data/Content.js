import React from 'react';

import { Box } from '@mui/material';

import PropTypes from 'prop-types';

import MRTTable from 'components/MRTTable';

const Content = ({ path }) => {
	return (
		<Box
			sx={{
				margin: '5rem 1rem 1rem 1rem',
			}}
		>
			<MRTTable
				name={path.value}
				overrideMeta={{
					maxTableHeight: 'calc(100vh - 290px)',
				}}
			/>
		</Box>
	);
};

Content.propTypes = {
	path: PropTypes.object.isRequired,
};

export default Content;
