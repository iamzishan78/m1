import { Divider, makeStyles, Tab, Tabs, withStyles } from '@material-ui/core';
import React, { useState } from 'react';

import MRTTable from 'components/MRTTable';

import ShapeFile from './ShapeFile';

const useStyles = makeStyles(theme => ({
	mainTabContainer: {
		margin: '75px 0 10px',
	},
	actionsGrid: {
		'& .MuiButtonBase-root': {
			width: '149px',
			height: '35px',
			fontWeight: 'bold',
		},
	},
	divider: {
		height: '10px',
		backgroundColor: '#f3f3f3',
	},
}));

const StyledTabs = withStyles({
	root: {
		borderBottom: '1px solid #e8e8e8',
		textTransform: 'capitalize',
		padding: '0px 26px',
	},
	indicator: {
		backgroundColor: '#12abe0',
		height: '4px',
	},
})(Tabs);

const StyledTab = withStyles(theme => ({
	root: {
		textTransform: 'uppercase',
		minWidth: 72,
		fontWeight: theme.typography.fontWeightBold,
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
		},
		'&:focus': {
			color: 'black',
		},
	},
	selected: {},
}))(props => <Tab disableRipple {...props} />);

const tabs = [
	{ label: 'Platform Wells', table: 'WellsTable' },
	{ label: 'Agreements', table: 'AgreementTable' },
	{ label: 'Units', table: 'UnitTable' },
	{ label: 'Tracts', table: 'TractsTable' },
	{ label: 'My Wells', table: 'MyWellsTable' },
	{ label: 'Shape File', type: 'shapeFile' },
];

export default function LandAnalytics() {
	const classes = useStyles();
	const [tab, setTab] = useState(0);

	return (
		<>
			<div className={classes.mainTabContainer}>
				<StyledTabs
					value={tab}
					onChange={(event, tab) => {
						setTab(tab);
						window.setStateApp(state => ({ ...state, landAnalyticsSearchQuery: '' }));
					}}
					aria-label="ant example"
				>
					{tabs.map(({ label }) => (
						<StyledTab key={label} label={label} />
					))}
				</StyledTabs>
			</div>

			{tabs.map(({ label, table, overrideMeta, type }, index) => {
				if (tab !== index) {
					return null;
				}

				if (type === 'shapeFile') {
					return <ShapeFile />;
				}

				return (
					<MRTTable
						key={label}
						name={table}
						overrideMeta={{
							maxTableHeight: 'calc(100vh - 290px)',
							...overrideMeta,
						}}
					/>
				);
			})}
			<Divider className={classes.divider} />
		</>
	);
}
