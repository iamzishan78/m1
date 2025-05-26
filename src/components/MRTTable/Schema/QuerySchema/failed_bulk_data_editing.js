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
	isDeleteDisabled: true,
	enableFacetedValues: true,
	isInFiniteScroll: false,
	columnVirtualization: false,
	TableSchema: [
		{
			...CommonSchema.SELECT_STRING_COLUMN,
			size: 350,
			header: 'Time Stamp',
			id: 'timestamp',
			name: 'timestamp',
		},
		{
			...CommonSchema.SELECT_STRING_COLUMN,
			size: 800,
			header: 'Description',
			id: 'description',
			name: 'description',
		},
	],
};

export default FailedBulkDataEditingMeta;
