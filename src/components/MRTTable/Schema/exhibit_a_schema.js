/* eslint-disable react/prop-types */
import React from 'react';

import { Summarize } from '@mui/icons-material';
import { Grid } from '@mui/material';

import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import { formatDate } from 'components/Shared/functions';

import { AgreementTypes } from './agreement_schema';
import { CommonSchema } from './common_schema';
import ExhibitAToolbar from '../TablesOverride/ExhibitATable/ExhibitAToolbar';

const esIndex = 'shapetracts_flat';

const ExhibitAMeta = {
	esIndex,
	pageSize: 25,
	pagination: {
		pageIndex: 0,
		pageSize: 25,
	},
	defaultSort: { field: '_ts', order: 'asc' },
	defaultFilters: [
		{
			field: 'shape.shapeJson.properties.type',
			value: 'agreement',
		},
	],
	CustomToolBar: ExhibitAToolbar,
	gridViewSettings: {
		label: 'Exhibit A',
		module: 'Exhibit A',
		Icon: Summarize,
		defaultView: {
			name: 'All Exhibit A',
			type: 'Default',
		},
		handleDefaultView: (view, user) => {
			switch (view?.name) {
				case 'My Exhibit A':
					view.filters[0].value = user._id;
					break;

				default:
					break;
			}

			return view;
		},
		cssOverride: {
			top: '198px',
			left: '19px',
		},
	},
	maxTableHeight: 'calc(100vh - 365px)',
	isInFiniteScroll: true,
	columnVirtualization: true,
	TableSchema: [
		{
			...CommonSchema.HIDDEN,
			name: 'id',
			id: 'id',
		},

		{
			...CommonSchema.HIDDEN,
			name: '_id',
			id: '_id',
		},
		{
			...CommonSchema.HIDDEN,
			header: 'Agreement Id',
			id: 'shape._id',
			name: 'shape._id',
		},
		{
			...CommonSchema.INITAIL_PINNED,
			header: 'Agreement #',
			id: 'shape.shapeJson.properties.agreementNumber',
			name: 'shape.shapeJson.properties.agreementNumber.keyword',
			Cell: ({ row }) => {
				let value = row?.original?.shape?.shapeJson.properties.agreementNumber;
				let layer = row?.original?.shape?.layer;
				value = value?.toString();
				const splitNumber = value?.split('_');
				let link = '';
				if (window.location.pathname.includes('/land/')) {
					link = `/land/agreement/details/${row?.original?.shape?._id}`;
				} else {
					link = `/map/${layer}s/${row?.original?.shape?._id}`;
				}
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
											? `${splitNumber?.[0].trim()} - ${row?.original?.shape?.shapeJson?.properties?.agreementName || ''}`
											: row?.original?.shape?.shapeJson?.properties?.agreementName
									}
									link={link}
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
			header: 'Agreement Name',
			id: 'shape.shapeJson.properties.agreementName',
			name: 'shape.shapeJson.properties.agreementName.keyword',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Type',
			id: 'shape.shapeJson.properties.agreementType',
			name: 'shape.shapeJson.properties.agreementType.keyword',
			Cell: ({ row }) => {
				const value = row?.original?.shape?.shapeJson?.properties?.agreementType;
				return <>{AgreementTypes[value] || ''}</>;
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Lessor/Grantor',
			id: 'shape.shapeJson.properties.grantor',
			name: 'shape.shapeJson.properties.grantor.keyword',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Lessee/Grantee',
			id: 'shape.shapeJson.properties.grantee',
			name: 'shape.shapeJson.properties.grantee.keyword',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Agmt Date',
			id: 'shape.shapeJson.properties.agreementDate',
			name: 'shape.shapeJson.properties.agreementDate.keyword',
			isSearchField: false,
			type: 'date',
			Cell: ({ row }) => {
				const value = row?.original?.shape?.shapeJson?.properties?.agreementDate;
				return <>{formatDate(value)}</>;
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Efftv Date',
			id: 'shape.shapeJson.properties.effectiveDate',
			name: 'shape.shapeJson.properties.effectiveDate.keyword',
			isSearchField: false,
			type: 'date',
			Cell: ({ row }) => {
				const value = row?.original?.shape?.shapeJson?.properties?.effectiveDate;
				return <>{formatDate(value)}</>;
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Agreement Status',
			id: 'shape.shapeJson.properties.agreementStatus',
			name: 'shape.shapeJson.properties.agreementStatus.keyword',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Tract Name',
			id: 'parcel.name',
			name: 'parcel.name.keyword',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'State',
			id: 'parcel.shapeJson.properties.originalProperties.State',
			name: 'parcel.shapeJson.properties.originalProperties.State.keyword',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'County',
			id: 'parcel.shapeJson.properties.originalProperties.County',
			name: 'parcel.shapeJson.properties.originalProperties.County.keyword',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Block/Twsp',
			name: 'parcel.shapeJson.properties.originalProperties.blockTownship.keyword',
			id: 'parcel.shapeJson.properties.originalProperties.blockTownship',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Sec/Range',
			name: 'parcel.shapeJson.properties.originalProperties.rangeSection.keyword',
			id: 'parcel.shapeJson.properties.originalProperties.rangeSection',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Abstract/Sec',
			name: 'parcel.shapeJson.properties.originalProperties.abstractSection.keyword',
			id: 'parcel.shapeJson.properties.originalProperties.abstractSection',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Legal Description',
			id: 'shape.shapeJson.properties.legalDesctiption',
			name: 'shape.shapeJson.properties.legalDesctiption.keyword',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Internal Company',
			id: 'shape.shapeJson.properties.internalCompany',
			name: 'shape.shapeJson.properties.internalCompany.keyword',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Prospect',
			id: 'shape.shapeJson.properties.prospectID',
			name: 'shape.shapeJson.properties.prospectID.keyword',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Acquisition',
			id: 'shape.shapeJson.properties.acquisitionID',
			name: 'shape.shapeJson.properties.acquisitionID.keyword',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Rec Date',
			id: 'shape.shapeJson.properties.recordedDate',
			name: 'shape.shapeJson.properties.recordedDate',
			isSearchField: false,
			type: 'date',
			Cell: ({ row }) => {
				const value = row?.original?.shape?.shapeJson?.properties?.recordedDate;
				return <>{formatDate(value)}</>;
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Book',
			id: 'shape.shapeJson.properties.recordedBook',
			name: 'shape.shapeJson.properties.recordedBook.keyword',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Page',
			id: 'shape.shapeJson.properties.recordedPage',
			name: 'shape.shapeJson.properties.recordedPage.keyword',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Instrument #',
			id: 'shape.shapeJson.properties.recordedInstrumentNumber',
			name: 'shape.shapeJson.properties.recordedInstrumentNumber.keyword',
		},
	],
};

export default ExhibitAMeta;
