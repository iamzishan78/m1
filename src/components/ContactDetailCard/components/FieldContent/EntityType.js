import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';

import { entityTypeOptions } from 'components/ContactDetailedInfo/helper';
import CustomAutoComplete from 'components/Shared/components/Fields/CustomAutoComplete';

import { GET_ES_FILTER_LIST } from 'graphQL/useQueryESFilterList';

export default function EntityType({ setDocumentType, value, ...other }) {
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

	const classes = useStyles();

	const [search, setSearch] = useState(value);

	useEffect(() => {
		setSearch(value);
	}, [value]);

	const onInputChange = (event, value) => {
		setSearch(value);
	};

	return (
		<CustomAutoComplete
			fieldAttributes={{
				name: 'entityType',
				label: 'Entity Type',
				value: search,
				defaultValue: search,
				variables: {
					esIndex: 'contacts_flat',
					filterKey: 'ownerType.keyword',
					size: 50,
				},
				optionArray: [],
				query: GET_ES_FILTER_LIST,
				getOptions: hits => {
					let filterData = hits?.data?.getESFilterList?.hits?.filter(hit => hit.key).map(hit => hit.key);
					for (let i = 0; i < entityTypeOptions.length; i++) {
						filterData = filterData.filter(d => d !== entityTypeOptions[i].value && d !== entityTypeOptions[i].label);
					}
					for (let i = 0; i < entityTypeOptions.length; i++) {
						filterData.push(entityTypeOptions[i].label);
					}
					return filterData;
				},
			}}
			fieldEvents={{
				onChange: ({ value }) => {
					if (typeof value === 'string') {
						setDocumentType({ _id: value, name: value });
					} else if (value && value._id) {
						if (value._id !== 'newEntity') {
							setDocumentType(value);
						} else {
							setDocumentType({ _id: 'newEntity', name: value.name });
						}
					} else {
						setSearch('');
						setDocumentType({ _id: '', name: '' });
					}
				},
				onInputChange,
			}}
			fieldConfig={{
				margin: 'dense',
				size: 'small',
			}}
			disableListWrap
			disableClearable={false}
			classes={classes}
			id="entityType"
			{...other}
		/>
	);
}

EntityType.propTypes = {
	setDocumentType: PropTypes.func.isRequired,
	value: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.shape({
			_id: PropTypes.string,
			name: PropTypes.string,
		}),
	]),
};
