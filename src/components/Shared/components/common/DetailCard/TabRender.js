import React from 'react';

import { Grid, makeStyles } from '@material-ui/core';

import { detailCardController } from 'stateManagement/detailCardController';
import { popupController } from 'stateManagement/popupStateController';

import * as Pages from './pages';

const useStyles = makeStyles(theme => ({
	leftContainer: ({ expandedCard }) => ({
		padding: '0px 15px 0px 20px',
		borderBottom: expandedCard ? '0' : '10px solid rgb(242, 242, 242)',
		height: 'fit-content',
		maxHeight: !expandedCard ? '25vh' : '100%',
		overflowY: 'auto',
	}),
	tabRender: {
		height: '100%',
		flexWrap: 'nowrap',
	},
}));

const TabRender = () => {
	const {
		stateValues: { expandedCard },
	} = popupController.useState(['expandedCard']);

	const {
		stateValues: { baseTabKey: tabKey, page, tabs },
	} = detailCardController.useState(['baseTabKey', 'page', 'tabs']);

	const classes = useStyles({ expandedCard });

	const { MainGridLeftContainer, BottomContainer } = Pages[page];

	if (tabKey === 0 || !tabs || tabs.length < 2) {
		return (
			<Grid container direction="column" className={classes.tabRender}>
				<Grid item xs={12} className={classes.leftContainer}>
					<MainGridLeftContainer />
				</Grid>

				{!expandedCard && (
					<Grid item xs={12} style={{ height: '100%' }}>
						<BottomContainer />
					</Grid>
				)}
			</Grid>
		);
	}

	const TabComponent = tabs?.[tabKey]?.component;
	return <>{typeof TabComponent === 'function' ? <TabComponent /> : null}</>;
};

export default TabRender;
