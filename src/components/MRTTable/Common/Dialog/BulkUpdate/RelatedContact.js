import { useLazyQuery } from '@apollo/client';
import { TextField, CircularProgress } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import get from 'lodash/get';
import React, { useState, useEffect, memo, useMemo } from 'react';

import { GET_ES_SIMPLE_SEARCH } from 'graphQL/useQueryESSimpleSearch';

// Options for the relationship type dropdown
const RelationshipTypeOptions = ['Child', 'Cousin', 'Parent', 'Spouse'];

// The main component function
function RelatedContact({ setFieldKey }) {
	// useLazyQuery hook to get ES search results
	const [getESSearch, { data: esFilter, loading }] = useLazyQuery(GET_ES_SIMPLE_SEARCH, {
		fetchPolicy: 'no-cache',
	});

	// State variables for selected contact and relationship type
	const [descriptorObject, setDescriptorObject] = useState();
	const [relationshipType, setRelationshipType] = useState();

	// Function to fetch contacts based on search input
	const getContacts = (search = '') => {
		getESSearch({
			variables: {
				index: 'contacts_flat',
				pagination: {
					first: 25,
					after: null,
				},
				search: {
					query: search ? `*${search}*` : null,
					fields: ['name^4', '_id'],
				},
				sort: {
					field: 'lastUpdateAt',
					order: 'desc',
					unmapped_type: 'date',
				},
				filters: [],
			},
		});
	};

	// Fetch contacts on component mount
	useEffect(() => {
		getContacts();
	}, []);

	// Handle input change to fetch new contacts based on user input
	const onInputChange = (_, value) => {
		getContacts(value);
	};

	// Update parent component's state when descriptorObject or relationshipType changes
	useEffect(() => {
		if (descriptorObject && relationshipType) {
			setFieldKey({
				descriptorObject,
				relationshipType,
			});
		} else {
			setFieldKey(false);
		}
	}, [descriptorObject, relationshipType]);

	// Memoize contact options to avoid unnecessary recalculations
	const formattedContactOptions = useMemo(() => {
		const options = get(esFilter, 'getESSimpleSearch.hits', []).map(option => ({
			value: option._id,
			name: option.name,
			fullObject: option,
		}));

		return options;
	}, [esFilter, loading]);

	return (
		<div>
			<div style={{ marginTop: '20px' }}>
				<Autocomplete
					id="search-contacts"
					data-testid={'contact-search-drop-down'}
					getOptionSelected={(option, value) => option.name === value.name}
					getOptionLabel={option => option.name}
					options={formattedContactOptions}
					loading={loading}
					value={descriptorObject}
					onInputChange={onInputChange}
					onChange={(_, newValue) => {
						setDescriptorObject(newValue);
					}}
					renderInput={params => (
						<TextField
							{...params}
							data-testid={'contact-search-text-field'}
							label="Search Contact"
							variant="outlined"
							size="small"
							InputProps={{
								...params.InputProps,
								endAdornment: (
									<React.Fragment>
										{loading ? <CircularProgress color="inherit" size={20} /> : null}
										{params.InputProps.endAdornment}
									</React.Fragment>
								),
							}}
						/>
					)}
				/>
			</div>

			<div style={{ marginTop: '30px' }}>
				<Autocomplete
					id="combo-box-demo 1"
					data-testid={'relation-ship-drop-down'}
					options={RelationshipTypeOptions}
					onChange={(e, newValue) => {
						setRelationshipType(newValue);
					}}
					value={relationshipType}
					renderInput={params => (
						<TextField
							{...params}
							data-testid={'relation-ship-text-field'}
							size="small"
							variant="outlined"
							placeholder="Select Relation"
						/>
					)}
				/>
			</div>
		</div>
	);
}

// Memoize the component to prevent unnecessary re-renders
export default memo(RelatedContact);
