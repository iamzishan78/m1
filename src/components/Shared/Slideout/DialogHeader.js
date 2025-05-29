import React, { memo, useState } from 'react';

import { Menu, MenuItem, ListItemIcon, ListItemText } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import { useHookstate } from '@hookstate/core';

import KeyboardTabBlackIcon from 'components/Shared/svgIcons/KeyboardTabBlackIcon';

import { slidoutState } from 'stateManagement/initialStates';

const getDealNameFieldHeight = title => {
	const lineLength = Math.ceil(title.length / 53);
	return `${24 * lineLength}px !important`;
};

const useStyles = makeStyles(() => ({
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
		width: '110%',
		padding: '20px 0 20px 10px',
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
		textAlign: 'left',
		fontSize: '1.2rem',
		'&.Mui-focused fieldset': {
			border: '1px solid black',
			backgroundColor: 'transparent',
		},
		'&:hover': {
			border: '1px solid black',
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

const DialogHeader = ({ handleClickDialogClose, openConfirmationDialog }) => {
	const title = useHookstate(slidoutState.title);
	const newEntity = useHookstate(slidoutState.newEntity);
	const parentType = useHookstate(slidoutState.parentType);
	const isObligation = parentType.get() === 'Obligation';

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
			<Grid
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					padding: '10px',
					maxHeight: '115px',
				}}
			>
				<Grid item style={{ flexGrow: 1 }} xs={9} alignItems="center">
					<FormControl variant="outlined" className={classes.inputFieldDealName} fullWidth size="small">
						<TextField
							margin="dense"
							value={title.get()}
							variant="outlined"
							placeholder="Click to enter title"
							required
							multiline
							autoFocus
							disabled={isObligation}
							error={!title.get() && !isObligation}
							helperText={!title.get() && !isObligation ? 'Enter a title to get started' : ''}
							onChange={({ target }) => {
								title.set(target.value);
							}}
							InputProps={{
								classes: {
									root: classes.dealNameRoot,
									focused: classes.focused,
									notchedOutline: classes.notchedOutline,
								},
							}}
							// onBlur={() => setTitleFocus(false)}
						/>
						{/* <TextareaAutosize aria-label="empty textarea" placeholder="Empty" style={{ width: 200 }} /> */}
					</FormControl>
				</Grid>
				<Grid item xs={3} className={classes.dialogActions}>
					{!newEntity.get() && (
						<>
							<IconButton
								// disabled={updateDealLoading || addContactLoading}
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
								<MenuItem onClick={openConfirmationDialog}>
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
