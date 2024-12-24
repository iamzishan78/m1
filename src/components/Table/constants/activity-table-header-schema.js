import { formatDate } from 'components/Shared/functions';

import GlobalSettings from 'GlobalSettings';
import { GlobalStickyStyles } from 'GlobalSettings';

const ActivitiesHeadCells = [
	{
		name: '_id',
		options: {
			display: false,
			filter: false,
			searchable: false,
			sort: false,
			download: false,
			print: false,
			viewColumns: false,
		},
	},
	{
		name: 'name',
		label: 'Activity Name',
		esKey: 'name.keyword',
		options: {
			...GlobalStickyStyles({
				setCellProps: {
					maxWidth: '300px',
					left: '76.5px',
				},
				setCellHeaderProps: {
					left: '76.5px',
				},
				isSnapGrid: false, // Fix issue table title slightly hide while scrolling horizontally
			}),
			dbName: 'shapeJson.properties.agreementNumber',
			isSnapGrid: false,
		},
	},
	{
		name: 'type',
		label: 'Activity Type',
		esKey: 'type.keyword',
		options: {
			display: true,
			sort: true,
			filter: true,
		},
	},
	{
		name: 'start',
		label: 'Start Date',
		esKey: 'dateTime',
		options: {
			setCellProps: () => ({ style: { minWidth: '185px' } }),
			sort: true,
			filter: true,
		},
		custom: {
			key_as_string: true,
			isDate: true,
		},
	},

	{
		name: 'end',
		label: 'End Date',
		esKey: 'endDateTime',
		options: {
			setCellProps: () => ({ style: { minWidth: '185px' } }),
			sort: true,
			filter: true,
		},
		custom: {
			key_as_string: true,
			isDate: true,
		},
	},
	{
		name: 'outcome',
		label: 'Outcome',
		esKey: 'outcome.keyword',
		options: {
			display: true,
			sort: true,
			filter: true,
		},
	},
	{
		name: 'dealName',
		label: 'Deal Name',
		esKey: 'deal.name.keyword',
		options: {
			display: true,
			sort: true,
			filter: true,
		},
		style: { minWidth: 200 },
	},
	{
		name: 'contactName',
		label: 'Contact Name',
		esKey: 'contactName.keyword',
		options: {
			display: true,
			sort: true,
			filter: true,
		},
		style: { minWidth: 250 },
	},
	{
		name: 'ownerName',
		label: 'Activity Owner',
		esKey: 'ownerName.keyword',
		options: {
			display: true,
			sort: true,
			filter: true,
		},
	},
	{
		name: 'notes',
		label: 'Notes',
		options: {
			display: true,
			sort: true,
			filter: true,
		},
		style: { minWidth: 300 },
	},

	{
		name: 'createBy',
		label: 'Created By',
		esKey: 'createBy',
		options: {
			display: true,
			customRender: value => {
				return <>{value?.name}</>;
			},
		},
	},

	{
		name: 'createAt',
		label: 'Created Date',
		esKey: 'createAt',
		options: {
			display: true,
			customRender: value => {
				return <>{formatDate(value)}</>;
			},
		},
		custom: {
			key_as_string: true,
			isDate: true,
		},
	},

	{
		name: 'lastUpdateBy',
		label: 'Last Updated By',
		esKey: 'lastUpdateBy',
		options: {
			display: true,
			customRender: value => {
				return <>{value?.name}</>;
			},
		},
	},

	{
		name: 'lastUpdateAt',
		label: 'Last Updated Date',
		esKey: 'lastUpdateAt',
		options: {
			display: true,
			customRender: value => {
				return <>{formatDate(value)}</>;
			},
		},
		custom: {
			key_as_string: true,
			isDate: true,
		},
	},

	{
		name: 'isClosed',
		label: 'Completed?',
		esKey: 'isClosed',
		options: {
			ignoreGlobal: true,
			display: true,
			sort: true,
			filter: true,
		},
		custom: {
			formatedFilterOptions: [
				{ value: 'true', label: 'Completed' },
				{ value: 'false', label: 'Not Completed' },
			],
		},
	},
];

export default ActivitiesHeadCells;
