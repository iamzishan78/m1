import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';

export default function LandAppBar() {
	const { activeModule, quickActionsPanelState } = useSelector(({ common }) => common);

	return (
		<Grid
			container
			direction="row"
			display="flex"
			justifyContent="space-between"
			alignItems="center"
			style={{ marginLeft: quickActionsPanelState ? '433px' : '7px' }}
		>
			<Grid item md={8}>
				<Grid container direction="row" display="flex" justify="flex-start" alignItems="center">
					<Grid item md={2.5}>
						<Typography variant="h5" style={{ color: 'black', fontWeight: 'bold' }}>
							{activeModule.title} {activeModule.showSettingString && 'Settings'}
						</Typography>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
}
