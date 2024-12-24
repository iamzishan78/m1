import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import React from 'react';

import { slidoutStateController } from 'hookstate/slidoutStateController';

const useStyles = makeStyles(theme => ({
	root: {
		height: '100vh',
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
			fill: 'rgb(23, 170, 221) !important',
		},
	},
	inactiveIcon: {
		'& svg': {
			fill: 'rgba(146, 158, 170, 1) !important',
		},
	},
}));

export default function Drawer(props) {
	const classes = useStyles(props);
	const slideOutState = slidoutStateController.useState(['views', 'view', 'activeTabs']);
	const slideOutStateValues = slideOutState.stateValues;

	const drawerIcons = slideOutStateValues?.views;

	const handleClick = view => {
		slideOutState.view.set(view);
	};

	const getClass = key => {
		const activeTabs = slideOutStateValues?.activeTabs;

		const view = slideOutStateValues?.view;
		return activeTabs[key] || view.name === key ? classes.activeIcon : classes.inactiveIcon;
	};

	return (
		<div className={classes.root}>
			{drawerIcons.map((view, index) => {
				const { name, Icon, show } = view;
				if (show === false) {
					return null;
				}
				return (
					<Tooltip key={index} title={name} placement="left">
						<div className={`${classes.icon} ${getClass(name)}`} onClick={() => handleClick(view)}>
							<Icon {...props} opacity="1" height="30" />
						</div>
					</Tooltip>
				);
			})}
		</div>
	);
}
