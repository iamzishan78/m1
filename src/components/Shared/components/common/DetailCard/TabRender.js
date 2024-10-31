import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { detailCardController } from 'hookstate/detailCardController';
import * as Pages from './pages';

const useStyles = makeStyles(theme => ({
	leftContainer: {
		padding: '0px 15px 0px 20px',
		borderBottom: '10px solid rgb(242, 242, 242)',
		maxHeight: 'fit-content',
	},
	tabRender: {
		height: '100%',
		flexWrap: 'nowrap',
	},
}));

const TabRender = () => {
	const {
		stateValues: { baseTabKey: tabKey, page, tabs },
	} = detailCardController.useState(['baseTabKey', 'page', 'tabs']);

	const classes = useStyles();

	const { MainGridLeftContainer, BottomContainer } = Pages[page];

	if (tabKey === 0 || !tabs || tabs.length < 2)
		return (
			<Grid container direction="column" className={classes.tabRender}>
				<Grid item xs={12} className={classes.leftContainer}>
					<MainGridLeftContainer />
				</Grid>

				<Grid item xs={12} style={{ height: '100%' }}>
					<BottomContainer />
				</Grid>
			</Grid>
		);

	const TabComponent = tabs?.[tabKey]?.component;
	return <>{typeof TabComponent === 'function' ? <TabComponent /> : null}</>;
};

export default TabRender;
