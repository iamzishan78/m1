import { GETMONGOUSERS } from 'graphQL/useQueryGetUsers';

export const customAssetForm = ({ fields = [], user }) => {
	const userTypeProperties = {
		variables: {},
		query: GETMONGOUSERS,
		getOptions: apiRes => {
			const filterData = apiRes?.data?.allMongoUsers?.map(hit => ({
				label: hit.name || hit.displayName,
				value: hit._id,
			}));
			return filterData;
		},
		renderField: 'autoComplete',
	};

	const booleanTypeOptions = [
		{ value: true, label: 'Yes' },
		{ value: false, label: 'No' },
	];

	const role = user?.roles?.[0]?.toLowerCase();

	const formSchema = fields?.map(field => {
		const commonProperties = {
			label: field.label,
			name: field.mappingKey,
			type: field.keyType,
			required: field.isRequired,
			renderField: field.keyType,
			disabled: field.accessControl?.[role] === 'Readonly',
			isHidden: field.accessControl?.[role] === 'Hidden',
		};

		switch (field.keyType) {
			case 'user':
			case 'owner':
				return {
					...commonProperties,
					...userTypeProperties,
				};
			case 'boolean':
				return {
					...commonProperties,
					options: booleanTypeOptions,
				};
			default:
				return {
					...commonProperties,
				};
		}
	});
	return formSchema;
};
