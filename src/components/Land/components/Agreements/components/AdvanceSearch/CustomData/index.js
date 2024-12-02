import React, { useContext, useState, useEffect, useMemo } from 'react';
import { Grid, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControl from '@material-ui/core/FormControl';
import { AppContext } from 'AppContext';
import { useLazyQuery } from '@apollo/client';
import { GET_ALL_CUSTOM_DATA_KEYS } from 'graphQL/useQueryGetAllCustomKeys';
import _, { isArray } from 'lodash';
import { useSelector } from 'react-redux';
import { convertToTitleCase } from 'components/Shared/M1nTable/components/MUIDataTable/utils';

const AutoCompleteDropdown = ({ options, onChange, loading, label, value }) => {
	return (
		<FormControl fullWidth>
			<Autocomplete
				id="combo-box-demo"
				options={options}
				loading={loading}
				onChange={onChange}
				value={value}
				getOptionLabel={option => option.label}
				renderInput={params => <TextField {...params} label={label} variant="outlined" fullWidth />}
			/>
		</FormControl>
	);
};
export default function CustomDataFilters(props) {
	const [stateApp, setStateApp] = useContext(AppContext);
	const [selectedKey, setSelectedKey] = useState(null);
	const [key, setKey] = useState(null);
	const [selectedValue, setSelectedValue] = useState(null);
	const agreementDetails = useSelector(({ Land }) => Land.agreement?.activeAgreement?.shape)?.properties;

	const [getCustomKey, { data: customData, loading }] = useLazyQuery(GET_ALL_CUSTOM_DATA_KEYS, {
		fetchPolicy: 'no-cache',
	});

	useEffect(() => {
		if (stateApp.landSearchFilters?.customData.length === 0) {
			setKey(null);
			setSelectedValue(null);
			setSelectedKey(null);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stateApp.landSearchFilters?.customData]);

	useEffect(() => {
		getCustomKey({
			variables: {
				index: 'shapes_flat',
				pathToKey: 'shapeJson.properties.custom_data',
				filters: [{ field: 'shapeJson.properties.type.keyword', value: 'agreement' }],
			},
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const customFilters = stateApp.landSearchFilters.customData[0];
		setSelectedKey(customFilters?.field?.split?.('.')[3]);
		setSelectedValue(customFilters?.value);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (selectedKey && selectedValue) {
			const filterKey = `shapeJson.properties.custom_data.${selectedKey}`;
			const landCustomDataFilters = [...stateApp.landSearchFilters.customData];
			const _index = landCustomDataFilters.findIndex(f => f.field.startsWith('shapeJson.properties.custom_data'));
			if (_index === -1 && selectedValue !== null)
				landCustomDataFilters.push({ field: filterKey, value: selectedValue });
			else if (selectedValue !== null) landCustomDataFilters[_index].value = selectedValue;
			else if (_index !== -1) landCustomDataFilters.splice(_index, 1);

			setSelectedKey(landCustomDataFilters?.[0]?.field?.split?.('.')[3]);
			setSelectedValue(landCustomDataFilters?.[0]?.value);

			setStateApp(stateApp => ({
				...stateApp,
				landSearchFilters: { ...stateApp.landSearchFilters, customData: landCustomDataFilters },
			}));
		} else {
			let landCustomDataFilters = [...stateApp.landSearchFilters.customData];
			const _index = landCustomDataFilters.findIndex(f => f.field.startsWith('shapeJson.properties.custom_data'));

			if (_index > -1) {
				landCustomDataFilters = landCustomDataFilters.filter(
					f => !f.field.startsWith('shapeJson.properties.custom_data')
				);

				setStateApp(stateApp => ({
					...stateApp,
					landSearchFilters: { ...stateApp.landSearchFilters, customData: landCustomDataFilters },
				}));
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedKey, selectedValue]);

	const getKeysOptions = useMemo(() => {
		const getAllKeys = _.get(customData, 'getAllKeys', {});

		let allKeys = Object.keys(getAllKeys).flatMap(key => {
			if (isArray(getAllKeys[key].label))
				return getAllKeys[key].label.map(label => ({ label: label || convertToTitleCase(key), value: key }));

			return { label: getAllKeys[key].label || convertToTitleCase(key), value: key };
		});

		// Removing the keys that are already in agreementDetails
		allKeys = allKeys.filter(
			key => !(key.value.replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase()) in (agreementDetails || {}))
		);

		return allKeys.filter(key => !Array.isArray(key.label));
	}, [customData, agreementDetails]);

	const getValueOptions = useMemo(() => {
		let allValues = (customData?.getAllKeys[selectedKey]?.value || []).map(key => ({ label: key, value: key }));

		return allValues;
	}, [customData, selectedKey]);

	const handleKeyChange = key => {
		if (!key) return;
		setSelectedKey(key.value);
		setKey(key);
		setSelectedValue(null);
	};
	return (
		<Grid container item spacing={2} style={{ padding: '8px', width: '100%', margin: '0' }}>
			<Grid item xs={12}>
				<AutoCompleteDropdown
					onChange={(e, val) => {
						handleKeyChange(val);
					}}
					options={getKeysOptions}
					label={'Key'}
					loading={loading}
					value={key}
				/>
			</Grid>
			<Grid item xs={12}>
				<AutoCompleteDropdown
					onChange={(e, val) => setSelectedValue(val?.value)}
					options={getValueOptions}
					label={'Value'}
					loading={loading}
					value={selectedKey && { label: selectedValue, value: selectedValue }}
				/>
			</Grid>
		</Grid>
	);
}
