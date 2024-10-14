import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Menu, MenuItem } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import get from 'lodash/get';

import { NavigationContext } from 'components/Navigation/NavigationContext';
import FeatureFlag from 'components/Shared/FeatureFlag/FeatureFlagComponent';
import { FEATURES } from 'components/Shared/FeatureFlag/common';
import { rawJobs } from 'components/BulkUpload/BulkUpload';
import BulkDataTable from 'components/Table/Jobs/BulkDataTable';
import { JOB_RESPONSE } from 'graphQL/useQueryJobResponse';

import { useLazyQuery } from '@apollo/client';

import Table from 'components/Shared/M1nTable/components/Table';
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
	const [stateNav, setStateNav] = React.useContext(NavigationContext);
	// const [createJob, { data: createJobData }] = useMutation(CREATE_JOB);
	const [failedJob, setFailedJob] = useState(null);

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
			{!failedJob ? (
				<>
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
					<BulkDataTable setFailedJob={setFailedJob} parent="admin_panel" headerLabel="" />
				</>
			) : (
				<>
					<FailedDetails failedJob={failedJob} />
				</>
			)}
		</div>
	);
};

export default BulkDataEditing;

const useTableStyles = makeStyles(theme => ({
	container: {
		width: '100%',
		'& .MuiToolbar-root': {
			display: 'none',
		},
	},
}));

const FailedDetails = ({ failedJob }) => {
	const classes = useTableStyles();
	const [getJobResponse, { data: jobResponseData }] = useLazyQuery(JOB_RESPONSE);
	const [uploadedData, setUploadedData] = useState([]);

	useEffect(() => {
		getJobResponse({
			variables: {
				jobId: failedJob._id,
			},
		});
	}, []);

	useEffect(() => {
		if (jobResponseData?.getJobResponse?.uploadedData) {
			const data = get(jobResponseData, 'getJobResponse.uploadedData', []).map(d => {
				return {
					...d,
					index: get(d, 'index', 0) + 1,
					name:
						get(d, 'entityDetail.name', '') ||
						get(d, 'entityDetail.firstName', '') ||
						get(d, 'entityDetail.lastName', ''),
				};
			});
			setUploadedData(data);
		}
	}, [jobResponseData]);

	const columns = [
		{
			name: 'name',
			label: 'Column',
		},
		{
			name: 'index',
			label: 'Cell',
		},
		{
			name: 'reason',
			label: 'Error Description',
		},
	];
	return (
		<>
			<Grid container direction="row" display="flex" style={{ padding: 25 }}>
				<Grid item xs={6} style={{ padding: 5 }}>
					<Grid container>
						<Grid item xs={3}>
							<span style={{ fontWeight: 'bold', fontSize: 14, marginRight: 20 }}>Name</span>
						</Grid>
						<Grid item xs={6}>
							{failedJob.name}
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={6} style={{ padding: 5 }}>
					<Grid container>
						<Grid item xs={3}>
							<span style={{ fontWeight: 'bold', fontSize: 14, marginRight: 20 }}>Edited On</span>
						</Grid>
						<Grid item xs={6}>
							{failedJob.editedOn}
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={6} style={{ padding: 5 }}>
					<Grid container>
						<Grid item xs={3}>
							<span style={{ fontWeight: 'bold', fontSize: 14, marginRight: 20 }}>Type</span>
						</Grid>
						<Grid item xs={6}>
							{failedJob.type}
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={6} style={{ padding: 5 }}>
					<Grid container>
						<Grid item xs={3}>
							<span style={{ fontWeight: 'bold', fontSize: 14, marginRight: 20 }}>Edited By</span>
						</Grid>
						<Grid item xs={6}>
							{failedJob.editedBy}
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={6} style={{ padding: 5 }}>
					<Grid container>
						<Grid item xs={3}>
							<span style={{ fontWeight: 'bold', fontSize: 14, marginRight: 20 }}>Status</span>
						</Grid>
						<Grid item xs={6}>
							{failedJob.status}
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			<Grid container direction="row" display="flex" style={{ padding: 25 }}>
				<div className={classes.container}>
					<Table
						style={{ backgroundColor: '#fff' }}
						header={null}
						columns={columns}
						rows={uploadedData}
						total={uploadedData.length}
						startPaginationAt={25}
					/>
				</div>
			</Grid>
		</>
	);
};
