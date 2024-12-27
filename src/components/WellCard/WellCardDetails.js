import React, { useContext, useState, useEffect } from 'react';

import { Box, IconButton } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import { useLazyQuery } from '@apollo/client';
import moment from 'moment';

// contexts
import WellDetailsDocumentTable from 'components/WellCard/components/WellDetailsDocumentTable';

import { popupController } from 'hookstate/popupStateController';

import { WellCardContext } from './WellCardContext';

// styling

//material-ui components

//custom components
import { PRODUCTIONDETAILQUERY } from '../../graphQL/useQueryProductionDetail';
import Taps from '../Shared/Taps';
import TableSummary from './components/TableSummary';
import QuadProvider from '../Quad/QuadProvider';
import CompletionDateCard from '../Shared/CompletionDateCard';
import FirstProdDateCard from '../Shared/FirstProdDateCard';
import M1nTable from '../Shared/M1nTable/M1nTable';
import OwnerNumCard from '../Shared/OwnerNumCard';
import PermitDateCard from '../Shared/PermitDateCard';
import PlugDateCard from '../Shared/PlugDateCard';
import ProfileCard from '../Shared/ProfileCard';
import SpudDateCard from '../Shared/SpudDateCard';
import WellStatusCard from '../Shared/WellStatusCard';
import WellTypeCard from '../Shared/WellTypeCard';
import WellProdChartProvider from '../WellProdChart/WellProdChartProvider';

const useStyles = makeStyles(theme => ({
	grid: {
		// height: "100%",
		width: 'auto',
		// overflowY: "auto",
		// paddingBottom: "64px"
	},
	gridItem: {
		flexGrow: 1,
		display: 'flex',
		justifyContent: 'space-around',
		height: '100%',
		// paddingBottom: "10px",
	},
	gridItemGrey: {
		flexGrow: 1,
		display: 'flex',
		justifyContent: 'space-around',
		// background: "#f6f6f6",
		position: 'relative',
		top: '0',
		left: '0',
		paddingTop: '7px',
		borderBottom: '1px solid rgb(190, 190, 190)',
		background: '#ebebeb',
	},
	gridWidthScroll: {
		maxHeight: 'calc(100% - 88px)',
		overflow: 'auto',
		'&::-webkit-scrollbar': {
			height: '0.4em',
		},
		'&::-webkit-scrollbar-track': {
			'-webkitBoxShadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
		},
		'&::-webkit-scrollbar-thumb': {
			backgroundColor: '#929292',
			borderRadius: 5,
		},
	},
	card: {
		width: '100%',
		height: '100%',
		minHeight: '100%',
		background: '#011133',
		borderStyle: 'solid',
		borderWidth: 'thin',
		borderColor: '#011133',
	},
	title: {
		fontFamily: 'Poppins',
		fontStyle: 'normal',
		fontWeight: 600,
		fontSize: '15px',
		lineHeight: '22px',
		color: '#FFFFFF',
		textTransform: 'uppercase',
		position: 'relative',
		height: '23px',
		left: '0.45%',
		right: '39.32%',
		top: 'calc(50% - 23px/2 - 140px)',
	},
	subheader: {
		fontFamily: 'Poppins',
		fontStyle: 'normal',
		fontWeight: 300,
		fontSize: '11px',
		lineHeight: '16px',
		color: '#FFFFFF',
		position: 'relative',
		height: '17px',
		left: '0.45%',
		right: '58.31%',
		top: 'calc(50% - 17px/2 - 120px)',
	},
	iconContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: '1%',
	},
	content: {
		// height: "93vh",
		backgroundColor: '#fff',
		//overflowY: "auto",
		padding: '16px',
	},
	cardAction: {
		flexGrow: 1,
		display: 'flex',
		justifyContent: 'space-evenly',
		backgroundColor: '#fff',
		alignItems: 'right',
	},

	cardAction2: {
		flexGrow: 1,
		display: 'flex',
		justifyContent: 'space-evenly',
		//justifyContent: 'left',
		backgroundColor: '#f9f9f9',
		alignItems: 'right',
	},

	icons: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	toggle: {
		// float: "right",
		// position: 'relative',
		// right: '10px',
		paddingBottom: '5px',
		paddingLeft: '25px',
	},
	subContent: {
		'& div': {
			'&>.MuiPaper-root': {
				'&>:nth-child(3)': {
					height: 'calc(100vh - 56vh ) !important',
				},
			},
		},
	},
	subContent2: {
		'& div': {
			'&>.MuiPaper-root': {
				'&>:nth-child(3)': {
					height: 'calc(100vh - 56vh + 482px) !important',
				},
			},
		},
	},
	documentHeader: {
		display: 'flex',
		'& span': {
			marginTop: '2px',
			marginLeft: '5px',
		},
	},
	wellDocument: {
		'& .MuiTableRow-root': {
			'&>:nth-child(2) ': {
				'& .fileName': {
					width: '375px !important',
				},
			},
		},
	},
}));

export default function WellCardDetails(props) {
	const classes = useStyles();
	const [stateWellCard, setStateWellCard] = useContext(WellCardContext);
	const [production, setProduction] = useState(null);
	const [, setTarget] = useState(null);
	const [showSummary, setShowSummary] = useState(true);
	const [getExternalProductionDetail, { data: externalProductionDetail }] = useLazyQuery(PRODUCTIONDETAILQUERY);

	const { stateValues } = popupController.useState(['selectedWell', 'wellDetailCardTabIndex']);

	useEffect(() => {
		getExternalProductionDetail({
			variables: { id: stateValues.selectedWell.api, pageSize: '999' },
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (externalProductionDetail?.externalProductionDetail) {
			let temp = [];
			externalProductionDetail.externalProductionDetail.forEach(element => {
				let temp_row = { ...element };
				temp_row.ReportDate = moment.utc(temp_row.ReportDate).format('MM/YYYY');
				temp.push(temp_row);
			});
			setProduction(temp);
			setStateWellCard(state => {
				return {
					...state,
					wellProdHistory: temp,
				};
			});
			if (props.target) {
				setTarget(props.target);
			}
		} else {
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [externalProductionDetail, props.target, setTarget]);

	const handleChangeOil = event => {
		setStateWellCard({
			...stateWellCard,
			chartToggleOil: event.target.checked,
		});
	};

	const handleChangeGas = event => {
		setStateWellCard({
			...stateWellCard,
			chartToggleGas: event.target.checked,
		});
	};

	const handleChangeWater = event => {
		setStateWellCard({
			...stateWellCard,
			chartToggleWater: event.target.checked,
		});
	};

	const handleChangeMultiAxis = event => {
		setStateWellCard({
			...stateWellCard,
			chartToggleMultiAxis: event.target.checked,
		});
	};

	const OilSwitch = withStyles({
		switchBase: {
			color: '#81c784',
			'&$checked': {
				color: '#81c784',
			},
			'&$checked + $track': {
				backgroundColor: '#81c784',
			},
		},
		checked: {},
		track: {},
	})(Switch);

	const GasSwitch = withStyles({
		switchBase: {
			color: '#e57373',
			'&$checked': {
				color: '#e57373',
			},
			'&$checked + $track': {
				backgroundColor: '#e57373',
			},
		},
		checked: {},
		track: {},
	})(Switch);

	const WaterSwitch = withStyles({
		switchBase: {
			color: '#64b5f6',
			'&$checked': {
				color: '#64b5f6',
			},
			'&$checked + $track': {
				backgroundColor: '#64b5f6',
			},
		},
		checked: {},
		track: {},
	})(Switch);

	const DocumentHeader = () => (
		<div className={classes.documentHeader}>
			<DescriptionOutlinedIcon />
			<span>ASSOCIATED DOCUMENTS</span>
		</div>
	);

	return stateValues.selectedWell ? (
		<React.Fragment>
			<Grid item sm={12} className={classes.gridItemGrey}>
				<WellTypeCard summary={props.summary} />

				<WellStatusCard summary={props.summary} />
				<OwnerNumCard summary={props.summary} />
				<ProfileCard summary={props.summary} />
				<PermitDateCard summary={props.summary} />
				<SpudDateCard summary={props.summary} />
				<CompletionDateCard summary={props.summary} />
				<FirstProdDateCard summary={props.summary} />
				<PlugDateCard summary={props.summary} />
				<Box>
					<IconButton onClick={() => setShowSummary(!showSummary)} aria-label="delete" color="primary">
						{showSummary ? <KeyboardArrowUpIcon fontSize="large" /> : <KeyboardArrowDownIcon fontSize="large" />}
					</IconButton>
				</Box>
			</Grid>
			<Grid item sm={12} container className={classes.gridWidthScroll}>
				{showSummary && (
					<Grid item sm={12} container style={{ maxHeight: '482px', overflow: 'auto' }}>
						<Grid container spacing={2} style={{ marginRight: 0, marginLeft: 0 }}>
							<Grid item sm={8}>
								<TableSummary summary={props.summary} />
							</Grid>
							<Grid item xs={4}>
								<QuadProvider />
							</Grid>
						</Grid>
					</Grid>
				)}
				<Grid item sm={12} style={{ overflow: 'auto', maxHeight: 'calc(100vh - 650px)' }}>
					<Taps
						tabLabels={['Production', 'Interest Owners', 'Documents']}
						tabPanels={[
							<Paper elevation={3} style={{ padding: '10px' }}>
								<Grid container spacing={2}>
									<Grid item xs={12}>
										<div className={classes.toggle}>
											<FormControlLabel
												control={<OilSwitch checked={stateWellCard.chartToggleOil} onChange={handleChangeOil} />}
												label="Allocated Oil"
											/>
											<FormControlLabel
												control={
													<GasSwitch
														checked={stateWellCard.chartToggleGas}
														onChange={handleChangeGas}
														name="checkedGas"
														color="secondary"
													/>
												}
												label="Allocated Gas"
											/>
											<FormControlLabel
												control={
													<WaterSwitch
														checked={stateWellCard.chartToggleWater}
														onChange={handleChangeWater}
														name="checkedWater"
													/>
												}
												label="Allocated Water"
											/>
											<FormControlLabel
												control={
													<Switch
														checked={stateWellCard.chartToggleMultiAxis}
														onChange={handleChangeMultiAxis}
														color="primary"
													/>
												}
												label="Multi-Axes"
											/>
										</div>
									</Grid>
									<Grid item xs={12}>
										<WellProdChartProvider />
									</Grid>
									<Grid item xs={12}>
										{production != null && (
											<div className={showSummary ? classes.subContent : classes.subContent2}>
												<M1nTable dense parent="production_WellDetails" productionDetails={production} />
											</div>
										)}
									</Grid>
								</Grid>
							</Paper>,
							<Paper elevation={3} style={{ padding: '10px' }}>
								<div className={showSummary ? classes.subContent : classes.subContent2}>
									<M1nTable
										parent="OwnersPerWell"
										selectedWell={stateValues.selectedWell} // MIGRATE TO WELL CARD CONTEXT
									/>
								</div>
							</Paper>,
							<div className={`${classes.wellDocument}`}>
								<WellDetailsDocumentTable
									selectedWell={stateValues.selectedWell}
									parent="associatedDocumentsPerWell"
									targetLabel="wellDocument"
									header={<DocumentHeader />}
									dense
								/>
							</div>,
						]}
						openTabIdex={stateValues.wellDetailCardTabIndex}
					/>
				</Grid>
			</Grid>
		</React.Fragment>
	) : null;
}
