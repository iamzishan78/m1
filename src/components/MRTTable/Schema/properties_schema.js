// Importing necessary dependencies and components
import { ErrorOutline } from '@material-ui/icons';
import { LocalAtm as CurrencyIcon } from '@material-ui/icons';
import React from 'react';
import { useHistory } from 'react-router-dom';

import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import { formatDate } from 'components/Shared/functions';

import WellIcon from '../../../components/Shared/svgIcons/well.js';
// Elasticsearch index for properties
const esIndex = 'properties_flat';

// Metadata for the Properties table
const PropertiesMeta = {
	esIndex, //  Elasticsearch search index
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	defaultSort: { field: 'name.keyword', order: 'asc' },
	maxTableHeight: 'calc(100vh - 500px)',
	isInFiniteScroll: true,
	columnVirtualization: true,
	gridViewSettings: {
		label: 'Properties',
		module: 'Properties',
		Icon: CurrencyIcon,
		defaultView: {
			name: 'All Properties',
			type: 'Default',
		},
		handleDefaultView: (view, user) => {
			return view;
		},
		cssOverride: {
			top: '440px',
			left: '5px',
		},
	},
	// Definition of table schema
	TableSchema: [
		// Hidden columns
		{
			...CommonSchema.HIDDEN,
			name: 'id',
			accessorKey: 'id',
		},
		// Allow M1neral System ID to export in Grid
		{
			...CommonSchema.MONGO_ID,
			name: '_id',
			accessorKey: '_id',
		},
		// Column for Property with link
		{
			...CommonSchema.INITAIL_PINNED,
			name: 'purchaserNumber.keyword',
			accessorKey: 'purchaserNumber',
			header: 'Property',
			// Cell rendering for Property column
			Cell: ({ row }) => {
				const history = useHistory();
				const wells = row.getValue('wells.apiNumber');
				const wellApiIndex = wells?.[0]?.apiNumber;
				const wellName = wells?.[0]?.wellName;
				return (
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<ColumnWithLink
							onClick={e => {
								e.stopPropagation();
								history.push(`/revenue/property/details/${row.getValue('_id')}`);
							}}
							value={
								row.getValue('purchaserNumber')?.split('_')?.[0]
									? `${row.getValue('purchaserNumber')?.split('_')?.[0]} - ${row.getValue('name')}`
									: row.getValue('name')
							}
							link={`/revenue/property/details/${row.getValue('_id')}`}
						/>
						{!(wellApiIndex && wellName) && (
							<div
								style={{ marginLeft: '15px', cursor: 'pointer' }}
								onClick={e => {
									e.stopPropagation();
									history.push(`/revenue/property/details/${row.getValue('_id')}`, { focusOnWellSearch: true });
								}}
							>
								<WellIcon size={'18'} opacity={'1'} color="gray" />
								<ErrorOutline
									style={{
										width: '17px',
										height: '17px',
										color: 'gray',
									}}
								/>
							</div>
						)}
					</div>
				);
			},
		},
		// Columns for Well API Number and Well Name
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'wells.apiNumber.keyword',
			accessorFn: row => row?.wells,
			id: 'wells.apiNumber',
			header: 'Well API#',
			isExport: 'apiNumber',
			Cell: ({ renderedCellValue }) => {
				if (renderedCellValue?.length > 0) {
					return renderedCellValue?.length > 1 ? 'MULTIPLE' : renderedCellValue[0].apiNumber;
				} else {
					return '';
				}
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'wells.wellName.keyword',
			accessorFn: row => row?.wells,
			id: 'wells.wellName',
			header: 'Well Name',
			isExport: 'wellName',
			Cell: ({ renderedCellValue }) => {
				if (renderedCellValue?.length > 0) {
					return renderedCellValue?.length > 1 ? 'MULTIPLE' : renderedCellValue[0].wellName;
				} else {
					return '';
				}
			},
		},
		// Columns for Property details
		{
			...CommonSchema.HIDDEN,
			name: 'name.keyword',
			accessorFn: row => row?.name,
			id: 'name',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'purchaserNumber.keyword',
			accessorFn: row => row?.purchaserNumber,
			id: 'purchaserNumber',
			header: 'Payor Prop #',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'purchaser.name.keyword',
			accessorFn: row => row?.purchaser?.name,
			id: 'purchaser.name',
			header: 'Payor',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'number.keyword',
			accessorFn: row => row?.number,
			id: 'number',
			header: 'Operator Prop #',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'operator.name.keyword',
			accessorFn: row => row?.operator?.name,
			id: 'operator.name',
			header: 'Operator',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'state.keyword',
			accessorFn: row => row?.state,
			id: 'state',
			header: 'State',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'county.keyword',
			accessorFn: row => row?.county,
			id: 'county',
			header: 'County',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'description.keyword',
			accessorFn: row => row?.description,
			id: 'description',
			header: 'Property Description',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'status.keyword',
			accessorFn: row => row?.status,
			id: 'status',
			header: 'Pay Status',
			type: 'defaultFiltersOptions',
			defaultFilterOptions: [
				{ label: 'In Pay', value: 'inpay' },
				{ label: 'Not in Pay', value: 'notinpay' },
			],
			// Cell rendering for Pay Status column
			Cell: ({ row }) => {
				const { status } = row?.original;
				const formattedValue = status ? status.replace(/\s+/g, '').toLowerCase() : '';

				const formattedStatus =
					formattedValue === 'inpay' ? 'In Pay' : formattedValue === 'notinpay' ? 'Not in Pay' : '';
				return <div>{formattedStatus}</div>;
			},
		},
		// Columns for last check details
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'lastCheck.checkNumber.keyword',
			accessorFn: row => row?.lastCheck?.checkNumber,
			id: 'lastCheck.checkNumber',
			header: 'Last Check#',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'lastCheck.checkDate',
			accessorFn: row => row?.lastCheck?.checkDate,
			id: 'lastCheck.checkDate',
			header: 'Last Check',
			simple: true,
			type: 'date',
			isSearchField: false,
			// Cell rendering for Last Check Date column
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.lastCheck?.checkDate)}</>;
			},
		},
		// Columns for additional property details
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'prospectID.keyword',
			accessorFn: row => row?.prospectID,
			id: 'prospectID',
			header: 'Prospect',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'acquisitionID.keyword',
			accessorFn: row => row?.acquisitionID,
			id: 'acquisitionID',
			header: 'Acquisition ID',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'internalID.keyword',
			accessorFn: row => row?.internalID,
			id: 'internalID',
			header: 'Accounting Ref ID',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'internalCompany.keyword',
			accessorFn: row => row?.internalCompany,
			id: 'internalCompany',
			header: 'Internal Company',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'owner.name.keyword',
			accessorFn: row => row?.owner?.name,
			id: 'owner.name',
			header: 'Owner Name',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'source.keyword',
			accessorFn: row => row?.source,
			id: 'source',
			header: 'Source',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'approvalStatus.keyword',
			accessorFn: row => row?.approvalStatus,
			id: 'approvalStatus',
			header: 'Approval Status',
		},
		// Columns for tags and comments
		{
			...CommonSchema.TAGS,
			// Cell rendering for Tags column
			Cell: ({ row }) => {
				const targetSourceId = row.getValue('_id');
				const targetLabel = 'property';
				return (
					<TagCell
						id={targetSourceId}
						targetSourceId={targetSourceId}
						tags={row?.original?.tags}
						targetLabel={targetLabel}
					/>
				);
			},
		},
		{
			...CommonSchema.COMMENTS,
			// Cell rendering for Comments column
			Cell: ({ renderedCellValue, row }) => {
				const id = row.getValue('_id');
				const targetLabel = 'property';
				return <CommentCell id={id} value={renderedCellValue.length} targetLabel={targetLabel} />;
			},
		},
	],
};

export default PropertiesMeta;
