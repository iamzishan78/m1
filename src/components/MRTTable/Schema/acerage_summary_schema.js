import { CommonSchema } from './common_schema';

const esIndex = 'shapetracts_flat';

const AcerageSummaryMeta = {
	esIndex,
	isElasticQuery: false,
	pageSize: 25,
	pagination: {
		pageIndex: 0,
		pageSize: 25,
	},
	defaultSort: { field: '_ts', order: 'asc' },
	maxTableHeight: 'calc(100vh - 290px)',
	isInFiniteScroll: true,
	columnVirtualization: false,
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
			...CommonSchema.COMMON_COLUMN,
			name: 'state',
			accessorFn: row => row?.state,
			id: 'state',
			header: 'State',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'county',
			accessorFn: row => row?.county,
			id: 'county',
			header: 'County',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'prospect',
			accessorFn: row => row?.prospect,
			id: 'prospect',
			header: 'Prospect',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.devReportGrossAcres.keyword',
			accessorFn: row => row?.shape?.shapeJson?.properties?.devReportGrossAcres,
			id: 'shape.shapeJson.properties.devReportGrossAcres',
			header: 'Report Dev Gross',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.devReportNet.keyword',
			accessorFn: row => row?.shape?.shapeJson?.properties?.devReportNet,
			id: 'shape.shapeJson.properties.devReportNet',
			header: 'Report Dev Net',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.devCompanyNetAcres.keyword',
			accessorFn: row => row?.shape?.shapeJson?.properties?.devCompanyNetAcres,
			id: 'shape.shapeJson.properties.devCompanyNetAcres',
			header: 'Dev Co Net',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.undevReportGrossAcres.keyword',
			accessorFn: row => row?.shape?.shapeJson?.properties?.undevReportGrossAcres,
			id: 'shape.shapeJson.properties.undevReportGrossAcres',
			header: 'Report Undev Gross',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.undevReportNet.keyword',
			accessorFn: row => row?.shape?.shapeJson?.properties?.undevReportNet,
			id: 'shape.shapeJson.properties.undevReportNet',
			header: 'Report Undev Net',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.undevCompanyNetAcres.keyword',
			accessorFn: row => row?.shape?.shapeJson?.properties?.undevCompanyNetAcres,
			id: 'shape.shapeJson.properties.undevCompanyNetAcres',
			header: 'Undev Co Net',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.reportGrossAcres.keyword',
			accessorFn: row => row?.shape?.shapeJson?.properties?.reportGrossAcres,
			id: 'shape.shapeJson.properties.reportGrossAcres',
			header: 'Total Report Gross',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.reportNet.keyword',
			accessorFn: row => row?.shape?.shapeJson?.properties?.reportNet,
			id: 'shape.shapeJson.properties.reportNet',
			header: 'Total Report Net',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.companyNetAcres.keyword',
			accessorFn: row => row?.shape?.shapeJson?.properties?.companyNetAcres,
			id: 'shape.shapeJson.properties.companyNetAcres',
			header: 'Total Co Net',
		},
	],
};

export default AcerageSummaryMeta;
