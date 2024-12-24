import { useLazyQuery } from '@apollo/client';
import { Grid, Typography } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useState } from 'react';

import { GET_ES_SIMPLE_SEARCH } from 'graphQL/useQueryESSimpleSearch';

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

const debouncedSearch = debounce((getESSimpleSearch, searchTerm) => {
	getESSimpleSearch({
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
	const [getESSimpleSearch, { data: documentData }] = useLazyQuery(GET_ES_SIMPLE_SEARCH);

	const handleSearch = useCallback(searchTerm => debouncedSearch(getESSimpleSearch, searchTerm), [getESSimpleSearch]);

	useEffect(() => {
		handleSearch(search);
	}, [search, handleSearch]);

	useEffect(() => {
		if (documentData?.getESSimpleSearch?.hits) {
			setDocuments(documentData?.getESSimpleSearch?.hits);
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

	return (
		<Autocomplete
			id="searchDocumentList"
			value={value}
			disableListWrap
			classes={classes}
			options={documents || []}
			getOptionLabel={option => {
				if (typeof option === 'string') {
					return option;
				}
				if (option.inputValue) {
					return option.name;
				}
				if (option?.name) {
					return option.name;
				} else {
					return '';
				}
			}}
			filterOptions={(options, value) => {
				return options;
			}}
			getOptionSelected={(option, value) => {
				return option?._id === value?._id;
			}}
			renderOption={option => {
				return (
					<Grid container spacing={0}>
						<Grid container item xs={12} alignItems="center">
							<Grid item xs>
								<span style={{ fontWeight: 400 }}>{option.name}</span>
								<Typography variant="body2" color="textSecondary">
									{option.documentNumber} {option.documentNumber && option.documentName ? ' - ' : ''}{' '}
									{option.documentName}
								</Typography>
							</Grid>
						</Grid>
					</Grid>
				);
			}}
			onInputChange={onInputChange}
			onChange={(event, newValue) => {
				onChange(newValue);
			}}
			onBlur={onBlur}
			renderInput={params => (
				<TextField
					margin="dense"
					variant="outlined"
					{...params}
					placeholder="Search documents"
					InputProps={{
						...params.InputProps,
						startAdornment: (
							<InputAdornment position="start">
								<SearchIcon />
							</InputAdornment>
						),
					}}
					fullWidth
					autoFocus
					size="small"
				/>
			)}
		/>
	);
};
export default AutoCompleteDocumentList;
