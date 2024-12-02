import { Grid } from '@mui/material';
import { CommonSchema } from './common_schema';
import ColumnWithLink from 'components/Common/MRTable/ColumnWithLink';
import { AgreementTypes } from './agreement_schema';
import { formatDate } from 'components/Shared/functions';
import { Summarize } from '@mui/icons-material';
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

				case 'Recently Added':
					view.filters = [];
					view.sorting = [{ field: '_ts', desc: true }];
					break;

				case 'Recently Modified':
					view.filters = [];
					view.sorting = [{ field: 'flatSyncAt', desc: true }];
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
			accessorKey: 'id',
		},

		{
			...CommonSchema.HIDDEN,
			name: '_id',
			accessorKey: '_id',
		},
		{
			...CommonSchema.HIDDEN,
			header: 'Agreement Id',
			accessorFn: row => row?.shape._id,
			id: 'shape._id',
			name: 'shape._id',
		},
		{
			...CommonSchema.INITAIL_PINNED,
			header: 'Agreement #',
			accessorFn: row => row?.shape?.shapeJson?.properties?.agreementNumber,
			id: 'shape.shapeJson.properties.agreementNumber',
			name: 'shape.shapeJson.properties.agreementNumber.keyword',
			Cell: ({ row }) => {
				let value = row?.original?.shape?.shapeJson.properties.agreementNumber;
				let layer = row?.original?.shape?.layer;
				value = value?.toString();
				const splitNumber = value?.split('_');
				let link = '';
				if (window.location.pathname.includes('/land/')) link = `/land/agreement/details/${row?.original?.shape?._id}`;
				else link = `/map/${layer}s/${row?.original?.shape?._id}`;
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
			accessorFn: row => row?.shape?.shapeJson?.properties?.agreementName || '',
			id: 'shape.shapeJson.properties.agreementName',
			name: 'shape.shapeJson.properties.agreementName.keyword',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Type',
			accessorFn: row => row?.shape?.shapeJson?.properties?.agreementType || '',
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
			accessorFn: row => row?.shape?.shapeJson?.properties?.grantor || '',
			id: 'shape.shapeJson.properties.grantor',
			name: 'shape.shapeJson.properties.grantor.keyword',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Lessee/Grantee',
			accessorFn: row => row?.shape?.shapeJson?.properties?.grantee || '',
			id: 'shape.shapeJson.properties.grantee',
			name: 'shape.shapeJson.properties.grantee.keyword',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Agmt Date',
			accessorFn: row => row?.shape?.shapeJson?.properties?.agreementDate || '',
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
			accessorFn: row => row?.shape?.shapeJson?.properties?.effectiveDate || '',
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
			accessorFn: row => row?.shape?.shapeJson?.properties?.agreementStatus || '',
			id: 'shape.shapeJson.properties.agreementStatus',
			name: 'shape.shapeJson.properties.agreementStatus.keyword',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Tract Name',
			accessorFn: row => row?.parcel?.name || '',
			id: 'parcel.name',
			name: 'parcel.name.keyword',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'State',
			accessorFn: row => row?.parcel?.shapeJson?.properties?.originalProperties?.State || '',
			id: 'parcel.shapeJson.properties.originalProperties.State',
			name: 'parcel.shapeJson.properties.originalProperties.State.keyword',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'County',
			accessorFn: row => row?.parcel?.shapeJson?.properties?.originalProperties?.County || '',
			id: 'parcel.shapeJson.properties.originalProperties.County',
			name: 'parcel.shapeJson.properties.originalProperties.County.keyword',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Block/Twsp',
			name: 'parcel.shapeJson.properties.originalProperties.blockTownship.keyword',
			accessorFn: row => row?.parcel?.shapeJson?.properties?.originalProperties?.blockTownship || '',
			id: 'parcel.shapeJson.properties.originalProperties.blockTownship',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Sec/Range',
			name: 'parcel.shapeJson.properties.originalProperties.rangeSection.keyword',
			accessorFn: row => row?.parcel?.shapeJson?.properties?.originalProperties?.rangeSection || '',
			id: 'parcel.shapeJson.properties.originalProperties.rangeSection',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Abstract/Sec',
			name: 'parcel.shapeJson.properties.originalProperties.abstractSection.keyword',
			accessorFn: row => row?.parcel?.shapeJson?.properties?.originalProperties?.abstractSection || '',
			id: 'parcel.shapeJson.properties.originalProperties.abstractSection',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Legal Description',
			accessorFn: row => row?.shape?.shapeJson?.properties?.legalDesctiption || '',
			id: 'shape.shapeJson.properties.legalDesctiption',
			name: 'shape.shapeJson.properties.legalDesctiption.keyword',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Internal Company',
			accessorFn: row => row?.shape?.shapeJson?.properties?.internalCompany || '',
			id: 'shape.shapeJson.properties.internalCompany',
			name: 'shape.shapeJson.properties.internalCompany.keyword',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Prospect',
			accessorFn: row => row?.shape?.shapeJson?.properties?.prospectID || '',
			id: 'shape.shapeJson.properties.prospectID',
			name: 'shape.shapeJson.properties.prospectID.keyword',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Acquisition',
			accessorFn: row => row?.shape?.shapeJson?.properties?.acquisitionID || '',
			id: 'shape.shapeJson.properties.acquisitionID',
			name: 'shape.shapeJson.properties.acquisitionID.keyword',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Rec Date',
			accessorFn: row => row?.shape?.shapeJson?.properties?.recordedDate || '',
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
			accessorFn: row => row?.shape?.shapeJson?.properties?.recordedBook || '',
			id: 'shape.shapeJson.properties.recordedBook',
			name: 'shape.shapeJson.properties.recordedBook.keyword',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Page',
			accessorFn: row => row?.shape?.shapeJson?.properties?.recordedPage || '',
			id: 'shape.shapeJson.properties.recordedPage',
			name: 'shape.shapeJson.properties.recordedPage.keyword',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Instrument #',
			accessorFn: row => row?.shape?.shapeJson?.properties?.recordedInstrumentNumber || '',
			id: 'shape.shapeJson.properties.recordedInstrumentNumber',
			name: 'shape.shapeJson.properties.recordedInstrumentNumber.keyword',
		},
	],
};

export default ExhibitAMeta;
