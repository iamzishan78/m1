import React from 'react';
import { useSelector } from 'react-redux';

import { Grid, Typography } from '@material-ui/core';

const DataAppBar = () => {
	const { quickActionsPanelState, activeModule } = useSelector(({ common }) => common);

	return (
		<Grid
			container
			direction="row"
			display="flex"
			justifyContent="space-between"
			alignItems="center"
			style={{
				marginLeft: quickActionsPanelState ? '433px' : '0px', // Adjust header position on toggling sidebar
			}}
		>
			{activeModule?.title && (
				<Typography variant="h5" style={{ color: 'black', fontWeight: 'bold', marginRight: '20px' }}>
					{activeModule.title + ' Data'}
				</Typography>
			)}
		</Grid>
	);
};

export default DataAppBar;
