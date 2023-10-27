const mrtFilterOptions = [
	{
		option: 'fuzzy',
		symbol: '≈',
		label: 'Fuzzy',
		divider: false,
	},
	{
		option: 'contains',
		symbol: '*',
		label: 'Contains',
		divider: false,
	},
	{
		option: 'startsWith',
		symbol: 'a',
		label: 'Starts With',
		divider: false,
	},
	{
		option: 'endsWith',
		symbol: 'z',
		label: 'Ends With',
		divider: true,
	},
	{
		option: 'equals',
		symbol: '=',
		label: 'Equals',
		divider: false,
	},
	{
		option: 'notEquals',
		symbol: '≠',
		label: 'Not Equals',
		divider: true,
	},
	{
		option: 'between',
		symbol: '⇿',
		label: 'Between',
		divider: false,
	},
	{
		option: 'betweenInclusive',
		symbol: '⬌',
		label: 'Between Inclusive',
		divider: true,
	},
	{
		option: 'greaterThan',
		symbol: '>',
		label: 'Greater Than',
		divider: false,
	},
	{
		option: 'greaterThanOrEqualTo',
		symbol: '≥',
		label: 'Greater Than or Equal To',
		divider: false,
	},
	{
		option: 'lessThan',
		symbol: '<',
		label: 'Less Than',
		divider: false,
	},
	{
		option: 'lessThanOrEqualTo',
		symbol: '≤',
		label: 'Less Than or Equal To',
		divider: true,
	},
	{
		option: 'empty',
		symbol: '∅',
		label: 'Empty',
		divider: false,
	},
	{
		option: 'notEmpty',
		symbol: '!∅',
		label: 'Not Empty',
		divider: true,
	},
	// {
	// 	option: 'singleselect',
	// 	symbol: (
	// 		<svg
	// 			xmlns="http://www.w3.org/2000/svg"
	// 			enableBackground="new 0 0 24 24"
	// 			height="18"
	// 			viewBox="0 0 24 24"
	// 			width="18"
	// 		>
	// 			<g>
	// 				<path d="M0,0h24 M24,24H0" fill="none" />
	// 				<path d="M4.25,5.61C6.27,8.2,10,13,10,13v6c0,0.55,0.45,1,1,1h2c0.55,0,1-0.45,1-1v-6c0,0,3.72-4.8,5.74-7.39 C20.25,4.95,19.78,4,18.95,4H5.04C4.21,4,3.74,4.95,4.25,5.61z" />
	// 				<path d="M0,0h24v24H0V0z" fill="none" />
	// 			</g>
	// 		</svg>
	// 	),
	// 	label: 'Single Select',
	// 	divider: false,
	// },
	// {
	// 	option: 'multiselect',
	// 	symbol: (
	// 		<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
	// 			<path
	// 				fill="currentColor"
	// 				d="M3 5H1v18h18v-2H3V5zm11 9V6H9v5h3v1H9v2h5zm-3-5V8h1v1h-1zm12-8H5v18h18V1zm-2 8h-2V7h-2v2h-2v2h2v2h2v-2h2v6H7V3h14v6z"
	// 			/>
	// 		</svg>
	// 	),
	// 	label: 'Multi Select',
	// 	divider: false,
	// },
];

export const tableSimpleFilterModes = mrtFilterOptions.reduce(
	(acc, cur) => ({ ...acc, [cur.option]: cur }),
	{}
);

export const tableSimpleFilterModeOtions = {
	string: ['fuzzy', 'contains', 'startsWith', 'endsWith'],
	equation: ['equals', 'notEquals'],
	inclusive: ['between', 'betweenInclusive'],
	comparison: ['greaterThan', 'greaterThanOrEqualTo', 'lessThan', 'lessThanOrEqualTo'],
	vacancy: ['empty', 'notEmpty'],
	custom: ['singleselect', 'multiselect'],
};

export const stringFilterOptions = [
	...tableSimpleFilterModeOtions.string,
	...tableSimpleFilterModeOtions.equation,
	...tableSimpleFilterModeOtions.vacancy,
	// ...tableSimpleFilterModeOtions.custom,
];

export const numberFilterOptions = [
	...tableSimpleFilterModeOtions.equation,
	...tableSimpleFilterModeOtions.inclusive,
	...tableSimpleFilterModeOtions.comparison,
	...tableSimpleFilterModeOtions.vacancy,
	// ...tableSimpleFilterModeOtions.custom,
];

export const dateFilterOptions = [...tableSimpleFilterModeOtions.custom];
