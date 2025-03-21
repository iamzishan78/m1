import React, { memo, useState } from 'react';

import { Menu, MenuItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import KeyboardTabBlackIcon from 'components/Shared/svgIcons/KeyboardTabBlackIcon';

import { slidoutStateController } from 'stateManagement/slidoutStateController';

const getDealNameFieldHeight = title => {
	const lineLength = Math.ceil(title.length / 53);
	return `${24 * lineLength}px !important`;
};

const useStyles = makeStyles(theme => ({
	dealStateOpenWon: {
		padding: '8px 16px',
		borderRadius: 5,
		cursor: 'pointer',
		backgroundColor: '#d9d9d9',
		'&:hover': {
			backgroundColor: '#a6e5c3',
			fontWeight: 'bold',
			color: '#54a83c',
		},
	},
	dealStateOpenLost: {
		padding: '8px 16px',
		borderRadius: 5,
		cursor: 'pointer',
		backgroundColor: '#d9d9d9',
		'&:hover': {
			backgroundColor: '#ffa8a8',
			fontWeight: 'bold',
			color: '#f96060',
		},
	},
	dealStateClosed: {
		padding: '8px 16px',
		borderRadius: 18,
	},
	dealStateReopen: {
		padding: '2px 10px',
		cursor: 'pointer',
		borderRadius: 5,
		border: '1px solid gray',
	},
	inputField: {
		outline: 'none',
	},
	inputFieldDealName: props => ({
		width: '750px',
		'& .MuiTextField-root': {
			'& .MuiInputBase-multiline': {
				'& .MuiInputBase-inputMultiline': {
					height: props.title.length > 0 ? getDealNameFieldHeight(props.title) : 'auto !important',
				},
			},
		},
	}),
	dealNameRoot: {
		fontWeight: 'bold',
		paddingLeft: 0,
		textAlign: 'left',
		fontSize: '1.2rem',
		'&.Mui-focused fieldset': {
			border: '1px solid black',
			backgroundColor: 'transparent',
		},
	},
	notchedOutline: {
		border: 0,
	},
	menu: {
		'& .MuiListItem-root': {
			'& .MuiListItemIcon-root': {
				minWidth: '30px',
				'& .MuiSvgIcon-root': {
					fill: 'red !important',
				},
			},
		},
	},
	dialogActions: {
		display: 'flex',
		justifyContent: 'flex-end',
		'& svg': {
			fill: '#d9d9d9',
			'&:hover': {
				fill: '#b5b2b2',
			},
		},
	},
}));

const DialogHeader = ({ handleClickDialogClose, deleteFunc }) => {
	const slideOutState = slidoutStateController.useState(['title', 'newEntity']);
	const slideOutStateValues = slideOutState.stateValues;
	const title = slideOutStateValues.title;

	const classes = useStyles({ title });
	const [anchorEl, setAnchorEl] = useState();

	const handleMenuClick = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	return (
		<div>
			<Grid container style={{ padding: '10px' }}>
				<Grid item container xs={9} alignItems="center">
					<Typography variant="h6" style={{ cursor: 'pointer', paddingLeft: '10px' }} className={classes.dealNameRoot}>
						{title}
					</Typography>
				</Grid>
				<Grid item xs={3} className={classes.dialogActions}>
					{!slideOutStateValues?.newEntity && (
						<>
							<IconButton
								size="small"
								component="span"
								style={{
									background: 'transparent',
									paddingLeft: '10px',
									align: 'center',
								}}
								onClick={handleMenuClick}
							>
								<MoreHorizIcon size="medium" />
							</IconButton>
							<Menu
								id="dealMenu"
								anchorEl={anchorEl}
								keepMounted
								open={Boolean(anchorEl)}
								onClose={handleMenuClose}
								className={classes.menu}
								getContentAnchorEl={null}
								anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
								transformOrigin={{ vertical: 'top', horizontal: 'center' }}
							>
								<MenuItem onClick={deleteFunc}>
									<ListItemIcon>
										<DeleteIcon size="medium" />
									</ListItemIcon>
									<ListItemText>Delete</ListItemText>
								</MenuItem>
							</Menu>
						</>
					)}

					<IconButton
						size="small"
						component="span"
						style={{
							background: 'transparent',
							paddingLeft: '10px',
							align: 'center',
						}}
						onClick={handleClickDialogClose}
					>
						<KeyboardTabBlackIcon />
					</IconButton>
				</Grid>
			</Grid>
			<Divider />
		</div>
	);
};

export default memo(DialogHeader);
