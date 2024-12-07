import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		justifyContent: 'space-between',
		width: '70%',
		alignItems: 'center',
		padding: '10px 0px',
	},
}));

const CampaignStatus = ({ status }) => {
	const classes = useStyles();
	const [isChecked, setCheckState] = useState(!!(status === 'Active'));

	return (
		<div className={classes.root}>
			<h4>{isChecked ? 'Active' : 'Inactive'}</h4>
			<div>
				<Switch checked={isChecked} onChange={() => setCheckState(!isChecked)} name="includeFilter" />
			</div>
		</div>
	);
};

export default CampaignStatus;
