import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import FormLabel from '@material-ui/core/FormLabel';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import KeyboardTabIcon from '@material-ui/icons/KeyboardTab';

import { useMutation } from '@apollo/client';

import joinAddress from 'components/Shared/valueformatters/join-address.js';

import { UPLOADRECIPIENTS } from 'graphQL/useMutationUploadStorefrontRecipientsList';

import { globalStateController } from 'hookstate/globalStateController';

import { Modals } from 'styles/Modal';

import { showSuccessMessage, showErrorMessage } from 'actions';

const styles = theme => ({
	root: {
		marginLeft: 20,
		marginTop: 5,
		padding: theme.spacing(2),
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500],
	},
	dialogTitle: {
		padding: '25px',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
});

const DialogTitle = withStyles(styles)(props => {
	const { children, classes, onClose, ...other } = props;
	return (
		<MuiDialogTitle disableTypography className={classes.dialogTitle} {...other}>
			<Typography variant="h5" style={{ fontWeight: 'bold' }}>
				{children}
			</Typography>
			{onClose ? (
				<IconButton aria-label="close" onClick={onClose}>
					<KeyboardTabIcon fontSize="large" />
				</IconButton>
			) : null}
		</MuiDialogTitle>
	);
});

export default function SendMailersDialogContent(props) {
	const dispatch = useDispatch();
	const modalClass = Modals();

	const [campaign, setCampaign] = useState('');
	const [rowsLoading, setRowsLoading] = useState(false);

	const [uploadRecipients] = useMutation(UPLOADRECIPIENTS, {
		onCompleted: data => {
			window.open(data.uploadStorefrontRecipientsList.link, '_blank');
		},
	});

	useEffect(() => {
		if (!props.rows || props.rows.length === 0) {
			setRowsLoading(true);
		} else {
			setRowsLoading(false);
		}
	}, [props.rows]);

	const { user } = globalStateController.useState(['user']);
	const getUser = user;

	useEffect(() => {
		if (props?.campaign?.name !== '') {
			setCampaign(props?.campaign?.name);
		}
	}, [props.campaign]);
	const runStorefront = () => {
		if (campaign.trim() === '') {
			dispatch(showErrorMessage('Please fill Campaign Name'));
			return;
		}
		uploadRecipients({
			variables: {
				campaign: campaign,
				email: getUser?.email,
				recipients: props.rows.map(row => row._id),
			},
		});
		props.onClose();
		dispatch(showSuccessMessage('Redirecting...'));
	};

	return (
		<React.Fragment>
			{rowsLoading ? (
				<div className={modalClass.loaderWrapper}>
					<CircularProgress color="secondary" className={modalClass.loader} size={80} disableShrink />
				</div>
			) : (
				<>
					<DialogTitle styles={{ backgroundColor: '#fff' }} id="customized-dialog-title" onClose={props.onClose}>
						New Mailer Campaign
					</DialogTitle>
					<DialogContent>
						<Grid container spacing={1}>
							<Grid item xs={12}>
								<h3 style={{ padding: 0, marginTop: '40px', marginBottom: 0, marginLeft: 15 }}>Campaign Name</h3>
							</Grid>
							<Grid item xs={12}>
								<TextField
									margin="none"
									placeholder="Enter a campaign name"
									style={{ width: '96%', marginBottom: '10px', marginLeft: 15 }}
									value={campaign}
									onChange={e => {
										setCampaign(e.target.value);
									}}
								/>
							</Grid>
							<Grid item xs={12} style={{ marginTop: '40px' }}>
								<h3 style={{ margin: '0', marginLeft: 15 }}>Mailing List</h3>
							</Grid>
							<Grid item xs={12} style={{ margin: 0, paddingTop: 0, marginLeft: 15 }}>
								<FormLabel>{props.rows && props.rows.length ? props.rows.length : ''} selected</FormLabel>
							</Grid>
							{props.rows &&
								props.rows.map((row, index) => (
									<Grid item xs={12} className={modalClass.inputContainer}>
										<FormLabel className={modalClass.inputLabel}>{row.name}</FormLabel>
										<FormLabel className={modalClass.inputLabel}>{joinAddress(row)}</FormLabel>
										<FormLabel className={modalClass.inputContent}>
											<DeleteOutlinedIcon
												fontSize="small"
												style={{ cursor: 'pointer', float: 'right' }}
												onClick={() => {
													let reducedRows = [...props.rows];
													reducedRows.splice(index, 1);
													props.setRows(reducedRows);

													if (reducedRows.length === 0) {
														props.onClose();
													}
												}}
											/>
										</FormLabel>
									</Grid>
								))}
						</Grid>
					</DialogContent>
					<DialogActions className={modalClass.actionButtons}>
						<Button
							onClick={() => {
								props.onClose();
							}}
							color="primary"
						>
							Cancel
						</Button>
						<Button onClick={() => runStorefront()} color="secondary" variant="contained">
							Continue to Send Mailers
						</Button>
					</DialogActions>
				</>
			)}
		</React.Fragment>
	);
}
