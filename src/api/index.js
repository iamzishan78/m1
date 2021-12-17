import axios from "axios";
import { print } from "graphql";
import { BlockBlobClient } from "@azure/storage-blob";

import { getURL, getHeaders } from 'utils/helper';
class API {
  failedResponse = (error) => {
    const data =
      error.response && error.response.data ? error.response.data : {};
    return Promise.reject(data);
  };

  fetch = (query, variables) => {
    return axios
      .post(getURL(), {
        query: print(query),
        variables: variables,
      },{
        headers: getHeaders()
      })
      .catch((error) => {
        return this.failedResponse(error);
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
        Internalkey: internalKey || "",
      },
    });
  };
}

export default new API();
