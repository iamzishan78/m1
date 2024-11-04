import React from 'react';

import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import { detailCardController } from 'hookstate/detailCardController';

import * as Pages from './pages';
import TabRender from './TabRender';
import { popupController } from 'hookstate/popupStateController';

const useStyles = makeStyles(theme => ({
	container: {
		top: '30px',
	},
	tabsContainer: {
		background: '#fff',
		// height: ({ isTabbed }) => (isTabbed ? 'calc(100vh - 264px)' : 'calc(100vh - 238px)'),
		height: 'calc(100vh - 220px)',
		overflow: 'auto',
	},
	header: {
		backgroundColor: '#fff',
		padding: '12px 20px 12px 20px',
		borderTop: '9px solid rgb(242, 242, 242)',
		borderBottom: '10px solid rgb(242, 242, 242)',
	},
	rightContainer: {
		backgroundColor: 'rgb(242, 242, 242)',
	},
	rightContent: {
		height: '100%',
		// height: ({ isTabbed }) => (isTabbed ? 'calc(100vh - 288px)' : 'calc(100vh - 210px)'),
		margin: '0px 15px',
	},
	title: {
		display: 'flex',
		alignItems: 'center',
		width: '100%',
	},
	mainGridContainer: {
		display: 'flex',
		marginTop: '8px',
		// height: ({ isTabbed }) => isTabbed ? 'calc(100vh - 236px)' : 'calc(100vh - 210px)',
		'& a': { color: '#757575' },
		'& .MuiPopover-paper': {
			zIndex: '1700',
		},
	},
	rightColumnGrid: {
		display: 'block',
		margin: '0',
		minHeight: '100%',
		backgroundColor: '#F0F6F8',
		position: 'relative',
		transition: 'width 0.3s ease-out',
		webkitTransition: 'width 0.3s ease-out',
		width: ({ shrinkRightColumn }) => (shrinkRightColumn ? '0px' : '37%'),
	},
	pulloutBox: {
		position: 'absolute',
		top: ({ isTabbed }) => (isTabbed ? '180px' : '150px'),
		right: 0,
		height: '80px',
		color: 'white',
		width: '20px',
		background: '#141d32',
		cursor: 'pointer',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		'& svg': {
			transform: 'scaleX(0.5)',
		},
	},

	border: {
		borderBottom: 'solid 1px #eaeaea',
	},
	summarySection: {
		width: '100%',
		backgroundColor: '#fff',
	},
	detailCardSection: {
		backgroundColor: '#fff',
		marginTop: '3px',
		width: '100%',
	},
}));

const Content = () => {
	const {
		stateValues: { expandedCard },
	} = popupController.useState(['expandedCard']);

	const {
		stateValues: { shrinkRightColumn, tabs, page },
	} = detailCardController.useState(['shrinkRightColumn', 'tabs', 'page']);

	const classes = useStyles({
		shrinkRightColumn: shrinkRightColumn,
		isTabbed: tabs && tabs.length > 1,
	});

	if (!Pages[page]) return null;

	const { Header, MainGridRightContainer } = Pages[page];

	return (
		<Grid sx={{ display: 'flex' }} direction="column" className={classes.container}>
			<Grid item xs={12} className={classes.header}>
				<Header />
			</Grid>

			<Grid item xs={12}>
				<Grid container direction="row" className={classes.tabsContainer}>
					<Grid item xs={shrinkRightColumn ? 12 : expandedCard ? 7 : 8}>
						<TabRender />
					</Grid>

					{!shrinkRightColumn && (
						<Grid item xs={expandedCard ? 5 : 4} className={classes.rightContainer}>
							<div className={classes.rightContent}>
								<MainGridRightContainer />
							</div>
						</Grid>
					)}
				</Grid>
			</Grid>

			{shrinkRightColumn && (
				<div className={classes.pulloutBox} onClick={detailCardController.togglePullout}>
					<ArrowBackIosIcon id="ArrowBackIosIcon" />
				</div>
			)}
		</Grid>
	);
};

export default Content;
