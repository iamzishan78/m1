import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import Grid from '@material-ui/core/Grid';
import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import { formatDate } from 'components/Shared/functions';

// Schema for units/tracts Related agreements

// Elastic search index
const esIndex = 'shapeowners_flat';

// Grid Schema
const AgreementTypes = {
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
	defaultSort: { field: '_ts', order: 'desc' },
	maxTableHeight: 'calc(100vh - 200px)',
	isInFiniteScroll: true,
	columnVirtualization: true,
	TableSchema: [
		{
			...CommonSchema.HIDDEN,
			name: '_id',
			accessorKey: '_id',
		},

		{
			...CommonSchema.INITAIL_PINNED,
			name: 'shape.shapeJson.properties.agreementNumber.keyword',
			accessorKey: 'shape.shapeJson.properties.agreementNumber',
			header: 'Agreement',
			Cell: ({ row }) => {
				let value = row?.original?.shape?.shapeJson.properties.agreementNumber;
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
											? `${splitNumber?.[0].trim()} - ${row?.original?.shape?.shapeJson?.properties?.agreementName}`
											: row?.original?.shape?.shapeJson?.properties?.agreementName
									}
									link={`/land/agreement/details/${row?.original?.shape?._id}`}
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
			name: 'shape.shapeJson.properties.agreementName.keyword',
			accessorKey: 'shape.shapeJson.properties.agreementName',
			header: 'Agreement Name',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.agreementType.keyword',
			accessorKey: 'shape.shapeJson.properties.agreementType',
			header: 'Type',
			Cell: ({ row }) => {
				const value = row?.original?.shape?.shapeJson?.properties?.agreementType;
				return <>{AgreementTypes[value] || ''}</>;
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.agreementSubtype.keyword',
			accessorKey: 'shape.shapeJson.properties.agreementSubtype',
			header: 'Agreement Subtype',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.stateDetails.keyword',
			accessorKey: 'shape.shapeJson.properties.originalProperties.stateDetails',
			header: 'State',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.originalProperties.County.keyword',
			accessorKey: 'shape.shapeJson.properties.originalProperties.County',
			header: 'County',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.rightsType.keyword',
			accessorKey: 'shape.shapeJson.properties.rightsType',
			header: 'Rights',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.grantor.keyword',
			accessorKey: 'shape.shapeJson.properties.grantor',
			header: 'Grantor (Party 1)',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.grantee.keyword',
			accessorKey: 'shape.shapeJson.properties.grantee',
			header: 'Grantee (Party 2)',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.agreementDate',
			accessorKey: 'shape.shapeJson.properties.agreementDate',
			type: 'date',
			header: 'Agmt Date',
			isSearchField: false,
			Cell: ({ row }) => {
				const value = row?.original?.shape?.shapeJson?.properties?.agreementDate;
				return <>{formatDate(value)}</>;
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.effectiveDate.keyword',
			accessorKey: 'shape.shapeJson.properties.effectiveDate',
			header: 'Efftv Date',
			isSearchField: false,
			type: 'date',
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.shape?.shapeJson?.properties?.effectiveDate)}</>;
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.agreementTerm.keyword',
			accessorKey: 'shape.shapeJson.properties.agreementTerm',
			header: 'Primary Term (Mo)',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.expirationDate.keyword',
			accessorKey: 'shape.shapeJson.properties.expirationDate',
			header: 'Exp Date',
			isSearchField: false,
			type: 'date',
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.shape?.shapeJson?.properties?.expirationDate)}</>;
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.extensionTerm.keyword',
			accessorKey: 'shape.shapeJson.properties.extensionTerm',
			header: 'Extension Term (Mo)',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.extensionDate.keyword',
			accessorKey: 'shape.shapeJson.properties.extensionDate',
			header: 'Extension Exp Date',
			isSearchField: false,
			type: 'date',
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.shape?.shapeJson?.properties?.extensionDate)}</>;
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.bounusPayment.keyword',
			accessorKey: 'shape.shapeJson.properties.bounusPayment',
			header: 'Bonus Payment',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.agmtRoyalty.keyword',
			accessorKey: 'shape.shapeJson.properties.agmtRoyalty',
			header: 'Agmt Royalty(%)',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.agreementStatus.keyword',
			accessorKey: 'shape.shapeJson.properties.agreementStatus',
			header: 'Status',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.acquisitionID.keyword',
			accessorKey: 'shape.shapeJson.properties.acquisitionID',
			header: 'Acquisition ID',
			size: 280,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.acquisitionDate',
			accessorKey: 'shape.shapeJson.properties.acquisitionDate',
			header: 'Acquisition Date',
			type: 'date',
			isSearchField: false,
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.shape?.shapeJson?.properties?.acquisitionDate)}</>;
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.prospectID.keyword',
			accessorKey: 'shape.shapeJson.properties.prospectID',
			header: 'Prospect',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.recordedDate.keyword',
			accessorKey: 'shape.shapeJson.properties.recordedDate',
			header: 'Recorded Date',
			type: 'date',
			isSearchField: false,
			Cell: ({ row }) => {
				return <>{formatDate(row?.original?.shape?.shapeJson?.properties?.recordedDate)}</>;
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.recordedBook.keyword',
			accessorKey: 'shape.shapeJson.properties.recordedBook',
			header: 'Book',
			isSearchField: false,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.recordedPage.keyword',
			accessorKey: 'shape.shapeJson.properties.recordedPage',
			header: 'Page',
			isSearchField: false,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.recordedInstrumentNumber.keyword',
			accessorKey: 'shape.shapeJson.properties.recordedInstrumentNumber',
			header: 'Instrument #',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.reportGrossAcres.keyword',
			accessorKey: 'shape.shapeJson.properties.reportGrossAcres',
			header: 'Report Gross',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.grossAcres.keyword',
			accessorKey: 'shape.shapeJson.properties.grossAcres',
			header: 'Gross',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.netAcres.keyword',
			accessorKey: 'shape.shapeJson.properties.netAcres',
			header: 'Net',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.companyNetAcres.keyword',
			accessorKey: 'shape.shapeJson.properties.companyNetAcres',
			header: 'Company Net',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.netRoyalty.keyword',
			accessorKey: 'shape.shapeJson.properties.netRoyalty',
			header: 'NRA',
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
	],
};

export default AgreementMeta;
