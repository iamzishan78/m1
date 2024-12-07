/* props is just a style object*/

import { GlobalStickyStyles } from 'GlobalSettings';

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
		esKey: 'name.keyword',
		options: {
			...GlobalStickyStyles({
				setCellProps: {
					minWidth: '460px',
					maxWidth: '492px',
					boxShadow: 'none',
					left: '77px',
				},
				setCellHeaderProps: {
					paddingLeft: '27px',
					left: '77px',
				},
			}),
			ignoreGlobal: true,
			dbName: 'shapeJson.properties.agreementNumber',
		},
	},
	{
		name: 'fileId',
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
		name: 'documentNumber',
		label: 'File Number',
		esKey: 'documentNumber.keyword',
		options: {
			filter: true,
		},
	},
	{
		name: 'documentName',
		label: 'File Name',
		esKey: 'documentName.keyword',
		options: {
			filter: true,
		},
	},
	{
		name: 'documentType',
		label: 'File Type',
		esKey: 'documentType.keyword',
		options: {
			filter: true,
		},
	},
	{
		name: 'dateTime',
		label: 'File Date',
		esKey: 'dateTime',
		options: {
			filter: true,
		},
		custom: { isDate: true, key_as_string: true },
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
		name: 'book',
		esKey: 'book.keyword',
		label: 'Book',
		options: {
			filter: true,
		},
	},
	{
		name: 'page',
		esKey: 'page.keyword',
		label: 'Page',
		options: {
			filter: true,
		},
	},
	{
		name: 'instrument',
		esKey: 'instrument.keyword',
		label: 'Instrument #',
		options: {
			filter: true,
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
