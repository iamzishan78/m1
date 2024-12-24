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

import { slidoutStateController } from 'hookstate/slidoutStateController';
import { tableGlobalController } from 'hookstate/tableController';

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
	} catch (err) {
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
			if (view.name === 'My Documents') {
				view.filters[0].value = user._id;
			}
			if (view.name === 'Recently Modified' || view.name === 'Recently Added') {
				view.filters[0].type = 'range';
				view.filters[0].value.range[view.filters[0].field].gte = moment().subtract(30, 'days').toISOString();
				view.filters[0].value.range[view.filters[0].field].lte = moment().toISOString();
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
			isKeyword: true,
		},
		{
			field: 'isLayerFile',
			value: true,
			type: 'advanced',
			searchType: 'notEquals',
			isKeyword: true,
		},
		{
			field: 'isDatasetFile',
			value: true,
			type: 'advanced',
			searchType: 'notEquals',
			isKeyword: true,
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
			accessorKey: '_id',
		},

		{
			...CommonSchema.INITAIL_PINNED,
			name: 'name.keyword',
			accessorKey: 'name',
			header: 'File Name',
			Cell: ({ row }) => {
				return <FileName docInfo={row?.original} />;
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'documentNumber.keyword',
			accessorKey: 'documentNumber',
			header: 'File Number',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'documentName.keyword',
			accessorKey: 'documentName',
			header: 'File Description',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'documentType.keyword',
			accessorKey: 'documentType',
			header: 'File Type',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'documentDate',
			accessorKey: 'documentDate',
			header: 'File Date',
			type: 'date',
			isSearchField: false, // donn't include in search fields
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.dateTime)}</>;
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'book.keyword',
			accessorKey: 'book',
			header: 'Book',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'page.keyword',
			accessorKey: 'page',
			header: 'Page',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'instrument.keyword',
			accessorKey: 'instrument',
			header: 'Instrument #',
		},

		{
			...CommonSchema.ACTION_COLUMN,
			name: 'actionMenu',
			accessorKey: 'actionMenu',
			header: ' ',
			size: 70,
			Cell: ({ row }) => {
				return <FileDownload id={row?.original?._id} />;
			},
		},

		{
			...CommonSchema.ACTION_COLUMN,
			name: 'actionMenu2',
			accessorKey: 'actionMenu2',
			header: ' ',
			size: 70,
			Cell: ({ row }) => {
				return <FileView docInfo={row?.original} />;
			},
		},
	],
};

export default DocumentMeta;
