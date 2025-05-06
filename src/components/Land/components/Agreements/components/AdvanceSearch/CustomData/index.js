import React, { useContext, useState, useEffect, useMemo } from 'react';

import { Grid } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';

import { useLazyQuery } from '@apollo/client';
import _ from 'lodash';

import CustomAutoComplete from 'components/Shared/components/Fields/CustomAutoComplete';

import { GET_DB_FILTERS } from 'graphQL/useQueryDbQuery';

import { AppContext } from 'AppContext';

const AutoCompleteDropdown = ({ options, onChange, loading, label, value }) => {
	return (
		<FormControl fullWidth>
			<CustomAutoComplete
				fieldAttributes={{
					name: 'customData',
					label,
					value,
					optionArray: options || [],
				}}
				fieldConfig={{
					variant: 'outlined',
					loading,
					textfieldRestProps: {
						fullWidth: true,
					},
				}}
				fieldEvents={{
					onChange: ({ value }) => onChange(null, value),
				}}
				id="combo-box-demo"
			/>
		</FormControl>
	);
};
export default function CustomDataFilters(props) {
	const [stateApp, setStateApp] = useContext(AppContext);
	const [selectedKey, setSelectedKey] = useState(null);
	const [selectedValue, setSelectedValue] = useState(null);

	const [getCustomKey, { data: customKeyData, loadingKey }] = useLazyQuery(GET_DB_FILTERS, {
		fetchPolicy: 'no-cache',
	});
	const [getCustomValues, { data: customValueData, loadingVal }] = useLazyQuery(GET_DB_FILTERS, {
		fetchPolicy: 'no-cache',
	});

	useEffect(() => {
		if (stateApp.landSearchFilters?.customData.length === 0) {
			setSelectedValue(null);
			setSelectedKey(null);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stateApp.landSearchFilters?.customData]);

	useEffect(() => {
		getCustomKey({
			variables: {
				index: 'shapes_flat',
				filterAggs: {
					field: 'shapeJson.properties.custom_data',
					type: 'objectKeys',
				},
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
			if (_index === -1 && selectedValue !== null) {
				landCustomDataFilters.push({ field: filterKey, value: selectedValue });
			} else if (selectedValue !== null) {
				landCustomDataFilters[_index].value = selectedValue;
			} else if (_index !== -1) {
				landCustomDataFilters.splice(_index, 1);
			}

			setSelectedKey(landCustomDataFilters?.[0]?.field?.split?.('.')[3]);
			setSelectedValue(landCustomDataFilters?.[0]?.value);

			setStateApp(stateApp => ({
				...stateApp,
				landSearchFilters: { ...stateApp.landSearchFilters, customData: landCustomDataFilters },
			}));
		} else if (selectedKey === null) {
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

		if (selectedKey) {
			getCustomValues({
				variables: {
					esIndex: 'shapes_flat',
					index: 'shapes_flat',
					filters: [{ field: 'shapeJson.properties.type.keyword', value: 'agreement' }],
					filterAggs: {
						field: `shapeJson.properties.custom_data.${selectedKey}`,
					},
				},
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedKey, selectedValue]);

	const getKeysOptions = useMemo(() => {
		const hits = _.get(customKeyData, 'getDbFilters.hits', []);
		let allKeys = [];

		if (hits?.length) {
			allKeys = hits.map(hit => hit.key);
		}

		return allKeys;
	}, [customKeyData]);

	const getValueOptions = useMemo(() => {
		const hits = _.get(customValueData, 'getDbFilters.hits', []);
		let allValues = [];

		if (hits?.length) {
			allValues = [
				...new Set(
					hits.flatMap(hit =>
						Array.isArray(hit.key) ? hit.key.filter(key => key !== null).map(String) : [String(hit.key)]
					)
				),
			];
		}

		return allValues;
	}, [customValueData]);

	const handleKeyChange = key => {
		setSelectedKey(key);
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
					loading={loadingKey}
					value={selectedKey}
				/>
			</Grid>
			<Grid item xs={12}>
				<AutoCompleteDropdown
					onChange={(e, val) => setSelectedValue(val)}
					options={getValueOptions}
					label={'Value'}
					loading={loadingVal}
					value={selectedValue}
				/>
			</Grid>
		</Grid>
	);
}
