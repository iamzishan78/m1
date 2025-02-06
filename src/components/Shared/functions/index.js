import { BlockBlobClient } from '@azure/storage-blob';
import { cloneDeep, initial, join, keyBy, last, merge, split, values } from 'lodash';
import moment from 'moment';

import { UserSession } from 'utils/user';

export * from './deepEqual';
export * from './setStateIfDeepEqual';
export * from './getPolygonString';

export const getFileExtension = filename => {
	const parts = split(filename, '.');
	return parts.length > 1 ? last(parts) : '';
};
export const getFileName = filename => {
	const parts = split(filename, '.');
	return join(initial(parts), '.');
};

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
			} else if (row.esKey.includes('.keyword')) {
				searchFields.push(row.esKey);
			}
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
	const internal_key = file.internalKey;
	const file_name = file.name;

	return new Promise((resolve, reject) => {
		const blockBlobClient = new BlockBlobClient(url);
		blockBlobClient
			.uploadData(fileContent.file, {
				maxSingleShotSize: 4 * 1024 * 1024,
				blobHTTPHeaders: {
					blobContentDisposition: `attachment; filename="${file_name}"`,
					blobContentType: fileContent.fileType,
				},
				metadata: {
					Internalkey: internal_key,
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
	if (!str) {
		return '';
	}

	if (isDate) {
		return moment.parseZone(new Date(+str)).format('MM/DD/YY');
	}

	if (str && str.split(' ').length < 2) {
		return str;
	}

	return str
		.split(' ')
		.map(s => (s ? s[0] + s.substring(1).replace(/[A-Z]/g, x => `${x}`) : s))
		.join(' ');
}

export function workspaceTenantName() {
	const workspaceName = UserSession.getStorageItem('tenantName');
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
	} else {
		return null;
	}
}

export const getSelectedRowsFromProps = (props = {}) => {
	const { selectedRowsValues = [], rows = [] } = props;

	return selectedRowsValues.length > rows.length ? selectedRowsValues : rows;
};

export const formatDate = (date, simple = true) => {
	if (!date) {
		return '--';
	}
	return moment(date).format(simple ? 'MM/DD/YYYY' : 'MMMM D, YYYY');
};

export const processInBatches = async (promises, batchSize) => {
	for (let i = 0; i < promises.length; i += batchSize) {
		const batch = promises.slice(i, i + batchSize);
		// eslint-disable-next-line no-await-in-loop
		await Promise.all(batch);
	}
};

export const formatDateTime = date => {
	if (!date) {
		return '--';
	}
	return moment.parseZone(new Date(date)).format('M/D/YYYY, hh:mm A');
};

export const isValidDate = dateString => {
	// Attempt to create a new Date object
	const date = new Date(dateString);

	// Check if the date is a valid date and the input format is recognized
	return !isNaN(date.getTime());
};

export const getStartAndEndOfDay = dateString => {
	// Create a Date object from the input string
	const inputDate = new Date(dateString);

	// Set the time to the start of the day (00:00:00)
	const startOfDay = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate(), 0, 0, 0, 0);

	// Set the time to the end of the day (23:59:59)
	const endOfDay = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate(), 23, 59, 59, 999);

	return {
		startOfDay,
		endOfDay,
	};
};

export const isDateFormat = inputString => {
	// Regular expression for MM/DD/YYYY format
	const mmddyyy = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d$/;
	const mmddyy = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d\d$/;

	// Check if the inputString matches the date format
	return mmddyyy.test(inputString) || mmddyy.test(inputString);
};

export const mergeArrays = (arr1, arr2, uniqueField) => {
	const keyedArr1 = keyBy(arr1, uniqueField);
	const keyedArr2 = keyBy(arr2, uniqueField);

	// Merge the keyed objects
	const mergedKeyed = merge({}, keyedArr1, keyedArr2);

	// Convert the merged object back to an array
	return values(mergedKeyed);
};

export const normalizeUrl = url => {
	if (typeof url !== 'string' || !url.trim()) {
		return ''; // Handle invalid input
	}

	const lowerUrl = url.toLowerCase();
	if (!lowerUrl.startsWith('http://') && !lowerUrl.startsWith('https://')) {
		url = `https://${url}`;
	}

	if (!url.endsWith('/')) {
		url += '/'; // Ensure URL ends with a slash
	}

	return url;
};
