import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { useLazyQuery } from '@apollo/client';
import moment from 'moment';

import MRTTable from 'components/MRTTable';

import { JOB_RESPONSE } from 'graphQL/useQueryJobResponse';

const useStyles = makeStyles(() => ({
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

	useEffect(() => {
		getJobResponse({
			variables: {
				jobId,
			},
		});
	}, [jobId]);

	const failedBulkOverrideMeta = useMemo(
		() => ({
			customProps: {
				jobId,
			},
		}),
		[jobId]
	);
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
						<MRTTable name="FailedBulkDataEditingTable" overrideMeta={failedBulkOverrideMeta} />
					)}
				</div>
			</Grid>
		</>
	);
};

export default BulkDataEditingDetail;
