import React, { useState, useEffect } from 'react';

import { FormControl, FormControlLabel, Radio, RadioGroup as MUIRadioGroup } from '@material-ui/core';

import PropTypes from 'prop-types';

import * as Pages from 'components/Shared/components/common/DetailCard/pages';

import { detailCardController } from 'stateManagement/detailCardController';

const BooleanField = ({ fieldData, field }) => {
	const {
		stateValues: { page },
	} = detailCardController.useState(['page', 'loadingField']);
	const { useUpdate } = Pages[page];
	const { callApi } = useUpdate() || {};
	const [value, setValue] = useState(String(Boolean(fieldData)));

	const handleChange = event => {
		const newValue = event.target.value === 'true';
		setValue(String(newValue));
		callApi({ key: field.key, value: newValue, field, previousValue: fieldData, resetFn: setValue });
	};

	useEffect(() => {
		setValue(String(Boolean(fieldData)));
	}, [fieldData]);

	return (
		<FormControl component="fieldset">
			<MUIRadioGroup row value={value} onChange={handleChange}>
				<FormControlLabel value="true" control={<Radio color="primary" />} label="Yes" />
				<FormControlLabel value="false" control={<Radio color="primary" />} label="No" />
			</MUIRadioGroup>
		</FormControl>
	);
};

BooleanField.propTypes = {
	fieldData: PropTypes.object.isRequired,
	field: PropTypes.shape({
		key: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
	}).isRequired,
};

export default BooleanField;
