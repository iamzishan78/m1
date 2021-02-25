import React, { useEffect, useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useMutation } from '@apollo/client';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { Modals } from '../../../../../styles/Modal';
import DialogActions from '@material-ui/core/DialogActions';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import Close from '@material-ui/icons/Close';
import { AppContext } from '../../../../../AppContext';
import { showSuccessMessage, showErrorMessage } from '../../../../../actions';
import { UPLOADRECIPIENTS } from '../../../../../graphQL/useMutationUploadStorefrontRecipientsList';

// import value formatters
import capitalizeFirstLetter from '../../../../Shared/valueformatters/capitalize-first-letter.js';

const styles = (theme) => ({
	root: {
		margin: 0,
		padding: theme.spacing(2),
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500],
	},
});

const DialogTitle = withStyles(styles)((props) => {
	const { children, classes, onClose, ...other } = props;
	return (
		<MuiDialogTitle disableTypography className={classes.root} {...other}>
			<Typography variant="h4" style={{ fontWeight: 'bold' }}>
				{children}
			</Typography>
			{onClose ? (
				<IconButton
					aria-label="close"
					className={classes.closeButton}
					onClick={onClose}
					size="small"
				>
					<CloseIcon fontSize="small" />
				</IconButton>
			) : null}
		</MuiDialogTitle>
	);
});

const joinAddress = (row) => {
	let rowData =
		row.address1 ||
		row.address2 ||
		row.city ||
		row.state ||
		row.zip ||
		row.country
			? {
					address1: row.address1,
					address2: row.address2,
					city: row.city,
					state: row.state,
					zip: row.zip,
					country: row.country,
			  }
			: {
					address1: row.address1Alt,
					address2: row.address2Alt,
					city: row.cityAlt,
					state: row.stateAlt,
					zip: row.zipAlt,
					country: row.countryAlt,
			  };
	let textArray = [];
	for (const key in rowData) {
		if (rowData.hasOwnProperty(key) && rowData[key] && rowData[key] !== '') {
			if (key === 'zip' || key === 'country') {
				textArray = [
					[textArray.join(', '), capitalizeFirstLetter(rowData[key])].join(' '),
				];
			} else textArray.push(capitalizeFirstLetter(rowData[key]));
		}
	}

	return textArray.join(', ');
};

const useStyles = makeStyles({});

export default function SendMailersDialogContent(props) {
	const classes = useStyles();
	const dispatch = useDispatch();
	const modalClass = Modals();

	const [campaign, setCampaign] = useState('');

	//const [uploadRecipients] = useMutation(UPLOADRECIPIENTS);
	const [uploadRecipients, { data: dataUploadRecipients }] = useMutation(
		UPLOADRECIPIENTS,
		{
			onCompleted: (data) => {
				window.open(data.uploadStorefrontRecipientsList.link, '_blank');
			},
		}
	);

	useEffect(() => {
		if (!props.rows || props.rows.length === 0) props.onClose();
	}, [props.rows]);

	const [stateApp] = useContext(AppContext);

	const runStorefront = () => {
		if (campaign.trim() === '') {
			dispatch(showErrorMessage('Please fill Campaign Name'));
			return;
		}
		uploadRecipients({
			variables: {
				campaign: campaign,
				email: stateApp.user.email,
				recipients: props.rows.map((row) => row._id),
			},
		});
		props.onClose();
		dispatch(showSuccessMessage('Redirecting...'));
	};

	return (
		<React.Fragment>
			<DialogTitle styles={ {backgroundColor: "#fff"}}  id="customized-dialog-title">
				New Mailer Campaign
				<Close
					fontSize="large"
					className = {modalClass.closeIcon}
					onClick={props.onClose}
				/>
			</DialogTitle>
			<DialogContent>
				<Grid container spacing={1}>
					<Grid item xs={12}>
						<h3 style={{ padding: 0, marginTop: '40px', marginBottom: 0 }}>
							Campaign Name
						</h3>
					</Grid>
					<Grid item xs={12}>
						<TextField
							margin="none"
							placeholder="Enter a campaign name"
							style={{ width: '100%', marginBottom: '10px' }}
							value={campaign}
							onChange={(e) => {
								setCampaign(e.target.value);
							}}
						/>
					</Grid>
					<Grid item xs={12} style={{  marginTop: '40px' }}>
						<h3 style={{ margin: '0' }}>Mailing List</h3>
					</Grid>
					<Grid item xs={12} style={{ margin: 0, paddingTop: 0 }}>
						<FormLabel>
							{props.rows && props.rows.length ? props.rows.length : ''}{' '}
							selected
						</FormLabel>
					</Grid>
					{props.rows &&
						props.rows.map((row, index) => (
							<Grid item xs={12} className={modalClass.inputContainerFlex}>
								<FormLabel className={modalClass.inputLabelFlex}>
									{row.name} 	{joinAddress(row)}
								</FormLabel>
							
								<FormLabel className={modalClass.inputContent}>
									<DeleteOutlinedIcon
										fontSize="small"
										style={{ cursor: 'pointer', float: 'right' }}
										onClick={() => {
											let reducedRows = [...props.rows];
											reducedRows.splice(index, 1);
											props.setRows(reducedRows);
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
				<Button
					onClick={() => runStorefront()}
					color="secondary"
					variant="contained"
				>
					Continue to Send Mailers
				</Button>
			</DialogActions>
		</React.Fragment>
	);
}
