import React, { useState, useEffect } from 'react';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { useLazyQuery } from '@apollo/client';

import { GETMONGOUSERS } from 'graphQL/useQueryGetUsers';

const UserList = ({ setValue, value, ...rest }) => {
	const [users, setUsers] = useState([]);

	const [getAllMongoUsers, { data: userLists }] = useLazyQuery(GETMONGOUSERS, {
		fetchPolicy: 'cache-and-network',
	});

	useEffect(() => {
		getAllMongoUsers();
	}, []);

	useEffect(() => {
		if (userLists && userLists.allMongoUsers) {
			setUsers(
				userLists.allMongoUsers.map(user => ({
					value: user._id,
					text: user.name,
					...user,
				}))
			);
		}
	}, [userLists]);

	return (
		<Autocomplete
			{...rest}
			options={users.filter(u => u.text)}
			onChange={(e, user) => {
				setValue(user);
			}}
			value={value}
			getOptionLabel={option => option.text}
			getOptionSelected={option => option.value === value}
			renderInput={params => <TextField size="small" {...params} multiline />}
		/>
	);
};

export default UserList;
