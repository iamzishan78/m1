import { BlockBlobClient } from "@azure/storage-blob";

export * from "./deepEqual";
export * from "./setStateIfDeepEqual";
export * from "./getPolygonString";

export function truncate(str, n) {
    str = str || "";
    return (str.length > n) ? str.substr(0, n - 1) + '...' : str;
};

export function addTrailingZeros(num) {
    return num ? num.toLocaleString("en", { useGrouping: false, minimumFractionDigits: 8, maximumFractionDigits: 20 }) : num;
};

export function uploadFileData(file, fileContent) {
    const url = file.uri;
    const interal_key = file.internalKey;
    const file_name = file.name;
    // const content = JSON.stringify(fileContent.file);
    return new Promise((resolve, reject) => {
        const blockBlobClient = new BlockBlobClient(url);
        blockBlobClient.uploadBrowserData(fileContent.file, {
            maxSingleShotSize: 4 * 1024 * 1024,
            blobHTTPHeaders: {
                blobContentDisposition: `attachment; filename="${file_name}"`
            },
            metadata: {
                Internalkey: interal_key
            }
        })
            .then((response) => {
                return response._response.bodyAsText
              })
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            });
    })
}