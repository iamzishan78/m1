import UserList from 'components/Shared/UserList';
import { sideDialogController } from 'hookstate/sideDialogController';
import React, { useState } from 'react';

const UserField = ({dialogKey, item}) => {
  const [user, setUser] = useState(null)

	return (
		<UserList
			value={user}
			setValue={user => {
        setUser(user)
				sideDialogController(dialogKey).updateState({ [item.name]: user });
			}}
		/>
	);
};

export default UserField;
