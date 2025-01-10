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
			id: 'id',
		},

		{
			...CommonSchema.HIDDEN,
			name: '_id',
			id: '_id',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'state.keyword',
			id: 'state',
			header: 'State',
			isGrouped: true,
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'county.keyword',
			id: 'county',
			header: 'County',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.prospectID.keyword',
			id: 'shape.shapeJson.properties.prospectID',
			header: 'Prospect',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.report.devReportGrossAcres',
			type: 'number',
			id: 'shape.shapeJson.properties.report.devReportGrossAcres',
			header: 'Report Dev Gross',
			...CommonSchema.AGGREGATED_FIELD('Report Dev Gross'),
			...CommonSchema.AGGREGATED_FOOTER('shape.shapeJson.properties.report.devReportGrossAcres', 'AcreageSummaryTable'),
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.report.devReportNet',
			type: 'number',
			id: 'shape.shapeJson.properties.report.devReportNet',
			header: 'Report Dev Net',
			...CommonSchema.AGGREGATED_FIELD('Report Dev Net'),
			...CommonSchema.AGGREGATED_FOOTER('shape.shapeJson.properties.report.devReportNet', 'AcreageSummaryTable'),
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.report.devCompanyNetAcres',
			type: 'number',
			id: 'shape.shapeJson.properties.report.devCompanyNetAcres',
			header: 'Dev Co Net',
			...CommonSchema.AGGREGATED_FIELD('Dev Co Net'),
			...CommonSchema.AGGREGATED_FOOTER('shape.shapeJson.properties.report.devCompanyNetAcres', 'AcreageSummaryTable'),
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.report.undevReportGrossAcres',
			type: 'number',
			id: 'shape.shapeJson.properties.report.undevReportGrossAcres',
			header: 'Report Undev Gross',
			...CommonSchema.AGGREGATED_FIELD('Report Undev Gross'),
			...CommonSchema.AGGREGATED_FOOTER(
				'shape.shapeJson.properties.report.undevReportGrossAcres',
				'AcreageSummaryTable'
			),
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.report.undevReportNet',
			type: 'number',
			id: 'shape.shapeJson.properties.report.undevReportNet',
			header: 'Report Undev Net',
			...CommonSchema.AGGREGATED_FIELD('Report Undev Net'),
			...CommonSchema.AGGREGATED_FOOTER('shape.shapeJson.properties.report.undevReportNet', 'AcreageSummaryTable'),
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.report.undevCompanyNetAcres',
			type: 'number',
			id: 'shape.shapeJson.properties.report.undevCompanyNetAcres',
			header: 'Undev Co Net',
			...CommonSchema.AGGREGATED_FIELD('Undev Co Net'),
			...CommonSchema.AGGREGATED_FOOTER(
				'shape.shapeJson.properties.report.undevCompanyNetAcres',
				'AcreageSummaryTable'
			),
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.report.reportGrossAcres',
			type: 'number',
			id: 'shape.shapeJson.properties.report.reportGrossAcres',
			header: 'Total Report Gross',
			...CommonSchema.AGGREGATED_FIELD('Total Report Gross'),
			...CommonSchema.AGGREGATED_FOOTER('shape.shapeJson.properties.report.reportGrossAcres', 'AcreageSummaryTable'),
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.report.reportNet',
			type: 'number',
			id: 'shape.shapeJson.properties.report.reportNet',
			header: 'Total Report Net',
			...CommonSchema.AGGREGATED_FIELD('Total Report Net'),
			...CommonSchema.AGGREGATED_FOOTER('shape.shapeJson.properties.report.reportNet', 'AcreageSummaryTable'),
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'shape.shapeJson.properties.report.companyNetAcres',
			type: 'number',
			id: 'shape.shapeJson.properties.report.companyNetAcres',
			header: 'Total Co Net',
			...CommonSchema.AGGREGATED_FIELD('Total Co Net'),
			...CommonSchema.AGGREGATED_FOOTER('shape.shapeJson.properties.report.companyNetAcres', 'AcreageSummaryTable'),
		},
	],
};

export default AcreageSummaryMeta;
