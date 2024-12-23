import React, { memo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Menu, MenuItem, Button, ButtonGroup } from '@material-ui/core';

import { rawJobs } from 'components/BulkUpload/BulkUpload';
import { FEATURES } from 'components/Shared/FeatureFlag/common';
import { NavigationContext } from 'components/Navigation/NavigationContext';
import FeatureFlag from 'components/Shared/FeatureFlag/FeatureFlagComponent';

const BulkDataEditingToolBar = () => {
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
		<>
			<ButtonGroup variant="contained" color="primary" aria-label="split button">
				<Button
					id="addBulkData"
					color="primary"
					size="small"
					aria-label="select merge strategy"
					aria-haspopup="menu"
					style={{ height: '30px', marginBottom: '8px' }}
					onClick={handleClick}
				>
					+ ADD BULK DATA
				</Button>
			</ButtonGroup>

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
		</>
	);
};

export default memo(BulkDataEditingToolBar);
