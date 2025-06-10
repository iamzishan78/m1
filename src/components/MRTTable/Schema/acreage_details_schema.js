/* eslint-disable react/prop-types */
import React from 'react';

import { Summarize } from '@mui/icons-material';
import { Grid } from '@mui/material';

import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';

import { AgreementTypes } from './agreement_schema';
import { CommonSchema } from './common_schema';
import ExhibitAToolbar from '../TablesOverride/ExhibitATable/ExhibitAToolbar';

const esIndex = 'shapetracts_flat';

const AcreageDetilsMeta = {
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
		label: 'Acreage Detail',
		module: 'Acreage Detail',
		Icon: Summarize,
		defaultView: {
			name: 'All Acreage Detail',
			type: 'Default',
		},
		handleDefaultView: (view, user) => {
			if (view?.name === 'My Acreage Detail') {
				const newFilters = [...view.filters];
				newFilters[0] = {
					...newFilters[0],
					value: user._id,
				};

				return {
					...view,
					filters: newFilters,
				};
			}

			return view;
		},
		cssOverride: {
			top: '198px',
			left: '19px',
		},
	},
	maxTableHeight: 'calc(100vh - 290px)',
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
			...CommonSchema.STRING_COLUMN,
			header: 'Agreement Name',
			id: 'shape.shapeJson.properties.agreementName',
			name: 'shape.shapeJson.properties.agreementName.keyword',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Agreement Type',
			id: 'shape.shapeJson.properties.layerSubType',
			name: 'shape.shapeJson.properties.layerSubType.keyword',
			Cell: ({ row }) => {
				const value = row?.original?.shape?.shapeJson?.properties?.layerSubType;
				return <>{AgreementTypes[value] || ''}</>;
			},
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Agreement Subtype',
			id: 'shape.shapeJson.properties.agreementSubtype',
			name: 'shape.shapeJson.properties.agreementSubtype.keyword',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Rights',
			id: 'shape.shapeJson.properties.rightsType',
			name: 'shape.shapeJson.properties.rightsType.keyword',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Agreement Status',
			id: 'shape.shapeJson.properties.agreementStatus',
			name: 'shape.shapeJson.properties.agreementStatus.keyword',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'State',
			id: 'shape.shapeJson.properties.originalProperties.State',
			name: 'shape.shapeJson.properties.originalProperties.State.keyword',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'County',
			id: 'shape.shapeJson.properties.originalProperties.County',
			name: 'shape.shapeJson.properties.originalProperties.County.keyword',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Tract Name',
			id: 'parcel.name',
			name: 'parcel.name.keyword',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Tract Status',
			id: 'parcel.tractStatus',
			name: 'parcel.tractStatus.keyword',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Report Gross',
			id: 'parcel.shapeJson.properties.report.reportGrossAcres',
			name: 'parcel.shapeJson.properties.report.reportGrossAcres',
			type: 'number',
			...CommonSchema.AGGREGATED_FIELD('Total Report Gross'),
			...CommonSchema.AGGREGATED_FOOTER('parcel.shapeJson.properties.report.reportGrossAcres', 'AcreageDetailsTable'),
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Gross',
			id: 'parcel.shapeJson.properties.report.sdGrossAcres',
			name: 'parcel.shapeJson.properties.report.sdGrossAcres',
			type: 'number',
			...CommonSchema.AGGREGATED_FIELD('Gross'),
			...CommonSchema.AGGREGATED_FOOTER('parcel.shapeJson.properties.report.sdGrossAcres', 'AcreageDetailsTable'),
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Net',
			id: 'parcel.shapeJson.properties.report.netAcres',
			name: 'parcel.shapeJson.properties.report.netAcres',
			type: 'number',
			...CommonSchema.AGGREGATED_FIELD('Net'),
			...CommonSchema.AGGREGATED_FOOTER('parcel.shapeJson.properties.report.netAcres', 'AcreageDetailsTable'),
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Co. Net',
			id: 'parcel.shapeJson.properties.report.companyNetAcres',
			name: 'parcel.shapeJson.properties.report.companyNetAcres',
			type: 'number',
			...CommonSchema.AGGREGATED_FIELD('NRA'),
			...CommonSchema.AGGREGATED_FOOTER('parcel.shapeJson.properties.report.companyNetAcres', 'AcreageDetailsTable'),
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'NRA',
			id: 'parcel.shapeJson.properties.report.netRoyalty',
			name: 'parcel.shapeJson.properties.report.netRoyalty',
			type: 'number',
			...CommonSchema.AGGREGATED_FIELD('NRA'),
			...CommonSchema.AGGREGATED_FOOTER('parcel.shapeJson.properties.report.netRoyalty', 'AcreageDetailsTable'),
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Acquisition',
			id: 'shape.shapeJson.properties.acquisitionID',
			name: 'shape.shapeJson.properties.acquisitionID.keyword',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Prospect',
			id: 'shape.shapeJson.properties.prospectID',
			name: 'shape.shapeJson.properties.prospectID.keyword',
		},
		{
			...CommonSchema.STRING_COLUMN,
			header: 'Internal Company',
			id: 'shape.shapeJson.properties.internalCompany',
			name: 'shape.shapeJson.properties.internalCompany.keyword',
		},
	],
};

export default AcreageDetilsMeta;
