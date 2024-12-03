import { entityTypeOptions } from 'components/ContactDetailedInfo/helper';
import { GETMONGOUSERS } from 'graphQL/useQueryGetUsers';
import { GET_ES_FILTER_LIST } from 'graphQL/useQueryESFilterList';

const phonenumber = inputtxt => {
	if (inputtxt.match(/^([0-9]||-|\(|\)|\.|,)+$/) !== null) {
		return true;
	}
	return false;
};
const email = inputtxt => {
	if (inputtxt.match(/^(([0-9a-zA-Z]|\.)+@?[0-9a-zA-Z]*\.?[0-9a-zA-Z]*)?$/) !== null) {
		return true;
	}
	return false;
};

const zipCopde = inputtxt => {
	if (inputtxt.match(/^([0-9]+-?[0-9]*)?$/) !== null) {
		return true;
	}
	return false;
};

const contactForm = ({ getValues, setValue }) => {
	const formFields = [
		{
			label: 'First Name',
			name: 'firstName',
		},
		{
			label: 'Middle Name',
			name: 'middleName',
		},
		{
			label: 'Last Name',
			name: 'lastName',
		},
		{
			label: 'Entity Type',
			name: 'ownerType',
			defaultOptions: entityTypeOptions,
			renderField: 'autoComplete',
			variables: {
				esIndex: 'contacts_flat',
				filterKey: 'ownerType.keyword',
				size: 10000,
			},
			query: GET_ES_FILTER_LIST,
			getOptions: apiRes => {
				const filterData = apiRes.data.getESFilterList.hits.map(hit => hit.key);
				return filterData;
			},
		},
		{
			label: 'Home phone',
			name: 'homePhone',
			onChange: value => {
				if (phonenumber(value)) {
					setValue('homePhone', value);
				} else {
					setValue('homePhone', '');
				}
			},
		},
		{
			label: 'Mobile Phone',
			name: 'mobilePhone',
			onChange: value => {
				if (phonenumber(value)) {
					setValue('mobilePhone', value);
				} else {
					setValue('mobilePhone', '');
				}
			},
		},
		{
			label: 'Email',
			name: 'primaryEmail',
			onChange: value => {
				if (email(value)) {
					setValue('primaryEmail', value);
				} else {
					setValue('primaryEmail', '');
				}
			},
		},
		{
			label: 'Address #1',
			name: 'address1',
		},
		{
			label: 'Address #2',
			name: 'address2',
		},
		{
			label: 'City',
			name: 'city',
		},
		{
			label: 'State',
			name: 'state',
		},
		{
			label: 'Zip Code',
			name: 'zip',
			onChange: value => {
				if (zipCopde(value)) {
					setValue('zip', value);
				} else {
					setValue('zip', null);
				}
			},
		},
		{
			label: 'Country',
			name: 'country',
		},
		{
			label: 'Contact Owner',
			name: 'contactOwner',
			renderField: 'autoComplete',
			query: GETMONGOUSERS,
			getOptions: apiRes => {
				const filterData = apiRes.data.allMongoUsers.map(user => ({
					value: user._id,
					label: user.name,
				}));
				return filterData;
			},
		},
	];

	return formFields;
};

export default contactForm;
