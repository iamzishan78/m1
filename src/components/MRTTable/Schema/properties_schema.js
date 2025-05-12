/* eslint-disable react/prop-types */
import React from 'react';
import { useHistory } from 'react-router-dom';

import { ErrorOutline, LocalAtm as CurrencyIcon } from '@material-ui/icons';

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
		handleDefaultView: view => {
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
			name: 'name.keyword',
			id: 'name',
			header: 'Property',
			size: 450,
			// Cell rendering for Property column
			Cell: ({ row }) => {
				const history = useHistory();
				const wellApiIndex = row.getValue('wells.apiNumber');
				const wellName = row.getValue('wells.wellName');

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
			...CommonSchema.STRING_COLUMN,
			name: 'wells.apiNumber.keyword',
			id: 'wells.apiNumber',
			header: 'Well API#',
			isExport: 'apiNumber',
			accessorFn: row => {
				if (!row?.wells || row.wells.length === 0) {
					return '';
				}
				return row.wells.length > 1 ? 'MULTIPLE' : row.wells[0].apiNumber;
			},
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'wells.wellName.keyword',
			id: 'wells.wellName',
			header: 'Well Name',
			isExport: 'wellName',
			accessorFn: row => {
				if (!row?.wells || row.wells.length === 0) {
					return '';
				}
				return row.wells.length > 1 ? 'MULTIPLE' : row.wells[0].wellName;
			},
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'purchaserNumber.keyword',
			id: 'purchaserNumber',
			header: 'Payor Prop #',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'purchaser.name.keyword',
			id: 'purchaser.name',
			header: 'Payor',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'number.keyword',
			id: 'number',
			header: 'Operator Prop #',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'operator.name.keyword',
			id: 'operator.name',
			header: 'Operator',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'state.keyword',
			id: 'state',
			header: 'State',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'county.keyword',
			id: 'county',
			header: 'County',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'description.keyword',
			id: 'description',
			header: 'Property Description',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'status.keyword',
			id: 'status',
			header: 'Pay Status',
			defaultFilterOptions: [
				{ label: 'In Pay', value: 'inpay' },
				{ label: 'Not in Pay', value: 'notinpay' },
			],
			// Cell rendering for Pay Status column
			Cell: ({ row }) => {
				const { status } = row.original;
				const formattedValue = status ? status.replace(/\s+/g, '').toLowerCase() : '';

				const formattedStatus =
					formattedValue === 'inpay' ? 'In Pay' : formattedValue === 'notinpay' ? 'Not in Pay' : '';
				return <div>{formattedStatus}</div>;
			},
		},
		// Columns for last check details
		{
			...CommonSchema.STRING_COLUMN,
			name: 'lastCheck.checkNumber.keyword',
			id: 'lastCheck.checkNumber',
			header: 'Last Check#',
		},
		{
			...CommonSchema.STRING_COLUMN,
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
			...CommonSchema.STRING_COLUMN,
			name: 'prospectID.keyword',
			id: 'prospectID',
			header: 'Prospect',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'acquisitionID.keyword',
			id: 'acquisitionID',
			header: 'Acquisition ID',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'internalID.keyword',
			id: 'internalID',
			header: 'Accounting Ref ID',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'internalCompany.keyword',
			id: 'internalCompany',
			header: 'Internal Company',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'owner.name.keyword',
			id: 'owner.name',
			header: 'Owner Name',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'source.keyword',
			id: 'source',
			header: 'Source',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'approvalStatus.keyword',
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
