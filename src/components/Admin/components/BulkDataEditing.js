import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Menu, MenuItem } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';

import { NavigationContext } from 'components/Navigation/NavigationContext';
import FeatureFlag from 'components/Shared/FeatureFlag/FeatureFlagComponent';
import { FEATURES } from 'components/Shared/FeatureFlag/common';
import { rawJobs } from 'components/BulkUpload/BulkUpload';
import BulkDataTable from 'components/Table/Jobs/BulkDataTable';

const useStyles = makeStyles(theme => ({
	root: {
		marginTop: 60,
		padding: '10px 5px',
	},
	createButton: { marginLeft: '30px', marginBottom: '30px' },
	table: { marginTop: '30px' },
}));

const BulkDataEditing = () => {
	const classes = useStyles();
	const history = useHistory();
	const [anchorEl, setAnchorEl] = useState(null);
	const [stateNav] = React.useContext(NavigationContext);

	const jobs = rawJobs.filter(job => {
		let filter = true;
		switch (job.type) {
			case 'CONTACTS':
				filter = stateNav.bulkUploadFromMap ? false : true;
				break;
			case 'CONTACTS_WELL_INTEREST':
				filter = stateNav.bulkUploadFromMap ? false : true;
				break;
			case 'PARCELINTERESTS':
				filter = stateNav.bulkUploadParcel ? true : false;
				break;
			case 'SHAPEOWNER':
				filter = stateNav.bulkUploadShape ? true : false;
				break;
			default:
				break;
		}
		return filter;
	});

	const handleClose = () => {
		setAnchorEl(null);
	};
	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};

	return (
		<div className={classes.root}>
			<Button
				className={classes.createButton}
				variant="contained"
				color="secondary"
				onClick={event => {
					handleClick(event);
				}}
			>
				Edit Data
			</Button>

			<Menu
				id="menu"
				keepMounted
				style={{ zIndex: '1305' }}
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={e => {
					e.stopPropagation();
					handleClose();
				}}
				getContentAnchorEl={null}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				transformOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				{jobs.map(job => (
					<FeatureFlag feature={FEATURES[job.featureFlag]} noCheck={!FEATURES[job.featureFlag]}>
						<MenuItem
							onClick={e => {
								e.stopPropagation();
								handleClose();
								history.push(`/bulkupload/${job.type.toLowerCase()}`);
							}}
						>
							{job.name}
						</MenuItem>
					</FeatureFlag>
				))}
			</Menu>
			<BulkDataTable parent="admin_panel" headerLabel="" />
		</div>
	);
};

export default BulkDataEditing;
