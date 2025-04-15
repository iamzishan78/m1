import React, { useState, useEffect } from 'react';

import { Select, FormControl, MenuItem, TextField, Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';

import { FEATURES } from 'components/Shared/FeatureFlag/common';
import FeatureFlag from 'components/Shared/FeatureFlag/FeatureFlagComponent';

import { ADD_USER, UPDATE_USER } from 'graphQL/userManagement';

import { tableGlobalController } from 'stateManagement/tableController';

import { Modals } from 'styles/Modal';

import { RolePrivilege, UserRole } from 'utils/data';

export default function InviteUserDialog(props) {
	const modalClass = Modals();
	const { stateValues } = tableGlobalController.useState(['dialog']);
	const { activeUser } = stateValues?.dialog || {};
	const [displayName, setName] = useState('');
	const [emails, setEmailAddress] = useState('');
	const [role, setUserRole] = useState('USER');
	const [rolePrivileges, setRolePrivileges] = useState('ADD_OR_EDIT');

	const handleClose = () => {
		setName('');
		setEmailAddress('');
		setUserRole('USER');

		tableGlobalController.updateState({
			dialog: {},
		});

		props.onClose();
	};

	const [addUser] = useMutation(ADD_USER, {
		onCompleted: () => {
			handleClose();
			tableGlobalController.refetch();
		},
	});
	const [updateUser] = useMutation(UPDATE_USER, {
		onCompleted: () => {
			handleClose();
			tableGlobalController.refetch();
		},
	});

	useEffect(() => {
		if (activeUser) {
			setName(activeUser.displayName);
			setEmailAddress(activeUser.email);
			setUserRole(activeUser.role?.toUpperCase());
			setRolePrivileges(activeUser.rolePrivileges);
		}
	}, [activeUser]);

	const submitAddUser = () => {
		addUser({
			variables: {
				user: {
					displayName,
					email: emails,
					role,
					rolePrivileges,
				},
			},
		});
	};

	const submitUpdateUser = () => {
		updateUser({
			variables: {
				user: {
					id: activeUser.id,
					displayName,
					email: emails,
					role,
					rolePrivileges,
				},
			},
		});
	};

	return (
		<React.Fragment>
			<DialogTitle className={modalClass.title} id="customized-dialog-title">
				{activeUser ? 'Update User' : 'Invite a New User'}
				<HighlightOffIcon fontSize="large" className={modalClass.titleClose} onClick={handleClose} />
			</DialogTitle>
			<DialogContent>
				<Grid container spacing={2}>
					<FormControl style={{ minWidth: 350 }}>
						<Grid item xs={12}>
							<h3>Name</h3>
							<TextField size="small" fullWidth value={displayName} onChange={e => setName(e.target.value)} />
						</Grid>
						<Grid item xs={12}>
							<h3>Email</h3>
							<TextField
								size="small"
								fullWidth
								disabled={activeUser}
								value={emails}
								onChange={e => setEmailAddress(e.target.value)}
							/>
						</Grid>
						{/* <Grid item xs={12}>
            <h3>User Type</h3>
            <Select
                fullWidth
                value={userType}
                onChange={e=> setUserType(e.target.value)}
            >
                <MenuItem value="Member">Member</MenuItem>
                <MenuItem value="Guest">Guest</MenuItem>
            </Select>
          </Grid> */}
						<Grid item xs={12}>
							<h3>User Role</h3>
							<Select fullWidth value={role} onChange={e => setUserRole(e.target.value)}>
								{Object.entries(UserRole).map(([key, value]) => (
									<MenuItem key={key} value={key}>
										{value}
									</MenuItem>
								))}
							</Select>
						</Grid>

						<FeatureFlag feature={FEATURES.SHOWUSERPRIVILEGES}>
							<Grid item xs={12}>
								<h3>User Privileges</h3>
								<Select fullWidth value={rolePrivileges} onChange={e => setRolePrivileges(e.target.value)}>
									{Object.entries(RolePrivilege).map(([key, value]) => (
										<MenuItem key={key} value={key}>
											{value}
										</MenuItem>
									))}
								</Select>
							</Grid>
						</FeatureFlag>
					</FormControl>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="primary">
					Cancel
				</Button>
				<Button onClick={activeUser ? submitUpdateUser : submitAddUser} color="secondary">
					{activeUser ? 'Update' : 'Send Invite'}
				</Button>
			</DialogActions>
		</React.Fragment>
	);
}

InviteUserDialog.propTypes = {
	onClose: PropTypes.func.isRequired,
};
