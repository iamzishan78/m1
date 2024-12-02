import { GlobalStickyStyles } from 'GlobalSettings';

const wellsColumnHeaders = [
	{
		name: 'Id',
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
		name: 'api',
		label: 'API',
		esKey: 'api.keyword',
		options: {
			...GlobalStickyStyles({
				setCellProps: {
					maxWidth: '200px',
					left: '77px',
				},
				setCellHeaderProps: {
					paddingLeft: '35px',
					left: '77px',
				},
			}),
			sort: true,
			filter: true,
		},
	},
	{
		name: 'wellName',
		label: 'Well Name',
		esKey: 'wellName.keyword',
		options: {
			sort: true,
			filter: true,
		},
	},
	{
		name: 'leaseId',
		label: 'Lease Number',
		esKey: 'leaseId.keyword',
		options: {
			sort: true,
			filter: true,
		},
	},
	{
		name: 'lease',
		label: 'Lease Name',
		esKey: 'lease.keyword',
		options: {
			sort: true,
			filter: true,
		},
	},
	{
		name: 'operator',
		label: 'Operator',
		esKey: 'operator.keyword',
		options: {
			sort: true,
			filter: true,
		},
	},
	{
		name: 'wellType',
		label: 'Type',
		esKey: 'wellType.keyword',
		options: {
			sort: true,
			filter: true,
		},
	},
	{
		name: 'wellBoreProfile',
		label: 'Profile',
		esKey: 'wellBoreProfile.keyword',
		options: {
			sort: true,
			filter: true,
		},
	},
	{
		name: 'wellStatus',
		label: 'Status',
		esKey: 'wellStatus.keyword',
		options: {
			sort: true,
			filter: true,
		},
	},
	{
		name: 'globalWell',
		label: 'Global  Well',
		esKey: 'Id.keyword',
		options: {
			display: false,
			filter: false,
		},
	},
	{
		name: 'tags',
		label: 'Tags ',
		options: {
			filter: false,
			sort: false,
			download: false,
			print: false,
			filterOptions: {
				names: [],
				logic(rowVal, pickedTags) {
					let containIts = true;
					pickedTags.map(pickedTag => {
						if (rowVal[0].indexOf(pickedTag) === -1) {
							containIts = false;
						}
					});
					return !containIts;
				},
			},
		},
	},
	{
		name: 'commentsCounter',
		label: ' ',
		options: {
			filter: false,
			searchable: false,
			sort: false,
			download: false,
			print: false,
			viewColumns: false,
		},
	},
	{
		name: 'isTracked',
		label: ' ',
		options: {
			filter: false,
			searchable: false,
			download: false,
			print: false,
			viewColumns: false,
			filterOptions: {
				names: ['Tracked', 'Untracked'],
				logic(tracked, filterVal) {
					return !((filterVal.indexOf('Tracked') >= 0 && tracked) || (filterVal.indexOf('Untracked') >= 0 && !tracked));
				},
			},
			filterType: 'dropdown',
		},
	},
	{
		name: 'coordinates',
		label: ' ',
		options: {
			filter: false,
			sort: false,
			searchable: false,
			download: false,
			print: false,
			viewColumns: false,
		},
	},
];

export default wellsColumnHeaders;
