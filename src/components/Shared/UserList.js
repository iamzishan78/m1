import React, { useState, useEffect } from 'react';

import { useLazyQuery } from '@apollo/client';
import PropTypes from 'prop-types';

import { GETMONGOUSERS } from 'graphQL/useQueryGetUsers';

import CustomAutoComplete from './components/Fields/CustomAutoComplete';

const UserList = ({ setValue, value, disabled, ...rest }) => {
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
		<CustomAutoComplete
			fieldAttributes={{
				value: { value },
			}}
			fieldEvents={{
				onChange: ({ value }) => setValue(value),
			}}
			fieldConfig={{
				size: 'small',
				textfieldRestProps: {
					multiline: true,
				},
				disabled,
			}}
			options={users.filter(u => u.text)}
			getOptionLabel={option => option.text}
			getOptionSelected={(option, selectedValue) => option.value === selectedValue?.value}
			{...rest}
		/>
	);
};

export default UserList;

UserList.propTypes = {
	setValue: PropTypes.func.isRequired,
	value: PropTypes.string,
};
