import React, { useCallback, useEffect, useState } from 'react';

import { Grid, Typography } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';

import { useLazyQuery } from '@apollo/client';
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';

import CustomAutoComplete from 'components/Shared/components/Fields/CustomAutoComplete';

import { GET_DB_DATA } from 'graphQL/useQueryDbQuery';

const useStyles = makeStyles({
	inputRoot: {
		// backgroundColor: "#ffffff",
	},
	listbox: {
		boxSizing: 'border-box',
		'& ul': {
			padding: 0,
			margin: 0,
		},
	},
});

const debouncedSearch = debounce((getDbData, searchTerm) => {
	getDbData({
		variables: {
			index: 'documents_flat',
			pagination: {
				first: 50,
				keep_alive: '1micros',
			},
			search: {
				query: searchTerm ? `${searchTerm}*` : '',
				fields: ['name.keyword'],
			},
		},
	});
}, 300);

const AutoCompleteDocumentList = ({ onSelect, search, setSearch }) => {
	const classes = useStyles();
	const [documents, setDocuments] = useState([]);
	const [value, setValue] = useState({ name: '', _id: null });
	const [getDbData, { data: documentData }] = useLazyQuery(GET_DB_DATA);

	const handleSearch = useCallback(searchTerm => debouncedSearch(getDbData, searchTerm), [getDbData]);

	useEffect(() => {
		handleSearch(search);
	}, [search, handleSearch]);

	useEffect(() => {
		if (documentData?.getDbData?.hits) {
			setDocuments(documentData?.getDbData?.hits);
		}
	}, [documentData]);

	const onInputChange = e => {
		setSearch(e.target.value);
	};

	const onBlur = () => {
		setSearch('');
	};

	const onChange = value => {
		setValue(value);
		onSelect(value);
	};

	const renderOptionComp = option => {
		return (
			<Grid container item xs={12} alignItems="center">
				<Grid item xs>
					<span style={{ fontWeight: 400 }}>{option.name}</span>
					<Typography variant="body2" color="textSecondary">
						{option.documentNumber} {option.documentNumber && option.documentName ? ' - ' : ''} {option.documentName}
					</Typography>
				</Grid>
			</Grid>
		);
	};

	return (
		<CustomAutoComplete
			disableListWrap
			classes={classes}
			id="searchDocumentList"
			onInputChange={onInputChange}
			fieldConfig={{
				margin: 'dense',
				variant: 'outlined',
				renderOptionComp,
				textFiledInputProps: {
					startAdornment: (
						<InputAdornment position="start">
							<SearchIcon />
						</InputAdornment>
					),
				},
			}}
			fieldAttributes={{
				value: value,
				placeholder: 'Search documents',
				defaultOptions: documents || [],
			}}
			fieldEvents={{
				onBlur,
				onChange,
			}}
		/>
	);
};

AutoCompleteDocumentList.propTypes = {
	onSelect: PropTypes.func.isRequired,
	search: PropTypes.string.isRequired,
	setSearch: PropTypes.func.isRequired,
};

export default AutoCompleteDocumentList;
