import React, { useCallback, useEffect, useState } from 'react';

import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';

import { detailCardController } from 'hookstate/detailCardController';

import MRTTable from 'components/MRTTable';
import MRSimpleTable from 'components/MRSimpleTable';
import { TabPanel } from 'components/Shared/TabPanels';
import FeatureFlag from 'components/Shared/FeatureFlag/FeatureFlagComponent';
import { tableGlobalController } from 'hookstate/tableController';

const useStyles = makeStyles(theme => ({
	card: {
		width: '100%',
		height: '100%',
		'& .MuiInput-inputTypeSearch': {
			width: '96%',
		},
	},
	rootList: {
		width: ({ mapGridCardActivated }) =>
			mapGridCardActivated === 'min' ? '57vw' : mapGridCardActivated === 'exp' ? '96vw' : '57vw',
		height: ({ mapGridCardActivated }) =>
			mapGridCardActivated === 'min' ? '60vh' : mapGridCardActivated === 'exp' ? '91vh' : '60vh',
		left: ({ mapGridCardActivated, expandGrid }) => (mapGridCardActivated === 'exp' ? '2vw' : '2vw'),
		top: ({ mapGridCardActivated }) => (mapGridCardActivated === 'exp' ? '5vh' : '12vh'),
		zIndex: '1300',
		position: 'fixed',
	},
	dockMenu: {
		width: '100%',
		height: '100%',
	},
	tapsRoot: {
		'& .MuiTab-root': {
			textTransform: 'none',
		},
	},
	appBar: {
		backgroundColor: '#F2F2F2',
		borderBottom: '1px solid rgba(224, 224, 224, 1)',
		boxShadow: 'none',
		color: '#757575',
		cursor: 'context-menu',
		'& .MuiIconButton-root:hover': {
			backgroundColor: 'rgba(255, 255, 255, 0.08)',
		},
		'& button': {
			cursor: 'pointer',
		},
	},
	tapsPanels: {
		'& .MuiBox-root': { padding: '0' },
	},
	mainPanelsDiv: {
		height: '100%',
		maxHeight: '100vh',
		position: 'relative',
		'&::-webkit-scrollbar': {
			width: '0.75em',
			height: '0.75em',
		},
		'&::-webkit-scrollbar-thumb': {
			backgroundColor: '#929292',
			borderRadius: 10,
		},
	},
	tapsLabelsButtons: {
		boxShadow: 'none',
		backgroundColor: '#fff',
		color: '#757575',
		'&:hover': { boxShadow: 'none !important' },
	},
	tapsLabelsButtonsSelected: {
		boxShadow: 'none',
		color: '#fff',
		backgroundColor: theme.palette.secondary.main,
		'&:hover': { color: '#757575', boxShadow: 'none !important' },
	},
	viewportWells: {
		textAlign: 'center',
		'& #minimumZoomRequired': {
			margin: '30px',
			fontSize: '1.25rem',
			fontFamily: 'Poppins',
			fontWeight: '500',
			lineHeight: '1.6',
			display: 'block',
		},
		'& #viewportWellsTable': {
			display: 'none',
		},
	},
	selectBoundary: {
		background: 'white',
		width: '180px',
		height: '35px',
		marginTop: '6px',
		marginBottom: '6px',
		marginLeft: '10px',
		'& .MuiSelect-select.MuiSelect-select': {
			paddingLeft: '10px',
		},
	},
	selectorOptions: {
		backgroundColor: '#F2F2F2',
		minHeight: 'calc(60vh - 200px)',
		overflow: 'overlay',
	},
}));

const ComponentRender = ({ props: { component, isMRTTable, isMRSimpleTable, tableKey, props } }) => {
	if (component) return <>{component}</>;

	if (isMRTTable) return <MRTTable key={`MRTTable-${tableKey}`} name={tableKey} {...props} />;
	if (isMRSimpleTable) return <MRSimpleTable key={`MRSimpleTable-${tableKey}`} name={tableKey} {...props} />;

	return null;
};

function DetailCardBottom({ data }) {
	const {
		bottomTabKey,
		stateValues: { bottomTabKey: tabKey },
	} = detailCardController.useState(['bottomTabKey']);

	const [searchTapValue, SearchTapValue] = useState(data[0]);

	const setSearchTapValue = useCallback(
		state => {
			if (searchTapValue !== state) {
				tableGlobalController.reInitialized();
				SearchTapValue(state);
			}
		},
		[searchTapValue, SearchTapValue]
	);

	useEffect(() => {
		setSearchTapValue(data[tabKey]);
	}, [bottomTabKey, data, tabKey, setSearchTapValue]);

	// styles
	const classes = useStyles({
		mapLayersPanelExtended: '',
		mapGridCardActivated: '',
		mapGridCardActiveTap: '',
		userGridViewFilters: '',
		// screenSizes
	});

	return (
		<div className={classes.card}>
			<Card className={classes.dockMenu}>
				<div className={`cancelDraggableEffect ${classes.mainPanelsDiv}`} style={{ position: 'relative' }}>
					{/* //// search panel //// */}
					<TabPanel value={0} index={0} style={{ width: '100%', height: '100%' }} isGenericDetail={true}>
						<Grid container direction="row" style={{ height: '100%' }}>
							<Grid item md={2} className={classes.selectorOptions}>
								<Typography variant="h6" component="h1" style={{ fontWeight: 'bold', padding: '10px 0px 0px 20px' }}>
									Associated Data
								</Typography>

								<List component="nav" aria-label="main mailbox folders">
									{data?.map((row, index) => {
										const Icon = row?.Icon;
										return (
											<FeatureFlag feature={row?.feature} noCheck={!row?.feature}>
												<ListItem
													button
													selected={row?.value === searchTapValue?.value}
													onClick={() => {
														detailCardController.setBottomSelectedTab(index);
														detailCardController.updateState({ selectedAssoicatedModel: row?.associatedModel });
													}}
												>
													<ListItemIcon style={{ minWidth: '35px' }}>
														<Icon />
													</ListItemIcon>
													<ListItemText>{row?.label} </ListItemText>
												</ListItem>
											</FeatureFlag>
										);
									})}
								</List>
							</Grid>

							<Grid item md={10} style={{ padding: '0px' }}>
								<div style={{ position: 'relative' }} classes={classes.gridTables}>
									<ComponentRender props={searchTapValue} />
								</div>
							</Grid>
						</Grid>
					</TabPanel>
				</div>
			</Card>
		</div>
	);
}

export default DetailCardBottom;
