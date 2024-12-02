import { GlobalStickyStyles } from 'GlobalSettings';

const operatorsColumnHeaders = [
	{
		name: 'Operator',
		label: 'Operator',
		esKey: 'operator.keyword',
		options: {
			...GlobalStickyStyles({
				setCellProps: {
					maxWidth: '350px',
					left: '77px',
				},
				setCellHeaderProps: {
					paddingLeft: '27px',
					left: '77px',
				},
			}),
			sort: true,
			filter: true,
		},
	},
	{
		name: 'StateCount',
		label: '# Active States',
		esKey: 'stateCount',
		options: {
			sort: true,
			filter: true,
		},
	},
	{
		name: 'BasinCount',
		label: '# Active Basins',
		esKey: 'basinCount',
		options: {
			sort: true,
			filter: true,
		},
	},
	{
		name: 'TotalWellCount',
		label: 'Total Wells',
		esKey: 'totalWellCount',
		options: {
			sort: true,
			filter: true,
		},
	},
	{
		name: 'GasWellCount',
		label: 'Gas Wells',
		esKey: 'gasWellCount',
		options: {
			sort: true,
			filter: true,
		},
	},
	{
		name: 'OilWellCount',
		label: 'Oil Wells',
		esKey: 'oilWellCount',
		options: {
			sort: true,
			filter: true,
		},
	},
	{
		name: 'ActiveWellCount',
		label: 'Active Wells',
		esKey: 'activeWellCount',
		options: {
			sort: true,
			filter: true,
		},
	},
	{
		name: 'DUCWellCount',
		label: 'DUCs',
		esKey: 'ducWellCount',
		options: {
			sort: true,
			filter: true,
		},
	},
	{
		name: 'PermitCount',
		label: 'Active Permits',
		esKey: 'permitCount',
		options: {
			sort: true,
			filter: true,
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

export default operatorsColumnHeaders;
