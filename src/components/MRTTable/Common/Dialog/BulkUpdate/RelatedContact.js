import React, { useState, useEffect, memo } from 'react';

import PropTypes from 'prop-types';

import CustomAutoComplete from 'components/Shared/components/Fields/CustomAutoComplete';

import { GET_DB_DATA } from 'graphQL/useQueryDbQuery';

const RelationshipTypeOptions = ['Child', 'Cousin', 'Parent', 'Spouse'];

function RelatedContact({ setFieldKey }) {
	const [descriptorObject, setDescriptorObject] = useState();
	const [relationshipType, setRelationshipType] = useState();

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

	return (
		<div>
			<div style={{ marginTop: '20px' }}>
				<CustomAutoComplete
					fieldAttributes={{
						value: descriptorObject,
						label: 'Search Contact',
						query: GET_DB_DATA,
						isESSearch: true,
						variables: {
							index: 'contacts_flat',
							pagination: {
								first: 25,
								after: null,
							},
							search: {
								query: '*',
								fields: ['name', '_id'],
							},
							sort: {
								field: 'lastUpdateAt',
								order: 'desc',
								unmapped_type: 'date',
							},
							filters: [],
						},
						getOptions: res =>
							res.data.getDbData.hits.map(option => ({
								_id: option._id,
								name: option.name,
							})),
					}}
					fieldConfig={{
						variant: 'outlined',
					}}
					fieldEvents={{
						onChange: ({ value }) => {
							setDescriptorObject(value);
						},
					}}
				/>
			</div>

			<div style={{ marginTop: '30px' }}>
				<CustomAutoComplete
					fieldAttributes={{
						value: relationshipType ?? '',
						label: 'Select Relation',
						optionArray: RelationshipTypeOptions,
					}}
					fieldConfig={{
						variant: 'outlined',
					}}
					fieldEvents={{
						onChange: ({ value }) => {
							setRelationshipType(value);
						},
					}}
				/>
			</div>
		</div>
	);
}

RelatedContact.propTypes = {
	setFieldKey: PropTypes.func.isRequired,
};

// Memoize the component to prevent unnecessary re-renders
export default memo(RelatedContact);
