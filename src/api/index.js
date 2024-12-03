import GlobalApolloClientProvider from '../GlobalApolloClientProvider';
import { Provider as ReduxProvider } from 'react-redux';
import { print } from 'graphql';
import { BlockBlobClient } from '@azure/storage-blob';

import { getURL, getHeaders } from 'utils/helper';
class API {
	failedResponse = error => {
		const data = error.response && error.response.data ? error.response.data : {};
		return Promise.reject(data);
	};

	query = (query, variables, options) => {
		return GlobalApolloClientProvider.client.query({
			query,
			variables,
			...options,
		});
	};

	mutate = (mutation, variables, options) => {
		return GlobalApolloClientProvider.client.mutate({
			mutation,
			variables,
			...options,
		});
	};

	fetchBlob = (owners, id, internalKey, uri) => {
		const blockBlobClient = new BlockBlobClient(uri);
		return blockBlobClient.uploadBrowserData(owners, {
			maxSingleShotSize: 4 * 1024 * 1024,
			blobHTTPHeaders: {
				blobContentDisposition: `attachment; filename="${id}"`,
			},
			metadata: {
				Internalkey: internalKey || '',
			},
		});
	};
}

export default new API();
