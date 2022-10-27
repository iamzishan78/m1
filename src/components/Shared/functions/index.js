import { BlockBlobClient } from "@azure/storage-blob";
import { cloneDeep } from "lodash";

export * from "./deepEqual";
export * from "./setStateIfDeepEqual";
export * from "./getPolygonString";

export const generateRandomString = (length = 24) => {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export function truncate(str, n) {
  str = str || "";
  return str.length > n ? str.substr(0, n - 1) + "..." : str;
}

export function copy(obj) {
  return cloneDeep(obj);
}

export function getSearchFields(Table) {
  let searchFields = [];
  Table.forEach((row) => {
    if ((row?.options?.display !== false && row.esKey && !row.name?.toLowerCase()?.includes("date")) || row?.options?.forSearch) {
      if (Array.isArray(row.esKey)) {
        searchFields = [...searchFields, ...row.esKey];
      } else if (row.esKey.includes(".keyword")) searchFields.push(row.esKey);
    }
  });

  searchFields = searchFields.map((key) => key.replace(".keyword", ""));
  return searchFields;
}

export function addTrailingZeros(num) {
  return num ? num.toLocaleString("en", { useGrouping: false, minimumFractionDigits: 8, maximumFractionDigits: 20 }) : num;
}

export function capitalizeFirstLetter(string) {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : string;
}

export function uploadFileData(file, fileContent) {
  const url = file.uri;
  const interal_key = file.internalKey;
  const file_name = file.name;
  // const content = JSON.stringify(fileContent.file);
  return new Promise((resolve, reject) => {
    const blockBlobClient = new BlockBlobClient(url);
    blockBlobClient
      .uploadBrowserData(fileContent.file, {
        maxSingleShotSize: 4 * 1024 * 1024,
        blobHTTPHeaders: {
          blobContentDisposition: `attachment; filename="${file_name}"`,
        },
        metadata: {
          Internalkey: interal_key,
        },
      })
      .then((response) => {
        return response._response.bodyAsText;
      })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function replaceLinkId(link, path) {
  const linkSplitted = link.split("/");
  const pathSplitted = path.split("/");
  for (let i = 0; i < linkSplitted.length; i++) {
    if (linkSplitted[i] !== pathSplitted[i] && linkSplitted[i] !== ":id") {
      return false;
    }
  }
  return true;
}

export function customStartCaseString(str) {
  if (!str) return str;
  return str
    .split(" ")
    .map((s) => s[0] + s.substring(1).replace(/[A-Z]/g, (x) => ` ${x}`))
    .join(" ");
}
