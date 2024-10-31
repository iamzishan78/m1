import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import get from 'lodash/get';

import { JOB_RESPONSE } from 'graphQL/useQueryJobResponse';

import { useLazyQuery } from '@apollo/client';

import Table from 'components/Shared/M1nTable/components/Table';
import { useParams } from 'react-router-dom';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
	container: {
		width: '100%',
		'& .MuiToolbar-root': {
			display: 'none',
		},
	},
}));

const BulkDataEditingDetail = () => {
	let { jobId } = useParams();

	const classes = useStyles();
	const [getJobResponse, { data: jobResponseData }] = useLazyQuery(JOB_RESPONSE);
	const [uploadedData, setUploadedData] = useState([]);

	useEffect(() => {
		getJobResponse({
			variables: {
				jobId,
			},
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [jobId]);

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
			<Grid container direction="row" display="flex" style={{ padding: 25, marginTop: 50 }}>
				<Grid item xs={6} style={{ padding: 5 }}>
					<Grid container>
						<Grid item xs={3}>
							<span style={{ fontWeight: 'bold', fontSize: 14, marginRight: 20 }}>Name</span>
						</Grid>
						<Grid item xs={6}>
							{jobResponseData?.getJobResponse?.name}
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={6} style={{ padding: 5 }}>
					<Grid container>
						<Grid item xs={3}>
							<span style={{ fontWeight: 'bold', fontSize: 14, marginRight: 20 }}>Edited On</span>
						</Grid>
						<Grid item xs={6}>
							{jobResponseData?.getJobResponse?.editedOn || jobResponseData?.getJobResponse?.ts
								? moment(jobResponseData?.getJobResponse?.editedOn || jobResponseData.getJobResponse?.ts).format(
										'MM/DD/YYYY'
									)
								: ''}

							{}
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={6} style={{ padding: 5 }}>
					<Grid container>
						<Grid item xs={3}>
							<span style={{ fontWeight: 'bold', fontSize: 14, marginRight: 20 }}>Type</span>
						</Grid>
						<Grid item xs={6}>
							{jobResponseData?.getJobResponse?.type}
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={6} style={{ padding: 5 }}>
					<Grid container>
						<Grid item xs={3}>
							<span style={{ fontWeight: 'bold', fontSize: 14, marginRight: 20 }}>Edited By</span>
						</Grid>
						<Grid item xs={6}>
							{jobResponseData?.getJobResponse?.editedBy}
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={6} style={{ padding: 5 }}>
					<Grid container>
						<Grid item xs={3}>
							<span style={{ fontWeight: 'bold', fontSize: 14, marginRight: 20 }}>Status</span>
						</Grid>
						<Grid item xs={6}>
							{jobResponseData?.getJobResponse?.status}
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={6} style={{ padding: 5 }}>
					<Grid container>
						<Grid item xs={3}>
							<span style={{ fontWeight: 'bold', fontSize: 14, marginRight: 20 }}>Progress</span>
						</Grid>
						<Grid item xs={6}>
							{jobResponseData?.getJobResponse
								? `${(jobResponseData.getJobResponse.progress / jobResponseData.getJobResponse.totalProgress) * 100} %`
								: ''}
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			<Grid container direction="row" display="flex" style={{ padding: 25 }}>
				<div className={classes.container}>
					{jobResponseData?.getJobResponse?.status?.toLowerCase().includes('fail') && (
						<Table
							style={{ backgroundColor: '#fff' }}
							header={null}
							columns={columns}
							rows={uploadedData}
							total={uploadedData.length}
							startPaginationAt={25}
						/>
					)}
				</div>
			</Grid>
		</>
	);
};

export default BulkDataEditingDetail;
