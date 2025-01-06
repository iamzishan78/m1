/* eslint-disable react/prop-types */
import React from 'react';

import Grid from '@material-ui/core/Grid';

import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import { formatDate } from 'components/Shared/functions';

const esIndex = 'shapes_flat';

const ContactDetailRelatedAgreementMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	defaultSort: { field: '_ts', order: 'desc' },
	defaultFilters: [{ field: 'shapeJson.properties.type.keyword', value: 'agreement' }],
	maxTableHeight: 'calc(50vh - 100px)',
	isInFiniteScroll: true,
	columnVirtualization: true,
	TableSchema: [
		{
			...CommonSchema.HIDDEN,
			name: '_id',
			id: '_id',
		},

		{
			...CommonSchema.INITAIL_PINNED,
			name: 'shapeJson.properties.agreementNumber.keyword',
			id: 'shapeJson.properties.agreementNumber',
			header: 'Agreement Number',
			Cell: ({ row }) => {
				let value = row?.original?.shapeJson.properties.agreementNumber;
				value = value?.toString();
				const splitNumber = value?.split('_');
				return (
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							minWidth: '500px',
							maxWidth: '500px',
						}}
					>
						<Grid
							container
							spacing={0}
							direction="row"
							style={{
								position: 'absolute',
								overflow: 'hidden',
								whiteSpace: 'nowrap',
								textOverflow: 'ellipsis',
								alignItems: 'center',

								'&:hover': {
									'& $actionButtons': {
										display: 'flex',
									},
								},
							}}
						>
							<Grid
								item
								style={{
									display: 'flex',
									justifyContent: 'flex-start',
								}}
							>
								<ColumnWithLink
									value={
										splitNumber?.[0]
											? `${splitNumber?.[0].trim()} - ${row?.original?.shapeJson?.properties?.agreementName}`
											: row?.original?.shapeJson?.properties?.agreementName
									}
									link={`/land/agreement/details/${row?.original?._id}`}
									onClick={e => {
										e.stopPropagation();
									}}
								/>
							</Grid>
						</Grid>
					</div>
				);
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.agreementName.keyword',
			id: 'shapeJson.properties.agreementName',
			header: 'Agreement Name',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.agreementType.keyword',
			id: 'shapeJson.properties.agreementType',
			header: 'Agmt Type',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.agreementSubtype.keyword',
			id: 'shapeJson.properties.agreementSubtype',
			header: 'Agmt Subtype',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.grantee.keyword',
			id: 'shapeJson.properties.grantee',
			header: 'Grantee',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.grantor.keyword',
			id: 'shapeJson.properties.grantor',
			header: 'Grantor',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.agreementDate',
			id: 'shapeJson.properties.agreementDate',
			type: 'date',
			header: 'Agmt Date',
			isSearchField: false,
			simple: true,
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.shapeJson?.properties?.agreementDate)}</>;
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.effectiveDate',
			id: 'shapeJson.properties.effectiveDate',
			type: 'date',
			header: 'Efftv Date',
			isSearchField: false,
			simple: true,
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.shapeJson?.properties?.effectiveDate)}</>;
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.expirationDate',
			id: 'shapeJson.properties.expirationDate',
			type: 'date',
			header: 'Exp Date',
			isSearchField: false,
			simple: true,
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.shapeJson?.properties?.expirationDate)}</>;
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.extensionDate',
			id: 'shapeJson.properties.extensionDate',
			type: 'date',
			header: 'Ext Date',
			isSearchField: false,
			simple: true,
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.shapeJson?.properties?.extensionDate)}</>;
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.agreementStatus.keyword',
			id: 'shapeJson.properties.agreementStatus',
			header: 'Status',
		},
		{
			...CommonSchema.TAGS,
			Cell: ({ row }) => {
				const targetSourceId = row.getValue('_id');
				return (
					<TagCell
						id={targetSourceId}
						targetSourceId={targetSourceId}
						tags={row?.original?.tags}
						targetLabel={'agreement'}
					/>
				);
			},
		},
		{
			...CommonSchema.COMMENTS,
			Cell: ({ renderedCellValue, row }) => {
				const id = row.getValue('_id');
				return <CommentCell id={id} value={renderedCellValue.length} targetLabel={'agreement'} />;
			},
		},
	],
};

export default ContactDetailRelatedAgreementMeta;
