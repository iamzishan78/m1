import React, { useState, useEffect } from 'react';

import { Switch, FormControlLabel } from '@material-ui/core';

import PropTypes from 'prop-types';

import * as Pages from 'components/Shared/components/common/DetailCard/pages';

import { detailCardController } from 'controllers/detailCardController';

const BooleanField = ({ fieldData, field }) => {
	const {
		stateValues: { page },
	} = detailCardController.useState(['page', 'loadingField']);
	const { useUpdate } = Pages[page];
	const { callApi } = useUpdate() || {};
	const [checked, setChecked] = useState(Boolean(fieldData));

	const handleChange = event => {
		setChecked(event.target.checked);
		callApi({ key: field.key, value: event.target.checked, field, previousValue: fieldData, resetFn: setChecked });
	};

	useEffect(() => {
		setChecked(Boolean(fieldData));
	}, [fieldData]);

	return (
		<FormControlLabel
			control={<Switch checked={checked} onChange={handleChange} color="primary" />}
			label={field.label}
		/>
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
