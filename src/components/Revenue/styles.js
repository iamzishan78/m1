import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { createTheme } from '@material-ui/core/styles';
import React from 'react';

const drawerWidth = 425;

export const theme = createTheme({
	overrides: {
		MuiSvgIcon: {
			root: {
				width: 90,
				height: 60,
			},
		},
		MuiListItemText: {
			root: {
				textAlign: 'center',
			},
		},
	},
});

export const useStyles = makeStyles(theme => ({
	iconArrow: {
		color: 'gray',
		textAlign: 'right',
		padding: '4px 0',
		transition: 'all 0.3s ease-in-out',
		margin: '5px 5px 0px auto',
		'&:hover': {
			background: 'unset',
			color: 'rgba(23, 170, 221, 1)',
		},
	},
	menuIcon: {
		position: 'relative',
		left: '-8px',
		fontSize: '30px',
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
		'& .MuiDrawer-paperAnchorLeft': {
			left: '60px',
		},
		'& .MuiDivider-root': {
			backgroundColor: '#263451',
		},
	},
	drawerPaper: {
		width: drawerWidth,
		backgroundColor: '#0e1119',
		color: 'white',
		zIndex: 1001,
	},
	quickActionText: {
		margin: '30px 10px 10px 10px',
		color: '#29abe0',
	},
	revenueRootExpanded: {
		marginLeft: '425px !important',
		width: 'calc(100% - 435px)',
	},
	revenueRootCollapsed: {
		marginLeft: '0px !important',
		width: '100%',
		transition: 'all 0.3s ease-in-out',
	},
	header: {
		padding: '10px 5px 15px 10px',
		alignItems: 'center',
	},
	pulloutBox: {
		zIndex: 2,
		position: 'absolute',
		top: '140px',
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
}));

export const StyledMenu = withStyles({})(props => <Paper elevation={0} variant="elevation" {...props} />);

export const StyledMenuItem = withStyles(theme => ({
	root: {
		fontFamily: 'Poppins',
		display: 'block',
		color: 'white',
		paddingLeft: '10px',
		'&:hover': {
			background: '#808080',
		},
		backgroundColor: '#0e111a',
		'& .MuiListItemIcon-root, & .MuiListItemText-primary': {
			color: theme.palette.common.white,
		},
	},
}))(MenuItem);
