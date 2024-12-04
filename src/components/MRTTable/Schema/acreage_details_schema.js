import { Grid } from '@mui/material';
import { CommonSchema } from './common_schema';
import ColumnWithLink from 'components/Common/MRTable/ColumnWithLink';
import { AgreementTypes } from './agreement_schema';
import { Summarize } from '@mui/icons-material';
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
			switch (view?.name) {
				case 'My Acreage Detail':
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
	maxTableHeight: 'calc(100vh - 290px)',
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
			header: 'Agreement Type',
			accessorFn: row => row?.shape?.shapeJson?.properties?.layerSubType,
			id: 'shape.shapeJson.properties.layerSubType',
			name: 'shape.shapeJson.properties.layerSubType.keyword',
			Cell: ({ row }) => {
				const value = row?.original?.shape?.shapeJson?.properties?.layerSubType;
				return <>{AgreementTypes[value] || ''}</>;
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Agreement Subtype',
			accessorFn: row => row?.shape?.shapeJson?.properties?.agreementSubtype || '',
			id: 'shape.shapeJson.properties.agreementSubtype',
			name: 'shape.shapeJson.properties.agreementSubtype.keyword',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Rights',
			accessorFn: row => row?.shape?.shapeJson?.properties?.rightsType || '',
			id: 'shape.shapeJson.properties.rightsType',
			name: 'shape.shapeJson.properties.rightsType.keyword',
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
			header: 'State',
			accessorFn: row => row?.shape?.shapeJson?.properties?.originalProperties?.State || '',
			id: 'shape.shapeJson.properties.originalProperties.State',
			name: 'shape.shapeJson.properties.originalProperties.State.keyword',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'County',
			accessorFn: row => row?.shape?.shapeJson?.properties?.originalProperties?.County || '',
			id: 'shape.shapeJson.properties.originalProperties.County',
			name: 'shape.shapeJson.properties.originalProperties.County.keyword',
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
			header: 'Tract Status',
			accessorFn: row => row?.parcel?.tractStatus || '',
			id: 'parcel.tractStatus',
			name: 'parcel.tractStatus.keyword',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Report Gross',
			accessorFn: row => row?.parcel?.shapeJson?.properties?.report?.reportGrossAcres,
			id: 'parcel.shapeJson.properties.report.reportGrossAcres',
			name: 'parcel.shapeJson.properties.report.reportGrossAcres',
			type: 'number',
			...CommonSchema.AGGREGATED_FIELD('Total Report Gross'),
			...CommonSchema.AGGREGATED_FOOTER('parcel.shapeJson.properties.report.reportGrossAcres', 'AcreageDetailsTable'),
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Gross',
			accessorFn: row => row?.parcel?.shapeJson?.properties?.report?.sdGrossAcres,
			id: 'parcel.shapeJson.properties.report.sdGrossAcres',
			name: 'parcel.shapeJson.properties.report.sdGrossAcres',
			type: 'number',
			...CommonSchema.AGGREGATED_FIELD('Gross'),
			...CommonSchema.AGGREGATED_FOOTER('parcel.shapeJson.properties.report.sdGrossAcres', 'AcreageDetailsTable'),
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Net',
			accessorFn: row => row?.parcel?.shapeJson?.properties?.report?.netAcres,
			id: 'parcel.shapeJson.properties.report.netAcres',
			name: 'parcel.shapeJson.properties.report.netAcres',
			type: 'number',
			...CommonSchema.AGGREGATED_FIELD('Net'),
			...CommonSchema.AGGREGATED_FOOTER('parcel.shapeJson.properties.report.netAcres', 'AcreageDetailsTable'),
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Co. Net',
			accessorFn: row => row?.parcel?.shapeJson?.properties?.report?.companyNetAcres,
			id: 'parcel.shapeJson.properties.report.companyNetAcres',
			name: 'parcel.shapeJson.properties.report.companyNetAcres',
			type: 'number',
			...CommonSchema.AGGREGATED_FIELD('NRA'),
			...CommonSchema.AGGREGATED_FOOTER('parcel.shapeJson.properties.report.companyNetAcres', 'AcreageDetailsTable'),
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'NRA',
			accessorFn: row => row?.parcel?.shapeJson?.properties?.report?.netRoyalty,
			id: 'parcel.shapeJson.properties.report.netRoyalty',
			name: 'parcel.shapeJson.properties.report.netRoyalty',
			type: 'number',
			...CommonSchema.AGGREGATED_FIELD('NRA'),
			...CommonSchema.AGGREGATED_FOOTER('parcel.shapeJson.properties.report.netRoyalty', 'AcreageDetailsTable'),
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
			header: 'Prospect',
			accessorFn: row => row?.shape?.shapeJson?.properties?.prospectID || '',
			id: 'shape.shapeJson.properties.prospectID',
			name: 'shape.shapeJson.properties.prospectID.keyword',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			header: 'Internal Company',
			accessorFn: row => row?.shape?.shapeJson?.properties?.internalCompany || '',
			id: 'shape.shapeJson.properties.internalCompany',
			name: 'shape.shapeJson.properties.internalCompany.keyword',
		},
	],
};

export default AcreageDetilsMeta;
