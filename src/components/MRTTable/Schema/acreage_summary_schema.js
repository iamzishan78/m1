import { Summarize } from '@mui/icons-material';

import { CommonSchema } from './common_schema';

const esIndex = 'shapetracts_flat';

const AcreageSummaryMeta = {
	esIndex,
	pageSize: 25,
	pagination: {
		pageIndex: 0,
		pageSize: 25,
	},
	defaultSort: { field: 'state', order: 'asc' },
	gridViewSettings: {
		label: 'Acreage Summary',
		module: 'Acreage Summary',
		Icon: Summarize,
		defaultView: {
			name: 'All Acreage Summary',
			type: 'Default',
		},
		handleDefaultView: (view, user) => {
			switch (view?.name) {
				case 'My Acreage Summary':
					view.filters[0].value = user._id;
					break;

				default:
					break;
			}

			return view;
		},
		cssOverride: {
			top: '263px',
			left: '19px',
		},
	},
	maxTableHeight: 'calc(100vh - 350px)',
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
			...CommonSchema.COMMON_COLUMN,
			name: 'state.keyword',
			accessorFn: row => row?.state || '',
			id: 'state',
			header: 'State',
			isGrouped: true,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'county.keyword',
			accessorFn: row => row?.county || '',
			id: 'county',
			header: 'County',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.prospectID.keyword',
			accessorFn: row => row?.shape?.shapeJson?.properties?.prospectID || '',
			id: 'shape.shapeJson.properties.prospectID',
			header: 'Prospect',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.report.devReportGrossAcres',
			type: 'number',
			accessorFn: row => row?.shape?.shapeJson?.properties?.report?.devReportGrossAcres,
			id: 'shape.shapeJson.properties.report.devReportGrossAcres',
			header: 'Report Dev Gross',
			...CommonSchema.AGGREGATED_FIELD('Report Dev Gross'),
			...CommonSchema.AGGREGATED_FOOTER('shape.shapeJson.properties.report.devReportGrossAcres', 'AcreageSummaryTable'),
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.report.devReportNet',
			type: 'number',
			accessorFn: row => row?.shape?.shapeJson?.properties?.report?.devReportNet,
			id: 'shape.shapeJson.properties.report.devReportNet',
			header: 'Report Dev Net',
			...CommonSchema.AGGREGATED_FIELD('Report Dev Net'),
			...CommonSchema.AGGREGATED_FOOTER('shape.shapeJson.properties.report.devReportNet', 'AcreageSummaryTable'),
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.report.devCompanyNetAcres',
			type: 'number',
			accessorFn: row => row?.shape?.shapeJson?.properties?.report?.devCompanyNetAcres,
			id: 'shape.shapeJson.properties.report.devCompanyNetAcres',
			header: 'Dev Co Net',
			...CommonSchema.AGGREGATED_FIELD('Dev Co Net'),
			...CommonSchema.AGGREGATED_FOOTER('shape.shapeJson.properties.report.devCompanyNetAcres', 'AcreageSummaryTable'),
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.report.undevReportGrossAcres',
			type: 'number',
			accessorFn: row => row?.shape?.shapeJson?.properties?.report?.undevReportGrossAcres,
			id: 'shape.shapeJson.properties.report.undevReportGrossAcres',
			header: 'Report Undev Gross',
			...CommonSchema.AGGREGATED_FIELD('Report Undev Gross'),
			...CommonSchema.AGGREGATED_FOOTER(
				'shape.shapeJson.properties.report.undevReportGrossAcres',
				'AcreageSummaryTable'
			),
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.report.undevReportNet',
			type: 'number',
			accessorFn: row => row?.shape?.shapeJson?.properties?.report?.undevReportNet,
			id: 'shape.shapeJson.properties.report.undevReportNet',
			header: 'Report Undev Net',
			...CommonSchema.AGGREGATED_FIELD('Report Undev Net'),
			...CommonSchema.AGGREGATED_FOOTER('shape.shapeJson.properties.report.undevReportNet', 'AcreageSummaryTable'),
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.report.undevCompanyNetAcres',
			type: 'number',
			accessorFn: row => row?.shape?.shapeJson?.properties?.report?.undevCompanyNetAcres,
			id: 'shape.shapeJson.properties.report.undevCompanyNetAcres',
			header: 'Undev Co Net',
			...CommonSchema.AGGREGATED_FIELD('Undev Co Net'),
			...CommonSchema.AGGREGATED_FOOTER(
				'shape.shapeJson.properties.report.undevCompanyNetAcres',
				'AcreageSummaryTable'
			),
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.report.reportGrossAcres',
			type: 'number',
			accessorFn: row => row?.shape?.shapeJson?.properties?.report?.reportGrossAcres,
			id: 'shape.shapeJson.properties.report.reportGrossAcres',
			header: 'Total Report Gross',
			...CommonSchema.AGGREGATED_FIELD('Total Report Gross'),
			...CommonSchema.AGGREGATED_FOOTER('shape.shapeJson.properties.report.reportGrossAcres', 'AcreageSummaryTable'),
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.report.reportNet',
			type: 'number',
			accessorFn: row => row?.shape?.shapeJson?.properties?.report?.reportNet,
			id: 'shape.shapeJson.properties.report.reportNet',
			header: 'Total Report Net',
			...CommonSchema.AGGREGATED_FIELD('Total Report Net'),
			...CommonSchema.AGGREGATED_FOOTER('shape.shapeJson.properties.report.reportNet', 'AcreageSummaryTable'),
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.report.companyNetAcres',
			type: 'number',
			accessorFn: row => row?.shape?.shapeJson?.properties?.report?.companyNetAcres,
			id: 'shape.shapeJson.properties.report.companyNetAcres',
			header: 'Total Co Net',
			...CommonSchema.AGGREGATED_FIELD('Total Co Net'),
			...CommonSchema.AGGREGATED_FOOTER('shape.shapeJson.properties.report.companyNetAcres', 'AcreageSummaryTable'),
		},
	],
};

export default AcreageSummaryMeta;
