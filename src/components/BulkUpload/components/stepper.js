/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { set, get } from 'lodash';
import { useForm } from 'react-hook-form';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Checkbox } from '@material-ui/core';
import clsx from 'clsx';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { useDispatch } from 'react-redux';
import StepConnector from '@material-ui/core/StepConnector';
import Button from '@material-ui/core/Button';
import CSVFileReader from './CSVFileReader';
import RevenueStatementInfoForm from './Fields/RevenueStatementInfoForm';
import M1neralHeaders from './M1neralHeaders';
import ReviewCSV from './ReviewCSV';
import UploadStepperComponent from './UploadStepperComponent';
import { AppContext } from '../../../AppContext';
import { useHistory } from 'react-router-dom';
import { matchRoutes } from 'react-router-config';
import { useMutation, useLazyQuery, useApolloClient } from '@apollo/client';
import { showErrorMessage } from 'actions';
import { CREATE_JOB } from 'graphQL/useMutationCreateJob';
import { UPDATE_JOB } from 'graphQL/useMutationUpdateJob';
import { GET_JOB_UPLOAD_URI } from 'graphQL/useQueryGetJobUploadUri';
import { BlockBlobClient } from '@azure/storage-blob';
import jobHeaders from '../jobHeaders';
import { INITIALIZE_EXPORT_JOB } from 'graphQL/useMutationinitializeExportJob';
import { getDateWithoutTime } from 'components/Shared/functions';
import { jobController } from 'hookstate/jobStateController';

const QontoConnector = withStyles({
	alternativeLabel: {
		flexDirection: 'column',
		left: 'calc(-50% + 12px)',
		right: 'calc(50% + 12px)',
	},
	active: {
		'& $line': {
			borderColor: '#17aadd',
		},
	},
	completed: {
		'& $line': {
			borderColor: '#17aadd',
		},
	},
	line: {
		borderColor: '#eaeaf0',
		borderTopWidth: 3,
		borderRadius: 1,
	},
})(StepConnector);

const NewSteplabel = withStyles({
	alternativeLabel: {
		flexDirection: 'column !important',
	},
	active: {
		color: '#17aadd !important',
	},
	completed: {
		color: '#17aadd !important',
	},
})(StepLabel);
const useQontoStepIconStyles = makeStyles({
	root: {
		color: '#17aadd',
		display: 'flex',
		height: 22,
		alignItems: 'center',
		flexDirection: 'column !important',
	},
	active: {
		color: '#17aadd',
	},
	circle: {
		width: 15,
		height: 15,
		borderRadius: '50%',
		backgroundColor: 'currentColor',
	},
	completed: {
		color: '#0084e2',
		zIndex: 1,
		fontSize: 18,
	},
	alternativeLabel: {
		flexDirection: 'column !important',
	},
});

const style_radio = {
	color: '#17aadd',
	width: 15,
	height: 15,
	border: '3px solid #17aadd',
	borderRadius: '50%',
};
const style_hollow_grey = {
	height: 15,
	width: 15,
	color: '#eaeaf0',
	border: '3px solid',
	borderRadius: '50%',
};
function QontoStepIcon(props) {
	const classes = useQontoStepIconStyles();
	const { active, completed } = props;

	return (
		<div
			className={clsx(classes.root, {
				[classes.active]: active,
			})}
		>
			{completed ? (
				<Checkbox style={style_radio} color="primary" checked={true} />
			) : active ? (
				<Checkbox style={style_radio} color="primary" checked={true} />
			) : (
				<Checkbox style={style_hollow_grey} color="primary" checked={true} />
			)}
		</div>
	);
}

QontoStepIcon.propTypes = {
	/**
	 * Whether this step is active.
	 */
	active: PropTypes.bool,
	/**
	 * Mark the step as completed. Is passed to child components.
	 */
	completed: PropTypes.bool,
};

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
	},
	buttonback: {
		color: '#17aadd',
		fontWeight: 900,
		padding: '3px 25px',
		marginRight: theme.spacing(1),
		backgroundColor: '#d5f4fd',
	},
	buttonselect: {
		backgroundColor: '#17aadd',
		fontWeight: 900,
		padding: '3px 25px',
		marginRight: theme.spacing(1),
	},
	instructions: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
}));

function getSteps(job) {
	if (job?.skipReview) {
		return ['Select', 'Match', 'Upload'];
	}
	return ['Select', 'Match', 'Review', 'Upload'];
}

const mapping_buttons_div = {
	maxWidth: '20%',
	margin: '8px auto',
	textAlign: 'center',
};
const stepper_style = {
	padding: '35px 0px',
};
export default function CustomizedSteppers(props) {
	const classes = useStyles();
	const { control, watch, getValues, reset } = useForm();
	const [stateApp] = React.useContext(AppContext);
	const client = useApolloClient();
	const history = useHistory();
	const previousRoute = matchRoutes(props.routes, history.pathHistory[1]);

	const { activeStepNumber, csvDataToSend, transferData, selectedShapeLayerOption, jobType, jobStateValues } =
		jobController.useState(
			[
				'activeStepNumber',
				'csvDataToSend',
				'mappedHeadersFromCSV',
				'transferData',
				'uploaderFormValues',
				'selectedShapeLayerOption',
				'jobType',
				'job',
			],
			'jobStateValues'
		);

	const [uploadList, setUploadList] = useState(null);
	const [jobId, setJobId] = useState(null);
	const [processing, setProcessing] = useState(false);

	const [buttonTitle, setButtonTitle] = useState('false');

	const steps = getSteps(jobStateValues.job);
	const dispatch = useDispatch();
	const [getJobUploadUri, { data: contactUploadUri }] = useLazyQuery(GET_JOB_UPLOAD_URI, {
		fetchPolicy: 'no-cache',
	});
	const [createJob, { data: createJobData }] = useMutation(CREATE_JOB);
	const [updateJob] = useMutation(UPDATE_JOB);

	const userID = stateApp.user.mongoId;

	useEffect(() => {
		setButtonTitle(
			jobStateValues.activeStepNumber >= steps.length - 2
				? jobStateValues.activeStepNumber === steps.length - 1
					? 'Close'
					: 'Upload'
				: 'Continue'
		);
	}, [activeStepNumber, steps.length]);

	useEffect(() => {
		if (createJobData?.createJob && jobId) {
			updateJob({
				variables: {
					job: {
						_id: jobId,
						createJobResponse: createJobData?.createJob.body,
					},
				},
			});
		}
	}, [createJobData, jobId]);

	useEffect(() => {
		if (contactUploadUri?.getJobUploadUri?.success && !processing) {
			setProcessing(true);
			jobController.toggleBulkUpload();
			const uri = contactUploadUri.getJobUploadUri.job.uri;
			const id = contactUploadUri.getJobUploadUri.job.id;
			const interal_key = contactUploadUri.getJobUploadUri.job.internalKey;

			setJobId(id);

			const blockBlobClient = new BlockBlobClient(uri);
			blockBlobClient
				.uploadBrowserData(uploadList, {
					maxSingleShotSize: 4 * 1024 * 1024,
					blobHTTPHeaders: {
						blobContentDisposition: `attachment; filename="${id}"`,
					},
					metadata: {
						Internalkey: interal_key || '',
					},
				})
				.then(res => {
					if (res?._response?.status === 201) {
						createJob({
							variables: {
								jobId: id,
								sendEmail: true,
							},
						});
					} else {
						dispatch(showErrorMessage('Upload failed'));
					}
				})
				.catch(err => console.log(err));
		}
	}, [contactUploadUri]);

	const setValue = (_obj, key, value) => {
		if (_obj[key]) delete _obj[key];
		set(_obj, key, value);
	};

	const handleNext = async () => {
		const activeStep = jobStateValues.activeStepNumber;
		if (activeStep === steps.length - 2) {
			if (jobStateValues.jobType === 'SHAPE_TO_M1_LAYER') {
				const jobInitialization = await client.mutate({
					mutation: INITIALIZE_EXPORT_JOB,
					variables: {
						jobName: 'SHAPE TO M1 LAYER',
						jobType: 'SHAPE_TO_M1_LAYER',
						requestPayload: {
							transferData: jobStateValues.transferData,
							mappedHeadersFromCSV: jobStateValues.mappedHeadersFromCSV,
							selectedShapeLayerOption: jobStateValues.selectedShapeLayerOption,
						},
						userId: userID,
					},
				});
				await client.mutate({
					mutation: CREATE_JOB,
					variables: {
						jobId: jobInitialization?.data?.initializeExportJob?.job?._id,
						sendEmail: true,
					},
				});
				jobController.toggleBulkUpload();
			} else {
				const changeDate = new Date();
				const statementInfo = get(jobStateValues, 'uploaderFormValues', {});
				let data_to_send = jobStateValues.csvDataToSend.map((element, index) => {
					element.createBy = userID;
					element.createAt = changeDate;
					element.lastUpdateBy = userID;
					element.lastUpdateAt = changeDate;
					if (statementInfo) {
						element = { ...statementInfo, ...element };
						setValue(element, 'check.sourceId', statementInfo.sourceId);
						setValue(element, 'check.importType', statementInfo.importType);
					}
					element['checkDate'] = getDateWithoutTime(element['check.checkDate']);
					element['check.checkDate'] = getDateWithoutTime(element['check.checkDate']);
					setValue(element, 'check.sourceId', statementInfo?.sourceId);
					setValue(element, 'check.importType', statementInfo?.importType);
					if (props.selectedJob.type === 'UNITS') {
						element['shape.shapeType'] = 'Unit';
					}
					if (props.selectedJob.type === 'AGREEMENT_HEADER') {
						element.shapeType = 'Agreement';
					}
					delete element.tableData;
					return element;
				});
				const requestPayload = {
					sampleCsv: jobHeaders[props.selectedJob.type],
					uploadType: jobStateValues.selectedShapeLayerOption,
				};

				if (jobStateValues.jobType === 'UNITS') {
					const autoCalculateOfferPrice = !!stateApp?.user?.features?.find(f => f.name === 'autoCalculateOfferPrice');
					requestPayload['autoCalculateOfferPrice'] = autoCalculateOfferPrice;
				}

				if (jobStateValues.jobType === 'AGREEMENT_COMMENTS') {
					requestPayload['type'] = 'agreement';
				}
				if (jobStateValues.jobType === 'TRACT_COMMENTS') {
					requestPayload['type'] = 'tract';
				}
				if (jobStateValues.jobType === 'CONTACT_COMMENTS') {
					requestPayload['type'] = 'contact';
				}

				getJobUploadUri({
					variables: {
						requestPayload,
						jobName: props.selectedJob.name,
						jobType: props.selectedJob.type,
						userId: userID,
					},
				});
				setUploadList(JSON.stringify(data_to_send));

				jobController.updateState({
					uploaderFormValues: {},
				});
			}

			jobController.nextStep();
		} else {
			jobController.nextStep();
		}
		if (activeStep === steps.length - 1) {
			handleReset();
			routeChange(props.selectedJob.redirectTo || previousRoute[0]?.match?.url);
		}
	};

	const handleBack = () => {
		if (
			jobStateValues.activeStepNumber === 0 ||
			(jobStateValues.activeStepNumber === 1 && jobStateValues?.jobType === 'SHAPE_TO_M1_LAYER')
		) {
			handleReset();
			routeChange(previousRoute[0]?.match?.url);
		} else {
			jobController.prevStep();
		}
	};

	const handleReset = () => {
		jobController.reset();
	};

	let routeChange = route => {
		history.push(route || '/');
	};

	const isDisabled = useMemo(() => {
		const _jobStateValues = jobController.getValues([
			'selectedShapeLayerOption',
			'activeStepNumber',
			'csvDataToSend',
			'transferData',
			'jobType',
		]);
		if (_jobStateValues.jobType === 'SHAPE_TO_M1_LAYER') {
			return !(_jobStateValues.selectedShapeLayerOption && _jobStateValues.transferData);
		} else if (_jobStateValues.jobType === 'AGREEMENT_HEADER') {
			return (
				(_jobStateValues.activeStepNumber === 1 && !_jobStateValues.csvDataToSend) ||
				_jobStateValues.csvDataToSend.length === 0 ||
				!_jobStateValues.selectedShapeLayerOption
			);
		} else {
			return (
				(_jobStateValues.activeStepNumber === 1 && !_jobStateValues.csvDataToSend) ||
				_jobStateValues.csvDataToSend.length === 0
			);
		}
	}, [selectedShapeLayerOption, activeStepNumber, csvDataToSend, transferData, jobType]);

	return (
		<div className={classes.root}>
			<Stepper
				style={stepper_style}
				alternativeLabel
				activeStep={jobStateValues.activeStepNumber}
				connector={<QontoConnector />}
			>
				{steps.map(label => (
					<Step key={label}>
						<NewSteplabel StepIconComponent={QontoStepIcon}>{label}</NewSteplabel>
					</Step>
				))}
			</Stepper>
			<div>
				<div>
					<div>
						{steps[jobStateValues.activeStepNumber] === 'Select' ? (
							<>
								{props.selectedJob.type === 'CHECKDETAILS' && (
									<RevenueStatementInfoForm
										control={control}
										watch={watch}
										getValues={getValues}
										reset={reset}
										uploaderFormValues={jobStateValues.uploaderFormValues}
									/>
								)}
								<CSVFileReader
									importType={getValues().importType}
									selectedJob={props.selectedJob}
									setSelectedJob={props.setSelectedJob}
								/>
							</>
						) : null}
						{steps[jobStateValues.activeStepNumber] === 'Match' ? <M1neralHeaders /> : null}
						{steps[jobStateValues.activeStepNumber] === 'Review' ? <ReviewCSV /> : null}
						{steps[jobStateValues.activeStepNumber] === 'Upload' ? <UploadStepperComponent /> : null}
					</div>
					<div style={mapping_buttons_div}>
						{steps[jobStateValues.activeStepNumber] !== 'Upload' ? (
							<Button onClick={handleBack} className={classes.buttonback}>
								Back
							</Button>
						) : null}
						{steps[jobStateValues.activeStepNumber] !== 'Select' ? (
							<Button
								id={`${buttonTitle}-button`}
								disabled={isDisabled}
								variant="contained"
								color="primary"
								onClick={handleNext}
								className={classes.buttonselect}
							>
								{buttonTitle}
							</Button>
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
}
