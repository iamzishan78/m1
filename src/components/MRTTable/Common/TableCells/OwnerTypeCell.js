import React from 'react';
import Avatar from 'react-avatar';

import { IconButton } from '@material-ui/core';

import { tableGlobalController } from 'hookstate/tableController';

function OwnerTypeCell({ contactOwner }) {
	// Getting users from global table state
	const globalState = tableGlobalController.useState(['users']);
	const users = globalState.users;
	if (!contactOwner?.name) {
		return <p></p>;
	}
	contactOwner = users?.find(user => user?.name === contactOwner?.name) || contactOwner;
	// Component will show avatar based onn user name and profile image
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
			}}
		>
			<IconButton>
				{contactOwner?.profileImage ? (
					<Avatar src={contactOwner?.profileImage} size="35" round />
				) : (
					<Avatar name={contactOwner?.name} size="35" round />
				)}
			</IconButton>
			<p
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					minWidth: '300px',
					marginLeft: '10px',
				}}
			>
				{contactOwner?.name}
			</p>
		</div>
	);
}

export default OwnerTypeCell;
