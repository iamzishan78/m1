import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import AutoCompleteWithAddNew from 'components/Shared/AutoCompleteWithAddNew';
import get from 'lodash/get';
import { useLazyQuery } from '@apollo/client';
import { GET_ES_FILTER_LIST } from 'graphQL/useQueryESFilterList';

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
	const [getOperatorList, { data: operatorList }] = useLazyQuery(GET_ES_FILTER_LIST, { fetchPolicy: 'no-cache' });

	useEffect(() => {
		getOperatorList({
			variables: {
				search: searchOperator ? `${searchOperator}*` : '*',
				filterKey: 'operator.name.keyword',
				esIndex: 'properties_flat',
				size: 50,
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
			options={get(operatorList, 'getESFilterList.hits', [])?.map(campaign => ({
				_id: campaign.key,
				name: campaign.key,
			}))}
		/>
	);
};

export default ResponsibleParty;
