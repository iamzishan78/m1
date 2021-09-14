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
    // const content = JSON.stringify(fileContent.file);
    return new Promise((resolve, reject) => {
        fetch(url, {
            headers: {
                "X-Ms-Blob-Content-Disposition": `attachment; filename="${fileContent.fileName}"`,
                "X-Ms-Blob-Type": "BlockBlob",
                "X-Ms-Meta-Internalkey": interal_key,
                "X-Ms-Version": "2015-02-21",
            },
            method: "PUT",
            body: fileContent.file,
        })
            .then((response) => response.text())
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            });
    })
}