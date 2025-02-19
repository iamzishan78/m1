import React, { useState, useEffect } from 'react';

import { TextField, Grid, Avatar, InputAdornment, CircularProgress } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/styles';

import { useLazyQuery } from '@apollo/client';

import { getRandomColor } from 'components/Shared/functions/ui';
import CustomAvatar from 'components/Shared/ui/CustomAvatar';

import { detailCardController } from 'controllers/detailCardController';

import { GETMONGOUSERS } from 'graphQL/useQueryGetUsers';

const useStyles = makeStyles(theme => ({
	gridStyle: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	inputFieldOwner: {
		'& .MuiFormControl-marginNormal': {
			margin: '0px',
		},
		'& .MuiFormControl-marginDense': {
			margin: '0px',
		},
		'& .MuiInputBase-root': {
			borderRadius: '7px',
		},
	},
	dealOwnerAvatar: {
		width: theme.spacing(3),
		height: theme.spacing(3),
		color: '#fff',
		fontSize: '0.6rem',
		backgroundColor: '#4880F6',
		padding: '0.5em',
		'&:hover': {
			cursor: 'pointer',
			opacity: 0.85,
		},
	},
	dealOwnerLabel: {
		fontWeight: 'bold',
		fontSize: '15px',
	},
}));

const UsersListWithIcon = ({
	field,
	label,
	placeholder,
	selectedUserId,
	onChangeUser,
	labelSize = 3,
	fieldSize = 9,
}) => {
	const classes = useStyles();
	const [users, setUsers] = useState([]);

	const {
		stateValues: { loadingField },
	} = detailCardController.useState(['loadingField']);

	const [getAllMongoUsers, { data: userLists }] = useLazyQuery(GETMONGOUSERS, {
		fetchPolicy: 'no-cache',
	});

	useEffect(() => {
		getAllMongoUsers();
	}, [getAllMongoUsers]);

	useEffect(() => {
		if (userLists && userLists.allMongoUsers) {
			setUsers(
				userLists.allMongoUsers.map(user => ({
					value: user._id,
					text: user.name,
					email: user.email,
				}))
			);
		}
	}, [userLists]);

	return (
		<Grid container className={classes.gridStyle}>
			{label && (
				<Grid item xs={labelSize}>
					<div className={classes.dealOwnerLabel}>{label}</div>
				</Grid>
			)}
			<Grid item xs={fieldSize} style={{ maxWidth: '100%', flex: '1' }}>
				<Autocomplete
					id="userList"
					options={users.filter(u => u.text)}
					onChange={(e, user) => onChangeUser(user)}
					value={users.find(user => user?.value === selectedUserId) || null}
					getOptionLabel={option => option.text}
					getOptionSelected={option => option.value === selectedUserId}
					renderInput={params => (
						<TextField
							margin="dense"
							{...params}
							variant="outlined"
							className={classes.inputFieldOwner}
							InputLabelProps={{
								...params.InputLabelProps,
								shrink: true,
								classes: {
									root: classes.dealOwnerLabel,
								},
							}}
							placeholder={placeholder}
							InputProps={{
								...params.InputProps,
								startAdornment: (
									<>
										<InputAdornment position="start">
											<Avatar
												style={{
													backgroundColor: users.find(user => user?.value === selectedUserId)
														? getRandomColor(users.find(user => user?.value === selectedUserId).text.toString())
														: '',
												}}
												className={classes.dealOwnerAvatar}
											>
												{users.find(user => user?.value === selectedUserId) ? (
													<CustomAvatar
														diglog={true}
														email={users.find(user => user?.value === selectedUserId).email}
														text={
															users
																.find(user => user?.value === selectedUserId)
																.text.toString()
																.toUpperCase().length > 1
																? users.find(user => user?.value === selectedUserId).text.toString()
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
								endAdornment: (
									<React.Fragment>
										{params.InputProps.endAdornment}
										{loadingField && loadingField === field?.key && <CircularProgress size={22} color="secondary" />}
									</React.Fragment>
								),
							}}
						/>
					)}
				/>
			</Grid>
		</Grid>
	);
};

export default UsersListWithIcon;
