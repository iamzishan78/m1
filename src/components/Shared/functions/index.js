import { BlockBlobClient } from '@azure/storage-blob';
import { cloneDeep } from 'lodash';
import moment from 'moment';

export * from './deepEqual';
export * from './setStateIfDeepEqual';
export * from './getPolygonString';

export const generateRandomString = (length = 24) => {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export function truncate(str, n) {
  str = str || '';
  return str.length > n ? str.substr(0, n - 1) + '...' : str;
}

export function copy(obj) {
  return cloneDeep(obj);
}

export function esExtentedSearch(search1, search2) {
  const search = search1 || search2 || '';
  return search ? `*${search}*` : '*';
}

export function getSearchFields(Table, customMetaFields = []) {
  let searchFields = [];
  Table.forEach(row => {
    if (
      (row?.options?.display !== false && row.esKey && !row.name?.toLowerCase()?.includes('date')) ||
      row?.options?.forSearch
    ) {
      if (Array.isArray(row.esKey)) {
        searchFields = [...searchFields, ...row.esKey];
      } else if (row.esKey.includes('.keyword')) searchFields.push(row.esKey);
    }
  });

  customMetaFields.forEach(metaFeild => {
    if (metaFeild.esKey) {
      searchFields.push(metaFeild.esKey);
    }
  });

  searchFields = [...new Set(searchFields)];
  searchFields = searchFields.map(key => key.replace('.keyword', ''));
  return searchFields;
}

export function addTrailingZeros(num) {
  return num
    ? num.toLocaleString('en', { useGrouping: false, minimumFractionDigits: 8, maximumFractionDigits: 20 })
    : num;
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
      .then(response => {
        return response._response.bodyAsText;
      })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function replaceLinkId(link, path) {
  const linkSplitted = link.split('/');
  const pathSplitted = path.split('/');
  for (let i = 0; i < linkSplitted.length; i++) {
    if (linkSplitted[i] !== pathSplitted[i] && linkSplitted[i] !== ':id') {
      return false;
    }
  }
  return true;
}

export function customStartCaseString(str, isDate) {
  if (!str) return '';

  if (isDate) return moment.parseZone(new Date(+str)).format('MM/DD/YY');

  if (str && str.split(' ').length < 2) return str;

  return str
    .split(' ')
    .map(s => s[0] + s.substring(1).replace(/[A-Z]/g, x => `${x}`))
    .join(' ');
}

export function workspaceTenantName() {
  const workspaceName = window.sessionStorage.getItem('tenantName');
  return workspaceName === 'localhost' ? 'm1dev' : workspaceName;
}

export function getDateWithoutTime(dateTime) {
  if (!dateTime || (typeof dateTime !== 'string' && typeof dateTime !== 'number')) {
    dateTime = '';
  }

  if (typeof dateTime === 'number') {
    dateTime = dateTime.toString();
  }


  if (dateTime?.includes && dateTime.includes('/')) {
    const splittedDate = dateTime.split('/');
    const newDate = new Date();
    newDate.setMonth(Number(splittedDate[0]) - 1);
    newDate.setDate(Number(splittedDate[1]));
    newDate.setYear(Number(splittedDate[2]));
    return newDate;
  }
  const splittedDate = dateTime.split('-');
  if (splittedDate.length === 3) {
    const newDate = new Date();
    newDate.setYear(Number(splittedDate[0]));
    newDate.setMonth(Number(splittedDate[1]) - 1);
    newDate.setDate(Number(splittedDate[2]));
    return newDate;
  } else return null;
}

export const getSelectedRowsFromProps = (props = {}) => {
  const { selectedRowsValues = [], rows = [] } = props

  return selectedRowsValues.length > rows.length ? selectedRowsValues : rows
}

export const formatDate = (date, simple = true) => {
  if (!date) return '--'
  return moment.parseZone(new Date(date)).format(simple ? 'MM/DD/YY' : 'MMMM D, YYYY');
}