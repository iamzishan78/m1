import React, { useEffect, useState, useMemo } from 'react';


import { useLazyQuery } from '@apollo/client';
import pick from 'lodash/pick';
import PropTypes from 'prop-types';

import CustomAutoComplete from 'components/Shared/components/Fields/CustomAutoComplete';

import { PARCELOWNERSQUERY } from 'graphQL/useQueryParcelOwners.js';

import joinAddress from '../../valueformatters/join-address.js';

const AutoCompleteParcelOwners = ({ onChange, value, parcel, onBlur, ...other }) => {
	const [esData, setEsData] = useState([]);

	const [getParcelOwners, { data: elasticData }] = useLazyQuery(PARCELOWNERSQUERY, {
		fetchPolicy: 'no-cache',
		onCompleted: () => {},
	});

	useEffect(() => {
		if (parcel?._id || parcel?.tractId) {
			getParcelOwners({
				variables: { customLayerId: parcel._id || parcel.tractId, qtr: parcel.qtrQtr || {} },
			});
		}
	}, [parcel]);

	useEffect(() => {
		if (elasticData && elasticData[Object.keys(elasticData)[0]]) {
			const data = elasticData[Object.keys(elasticData)[0]];
			setEsData(data);

			if (other?.setTotalOwners) {
				other?.setTotalOwners(data.length);
			}
		}
	}, [elasticData]);

	const options = useMemo(() => {
		if (esData?.length > 0) {
			return esData.map(data => ({
				_id: data.ownerEntity,
				value: data.ownerEntity,
				label: data?.relatedObject?.entityDetail?.name,
				...data?.relatedObject?.entityDetail,
				ownerData: {
					...pick(data, [
						'depthFrom',
						'depthTo',
						'mineral_interest',
						'royalty_interest',
						'orri',
						'net_acres',
						'nra',
						'company_net_acres',
					]),
					working_interest: data.operating_rights,
				},
			}));
		}
		return [];
	}, [esData]);

	const renderOptionComp = ({ option }) => (
		<div>
			<p style={{ fontWeight: 400, margin: 0 }}>{option.name}</p>
			<p style={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '0.875rem', margin: 0 }}>{joinAddress(option)}</p>
		</div>
	);

	return (
		<CustomAutoComplete
			fieldAttributes={{
				name: 'parcelOwner',
				label: other?.label,
				value,
				defaultOptions: options,
				placeholder: other?.placeholder || null,
			}}
			fieldConfig={{
				variant: other?.variant || 'standard',
				margin: other?.margin || 'dense',
				size: 'small',
				renderOptionComp,
				textFieldInputProps: other?.InputProps,
				textfieldRestProps: {
					InputLabelProps: other?.InputLabelProps,
					autoFocus: true,
				},
			}}
			fieldEvents={{
				onBlur,
				onChange: ({ value }) => {
					const option = options.find(option => option._id === value);
					onChange(null, option);
				},
			}}
		/>
	);
};

AutoCompleteParcelOwners.propTypes = {
	onChange: PropTypes.func.isRequired,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	parcel: PropTypes.shape({
		_id: PropTypes.string,
		tractId: PropTypes.string,
		qtrQtr: PropTypes.object,
	}).isRequired,
	onBlur: PropTypes.func,
	other: PropTypes.shape({
		label: PropTypes.string,
		placeholder: PropTypes.string,
		variant: PropTypes.string,
		margin: PropTypes.string,
		InputProps: PropTypes.object,
		InputLabelProps: PropTypes.object,
		setTotalOwners: PropTypes.func,
	}),
};

export default AutoCompleteParcelOwners;
