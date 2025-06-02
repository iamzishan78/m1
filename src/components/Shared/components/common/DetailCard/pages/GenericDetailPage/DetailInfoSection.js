import React, { useState } from 'react';

import { Grid, FormControlLabel, FormGroup, Switch, Box } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import { detailCardController } from 'stateManagement/detailCardController';
import { globalStateController } from 'stateManagement/globalStateController';

import CommonSummaryFieldsComponent from '../../CommonSummaryFields';
import { getAssetFields, getNonEmptyFields } from '../../helpers';

const AntSwitch = withStyles(theme => ({
	root: {
		width: 28,
		height: 16,
		padding: 0,
		display: 'flex',
	},
	switchBase: {
		padding: 2,
		color: theme.palette.grey[500],
		'&$checked': {
			transform: 'translateX(12px)',
			color: theme.palette.common.white,
			'& + $track': {
				opacity: 1,
				backgroundColor: '#12ABE0',
				borderColor: '#12ABE0',
			},
		},
	},
	thumb: {
		width: 12,
		height: 12,
		boxShadow: 'none',
	},
	track: {
		border: `1px solid ${theme.palette.grey[500]}`,
		borderRadius: 16 / 2,
		opacity: 1,
		backgroundColor: theme.palette.common.white,
	},
	checked: {},
}))(Switch);

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
		paddingRight: '25px',
		paddingLeft: '15px',
	},
	avatar: {
		marginRight: '20px',
	},
	moreIcon: {
		color: 'lightgray',
	},
	viewAll: {
		margin: '0 0 8px 22px',
		float: 'right',
		color: theme.palette.secondary.main,
		cursor: 'pointer',
		fontWeight: 'normal',
		'&:hover': { color: '#757575' },
		transition: 'color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
	},
	viewAllCard: {
		display: 'flex',
		justifyContent: 'space-between',
	},
	inputField: {
		marginBottom: '30px',
	},
	textBtn: {
		margin: '0 0 8px 0',
		float: 'right',
		color: theme.palette.secondary.main,
		cursor: 'pointer',
		fontWeight: 'normal',
		'&:hover': { color: '#757575' },
		transition: 'color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
	},
	label: {
		backgroundColor: 'white',
	},
	activitiesList: {
		padding: '20px',
	},
	activitiesFilter: {
		padding: '20px 30px',
		borderLeft: '1px solid #9A9A9A',
		minWidth: '250px',
	},
	checkBox: {
		minHeight: '35px',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
	},
	activityCardRight: {
		display: 'flex',
	},
	activityStats: {
		margin: '20px 30px',
		padding: '30px',
		height: 'fit-content',
		backgroundColor: '#FAFAEB',
	},
	activityScore: {
		border: '5px solid #F5A724',
		borderRadius: '50%',
		padding: '25px',
		textAlign: 'center',
		fontSize: '2rem',
		marginBottom: '5px',
	},
	statsMessage: {
		color: '#7B7B7B',
		textAlign: 'center',
	},
	dataSect: {
		borderTop: '2px solid #C9C9C9',
		width: '100%',
		maxHeight: '50vh',
		overflowY: 'auto',
		display: 'block',
		'& p': {
			wordWrap: 'break-word',
		},
		'& .dataLabels': {
			fontWeight: 'bold',
		},
		'& > .MuiGrid-item': {
			position: 'relative',
			width: '100%',
			margin: 0,
		},
		'& .fieldName': {
			borderLeft: '2px solid #C9C9C9',
			backgroundColor: '#EBEBEB',
			'& p': { margin: '8px 10px' },
		},
		'& a': { color: '#757575' },
	},
	showAll: {
		margin: '8px 0 0 0',
		float: 'right',
		color: theme.palette.secondary.main,
		cursor: 'pointer',
		fontWeight: 'normal',
		'&:hover': { color: '#757575' },
		transition: 'color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
	},
	switchButtom: {
		float: 'right',
		width: 'fit-content',
		alignSelf: 'flex-end',
		marginRight: 0,
		'& span.MuiTypography-body1': {
			fontSize: '0.9rem',
			marginLeft: '5px',
		},
	},
	switchTextDeselected: {
		color: 'rgb(141, 141, 141)',
	},
	tab: {
		border: '1px solid #C9C9C9',
		padding: '3px 20px',
		color: '#919191',
		cursor: 'pointer',
	},
	selectedTab: {
		color: 'white',
		background: '#01B0F0',
	},
	viewSwitcher: {
		width: '275px',
		fontSize: '14px',
		marginLeft: '10px',
	},
	headerActions: {
		minHeight: '28px',
		display: 'flex',
		justifyContent: 'space-between',
		padding: '20px 2px 4px 2px',
	},
}));

export default function DetailInfo() {
	const classes = useStyles();
	const [showEmpty, setShowEmpty] = useState(true);
	const [selectedTab, setSelectedTab] = useState('Basic Info');

	const {
		globalStateValues: { currentAsset },
	} = globalStateController.useState(['currentAsset'], 'globalStateValues');

	const {
		stateValues: { currentAssetRecord },
	} = detailCardController.useState(['currentAssetRecord']);

	const handleEmptyFields = () => {
		setShowEmpty(!showEmpty);
	};

	const ToggleEmptyFieldButton = () => {
		return (
			<FormGroup style={{ display: 'block' }}>
				<FormControlLabel
					className={`${classes.switchButtom} ${!showEmpty ? classes.switchTextDeselected : ''}`}
					control={
						<React.Fragment>
							<AntSwitch
								checked={showEmpty}
								onChange={() => {
									handleEmptyFields();
								}}
								name="checkedC"
							/>
						</React.Fragment>
					}
					label="Show empty fields"
					labelPlacement="end"
				/>
			</FormGroup>
		);
	};

	const tabs = ['Basic Info'];
	const nonSummaryFields = getAssetFields(currentAsset, false);
	// Duplicate fields 5 times for testing scroll
	const duplicatedFields = [...Array(5)].flatMap(() => [...nonSummaryFields]);
	const nonEmptyFields = getNonEmptyFields(currentAssetRecord, duplicatedFields);

	return (
		<div className={classes.root}>
			<Grid item xs={12} className={classes.headerActions}>
				<div>
					{tabs.map(tab => {
						return (
							<span
								key={tab}
								className={`${classes.tab} ${selectedTab === tab ? classes.selectedTab : ''}`}
								onClick={() => setSelectedTab(tab)}
							>
								{tab}
							</span>
						);
					})}
				</div>

				<Box display="flex" justifyContent="flex-end">
					<ToggleEmptyFieldButton />
				</Box>
			</Grid>

			{selectedTab === 'Basic Info' && (
				<>
					<Grid container className={classes.dataSect}>
						<Grid item xs={12} style={{ padding: 0 }}>
							{showEmpty ? (
								<CommonSummaryFieldsComponent formFields={duplicatedFields} isBasicInfo={true} />
							) : (
								<CommonSummaryFieldsComponent formFields={nonEmptyFields} isBasicInfo={true} />
							)}
						</Grid>
					</Grid>
				</>
			)}
		</div>
	);
}
