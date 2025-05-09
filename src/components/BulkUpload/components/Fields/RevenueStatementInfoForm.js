import React, { useEffect } from 'react';
import { Grid, TextField, Select, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Controller } from 'react-hook-form';

import _ from 'lodash';
import { jobController } from 'stateManagement/jobStateController.js';

const useStyles = makeStyles(() => ({
	root: {
		padding: '10px 33%',
	},
	title: {
		textAlign: 'center',
		fontSize: '17px',
		fontWeight: 700,
		padding: '20px 0px',
	},
	gridStyle: {
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'row',
	},
	boldLabel: {
		fontWeight: 'bold',
	},
	dateRoot: {
		border: '1px solid #EBEBEB',
		backgroundColor: '#fff',
		'&.Mui-focused fieldset': {
			border: '1px solid black',
			backgroundColor: 'transparent',
		},
		'&:hover': {
			backgroundColor: '#EBEBEB',
		},
		'&:active': {
			border: '1px solid black',
			backgroundColor: '#fff',
		},
	},
}));

const RevenueStatementInfoForm = ({ ...rest }) => {
	const classes = useStyles();
	const { control, reset, getValues, uploaderFormValues } = rest;

	useEffect(() => {
		if (uploaderFormValues) reset(uploaderFormValues);
		return () => {
			const values = getValues();
			Object.keys(values).forEach(key => {
				if (typeof values[key] === 'object') {
					Object.keys(values[key]).forEach(vk => {
						values[`check.${key}.${vk}`] = values[key][vk];
					});
				} else {
					values[`check.${key}`] = values[key];
				}
			});

			jobController.updateState({
				uploaderFormValues: values,
			});
		};
	}, []);

	useEffect(() => {
		const importType = watch('importType');
		if (importType) {
			jobController.updateState({
				jobSubType: importType,
			});
		}
	}, [watch('importType')]);

	useEffect(() => {
		getPayorList({
			variables: {
				search: searchOperator ? `${searchOperator}*` : '*',
				filterKey: 'payor.name.keyword',
				esIndex: 'checks_flat',
				size: 50,
			},
		});
	}, [getPayorList, searchOperator]);

	useEffect(() => {
		const sortList = _.orderBy(payorListData?.getESFilterList?.hits, 'key', 'asc');
		if (sortList?.length > 0) {
			setPayyorList(sortList);
		} else {
			setPayyorList([]);
		}
	}, [payorListData]);

	return (
		<div className={classes.root}>
			<div className={classes.title}>Begin by entering the following statement information</div>
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<Grid
					container
					display="flex"
					direction="row"
					alignItems="center"
					style={{ padding: '10px 35px', maxWidth: '540px' }}
				>
					<Grid item sm={12} md={12}>
						<Grid container className={classes.gridStyle}>
							<Grid item xs={4}>
								<div className={classes.boldLabel}>Source ID</div>
							</Grid>
							<Grid item xs={8}>
								<Controller
									control={control}
									name="sourceId"
									defaultValue={''}
									render={({ field }) => (
										<TextField id="sourceId" {...field} fullWidth margin="dense" type="text" variant="outlined" />
									)}
								/>
							</Grid>
						</Grid>
					</Grid>
					<Grid item sm={12} md={12}>
						<Grid container className={classes.gridStyle} style={{ padding: '8px 0px 0px 0px' }}>
							<Grid item xs={4}>
								<div className={classes.boldLabel}>Import Type</div>
							</Grid>
							<Grid item xs={8}>
								<Controller
									control={control}
									name="importType"
									defaultValue="Standard M1 Import"
									render={({ field }) => (
										<Select {...field} fullWidth margin="dense" variant="outlined">
											<MenuItem value="Standard M1 Import">Standard M1 Import</MenuItem>
											<MenuItem value="CHECKDETAILSENERGY">EnergyLink Import</MenuItem>
										</Select>
									)}
								/>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</div>
		</div>
	);
};

export default RevenueStatementInfoForm;
