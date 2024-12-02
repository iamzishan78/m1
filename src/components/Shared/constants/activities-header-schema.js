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
	},
	{
		name: 'type',
		label: 'Activity Type',
	},
	{
		name: 'start',
		label: 'Start Date',
	},
	{
		name: 'end',
		label: 'End Date',
	},
	{
		name: 'dealName',
		label: 'Deal Name',
	},
	{
		name: 'contactName',
		label: 'Contact Name',
	},
	{
		name: 'ownerName',
		label: 'Activity Owner',
	},
	{
		name: 'createBy',
		label: 'Created By',
	},

	{
		name: 'createAt',
		label: 'Created Date',
	},

	{
		name: 'lastUpdateBy',
		label: 'Last Updated By',
	},

	{
		name: 'lastUpdateAt',
		label: 'Last Updated Date',
	},
	{
		name: 'isClosed',
		label: 'Completed?',
	},
	{
		name: 'notes',
		label: 'Notes',
	},
	// {
	//   name: "isContact",
	//   label: " ",
	//   options: {
	//     filter: false,
	//     searchable: false,
	//     sort: false,
	//     download: false,
	//     print: false,
	//     viewColumns: false,
	//   },
	// },
];

export default ActivitiesHeadCells;
