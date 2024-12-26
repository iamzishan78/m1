import React from 'react';

import Badge from '@material-ui/core/Badge';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import BarChartIcon from '@material-ui/icons/BarChart';

import Agreements from 'components/Shared/svgIcons/agreements';
import WellIcon from 'components/Shared/svgIcons/well';

const useStyles = makeStyles(theme => ({
	root: {
		height: '93vh',
		padding: '10px',
		position: 'absolute',
		right: 0,
		top: props => props.top,
		zIndex: 1223,
		backgroundColor: 'rgb(240,245,248)',
	},
	icon: {
		cursor: 'pointer',
		width: '40px',
		height: '40px',
		backgroundColor: 'rgb(210,221,228)',
		transition: '0.25s background-color',
		borderRadius: '100%',
		margin: '0 auto',
		marginBottom: '10px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',

		'&:hover': {
			backgroundColor: 'rgb(206, 212, 217)',
			transition: '0.25s background-color',
		},
	},
	activeIcon: {
		'& svg': {
			'& path': {
				fill: 'rgb(23, 170, 221) !important',
			},
		},
	},
	inactiveIcon: {
		'& svg': {
			'& path': {
				fill: '#919aa3',
			},
		},
	},
}));

export default function RightActionsPanel(props) {
	const classes = useStyles(props);
	const { activePanel, setPanel, propertiesCount, agreementsCount } = props;

	const drawerIcons = {
		'Add New Well': props => (
			<Badge anchorOrigin={{ vertical: 'top', horizontal: 'right' }} color="primary">
				<WellIcon {...props} />
			</Badge>
		),
		'Revenue Properties': props => (
			<Badge anchorOrigin={{ vertical: 'top', horizontal: 'right' }} color="primary" badgeContent={propertiesCount}>
				<BarChartIcon {...props} />
			</Badge>
		),
		Agreements: props => (
			<Badge anchorOrigin={{ vertical: 'top', horizontal: 'right' }} color="primary" badgeContent={agreementsCount}>
				<Agreements {...props} />
			</Badge>
		),
	};

	return (
		<div className={classes.root}>
			{Object.keys(drawerIcons).map(key => (
				<Tooltip title={key} placement="left">
					<div
						className={`${classes.icon} ${activePanel === key ? classes.activeIcon : classes.inactiveIcon}`}
						onClick={() => setPanel(key)}
					>
						{drawerIcons[key]({
							opacity: '1',
							height: '30',
						})}
					</div>
				</Tooltip>
			))}
		</div>
	);
}
