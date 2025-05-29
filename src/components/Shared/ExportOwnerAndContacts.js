import React, { useContext } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';

import { useApolloClient } from '@apollo/client';

import CloseIcon from 'components/Shared/svgIcons/KeyboardTabBlackIcon';

import { execCommonAsyncExportJobAction } from 'store/actions/commonActions';

import { AppContext } from 'AppContext';

const useStyles = makeStyles(() => ({
	root: {
		width: '557px',
		padding: '10px 30px',
	},
	title: {
		display: 'flex',
		justifyContent: 'space-between',
		width: '100%',
		alignItems: 'center',
		padding: '10px 0px',
		'& svg': {
			fill: '#757575 !important',
		},
	},
	fullWidth: {
		width: '100%',
	},
	field: {
		marginTop: 20,
	},
	bold: {
		fontWeight: 'bold',
	},
	value: {
		fontWeight: 'bold',
		alignSelf: 'center',
	},
	checkbox: {
		display: 'flex',
		justifyContent: 'space-between',
	},
}));

const ExportOwnerAndContacts = ({ isSelectAll, filters, esIndex, onClose, search, total, open, rows, type }) => {
	const classes = useStyles();
	const [stateApp, setStateApp] = useContext(AppContext);
	const client = useApolloClient();
	const dispatch = useDispatch();
	const { control } = useForm();

	const exportContacts = useWatch({
		control,
		name: 'exportContacts',
		defaultValue: false,
	});
	const exportInterestOwners = useWatch({
		control,
		name: 'exportInterestOwners',
		defaultValue: false,
	});

	const exportDisabled = !exportContacts && !exportInterestOwners;

	const onExport = () => {
		dispatch(
			execCommonAsyncExportJobAction.STARTED({
				jobType: 'EXPORTCSV',
				client,
				setStateApp,
				userId: stateApp.user.mongoId,
				requestPayload: {
					type,
					total,
					search,
					filters,
					esIndex,
					isSelectAll,
					ownerIds: rows.map(row => row._id),
					contactIds: rows.map(row => row.contactId),
					contactIdKey: 'contactId',
					datasets: {
						exportContacts: exportContacts,
						exportContactsPurchase: exportContacts,
						exportShapeInterestOwner: exportInterestOwners,
					},
					counts: {
						exportContacts: rows.length,
						exportContactsPurchase: rows.length,
						exportShapeInterestOwner: rows.length,
					},
				},
			})
		);
		setTimeout(() => {
			onClose();
		}, 2000);
	};

	return (
		<Drawer anchor="right" open={open}>
			<div className={classes.root}>
				<div className={classes.title}>
					<h1>Export Data to CSV</h1>
					<div style={{ cursor: 'pointer' }}>
						<IconButton size="small" onClick={onClose}>
							<CloseIcon />
						</IconButton>
					</div>
				</div>
				<label className={classes.bold}>Available Data Elements</label>

				<div className={classes.field}>
					<div className={classes.checkbox}>
						<div>
							<Controller
								control={control}
								name="exportInterestOwners"
								defaultValue={false}
								render={({ field }) => (
									<Checkbox
										{...field}
										disabled={rows.length === 0}
										onChange={e => {
											field.onChange(e.target.checked);
										}}
									/>
								)}
							/>
							<label className={classes.bold}>Unit Ownership Interest</label>
						</div>
						<label className={classes.value}>{rows.length} selected</label>
					</div>
				</div>

				<div className={classes.field}>
					<div className={classes.checkbox}>
						<div>
							<Controller
								control={control}
								name="exportContacts"
								defaultValue={false}
								render={({ field }) => (
									<Checkbox
										{...field}
										disabled={rows.length === 0}
										onChange={e => {
											field.onChange(e.target.checked);
										}}
									/>
								)}
							/>
							<label className={classes.bold}>Contact Data (Basic & Purchased Info)</label>
						</div>
						<label className={classes.value}>{rows.length} selected</label>
					</div>
				</div>
				<Box pt={6} mt={6} mb={6} mr={2}>
					<Grid container direction="row" justify="flex-end" alignItems="flex-end">
						<Grid item>
							<Button onClick={onClose}>Cancel</Button>
						</Grid>
						<Grid item>
							<Button
								variant="contained"
								component="span"
								style={{
									backgroundColor: exportDisabled ? '#D3D3D3' : '#00abed',
									color: exportDisabled ? '#999999' : 'white',
								}}
								onClick={onExport}
								disabled={exportDisabled}
							>
								Export
							</Button>
						</Grid>
					</Grid>
				</Box>
			</div>
		</Drawer>
	);
};

export default ExportOwnerAndContacts;
