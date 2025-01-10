import React, { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Typography, AppBar, Button, ButtonGroup, Tooltip, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Add from '@material-ui/icons/Add';
import SettingsIcon from '@material-ui/icons/Settings';

import PropTypes from 'prop-types';

import { tableController } from 'hookstate/tableController';

import { setFlowState } from 'actions';
import { AppContext } from 'AppContext';

import PipelineCustomDialog from './PipelineCustomizeDialog';

const useStyles = makeStyles(() => ({
	root: {
		minHeight: '50px',
		maxHeight: '72px',
		backgroundColor: '#fff',
		padding: '0 16px 0',
	},
	top: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	right: {
		display: 'flex',
		alignItems: 'center',

		'& h1': {
			color: '#0DBBEA',
			margin: '0 10px 0 0',
		},
	},
	toggleBtn: {
		borderRadius: 5,
		border: '1px solid #1CB6DA',
		color: '#1CB6DA',
		transition: '200ms all',
		'&:hover': {
			backgroundColor: '#1CB6DA44',
		},
	},
	filterToggleBtn: {
		borderRadius: 5,
		border: '1px solid #d9d9d9',
		color: '#333',
		transition: '200ms all',
		backgroundColor: '#f5f5f5',
		width: '100%',
	},
	activeBtn: {
		borderRadius: 5,
		border: '1px solid #1CB6DA',
		backgroundColor: '#1CB6DA',
		color: '#fff',
		'&:hover': {
			backgroundColor: '#1CB6DAdd',
		},
	},
	left: {
		display: 'flex',
		alignItems: 'center',
		// justifyContent: "flex-end",
	},
	closedDeals: {
		marginLeft: 8,
		backgroundColor: '#3DD698',
		borderRadius: 5,
		minWidth: 220,
		padding: 7.8,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		'& span': {
			marginLeft: 4,
		},
	},
	activeDeals: {
		backgroundColor: '#E8C059',
		borderRadius: 5,
		minWidth: 220,
		padding: 7.8,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		'& span': {
			marginLeft: 4,
		},
	},
	lostDeals: {
		backgroundColor: '#011133',
		borderRadius: 5,
		minWidth: 220,
		padding: 7.8,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		'& span': {
			marginLeft: 4,
		},
		marginLeft: 8,
	},
	import: {
		marginLeft: 8,
		backgroundColor: '#F0F0F0',
	},
	addDeal: {
		marginLeft: 8,
		padding: 9,
		borderRadius: 5,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		'& span': {
			marginleft: 2,
			marginright: 2,
		},
		backgroundColor: '#011133',
		color: '#fff',
		transition: '200ms all',
		'&:hover': {
			backgroundColor: '#263451',
		},
	},
	pipelineControl: {
		minWidth: 200,
		marginBottom: 2,
		borderRadius: 5,
	},
	newDealAction: {
		margin: '0px 15px',
		fontWeight: '600',
		backgroundColor: 'rgba(1, 17, 51, 1)',
		color: '#fff',
		border: '1px solid #B3B3B3',
		paddingLeft: 10,
		paddingRight: 20,
		'&:hover': {
			backgroundColor: '#263451',
			color: '#fff',
		},
	},
	newDealActionDisabled: {
		margin: '0px 15px',
		fontWeight: '600',
		border: '1px solid #B3B3B3',
		paddingLeft: 10,
		paddingRight: 20,
	},
	settingsButton: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		float: 'right',

		'& .MuiIconButton-root': {
			display: 'none',
		},
		'&:hover .MuiIconButton-root': {
			display: 'block',
			'& .MuiIconButton-label': {
				marginLeft: '0 !important',
			},
		},
	},
}));

const TransactAppBar = ({ dealFilter, setDealFilter }) => {
	const [stateApp, setStateApp] = useContext(AppContext);
	const classes = useStyles();
	const dispatch = useDispatch();
	const { pipeToShow, selectedPipe, openPipeDialog } = useSelector(({ Flow }) => Flow);
	const Controller = tableController('DealsTable');

	const handleClickAddDeal = () => {
		setStateApp(stateApp => ({
			...stateApp,
			dealDialog: true,
			activeDeal: { cardId: null, laneId: null },
		}));
	};

	return (
		<>
			<AppBar elevation={1} className={classes.root} position="static" variant="outlined">
				<div className={classes.top} style={{ marginTop: 15 }}>
					<div className={classes.settingsButton}>
						{selectedPipe && (
							<Typography style={{ marginLeft: 10 }} variant="h5" color="textPrimary" fontWeight="fontWeightBold">
								{selectedPipe.name}
							</Typography>
						)}
					</div>

					{openPipeDialog && <PipelineCustomDialog />}
					<div className={classes.left}>
						<div>
							<Tooltip title={'Flowline Actions'}>
								{/* Settings Icon Button to open Flowline settings */}
								<IconButton
									disabled={!selectedPipe}
									size="medium"
									style={{ marginLeft: 10, marginRight: 10, padding: 8 }}
									onClick={() => {
										dispatch(
											setFlowState({
												openPipeDialog: true,
											})
										);
									}}
								>
									<SettingsIcon />
								</IconButton>
							</Tooltip>
						</div>
						{stateApp.dealDisplayType !== 'table' && (
							<div>
								<Button
									disableRipple={!pipeToShow}
									onClick={pipeToShow ? handleClickAddDeal : null}
									className={pipeToShow ? classes.newDealAction : classes.newDealActionDisabled}
									startIcon={<Add />}
								>
									{selectedPipe?.flowLineType === 'general' ? 'New Task' : 'Add Deal'}
								</Button>
							</div>
						)}

						<ButtonGroup style={{ minHeight: 36 }}>
							{(selectedPipe?.flowLineType === 'general'
								? ['all', 'open', 'closed']
								: ['all', 'open', 'won', 'lost']
							).map(filter => (
								<Button
									key={filter + '_button_filter'}
									size="small"
									className={`${classes.filterToggleBtn} ${dealFilter === filter && classes.activeBtn}`}
									onClick={() => {
										setDealFilter(filter);
										if (filter === 'all') {
											Controller.clearFilter('status');
										} else {
											Controller.setFilter({ field: 'status', value: filter });
										}
									}}
								>
									{filter.capitalize()}
								</Button>
							))}
						</ButtonGroup>
					</div>
				</div>
				<div className={classes.top} style={{ marginBottom: 4, marginTop: 2 }}></div>
			</AppBar>
		</>
	);
};

TransactAppBar.propTypes = {
	dealFilter: PropTypes.string.isRequired,
	setDealFilter: PropTypes.func.isRequired,
};

export default TransactAppBar;
