import React, { useContext, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Step from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { useMutation, useLazyQuery } from '@apollo/client';

import InterestStep from './InterestStep';
import ParcelStep from './ParcelStep/ParcelStep';
import { showErrorMessage, showSuccessMessage, setAddParcelInterestState } from '../../../../../../actions';
import { AppContext } from '../../../../../../AppContext';
import { ADDOWNERTOAPARCEL } from '../../../../../../graphQL/useMutationAddOwnerToAParcel';
import { ALLENTITYNAMESFORPARCEL } from '../../../../../../graphQL/useQueryAllEntityNamesToAddAsParcelOwner';
import { Modals } from '../../../../../../styles/Modal';
import AutocompEntityNamesVirtualizeList from '../AutocompEntityNamesVirtualizeList';

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
	},
	button: {
		marginTop: theme.spacing(1),
		marginRight: theme.spacing(1),
	},
	actionsContainer: {
		marginBottom: theme.spacing(2),
	},
	resetContainer: {
		padding: theme.spacing(3),
	},
}));

function getSteps() {
	return ['Parcel', 'Interest'];
}

function getStepContent(step) {
	switch (step) {
		case 0:
			return <ParcelStep />;
		case 1:
			return <InterestStep />;
		default:
			return 'Unknown step';
	}
}

export default function AddParcelToEntityDialogContent(props) {
	const classes = useStyles();
	const dispatch = useDispatch();
	const modalClass = Modals();
	const [activeStep, setActiveStep] = useState(0);
	const steps = getSteps();

	//// reset the reducer
	useEffect(() => {
		dispatch(
			setAddParcelInterestState({
				name: 'test',
				county: null,
				state: 'TX',
				Grid1: null,
				Grid2: null,
				Grid3: null,
				Grid4: null,
				Grid5: null,
				qtrQtr: {},
				grossAcres: 640,
				calcAcres: 640.3,
				legalDescription: '',

				entity: 'Unknown',
				type: 'Unknown',
				depthFrom: '',
				depthTo: '',
				interest: '',
				nma: '',
				nra: '',
			})
		);
	}, []);

	const handleNext = () => {
		if (activeStep !== steps.length - 1) {
			setActiveStep(prevActiveStep => prevActiveStep + 1);
		}
	};

	const handleBack = () => {
		setActiveStep(prevActiveStep => prevActiveStep - 1);
	};

	return (
		<React.Fragment>
			<DialogTitle className={modalClass.title} id="customized-dialog-title">
				Add an Owner
				<HighlightOffIcon fontSize="large" className={modalClass.titleClose} onClick={props.onClose} />
			</DialogTitle>
			<DialogContent dividers className={classes.dialogContent}>
				<div className={classes.root}>
					<Stepper activeStep={activeStep} orientation="vertical">
						{steps.map((label, index) => (
							<Step key={label}>
								<StepLabel>{label}</StepLabel>
								<StepContent>{getStepContent(index)}</StepContent>
							</Step>
						))}
					</Stepper>
				</div>
			</DialogContent>
			<DialogActions>
				<div className={classes.actionsContainer}>
					<div>
						<Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
							Back
						</Button>
						<Button variant="contained" color="primary" onClick={handleNext} className={classes.button}>
							{activeStep === steps.length - 1 ? 'Add' : 'Next'}
						</Button>
					</div>
				</div>
			</DialogActions>
		</React.Fragment>
	);
}
