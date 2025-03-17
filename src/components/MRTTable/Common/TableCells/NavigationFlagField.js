import React, { memo, useEffect, useState } from 'react';
import { Checkbox } from '@material-ui/core';
import { UPDATE_USER_FEATURE_SETTING } from 'graphQL/useMutationUpdateUserFeatureSetting';
import { useMutation } from '@apollo/client';
import { globalStateController } from 'stateManagement/globalStateController';

function NavigationFlagField({ featureName, row }) {
	const { stateValues } = globalStateController.useState(['user']);
	const [value, setValue] = useState(true);
	const [found, setFound] = useState(true);
	const [updateUserFeatureSetting] = useMutation(UPDATE_USER_FEATURE_SETTING);

	useEffect(() => {
		if (['mapModule'].includes(featureName)) {
			setValue(true);
			setFound(false);
		} else {
			const found = stateValues?.user?.features?.find(feature => feature.name === featureName);

			const checked =
				row?.featureSettings?.[featureName] !== undefined && found
					? row.featureSettings[featureName]
					: !found
						? false
						: true;

			setValue(checked);
			setFound(!!found);
		}
	}, []);

	return (
		<div style={{ marginRight: '10px' }}>
			<Checkbox
				checked={value}
				onChange={e => {
					setValue(!value);
					updateUserFeatureSetting({
						variables: {
							userId: row._id,
							feature: featureName,
							value: !value,
						},
					});
				}}
				disabled={!found}
			/>
		</div>
	);
}

export default memo(NavigationFlagField);
