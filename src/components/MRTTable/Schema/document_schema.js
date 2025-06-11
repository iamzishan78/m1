/* eslint-disable react/prop-types */
import React from 'react';

import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';

import moment from 'moment';

import Loaders from 'components/Loaders';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import DocumentToolBar from 'components/MRTTable/TablesOverride/DocumentTable/DocumentToolbar';
import FileDownload from 'components/MRTTable/TablesOverride/DocumentTable/TableCell/FileDownload';
import FileName from 'components/MRTTable/TablesOverride/DocumentTable/TableCell/FileName';
import FileView from 'components/MRTTable/TablesOverride/DocumentTable/TableCell/FileView';
import { formatDate } from 'components/Shared/functions';

import { UPDATE_DOCUMENT } from 'graphQL/useMutationUpdateDocument';

import { slidoutStateController } from 'stateManagement/slidoutStateController';
import { tableGlobalController } from 'stateManagement/tableController';

const esIndex = 'documents_flat';

const onClickedRow = selectedRow => {
	tableGlobalController.updateState({
		documentDialog: {
			type: 'createAndAddDocument',
			tableKey: 'DocumentTable',
			selectedRow,
		},
	});

	slidoutStateController.updateState({
		newEntity: false,
		title: 'File Detail',
	});
};

const onCustomKeyChange = async (client, row, value, item) => {
	const loaderId = `upadting-${row?._id}`;

	try {
		Loaders.createToast(loaderId, 'Updation in Progress');

		await client.mutate({
			variables: {
				document: {
					fileId: row?._id,
					custom_data: { [`${item?.name}`]: value },
				},
			},
			mutation: UPDATE_DOCUMENT,
		});

		Loaders.successToast(loaderId, 'Updation Complete');
		tableGlobalController.refetch();
	} catch {
		Loaders.errorToast(loaderId, 'Updation in Complete');
	}
};

const DocumentMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	onClickedRow,
	onCustomKeyChange,
	CustomToolBar: DocumentToolBar,
	gridViewSettings: {
		// Document grid view
		label: 'Documents',
		module: 'Documents',
		Icon: DescriptionOutlinedIcon,
		defaultView: {
			name: 'All Documents',
			type: 'Default',
		},
		handleDefaultView: (view, user) => {
			const TOTAL_DAYS = 30;

			if (view.name === 'My Documents') {
				view.filters = [
					{
						field: 'user.name',
						value: user.name || user.displayName || user.email,
					},
				];
			}

			if (view.name === 'Recently Modified' || view.name === 'Recently Added') {
				const fieldName = view.name === 'Recently Modified' ? 'lastUpdateAt' : 'ts';
				view.sort = [{ field: fieldName, desc: true }];
			}

			return view;
		},
		cssOverride: {
			top: '138px',
			left: '45px',
		},
	},
	defaultSort: { field: 'ts', order: 'desc', unmapped_type: 'date' },
	defaultFilters: [
		// Default search filters
		{
			field: 'fileUrl',
			value: 'jobs',
			type: 'advanced',
			searchType: 'notEquals',
		},
		{
			field: 'isLayerFile',
			value: true,
			type: 'advanced',
			searchType: 'notEquals',
		},
		{
			field: 'isDatasetFile',
			value: true,
			type: 'advanced',
			searchType: 'notEquals',
		},
	],
	maxTableHeight: 'calc(100vh - 200px)',
	isInFiniteScroll: true,
	columnVirtualization: true,
	fetchMetaData: {
		category: 'Docs',
	},
	TableSchema: [
		{
			...CommonSchema.HIDDEN,
			name: '_id',
			id: '_id',
		},

		{
			...CommonSchema.INITAIL_PINNED,
			name: 'name.keyword',
			id: 'name',
			header: 'File Name',
			size: 400,
			Cell: ({ row }) => {
				return <FileName docInfo={row?.original} />;
			},
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'documentNumber.keyword',
			id: 'documentNumber',
			header: 'File Number',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'documentName.keyword',
			id: 'documentName',
			header: 'File Description',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'documentType.keyword',
			id: 'documentType',
			header: 'File Type',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'documentDate',
			id: 'documentDate',
			header: 'File Date',
			type: 'date',
			isSearchField: false, // donn't include in search fields
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.dateTime)}</>;
			},
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'book.keyword',
			id: 'book',
			header: 'Book',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'page.keyword',
			id: 'page',
			header: 'Page',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'instrument.keyword',
			id: 'instrument',
			header: 'Instrument #',
		},

		{
			name: 'user.name',
			id: 'user.name',
			header: 'Owner',
			size: 250,
			filter: true,
			isSearchField: false,
			type: 'string',
		},

		{
			...CommonSchema.ACTION_COLUMN,
			name: 'actionMenu',
			id: 'actionMenu',
			header: ' ',
			size: 70,
			Cell: ({ row }) => {
				return <FileDownload id={row?.original?._id} />;
			},
		},

		{
			...CommonSchema.ACTION_COLUMN,
			name: 'actionMenu2',
			id: 'actionMenu2',
			header: ' ',
			size: 70,
			Cell: ({ row }) => {
				return <FileView docInfo={row?.original} />;
			},
		},
	],
};

export default DocumentMeta;
