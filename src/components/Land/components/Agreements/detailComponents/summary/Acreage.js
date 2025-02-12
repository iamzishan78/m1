import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';

import { Grid, makeStyles, Typography } from '@material-ui/core';

import _ from 'lodash';

import { StyledTextField } from '../style';

const useStyles = makeStyles(() => ({
	fieldContainer: { opacity: 0.7 },
	fieldText: {
		fontSize: '15px',
		fontWeight: 'bold',
	},
	acreageCard: {
		backgroundColor: '#F6F8F9',
		// paddingTop: "10px",
		marginTop: '8px',
		marginBottom: '8px',
		'& .heading': {
			fontWeight: 'bold',
			fontSize: 'larger',
		},
		'& .MuiGrid-item': {
			padding: '0px 5px',
			marginTop: '20px',
		},
		'& .MuiGrid-item:last-child': {},
	},
	mainCard: {
		paddingLeft: '5px',
	},
	lastChild: {
		marginBottom: '40px',
	},
}));

const Acreage = ({ properties }) => {
	const { control, reset } = useForm();
	const classes = useStyles();

	useEffect(() => {
		if (!_.isEmpty(properties)) {
			reset(properties);
		}
	}, [properties, reset]);
	return (
		<Grid item md={12} className={classes.acreageCard}>
			<Grid className={classes.mainCard} container display="row" alignItems="center">
				<Grid item xs={11} style={{ marginTop: 0 }}>
					<Grid container display="row" alignItems="center" justifyContent="space-between" spacing={3}>
						<Grid item xs={3}>
							<Typography className="heading"> Acreage</Typography>
						</Grid>
						<Grid item xs={3} className={classes.fieldContainer}>
							<Typography variant="h5" className={classes.fieldText}>
								Total
							</Typography>
						</Grid>
						<Grid item xs={3} className={classes.fieldContainer}>
							<Typography variant="h5" className={classes.fieldText}>
								Developed
							</Typography>
						</Grid>
						<Grid item xs={3} className={classes.fieldContainer}>
							<Typography variant="h5" className={classes.fieldText}>
								Undeveloped
							</Typography>
						</Grid>
					</Grid>
				</Grid>

				<Grid item xs={11}>
					<Grid container display="row" alignItems="center" justifyContent="space-between" spacing={3}>
						<Grid item xs={3} className={classes.fieldContainer}>
							<Typography variant="h5" className={classes.fieldText}>
								Report Gross
							</Typography>
						</Grid>
						<Grid item xs={3}>
							<Controller
								control={control}
								name="reportGrossAcres"
								defaultValue=""
								disabled
								render={({ field }) => <StyledTextField {...field} />}
							/>
						</Grid>
						<Grid item xs={3}>
							<Controller
								control={control}
								name="devReportGrossAcres"
								defaultValue=""
								disabled
								render={({ field }) => <StyledTextField {...field} />}
							/>
						</Grid>
						<Grid item xs={3}>
							<Controller
								control={control}
								name="undevReportGrossAcres"
								defaultValue=""
								disabled
								render={({ field }) => <StyledTextField {...field} />}
							/>
						</Grid>
					</Grid>
				</Grid>

				<Grid item xs={11}>
					<Grid container display="row" alignItems="center" justifyContent="space-between" spacing={3}>
						<Grid item xs={3} className={classes.fieldContainer}>
							<Typography variant="h5" className={classes.fieldText}>
								Gross
							</Typography>
						</Grid>
						<Grid item xs={3}>
							<Controller
								control={control}
								name="grossAcres"
								defaultValue=""
								disabled
								render={({ field }) => <StyledTextField {...field} />}
							/>
						</Grid>
						<Grid item xs={3}>
							<Controller
								control={control}
								name="devGrossAcres"
								defaultValue=""
								disabled
								render={({ field }) => <StyledTextField {...field} />}
							/>
						</Grid>
						<Grid item xs={3}>
							<Controller
								control={control}
								name="undevGrossAcres"
								defaultValue=""
								disabled
								render={({ field }) => <StyledTextField {...field} />}
							/>
						</Grid>
					</Grid>
				</Grid>

				<Grid item xs={11}>
					<Grid container display="row" alignItems="center" justifyContent="space-between" spacing={3}>
						<Grid item xs={3} className={classes.fieldContainer}>
							<Typography variant="h5" className={classes.fieldText}>
								Report Net
							</Typography>
						</Grid>
						<Grid item xs={3}>
							<Controller
								control={control}
								name="reportNet"
								defaultValue=""
								disabled
								render={({ field }) => <StyledTextField {...field} />}
							/>
						</Grid>
						<Grid item xs={3}>
							<Controller
								control={control}
								name="devReportNet"
								defaultValue=""
								disabled
								render={({ field }) => <StyledTextField {...field} />}
							/>
						</Grid>
						<Grid item xs={3}>
							<Controller
								control={control}
								name="undevReportNet"
								defaultValue=""
								disabled
								render={({ field }) => <StyledTextField {...field} />}
							/>
						</Grid>
					</Grid>
				</Grid>

				<Grid item xs={11}>
					<Grid container display="row" alignItems="center" justifyContent="space-between" spacing={3}>
						<Grid item xs={3} className={classes.fieldContainer}>
							<Typography variant="h5" className={classes.fieldText}>
								Net
							</Typography>
						</Grid>
						<Grid item xs={3}>
							<Controller
								control={control}
								name="netAcres"
								defaultValue=""
								disabled
								render={({ field }) => <StyledTextField {...field} />}
							/>
						</Grid>
						<Grid item xs={3}>
							<Controller
								control={control}
								name="devNetAcres"
								defaultValue=""
								disabled
								render={({ field }) => <StyledTextField {...field} />}
							/>
						</Grid>
						<Grid item xs={3}>
							<Controller
								control={control}
								name="undevNetAcres"
								defaultValue=""
								disabled
								render={({ field }) => <StyledTextField {...field} />}
							/>
						</Grid>
					</Grid>
				</Grid>

				<Grid item xs={11}>
					<Grid container display="row" alignItems="center" justifyContent="space-between" spacing={3}>
						<Grid item xs={3} className={classes.fieldContainer}>
							<Typography variant="h5" className={classes.fieldText}>
								Company Net
							</Typography>
						</Grid>
						<Grid item xs={3}>
							<Controller
								control={control}
								name="companyNetAcres"
								defaultValue=""
								disabled
								render={({ field }) => <StyledTextField {...field} />}
							/>
						</Grid>
						<Grid item xs={3}>
							<Controller
								control={control}
								name="devCompanyNetAcres"
								defaultValue=""
								disabled
								render={({ field }) => <StyledTextField {...field} />}
							/>
						</Grid>
						<Grid item xs={3}>
							<Controller
								control={control}
								name="undevCompanyNetAcres"
								defaultValue=""
								disabled
								render={({ field }) => <StyledTextField {...field} />}
							/>
						</Grid>
					</Grid>
				</Grid>

				<Grid item xs={11} className={classes.lastChild}>
					<Grid container display="row" alignItems="center" justifyContent="space-between" spacing={3}>
						<Grid item xs={3} className={classes.fieldContainer}>
							<Typography variant="h5" className={classes.fieldText}>
								Net Royalty Acres
							</Typography>
						</Grid>
						<Grid item xs={3}>
							<Controller
								control={control}
								name="netRoyalty"
								defaultValue=""
								disabled
								render={({ field }) => <StyledTextField {...field} />}
							/>
						</Grid>
						<Grid item xs={3}>
							<Controller
								control={control}
								name="devNetRoyalty"
								defaultValue=""
								disabled
								render={({ field }) => <StyledTextField {...field} />}
							/>
						</Grid>
						<Grid item xs={3}>
							<Controller
								control={control}
								name="undevNetRoyalty"
								defaultValue=""
								disabled
								render={({ field }) => <StyledTextField {...field} />}
							/>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default Acreage;
