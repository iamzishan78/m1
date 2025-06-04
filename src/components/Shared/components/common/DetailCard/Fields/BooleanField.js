import React, { useState, useEffect } from 'react';

import { FormControl, FormControlLabel, Radio, RadioGroup as MUIRadioGroup } from '@material-ui/core';

import PropTypes from 'prop-types';

import * as Pages from 'components/Shared/components/common/DetailCard/pages';

import { detailCardController } from 'stateManagement/detailCardController';

const BooleanField = ({ fieldData, field, disabled = false }) => {
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
		<FormControl component="fieldset" disabled={field?.disabled}>
			<MUIRadioGroup row value={value} onChange={handleChange}>
				<FormControlLabel disabled={field?.disabled} value="true" control={<Radio color="primary" />} label="Yes" />
				<FormControlLabel disabled={field?.disabled} value="false" control={<Radio color="primary" />} label="No" />
			</MUIRadioGroup>
		</FormControl>
	);
};

BooleanField.propTypes = {
	fieldData: PropTypes.object.isRequired,
	field: PropTypes.object.isRequired,
};

export default BooleanField;
