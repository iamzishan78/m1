import React, { useState, useEffect } from 'react';

import * as Pages from 'components/Shared/components/common/DetailCard/pages';
import UsersListWithIcon from 'components/Shared/UsersListWithIcon';

import { detailCardController } from 'stateManagement/detailCardController';

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
			callApi({ key: field.key, value: null, field, previousValue: fieldData?._id, resetFn: setValue });
			if (!field?.isRequired) {setValue(updatedvalue);}
		} else if (user?.value !== fieldData?._id) {
			callApi({ key: field.key, value: user?.value, field, previousValue: fieldData?._id, resetFn: setValue });
			setValue(updatedvalue);
		}
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
