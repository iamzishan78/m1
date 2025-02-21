/* eslint-disable react/prop-types */
import React from 'react';

import Grid from '@material-ui/core/Grid';

import _ from 'lodash';

import Loader from 'components/Loaders';
import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import AgreementToolBar from 'components/MRTTable/TablesOverride/AgreementTable/AgreementToolbar';
import { formatDate } from 'components/Shared/functions';
import Agreements from 'components/Shared/svgIcons/agreements';

import { globalStateController } from 'controllers/globalStateController';
import { tableGlobalController } from 'controllers/tableController';

import { UPDATECUSTOMLAYER } from 'graphQL/useMutationUpdateCustomLayer';

import { copy } from 'utils/helper';

const esIndex = 'shapes_flat';

const onCustomKeyChange = async (client, row, value, item) => {
	const loaderId = `upadting-${row?._id}`;

	try {
		Loader.createToast(loaderId, 'Updation in Progress');
		const user = globalStateController.getValue('user');

		const customData = copy(row?.shapeJson?.properties?.custom_data) ?? {};
		const filteredCustomData = _.pickBy(customData, value => value !== '' && !_.isEmpty(value));

		const shapeJson = {
			...row?.shapeJson,
			properties: {
				...row?.shapeJson?.properties,
				custom_data: {
					...filteredCustomData,
					[item.name]: value,
				},
			},
		};

		await client.mutate({
			variables: {
				customLayerId: row?._id,
				userId: user?._id,
				customLayer: {
					shape: JSON.stringify(shapeJson),
					shapeJson,
				},
			},
			mutation: UPDATECUSTOMLAYER,
			refetchQueries: ['getDbFilters'],
		});
		Loader.successToast(loaderId, 'Updation Complete');
		tableGlobalController.refetch();
	} catch {
		Loader.errorToast(loaderId, 'Updation in Complete');
	}
};

export const AgreementTypes = {
	lease: 'Lease',
	deed: 'Deed',
	contract: 'Contract',
	surface: 'Surface/ROW',
};

const AgreementMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	gridViewSettings: {
		label: 'Agreements',
		module: 'Agreements',
		Icon: Agreements,
		defaultView: {
			name: 'All Agreements',
			type: 'Default',
		},
		handleDefaultView: (view, user) => {
			if (view?.name === 'My Agreements') {
				view.filters[0].value = user._id;
			}
			return view;
		},
		cssOverride: {
			top: '138px',
			left: '10px',
			marginLeft: '-7px',
		},
	},
	onCustomKeyChange,
	CustomToolBar: AgreementToolBar,
	defaultSort: { field: '_ts', order: 'desc' },
	defaultFilters: [{ field: 'shapeJson.properties.type.keyword', value: 'agreement' }],
	maxTableHeight: 'calc(100vh - 200px)',
	isInFiniteScroll: true,
	columnVirtualization: true,
	fetchMetaData: {
		category: 'Agreement',
	},
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
			header: 'Agreement',
			Cell: ({ row }) => {
				let value = row?.original?.shapeJson.properties.agreementNumber;
				let layer = row?.original?.layer;
				value = value?.toString();
				const splitNumber = value?.split('_');
				let link = '';
				if (window.location.pathname.includes('/land/')) {
					link = `/land/agreement/details/${row?.original?._id}`;
				} else {
					link = `/map/${layer}s/${row?.original?._id}`;
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
											? `${splitNumber?.[0].trim()} - ${row?.original?.shapeJson?.properties?.agreementName}`
											: row?.original?.shapeJson?.properties?.agreementName
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
			name: 'shapeJson.properties.agreementName.keyword',
			id: 'shapeJson.properties.agreementName',
			header: 'Agreement Name',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.agreementType.keyword',
			id: 'shapeJson.properties.agreementType',
			header: 'Type',
			Cell: ({ row }) => {
				const value = row?.original?.shapeJson?.properties?.agreementType;
				return <>{AgreementTypes[value] || ''}</>;
			},
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.agreementSubtype.keyword',
			id: 'shapeJson.properties.agreementSubtype',
			header: 'Agreement Subtype',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.originalProperties.State.keyword',
			id: 'shapeJson.properties.originalProperties.State',
			header: 'State',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.originalProperties.County.keyword',
			id: 'shapeJson.properties.originalProperties.County',
			header: 'County',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.rightsType.keyword',
			id: 'shapeJson.properties.rightsType',
			header: 'Rights',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.grantor.keyword',
			id: 'shapeJson.properties.grantor',
			header: 'Grantor (Party 1)',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.grantee.keyword',
			id: 'shapeJson.properties.grantee',
			header: 'Grantee (Party 2)',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.agreementDate',
			id: 'shapeJson.properties.agreementDate',
			type: 'date',
			header: 'Agmt Date',
			isSearchField: false,
			Cell: ({ row }) => {
				const value = row?.original?.shapeJson?.properties?.agreementDate;
				return <>{formatDate(value)}</>;
			},
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.effectiveDate.keyword',
			id: 'shapeJson.properties.effectiveDate',
			header: 'Efftv Date',
			isSearchField: false,
			type: 'date',
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.shapeJson?.properties?.effectiveDate)}</>;
			},
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.agreementTerm.keyword',
			id: 'shapeJson.properties.agreementTerm',
			header: 'Primary Term (Mo)',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.expirationDate.keyword',
			id: 'shapeJson.properties.expirationDate',
			header: 'Exp Date',
			isSearchField: false,
			type: 'date',
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.shapeJson?.properties?.expirationDate)}</>;
			},
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.extensionTerm.keyword',
			id: 'shapeJson.properties.extensionTerm',
			header: 'Extension Term (Mo)',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.extensionDate.keyword',
			id: 'shapeJson.properties.extensionDate',
			header: 'Extension Exp Date',
			isSearchField: false,
			type: 'date',
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.shapeJson?.properties?.extensionDate)}</>;
			},
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.bounusPayment.keyword',
			id: 'shapeJson.properties.bounusPayment',
			header: 'Bonus Payment',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.agmtRoyalty.keyword',
			id: 'shapeJson.properties.agmtRoyalty',
			header: 'Agmt Royalty(%)',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.agreementStatus.keyword',
			id: 'shapeJson.properties.agreementStatus',
			header: 'Status',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.acquisitionID.keyword',
			id: 'shapeJson.properties.acquisitionID',
			header: 'Acquisition ID',
			size: 280,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.acquisitionDate',
			id: 'shapeJson.properties.acquisitionDate',
			header: 'Acquisition Date',
			type: 'date',
			isSearchField: false,
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.shapeJson?.properties?.acquisitionDate)}</>;
			},
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.prospectID.keyword',
			id: 'shapeJson.properties.prospectID',
			header: 'Prospect',
		},

		{
			...CommonSchema.CURRENCY_COLUMN,
			type: 'string',
			name: 'shapeJson.properties.totalAcquisitionCost.keyword',
			id: 'shapeJson.properties.totalAcquisitionCost',
			header: 'Total Acquisition Cost',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.internalCompany.keyword',
			id: 'shapeJson.properties.internalCompany',
			header: 'Company ID',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.metaDescription.keyword',
			id: 'shapeJson.properties.metaDescription.keyword',
			header: 'Description',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.recordedDate.keyword',
			id: 'shapeJson.properties.recordedDate',
			header: 'Recorded Date',
			type: 'date',
			isSearchField: false,
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.shapeJson?.properties?.recordedDate)}</>;
			},
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.recordedBook.keyword',
			id: 'shapeJson.properties.recordedBook',
			header: 'Book',
			isSearchField: false,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.recordedPage.keyword',
			id: 'shapeJson.properties.recordedPage',
			header: 'Page',
			isSearchField: false,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.recordedInstrumentNumber.keyword',
			id: 'shapeJson.properties.recordedInstrumentNumber',
			header: 'Instrument #',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.reportGrossAcres.keyword',
			id: 'shapeJson.properties.reportGrossAcres',
			header: 'Report Gross',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.grossAcres.keyword',
			id: 'shapeJson.properties.grossAcres',
			header: 'Gross',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.reportNet.keyword',
			id: 'shapeJson.properties.reportNet',
			header: 'Report Net',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.netAcres.keyword',
			id: 'shapeJson.properties.netAcres',
			header: 'Net',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.companyNetAcres.keyword',
			id: 'shapeJson.properties.companyNetAcres',
			header: 'Company Net',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.netRoyalty.keyword',
			id: 'shapeJson.properties.netRoyalty',
			header: 'NRA',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'shapeJson.properties.ownerName.keyword',
			id: 'shapeJson.properties.ownerName',
			header: 'Owner',
		},
		CommonSchema.CREATED_BY,
		CommonSchema.CREATED_DATE,
		CommonSchema.LAST_UPDATED_BY,
		CommonSchema.LAST_UPDATED_DATE,

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
	],
};

export default AgreementMeta;
