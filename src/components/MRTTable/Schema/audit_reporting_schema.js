import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import ColumnWithLink from 'components/Common/MRTable/ColumnWithLink';
import { makeStyles } from '@material-ui/core/styles';

const esIndex = 'contacts_flat';
const useStyles = makeStyles(() => ({
	title: {
		marginLeft: '30px',
		verticalAlign: 'middle',
		fontSize: '16px',
		position: 'absolute',
		display: 'flex',
		top: '16px',
		left: '0px',
	},
}));
const AuditReportingMeta = {
	esIndex,
	pageSize: 25,
	defaultSort: { field: 'lastUpdateAt', order: 'desc', unmapped_type: 'date' },
	maxTableHeight: 'calc(100vh - 640px)',
	CustomToolBar: () => {
		const classes = useStyles();
		return <div className={classes.title}>Audit Reporting</div>;
	},
	isDeleteDisabled: true,
	pagination: {
		pageIndex: 0,
		pageSize: 25,
	},
	isInFiniteScroll: true,
	columnVirtualization: true,
	TableSchema: [
		{
			...CommonSchema.MONGO_ID,
			name: '_id',
			accessorKey: '_id',
			header: 'M1neral Contact System ID',
			isHiddenFieldExport: true,
		},

		{
			...CommonSchema.INITAIL_PINNED,
			name: 'name.keyword',
			accessorKey: 'name',
			header: 'Entity Name ',
			size: 450,
			Cell: ({ renderedCellValue, row }) => {
				return (
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
						}}
					>
						<ColumnWithLink
							value={renderedCellValue}
							link={`/contact/details/${row.getValue('_id')}`}
							onClick={e => {
								e.stopPropagation();
							}}
						/>
					</div>
				);
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			accessorKey: 'entityType.keyword',
			header: 'Entity Type',
			Cell: ({ renderedCellValue, row }) => {
				renderedCellValue = 'contacts';
				return (
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
						}}
					>
						{renderedCellValue}
					</div>
				);
			},
		},

		CommonSchema.CREATED_BY,
		CommonSchema.CREATED_DATE,
		CommonSchema.LAST_UPDATED_BY,
		CommonSchema.LAST_UPDATED_DATE,
	],
};

export default AuditReportingMeta;
