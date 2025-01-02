/* eslint-disable react/prop-types */
import React from 'react';
import { useHistory } from 'react-router-dom';

import { ErrorOutline } from '@material-ui/icons';

import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import { formatDate } from 'components/Shared/functions';

import WellIcon from '../../../components/Shared/svgIcons/well.js';

// Elasticsearch index for properties
const esIndex = 'properties_flat';

// Metadata for the Properties table
const ReportingGroupsMeta = {
	esIndex, //  Elasticsearch search index
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	defaultSort: { field: 'name.keyword', order: 'asc' },
	maxTableHeight: 'calc(100vh - 300px)',
	isInFiniteScroll: true,
	columnVirtualization: true,
	isNotBreadcrumbView: true, // Flag to determine whether to display a simple Typography or a Breadcrumbs component. If true, Typography is rendered; if false, Breadcrumbs is rendered.
	gridViewSettings: {
		label: 'Properties',
		Icon: 'none',
		cssOverride: {
			top: '461px',
			left: '40px',
			marginLeft: '-25px',
			maxHeight: '445px',
		},
	},
	// Definition of table schema
	TableSchema: [
		// Hidden columns
		{
			...CommonSchema.HIDDEN,
			name: 'id',
			id: 'id',
		},
		// Allow M1neral System ID to export in Grid
		{
			...CommonSchema.MONGO_ID,
			name: '_id',
			id: '_id',
		},
		// Column for Property with link
		{
			...CommonSchema.INITAIL_PINNED,
			name: 'purchaserNumber.keyword',
			id: 'purchaserNumber',
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
		{
			...CommonSchema.HIDDEN,
			name: 'name.keyword',
			header: 'Property Name',
			id: 'name',
			isSearchField: true,
			isHiddenFieldExport: true,
			hidden: true,
		},
		// Columns for Well API Number and Well Name
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'wells.apiNumber.keyword',
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
			...CommonSchema.COMMON_COLUMN,
			name: 'purchaserNumber.keyword',
			header: 'Payor Prop #',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'purchaser.name.keyword',
			id: 'purchaser.name',
			header: 'Purchaser',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'purchaser.name.keyword',
			id: 'purchaser.name',
			header: 'Payor',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'number.keyword',
			id: 'number',
			header: 'Operator Prop #',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'operator.name.keyword',
			id: 'operator.name',
			header: 'Operator',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'state.keyword',
			id: 'state',
			header: 'State',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'county.keyword',
			id: 'county',
			header: 'County',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'description.keyword',
			id: 'description',
			header: 'Property Description',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'status.keyword',
			id: 'status',
			header: 'Pay Status',
			type: 'defaultFiltersOptions',
			defaultFilterOptions: [
				{ label: 'In Pay', value: 'InPay' },
				{ label: 'Not in Pay', value: 'NotInPay' },
			],
			// Cell rendering for Pay Status column
			Cell: ({ row }) => {
				const { status } = row.original;
				const formattedStatus = status ? (status === 'InPay' ? 'In Pay' : 'Not in Pay') : '';
				return <div>{formattedStatus}</div>;
			},
		},
		// Columns for last check details
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'lastCheck.checkNumber.keyword',
			id: 'lastCheck.checkNumber',
			header: 'Last Check#',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'lastCheck.checkDate',
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
			id: 'prospectID',
			header: 'Prospect',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'acquisitionID.keyword',
			id: 'acquisitionID',
			header: 'Acquisition ID',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'internalID.keyword',
			id: 'internalID',
			header: 'Accounting Ref ID',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'internalCompany.keyword',
			id: 'internalCompany',
			header: 'Internal Company',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'owner.name.keyword',
			id: 'owner.name',
			header: 'Owner Name',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'source.keyword',
			id: 'source',
			header: 'Source',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'approvalStatus.keyword',
			id: 'approvalStatus',
			header: 'Status',
		},
		CommonSchema.CREATED_BY,
		CommonSchema.CREATED_DATE,
		CommonSchema.LAST_UPDATED_BY,
		CommonSchema.LAST_UPDATED_DATE,
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

export default ReportingGroupsMeta;
