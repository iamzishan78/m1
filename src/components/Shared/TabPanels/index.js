import React from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import useTabedTablesUnmount from 'components/MRTTable/Hooks/useTabedTablesUnmount';

const useStyles = makeStyles(theme => ({
	tapsPanels: {
		'& .MuiBox-root': { padding: '0' },
	},
	tapsPanelsPadding: {
		'& .MuiBox-root': { padding: '0' },
	},
}));

const TabPanels = ({ panels, value, ignoreUnmount }) => {
	const classes = useStyles();

	useTabedTablesUnmount(ignoreUnmount);

	return (
		panels &&
		panels.length &&
		panels.map((panel, i) => (
			<TabPanel key={i} value={value} index={i} className={classes.tapsPanels}>
				{panel}
			</TabPanel>
		))
	);
};

export const TabPanel = props => {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box p={3}>{children}</Box>}
		</div>
	);
};

export default TabPanels;
