import { CommonSchema } from 'components/MRTTable/Schema/common_schema';

import { JOB_RESPONSE } from 'graphQL/useQueryJobResponse';

const FailedBulkDataEditingMeta = {
	query: JOB_RESPONSE,
	maxTableHeight: 'calc(100vh - 370px)',
	getVariables: tableMeta => {
		const { jobId } = tableMeta?.customProps || {};

		if (!jobId) {
			return null;
		}

		return {
			jobId,
		};
	},
	getDataFromRes: res => {
		const logs = res?.data?.getJobResponse?.resultsPayload?.logs || {};
		const data = Object.entries(logs).map(([timestamp, description]) => ({
			timestamp,
			description,
		}));

		return data || [];
	},
	getIdsFromRows: () => [],
	isClientSide: true,
	isSelectAllAllowed: true,
	isDeleteDisabled: true,
	isExportDisabled: true,
	enableFacetedValues: true,
	isInFiniteScroll: false,
	columnVirtualization: false,
	TableSchema: [
		{
			...CommonSchema.STRING_COLUMN,
			size: 350,
			enableColumnFilter: false,
			header: 'Time Stamp',
			accessorKey: 'timestamp',
			name: 'timestamp',
			accessorFn: row => row?.timestamp,
		},
		{
			...CommonSchema.STRING_COLUMN,
			size: 800,
			enableColumnFilter: false,
			header: 'Description',
			accessorKey: 'description',
			name: 'description',
			accessorFn: row => row?.description,
		},
	],
};

export default FailedBulkDataEditingMeta;
