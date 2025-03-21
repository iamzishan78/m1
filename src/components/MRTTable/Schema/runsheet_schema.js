import React from 'react';

import GavelIcon from '@material-ui/icons/Gavel';

import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import FileDownload from 'components/MRTTable/TablesOverride/DocumentTable/TableCell/FileDownload';
import FileView from 'components/MRTTable/TablesOverride/DocumentTable/TableCell/FileView';
import { formatDate } from 'components/Shared/functions';

import { tableGlobalController } from 'stateManagement/tableController';

import RunsheetToolbar from '../TablesOverride/RunsheetTable/RunsheetToolbar';

const esIndex = 'runsheetinstrument_flat';

const RunsheetMeta = {
	esIndex,
	pageSize: 50,
	defaultHeader: {
		label: 'RUNSHEET INSTRUMENTS',
		Icon: GavelIcon,
	},
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	onClickedRow: selectedRow => {
		tableGlobalController.updateState({
			selectedInstrument: {
				...selectedRow,
				show: true,
			},
		});
	},
	maxTableHeight: 'calc(100vh - 200px)',
	isInFiniteScroll: true,
	columnVirtualization: true,
	CustomToolBar: RunsheetToolbar,
	deletedKeys: { mainRecord: { key: 'descriptorObject' } },
	TableSchema: [
		{
			...CommonSchema.HIDDEN,
			name: '_id',
			id: '_id',
		},
		{
			...CommonSchema.INITAIL_PINNED,
			name: 'instrumentType.keyword',
			id: 'instrumentType',
			header: 'Instrument Type',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'fromPartySummary.keyword',
			id: 'fromPartySummary',
			header: 'Party of the First (Grantor)',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'toPartySummary.keyword',
			id: 'toPartySummary',
			header: 'Party of the Second (Grantee)',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'effectiveDate',
			id: 'effectiveDate',
			header: 'Effective Date',
			type: 'date',
			isSearchField: false, // don't include in search fields
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.effectiveDate)}</>;
			},
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'executionDate',
			id: 'executionDate',
			header: 'Instrument Date',
			type: 'date',
			isSearchField: false, // don't include in search fields
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.executionDate)}</>;
			},
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'fileDate',
			id: 'fileDate',
			header: 'File Date',
			type: 'date',
			isSearchField: false, // donn't include in search fields
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.fileDate)}</>;
			},
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'recordType.keyword',
			id: 'recordType',
			header: 'Record Type',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'recordationNumber.keyword',
			id: 'recordationNumber',
			header: 'Rec #',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'volume.keyword',
			id: 'volume',
			header: 'Volume',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'page.keyword',
			id: 'page',
			header: 'Page',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'legalDescription.keyword',
			id: 'legalDescription',
			header: 'Legal Description',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'legalDescription.keyword',
			id: 'legalDescription',
			header: 'Legal Description',
		},
		{
			...CommonSchema.TAGS,
			Cell: ({ row }) => {
				const targetSourceId = row?.original?.descriptorObject;
				return (
					<TagCell
						id={targetSourceId}
						targetSourceId={targetSourceId}
						tags={row?.original?.tags}
						targetLabel={'parcelRunsheet'}
					/>
				);
			},
		},
		{
			...CommonSchema.COMMENTS,
			Cell: ({ renderedCellValue, row }) => {
				const id = row?.original?.descriptorObject;
				return <CommentCell id={id} value={renderedCellValue.length} targetLabel={'parcelRunsheet'} />;
			},
		},

		{
			...CommonSchema.ACTION_COLUMN,
			name: 'actionMenu',
			id: 'actionMenu',
			header: ' ',
			size: 80,
			Cell: ({ row }) => {
				return <FileDownload id={row?.original?.fileId} />;
			},
		},

		{
			...CommonSchema.ACTION_COLUMN,
			name: 'actionMenu2',
			id: 'actionMenu2',
			header: ' ',
			size: 80,
			Cell: ({ row }) => {
				return <FileView docInfo={row?.original} />;
			},
		},
	],
};

export default RunsheetMeta;
