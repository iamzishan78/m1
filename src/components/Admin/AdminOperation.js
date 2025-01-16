import React, { useEffect, useMemo, useState } from 'react';
import ReactJsonPrint from 'react-json-print'

import { makeStyles } from '@material-ui/styles';

import { Autocomplete, TextField, Button, Grid, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

import { useLazyQuery, useMutation } from '@apollo/client';

import { copy } from 'components/Shared/functions';

import { TRIGGER_ADMIN_OPERATIONS } from 'graphQL/useMutationadminESOperations';
import { GET_DB_OPERATIONS } from 'graphQL/useQueryadminDBOperations';

import { adminOperationsController } from 'hookstate/adminOperationsController';

import { getHeaders } from 'utils/helper';

const useStyles = makeStyles(() => ({
	root: {
		marginTop: '65px',
	},
	formSection: {
		padding: '20px',
		backgroundColor: '#f5f5f5',
		borderRadius: '8px',
		marginBottom: '20px',
	},
	inputField: {
		width: '100%',
	},
	buttonBar: {
		display: 'flex',
		justifyContent: 'space-between',
		padding: '20px',
	},
	message: {
		marginTop: '10px',
		color: 'green',
	},
	warning: {
		marginTop: '10px',
		color: 'red',
	},
}));

const useGetDBOperations = options => {
	const [getDBOperations, { data: operationModels }] = useLazyQuery(GET_DB_OPERATIONS, { fetchPolicy: 'no-cache' });
	useEffect(() => {
		if (options.callApi !== false) {
			getDBOperations({
				variables: { options },
			});
		}
	}, [getDBOperations, options]);

	// Memoizing the returned data to avoid unnecessary recalculations
	return useMemo(() => {
		return options.callApi !== false
			? operationModels?.getDBOperations || []
			: {
				[options.operationType]: getDBOperations,
				[options.operationType + 'Data']: operationModels?.getDBOperations || [],
			};
	}, [operationModels, options.callApi, options.operationType, getDBOperations]);
};

const operations = {
	tenants: { type: 'tenants', operationType: 'getOperationModels' },
	databaseFlatenning: { type: 'databaseFlatenning', operationType: 'getOperationModels' },
	commonSingleOperation: { type: 'commonSingleOperation', operationType: 'commonSingleOperation' },
	getOperationTypes: { operationType: 'operationTypes' },
	getOperationsLogs: { operationType: 'getOperationsLogs', callApi: false },
};

export default function Flatten() {
	const classes = useStyles();
	const tenants = useGetDBOperations(operations.tenants);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const models = {
		databaseFlatenning: useGetDBOperations(operations.databaseFlatenning),
	};
	const operationTypes = useGetDBOperations(operations.getOperationTypes);
	const commonSingleOperations = useGetDBOperations(operations.commonSingleOperation);

	const { getOperationsLogs, getOperationsLogsData } = useGetDBOperations(operations.getOperationsLogs);
	const stateKeys = [
		'version',
		'description',
		'filterType',
		'tenants',
		'models',
		'selectedTenants',
		'selectedModels',
		'adminOperationType',
		'chunkSize',
		'reflatDependencies',
		'createNewFlatData',
		'singleOperation',
	];
	const { adminOperationsState } = adminOperationsController.useState(stateKeys, 'adminOperationsState');

	const [warning] = useState(false);
	const [showMessage, setShowMessage] = useState(false);
	const [operation, setOperation] = useState(false);
	const [intervalValue, setIntervalValue] = useState();
	const [TriggerAdminOperation] = useMutation(TRIGGER_ADMIN_OPERATIONS);

	// Function to build the curl command
	const generateCurlCommand = (url, options) => {
		// Build the full JSON structure
		const jsonData = {
			operationName: 'triggerAdminOperation',
			variables: { options },
			query: 'mutation triggerAdminOperation($options: JSON) { triggerAdminOperation(options: $options) }',
		};

		const headers = getHeaders();

		// Convert the JSON to a string
		const jsonString = JSON.stringify(jsonData);

		// Return the curl command
		return `curl -X POST ${url} \\
  -H "Content-Type: application/json" \\
  -H "X-ZUMO-AUTH: ${headers['X-ZUMO-AUTH']}" \\
  -H "X-MS-TOKEN-AAD-ID-TOKEN: ${headers['X-MS-TOKEN-AAD-ID-TOKEN']}" \\
  -d '${jsonString}'`;
	};

	const handleOperationsLogs = () => {
		clearInterval(intervalValue)

		const callOperation = () => {
			getOperationsLogs({
				variables: {
					options: {
						operationType: 'getOperationsLogs',
						version: adminOperationsState.version,
						adminOperationType: adminOperationsState.adminOperationType,
					},
				},
			}).then(({ data }) => {
				setOperation(copy(data.getDBOperations))
			})
		}
		callOperation()
		setIntervalValue(
			setInterval(() => {
				callOperation()
			}, 5000)
		)
	}

	const handleClick = () => {
		const options = {};
		stateKeys.forEach(stateKey => {
			options[stateKey] = adminOperationsState[stateKey];
		});

		console.log(generateCurlCommand('http://localhost:7071/api/m1graph', options));
		TriggerAdminOperation({
			variables: {
				options,
			},
		});
		setShowMessage(true);
		handleOperationsLogs()
	};



	useEffect(() => { });

	const tenantOptions = useMemo(() => {
		let _tenants = tenants?.map(tenant => tenant.name) || [];
		return {
			all: _tenants,
			withSelectAll: ['Select All', ..._tenants],
		};
	}, [tenants]);

	const modelOptions = useMemo(() => {
		let _models = models[adminOperationsState.adminOperationType] || [];
		if (adminOperationsState.adminOperationType === 'databaseFlatenning') {
			_models = _models.filter(model => model !== 'ShapeFile' && model !== 'Test');
		}
		return {
			all: _models,
			withSelectAll: ['Select All', ..._models],
		};
	}, [models, adminOperationsState.adminOperationType]);

	return (
		<div className={classes.root}>
			<div className={classes.formSection}>
				<Grid container spacing={2}>
					<Grid item xs={6}>
						<TextField
							label="Version"
							type="number"
							value={adminOperationsState.version}
							onChange={e => adminOperationsController.updateState({ version: Number(e.target.value) })}
							className={classes.inputField}
							inputProps={{
								min: 1,
								step: 1,
								onWheel: e => e.target.blur(),
								onKeyDown: e => {
									if (e.key === '-' || e.key === 'e') {
										e.preventDefault();
									}
								},
							}}
						/>
					</Grid>
					<Grid item xs={6}>
						<Autocomplete
							options={operationTypes}
							value={adminOperationsState.adminOperationType}
							onChange={(e, value) => adminOperationsController.updateState({ adminOperationType: value })}
							renderInput={params => <TextField {...params} label="Operation Type" />}
							className={classes.inputField}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							label="Description"
							type="textarea"
							value={adminOperationsState.description}
							onChange={e => adminOperationsController.updateState({ description: e.target.value })}
							className={classes.inputField}
						/>
					</Grid>
					<Grid item xs={6}>
						<Autocomplete
							multiple
							options={tenantOptions.withSelectAll}
							value={adminOperationsState.selectedTenants || []}
							onChange={(e, value) =>
								adminOperationsController.updateState({
									selectedTenants: value,
									tenants: value?.includes('Select All') ? tenantOptions.all : value,
								})
							}
							renderInput={params => <TextField {...params} label="Tenants" />}
							className={classes.inputField}
						/>
					</Grid>
					{adminOperationsState.adminOperationType === 'commonSingleOperation' && (
						<Grid item xs={6}>
							<Autocomplete
								options={commonSingleOperations}
								value={adminOperationsState.singleOperation}
								onChange={(e, value) => {
									adminOperationsController.updateState({ singleOperation: value, models: [] });
								}}
								renderInput={params => <TextField {...params} label="Single Operation" />}
								className={classes.inputField}
							/>
						</Grid>
					)}
					{models[adminOperationsState.adminOperationType] && (
						<Grid item xs={6}>
							<Autocomplete
								multiple
								options={modelOptions.withSelectAll}
								value={adminOperationsState.selectedModels || []}
								onChange={(e, value) => {
									console.log(value);
									adminOperationsController.updateState({
										selectedModels: value,
										models: value?.includes('Select All') ? modelOptions.all : value,
									});
								}}
								renderInput={params => <TextField {...params} label="Models" />}
								className={classes.inputField}
							/>
						</Grid>
					)}
					<Grid item xs={6}>
						<Autocomplete
							options={['runAll', 'onlyFailed', 'failedAndNew', 'newOnly', 'selectedOnly']}
							value={adminOperationsState.filterType}
							onChange={(e, value) => adminOperationsController.updateState({ filterType: value })}
							renderInput={params => <TextField {...params} label="Run Type" />}
							className={classes.inputField}
						/>
					</Grid>
					{adminOperationsState.adminOperationType === 'databaseFlatenning' && (
						<>
							<Grid item xs={6}>
								<FormControl className={classes.inputField}>
									<InputLabel>Create New Flat Data</InputLabel>
									<Select
										label="Create New Flat Data"
										value={adminOperationsState.createNewFlatData}
										onChange={({ target }) =>
											adminOperationsController.updateState({ createNewFlatData: target.value })
										}
									>
										<MenuItem value="Yes">Yes</MenuItem>
										<MenuItem value="No">No</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={6}>
								<FormControl className={classes.inputField}>
									<InputLabel>Reflat Model Dependencies</InputLabel>
									<Select
										label="Reflat Model Dependencies"
										value={adminOperationsState.reflatDependencies}
										onChange={({ target }) =>
											adminOperationsController.updateState({ reflatDependencies: target.value })
										}
									>
										<MenuItem value="Yes">Yes</MenuItem>
										<MenuItem value="No">No</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={6}>
								<TextField
									label="Chunk Size"
									type="number"
									value={adminOperationsState.chunkSize}
									onChange={e => adminOperationsController.updateState({ chunkSize: Number(e.target.value) })}
									className={classes.inputField}
									inputProps={{
										min: 500,
										step: 1,
										onWheel: e => e.target.blur(),
										onKeyDown: e => {
											if (e.key === '-' || e.key === 'e') {
												e.preventDefault();
											}
										},
									}}
								/>
							</Grid>
						</>
					)}
				</Grid>
			</div>

			<div className={classes.buttonBar}>
				<Button variant="contained" onClick={handleClick} color="primary" disabled={warning}>
					Run Operation
				</Button>

				{warning && <div className={classes.warning}>You should run flattening only on 2 indexes at a time.</div>}
				{showMessage && <div className={classes.message}>Operation is Started</div>}
			</div>

			<div className={classes.buttonBar}>
				{adminOperationsState.version && adminOperationsState.adminOperationType && (
					<>
						<Button
							variant="contained"
							onClick={() =>
								handleOperationsLogs()
							}
							color="primary"
						>
							Fetch AdminOperation Logs
						</Button>
						<Button
							variant="contained"
							onClick={() =>
								clearInterval(intervalValue)
							}
							color="primary"
						>
							Stop Fetching
						</Button>
					</>
				)}
			</div>

			<ReactJsonPrint dataObject={operation} expanded={true} />
		</div>
	);
}
