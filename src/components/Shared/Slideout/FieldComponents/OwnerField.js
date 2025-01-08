import React from 'react';

import { FormControl, Grid, InputAdornment, TextField, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Autocomplete } from '@material-ui/lab';

import { getRandomColor } from 'components/Shared/functions/ui';
import CustomAvatar from 'components/Shared/ui/CustomAvatar';

const useStyles = makeStyles(theme => ({
	dealOwnerLabel: {
		marginLeft: 4,
		// marginTOP: -2,
	},
	dealOwnerAvatar: {
		width: theme.spacing(3),
		height: theme.spacing(3),
		color: '#fff',
		fontSize: '0.6rem',
		backgroundColor: '#4880F6',
		padding: '0.5em',
	},
	inputFieldOwner: {
		marginBottom: '7px',
	},
	gridStyle: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	dealOwnerRoot: {
		border: '1px solid #EBEBEB',

		// This matches the specificity of the default styles at https://github.com/mui-org/material-ui/blob/v4.11.3/packages/material-ui-lab/src/Autocomplete/Autocomplete.js#L90
		'&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child': {
			// Default left padding is 6px
			paddingLeft: 26,
		},

		'& .MuiOutlinedInput-notchedOutline': {
			border: 0,
		},
		'&:hover.MuiOutlinedInput-root': {
			backgroundColor: '#EBEBEB',
		},
		'&:hover .MuiAutocomplete-popupIndicator': {
			visibility: 'visible',
			padding: '2px',
			marginRight: '-2px',
		},
	},
	dealOwnerRootFocused: {
		'& .MuiOutlinedInput-notchedOutline': {
			border: '1px solid black',
		},
	},
	popupIndicator: {
		visibility: 'hidden',
		padding: '2px',
		marginRight: '-2px',
		'&:hover': {
			visibility: 'visible',
		},
	},
}));

function OwnerField({ title, users, setOwnerId, ownerId, disabled = false }) {
	const classes = useStyles();

	return (
		<FormControl variant="outlined" fullWidth size="small">
			<Grid container className={classes.gridStyle}>
				<Grid item xs={3}>
					<div>{title}</div>
				</Grid>
				<Grid item xs={9}>
					<Autocomplete
						disabled={disabled}
						options={users
							.filter(u => u.text)
							.sort((a, b) => {
								return a.text.localeCompare(b.text);
							})}
						onChange={(e, user) => {
							setOwnerId(user?.value);
						}}
						value={users.find(user => user?.value === ownerId) || null}
						getOptionLabel={option => option.text}
						getOptionSelected={option => option.value === ownerId}
						classes={{
							inputRoot: classes.dealOwnerRoot,
							focused: classes.dealOwnerRootFocused,
							popupIndicator: classes.popupIndicator,
						}}
						renderInput={params => (
							<TextField
								margin="dense"
								{...params}
								variant="outlined"
								className={classes.inputFieldOwner}
								autoFocus
								InputLabelProps={{
									...params.InputLabelProps,
									shrink: true,
									classes: {
										root: classes.dealOwnerLabel,
									},
								}}
								placeholder="Assign Owner"
								InputProps={{
									...params.InputProps,
									startAdornment: (
										<>
											<InputAdornment position="start">
												<Avatar
													style={{
														backgroundColor: users.find(user => user?.value === ownerId)
															? getRandomColor(users.find(user => user?.value === ownerId).text.toString())
															: '',
													}}
													className={classes.dealOwnerAvatar}
												>
													{users.find(user => user?.value === ownerId) ? (
														<CustomAvatar
															diglog={true}
															email={users.find(user => user?.value === ownerId).email}
															text={
																users
																	.find(user => user?.value === ownerId)
																	.text.toString()
																	.toUpperCase().length > 1
																	? users.find(user => user?.value === ownerId).text.toString()
																	: 'Add Owner'
															}
														/>
													) : (
														'AO'
													)}
												</Avatar>
											</InputAdornment>
											{params.InputProps.startAdornment}
										</>
									),
								}}
							/>
						)}
					/>
				</Grid>
			</Grid>
		</FormControl>
	);
}

export default OwnerField;
