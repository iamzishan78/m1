import React, { useState } from 'react';

import UserList from 'components/Shared/UserList';

import { sideDialogController } from 'stateManagement/sideDialogController';

const UserField = ({ dialogKey, item }) => {
	const [user, setUser] = useState(null);

	return (
		<UserList
			value={user}
			setValue={user => {
				setUser(user);
				sideDialogController(dialogKey).updateState({ [item.name]: user });
			}}
		/>
	);
};

export default UserField;
