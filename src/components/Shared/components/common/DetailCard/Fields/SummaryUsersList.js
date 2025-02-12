import React, { useState, useEffect } from 'react';
import { detailCardController } from 'hookstate/detailCardController';
import * as Pages from 'components/Shared/components/common/DetailCard/pages';
import UsersListWithIcon from 'components/Shared/UsersListWithIcon';

const SummaryUsersList = ({ fieldData, field }) => {
	const {
		stateValues: { page },
	} = detailCardController.useState(['page']);
	const { useUpdate } = Pages[page];
	const { callApi } = useUpdate();

	const [value, setValue] = useState(fieldData || '');

	const handleChange = user => {
		let updatedvalue = user?.value || '';

		if (!user) {
			callApi({ key: field.key, value: null });
		} else if (user?.value !== fieldData?._id) {
			callApi({ key: field.key, value: user?.value });
		}
		setValue(updatedvalue);
	};

	useEffect(() => {
		setValue(fieldData?._id || '');
	}, [fieldData]);

	return (
		<UsersListWithIcon
			field={field}
			placeholder={`Enter ${field?.label}`}
			selectedUserId={value}
			onChangeUser={handleChange}
		/>
	);
};

export default SummaryUsersList;
