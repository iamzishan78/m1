import { activityStatusOptions, activityTypeOptions } from 'components/ContactDetailedInfo/helper';

const bulkAddActivityFormShcema = ({ getValues, setValue }) => {
	const formFields = [
		{
			name: 'activityName',
			label: 'Activity Name',
		},
		{
			name: 'activityType',
			label: 'Activity Type',
			renderField: 'autoComplete',
			defaultOptions: activityTypeOptions,
		},
		{
			name: 'startTime',
			label: 'Start Time',
			renderField: 'dateTime',
		},
		{
			name: 'endTime',
			label: 'End Time',
			renderField: 'dateTime',
		},
		{
			name: 'notes',
			label: 'Activity Notes',
			renderField: 'textField',
		},
		{
			name: 'activityOwner',
			label: 'Activity Owner',
			renderField: 'owner',
		},
		{
			name: 'activityStatus',
			label: 'Activity Status',
			renderField: 'autoComplete',
			optionsKey: 'activityStatus',
			defaultOptions: activityStatusOptions,
		},
	];

	return formFields;
};

export default bulkAddActivityFormShcema;
