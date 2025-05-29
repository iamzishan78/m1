import React, { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/core';

import AutoCompleteWithAddNew from 'components/Shared/AutoCompleteWithAddNew';
import { GET_COMBINED_FILTER_LIST } from 'graphQL/useQueryGetCombinedFilterList';

const useStyles = makeStyles({
	inputRoot: {
		backgroundColor: '#ffffff',
	},
	listbox: {
		boxSizing: 'border-box',
		'& ul': {
			padding: 0,
			margin: 0,
		},
	},
});

const ResponsibleParty = ({ value, handleChange, ...rest }) => {
	const classes = useStyles();
	const [searchOperator, setSearchOperator] = useState('');
	const [getOperatorList, { data: operatorList }] = useLazyQuery(GET_COMBINED_FILTER_LIST, { fetchPolicy: 'no-cache' });

	useEffect(() => {
		getOperatorList({
			variables: {
				size: 50,
				query: searchOperator ? `${searchOperator}*` : '*',
				searchFields: [
					{
						modelName: 'AgreementProvision',
						filterKey: 'responsibleParty',
					},
					{
						index: 'payment_flat',
						filterKey: 'responsibleParty',
					},
				],
			},
		});
	}, [getOperatorList, searchOperator]);

	return (
		<AutoCompleteWithAddNew
			value={value || searchOperator}
			variant="outlined"
			label="Responsible Party"
			onSearch={value => {
				setSearchOperator(value);
			}}
			setValue={value => {
				handleChange(value);
			}}
			options={
				operatorList?.getCombinedFilterList?.map(option => ({
					_id: option,
					name: option,
				})) ?? []
			}
		/>
	);
};

export default ResponsibleParty;
