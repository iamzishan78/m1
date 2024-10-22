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

	const [value, setValue] = useState(fieldData?.get({ noproxy: true }) || '');

	const handleChange = user => {
		let updatedvalue = user?.value || '';
		callApi(user?.value);

		if (user?.value !== fieldData?.get({ noproxy: true })) {
			callApi(field.key, user?.value);
		}

		setValue(updatedvalue);
	};

	useEffect(() => {
		setValue(fieldData?.get({ noproxy: true }) || '');
	}, [fieldData]);

	return <UsersListWithIcon placeholder={field.placeholder} selectedUserId={value} onChangeUser={handleChange} />;
};

export default SummaryUsersList;
