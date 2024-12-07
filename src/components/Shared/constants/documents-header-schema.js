/* props is just a style object*/

const DocumentsHeadCells = [
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
		name: 'fileName',
		label: 'File Name',
	},
	{
		name: 'documentNumber',
		label: 'File Number',
	},
	{
		name: 'documentName',
		label: 'File Name',
	},
	{
		name: 'documentType',
		label: 'File Type',
	},
	{
		name: 'dateTime',
		label: 'File Date',
	},
	{
		name: 'uploadedDate',
		label: 'File Date',
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
		name: ' ',
		label: ' ',
		options: {
			display: true,
			filter: false,
			searchable: false,
			sort: false,
			viewColumns: false,
		},
	},
	{
		name: 'viewToken',
		label: 'View Token',
		options: {
			display: false,
			filter: false,
			searchable: false,
			sort: false,
			viewColumns: false,
		},
	},
];

export default DocumentsHeadCells;
