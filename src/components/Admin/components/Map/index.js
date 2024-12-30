import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Tabs, Tab, RadioGroup, Radio, FormControlLabel, TextField } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/styles';

import { useMutation } from '@apollo/client';

import { workspaceTenantName } from 'components/Shared/functions';

import { UPSERT_WORKSPACE_SETTINGS } from 'graphQL/useMutationWorksapceSettings';

import Filters from './Filters';

const useStyles = makeStyles(theme => ({
	contenContainer: {
		padding: '40px',
		'& span': {
			fontWeight: 'bold',
			fontSize: '16px',
		},
	},
	actionsContainer: {
		padding: '0px 35px',
	},
	options: {
		marginTop: '20px',
		'& .MuiFormControl-marginDense': {
			marginTop: '0px !important',
		},
	},
}));

const StyledTabs = withStyles({
	root: {
		textTransform: 'capitalize',
	},
	indicator: {
		backgroundColor: '#12abe0',
		height: '5px',
	},
})(Tabs);

const StyledTab = withStyles(theme => ({
	root: {
		textTransform: 'uppercase',
		minWidth: 72,
		fontWeight: theme.typography.fontWeightRegular,
		marginRight: theme.spacing(4),
		fontFamily: [
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif',
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
		].join(','),
		'&:hover': {
			color: 'black',
			opacity: 1,
		},
		'&$selected': {
			color: 'black',
			fontWeight: theme.typography.fontWeightMedium,
		},
		'&:focus': {
			color: 'black',
		},
	},
	selected: {},
}))(props => <Tab disableRipple {...props} />);

export default function RevenueStatements() {
	const classes = useStyles();
	const options = [
		{
			key: 'unit',
			value: 'Unit Interest NRA Calculation',
			dbKey: 'unitNra',
		},
		{
			key: 'tract',
			value: 'Tract Interest NRA Calculation',
			dbKey: 'tractNra',
		},
	];
	const [tab, setTab] = useState(0);
	const [calculationOption, setCalculationOption] = useState(options[0]);
	const [settings, setSettings] = useState();
	const [addOrUpdateWorkspaceSettings] = useMutation(UPSERT_WORKSPACE_SETTINGS);

	const { user, workspaceSettings } = useSelector(({ app }) => app);

	const unitFormulaText = 'Unit Acres * (Sum of Decimal Interest)';
	const tractFormulaText = 'Tract Gross Acres * Mineral Interest * (RI + ORRI)';
	const showingFormulaText = calculationOption?.key === 'unit' ? unitFormulaText : tractFormulaText;

	useEffect(() => {
		if (workspaceSettings) {
			setSettings(workspaceSettings.settings);
		}
	}, [workspaceSettings]);

	const onChangeType = (key, type, value = settings?.map?.[calculationOption?.dbKey]?.value) => {
		const updatedSettings = {
			map: {
				...settings?.map,
				[key]: { type, value },
			},
		};

		addOrUpdateWorkspaceSettings({
			variables: {
				workspaceSettings: {
					name: workspaceTenantName(),
					modifier: user._id,
					settings: updatedSettings,
				},
			},
			refetchQueries: ['getWorkspaceSettings'],
			awaitRefetchQueries: true,
		});
	};

	return (
		<div
			style={{
				marginTop: '65px',
			}}
		>
			<div className={classes.actionsContainer}>
				<div className={classes.tabsHeader}>
					<StyledTabs value={tab} onChange={(event, tab) => setTab(tab)} aria-label="ant example">
						<StyledTab id="settings" label="CALCULATIONS" />
						{/* <StyledTab id="validations" label="Validations" disabled /> */}
					</StyledTabs>
				</div>
			</div>
			<Filters calculationOption={calculationOption} setCalculationOption={setCalculationOption} options={options} />

			<div className={classes.contenContainer}>
				{calculationOption && (
					<>
						<span>
							Select the method by which Net Royalty Acres (NRA) should be calculated for {calculationOption.key}{' '}
							owners:
						</span>

						<div className={classes.options}>
							<RadioGroup
								column
								value={settings?.map?.[calculationOption?.dbKey]?.type ?? 'standard'}
								onChange={event => onChangeType(calculationOption?.dbKey, event.target.value)}
							>
								<FormControlLabel
									value="standard"
									control={<Radio />}
									label={`Standard Calculation = ${showingFormulaText} ${calculationOption?.key === 'tract' ? '/ 0.125' : ''}`}
								/>
								<div>
									<FormControlLabel
										value="custom"
										control={<Radio />}
										label={`Custom Calculation = ${showingFormulaText} / `}
									/>
									<TextField
										variant="outlined"
										margin="dense"
										disabled={settings?.map?.[calculationOption?.dbKey]?.type !== 'custom'}
										onBlur={event => onChangeType(calculationOption.dbKey, 'custom', event.target.value)}
										value={settings?.map?.[calculationOption?.dbKey]?.value}
										onChange={event => {
											const _settings = {
												...settings,
												map: {
													...settings.map,
													[calculationOption?.dbKey]: {
														...settings?.map?.[calculationOption?.dbKey],
														value: event.target.value,
													},
												},
											};
											setSettings(_settings);
										}}
									/>
								</div>
							</RadioGroup>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
