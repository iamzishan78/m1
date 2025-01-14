import { get, isEqual, isInteger, isObject } from 'lodash';
import moment from 'moment';

import { tenantsCredentials } from 'components/AzureLogin/AADAuthConfig';

import { globalStateController } from 'hookstate/globalStateController';

import { wellsKeys } from 'utils/data';
import { getSession } from 'utils/user';

import { TO_FIXED, WEEK_DAYS } from './consts';

export const apolloClientEndpointDev = 'http://localhost:7071/api/m1graph';
export const isDev = process.env.REACT_APP_NODE_ENV === 'development';
const decimalForamtter = new Intl.NumberFormat('en-US', {
	style: 'decimal',
	useGrouping: true,
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
});
export const copy = data => {
	return data ? JSON.parse(JSON.stringify(data)) : null;
};

const appendZeroIfSingle = number => {
	const appenedNumber = number.toString().length === 1 ? '0' + number : number;
	return appenedNumber;
};

export const dateFilterToDate = date => {
	let endDate = new Date(`${date}T00:00:00.000Z`);
	const nextMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 1);
	const lastDayOfMonth = new Date(nextMonth - 1);
	return `${endDate.getFullYear()}-${appendZeroIfSingle(endDate.getMonth() + 1)}-${appendZeroIfSingle(lastDayOfMonth.getDate())}`;
};

export const getFirstDayOfMonth = dateString => {
	// Parse the input date string
	const date = new Date(dateString);
	if (isNaN(date.getTime())) {
		throw new Error('Invalid date string');
	}
	// Set the date to the first day of the month
	date.setUTCDate(1);
	// Return the date in ISO 8601 format
	return date.toISOString();
};

export const dateIsValid = date => {
	try {
		date = new Date(
			new Intl.DateTimeFormat('en-US', {
				year: 'numeric',
				month: 'long',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
			}).format(date)
		);
		return date instanceof Date && !isNaN(date);
	} catch {
		return false;
	}
};

export const getIdFromPath = path => {
	if (path.slice(-1) === '/') {
		path = path.substring(0, path.length - 1);
	}

	return path.split('/')[path.split('/').length - 1];
};

export const getURL = () => {
	let tenantName = window.sessionStorage.getItem('tenantName');
	if (tenantName) {
		let tenant = tenantsCredentials(tenantName);
		return isDev ? apolloClientEndpointDev : tenant.apolloClientEndpoint;
	}
	return null;
};

export const getHeaders = () => {
	const session = getSession();
	const headers = { 'X-ZUMO-AUTH': session.authToken };
	if (isDev || globalStateController.getValue('bypassLogin')) {
		headers['X-MS-TOKEN-AAD-ID-TOKEN'] = session.accessToken;
	}
	return headers;
};

export const API_TYPE = action => ({
	STARTED: `${action}_STARTED`,
	FULLFILLED: `${action}_FULLFILLED`,
	REJECTED: `${action}_REJECTED`,
});

export const formatTaxOwners = (owners, formData) => {
	const changeDate = new Date();
	owners = owners.map(owner => owner.node);
	const updateOwners = [];
	for (let i = 0; i < owners.length; i++) {
		let lastName = '';
		let firstName = '';
		let middleName = '';
		let newFullName = owners[i].name || owners[i].OwnerName;
		if (owners[i].OwnerType === 'INDIVIDUAL') {
			lastName = newFullName?.split(' ')[0].trim();
			const remainingName = newFullName?.replace(lastName, '').trim();
			firstName = remainingName.split(' ')[0].trim();
			middleName = remainingName.replace(firstName, '').trim();
			newFullName = [firstName, middleName, lastName].filter(el => !!el).join(' ');
		}
		updateOwners.push({
			// contact
			...(owners[i].isContact
				? { _id: owners[i].isContact }
				: {
						isPrimary: owners[i].isPrimary,
						'entityDetail.name': newFullName,
						'entityDetail.firstName': firstName,
						'entityDetail.lastName': lastName,
						'entityDetail.middleName': middleName,
						'entityDetail.address1': owners[i].StreetAddress,
						'entityDetail.city': owners[i].City,
						'entityDetail.state': owners[i].State,
						'entityDetail.zip': owners[i].Zip,
						ownerType: owners[i].OwnerType,
						'entityDetail.globalOwner': owners[i].globalOwnerId,
					}),

			// parcel interests
			...(owners[i].parcel && {
				'parcel._id': owners[i].parcel._id,
				'parcel.isSuggested': owners[i].parcel.isSuggested,
			}),

			// unit interests
			...(owners[i].shape && {
				'shape._id': owners[i].shape._id,
				'shape.shapeType': owners[i].shape.shapeType,
				'shape.working_interest': owners[i].shape.working_interest,
				'shape.royalty_interest': owners[i].shape.royalty_interest,
				'shape.orri': owners[i].shape.orri,
				'shape.nra': owners[i].shape.nra,
				'shape.uUnitPricing': owners[i].shape.uUnitPricing,
				'shape.uMaxUnitPricing': owners[i].shape.uMaxUnitPricing,
				'shape.globalOwnerId': owners[i].shape.globalOwnerId,
				'shape.isSuggested': owners[i].shape.isSuggested,
			}),

			// convert extras
			status: formData.contactStatus,
			taxYear: owners[i].year,
			dataSource: 'M1neral',
			contactOwner: formData.contactOwner,
			// TODO: remove this
			campaignName: formData.campaigns?.map(campaign => campaign.name),
			campaigns: formData.campaigns,
			tags: formData.tags,

			// default
			createBy: formData.userId,
			createAt: changeDate,
			lastUpdateBy: formData.userId,
			lastUpdateAt: changeDate,
		});
	}
	return updateOwners;
};

export const parseDate = dateValue => {
	const SPLIT_LENGTH = 3;

	const splittedDate = dateValue.split('-');
	if (splittedDate.length === SPLIT_LENGTH) {
		const newDate = new Date();
		newDate.setFullYear(Number(splittedDate[0])); // Use setFullYear instead of setYear
		newDate.setMonth(Number(splittedDate[1]) - 1);

		newDate.setDate(Number(splittedDate[2]));

		return newDate;
	} else {
		return '';
	}
};

export const downloadPdfsFile = viewFile => {
	if (viewFile?.viewToken) {
		let a = document.createElement('a');
		a.href = viewFile.viewToken;
		a.download = viewFile.documentName;
		a.click();
	}
};

export const getSearchQuery = (extendSearchQuery, filters) => {
	let query = extendSearchQuery;
	Object.entries(filters).map(filter => {
		for (let i = 0; i < filter[1]?.length; i++) {
			if (query && i === 0) {
				query = query + ' AND ';
			}
			query = `${query} ${i === 0 ? '(' : 'OR'} ${filter[0]}.keyword:"${filter[1][i]}"${i === filter[1].length - 1 ? ')' : ''}`;
		}
		return true;
	});
	return query;
};

export const getTermsFilters = filters => {
	return Object.entries(filters)
		.filter(([, value]) => {
			return Array.isArray(value) && value.length > 0;
		})
		.map(([key, value]) => {
			return {
				type: 'terms',
				field: `${key}.keyword`,
				value,
			};
		});
};

export const getRangeFilters = (filters, format) => {
	const customFilters = [];
	Object.entries(filters).map(filter => {
		if (filter[1].from || filter[1].to) {
			customFilters.push({
				type: 'range',
				field: filter[0],
				value: {
					range: {
						[filter[0]]: {
							gte: filter[1].from ? filter[1].from : null,
							lte: filter[1].to ? filter[1].to : null,
						},
					},
				},
				...(format === 'simple' && {
					value: {
						gte: filter[1].from ? filter[1].from : null,
						lte: filter[1].to ? filter[1].to : null,
					},
				}),
			});
		}
		return true;
	});
	return customFilters;
};

export const getRoundedNra = unitNra => {
	let nra = parseFloat(unitNra || 0);
	return decimalForamtter.format(nra);
};

export const getShapeFilter = polygon => {
	const coordinates = [];
	if (polygon && typeof polygon === 'string' && polygon.includes('POLYGON')) {
		let data = polygon.replace('POLYGON((', '').replace('))', '');
		data = data.split(',');
		for (let i = 0; i < data.length; i++) {
			const coor = data[i].trim().split(' ');
			coordinates.push([parseFloat(coor[0]), parseFloat(coor[1])]);
		}
	}
	return coordinates.length > 0 ? coordinates : undefined;
};

export const getContactsAddress = contact => {
	let address = 'https://www.google.com/maps/search/';
	if (contact.address1) {
		address = `${address}${contact.address1.replace(/ /g, '+')}`;
	}
	if (contact.city) {
		address = `${address},+${contact.city.replace(/ /g, '+')}`;
	}
	if (contact.state) {
		address = `${address},+${contact.state}`;
	}
	if (contact.zip) {
		address = `${address}+${contact.zip}`;
	}
	return {
		...contact,
		fullContactAddress: address,
	};
};

export const getAddressUrl = owner => {
	let address = 'https://www.google.com/maps/search/';
	if (owner.StreetAddress) {
		address = `${address}${owner.StreetAddress.replace(/ /g, '+')}`;
	}
	if (owner.address1) {
		address = `${address}${owner.address1.replace(/ /g, '+')}`;
	}
	if (owner.City) {
		address = `${address},+${owner.City.replace(/ /g, '+')}`;
	}
	if (owner.city) {
		address = `${address},+${owner.city.replace(/ /g, '+')}`;
	}
	if (owner.State) {
		address = `${address},+${owner.State}`;
	}
	if (owner.state) {
		address = `${address},+${owner.state}`;
	}
	if (owner.Zip) {
		address = `${address}+${owner.Zip}`;
	}
	if (owner.zip) {
		address = `${address},+${owner.zip}`;
	}
	return address;
};

export const getZillowAddressUrl = owner => {
	// create and return zillow link from the address
	let address = 'https://www.zillow.com/homes/';
	const { address1, city, state, zip } = owner;

	if (address1) {
		address += `${encodeURIComponent(address1)},`;
	}
	if (city) {
		address += `${encodeURIComponent(city)},`;
	}
	if (state) {
		address += `${encodeURIComponent(state)},`;
	}
	if (zip) {
		address += `${encodeURIComponent(zip)}`;
	}

	// Adding '_rb' to the end of the Zillow link
	address += '_rb/';

	return address;
};

// Function to generate the OpenCorporates search URL for a given company name.
export const getOpenCorporatesUrl = companyName => {
	const baseUrl = 'https://opencorporates.com/companies?q=';
	const encodedCompanyName = encodeURIComponent(companyName);
	return `${baseUrl}${encodedCompanyName}`;
};

export const getMapFilters = (stateNav, searchInput, gridPolygonString, format) => {
	const extendSearchQuery = searchInput;

	const search = getSearchQuery(extendSearchQuery, {
		wellType: stateNav.typeName,
		operator: stateNav.operatorName,
		wellStatus: stateNav.statusName,
		wellBoreProfile: stateNav.profileName,
		state: stateNav.stateName ? [stateNav.stateName] : [],
		county: stateNav.countyName ? [stateNav.countyName] : [],
	});

	const termsFilters =
		format === 'simple'
			? getTermsFilters({
					wellType: stateNav.typeName,
					operator: stateNav.operatorName,
					wellStatus: stateNav.statusName,
					wellBoreProfile: stateNav.profileName,
					state: stateNav.stateName ? [stateNav.stateName] : [],
					county: stateNav.countyName ? [stateNav.countyName] : [],
				})
			: [];

	const rangeFilters = getRangeFilters(
		{
			spudDate: {
				from: stateNav.spudDateFrom ? moment.parseZone(stateNav.spudDateFrom).utc(true).valueOf() : null,
				to: stateNav.spudDateTo ? moment.parseZone(stateNav.spudDateTo).utc(true).valueOf() : null,
			},
			permitApprovedDate: {
				from: stateNav.permitDateFrom ? moment.parseZone(stateNav.permitDateFrom).utc(true).valueOf() : null,
				to: stateNav.permitDateTo ? moment.parseZone(stateNav.permitDateTo).utc(true).valueOf() : null,
			},
			completionDate: {
				from: stateNav.completetionDateFrom
					? moment.parseZone(stateNav.completetionDateFrom).utc(true).valueOf()
					: null,
				to: stateNav.completetionDateTo ? moment.parseZone(stateNav.completetionDateTo).utc(true).valueOf() : null,
			},
			firstProductionDate: {
				from: stateNav.firstProdDateFrom ? moment.parseZone(stateNav.firstProdDateFrom).utc(true).valueOf() : null,
				to: stateNav.firstProdDateTo ? moment.parseZone(stateNav.firstProdDateTo).utc(true).valueOf() : null,
			},
		},
		format
	);

	const polygon = getShapeFilter(gridPolygonString);
	return { search, filters: [...termsFilters, ...rangeFilters], polygon };
};

const dataToCsv = (wells, keys, csv) => {
	for (let i = 0; i < wells.length; i++) {
		csv = csv + '\n';
		for (let j = 0; j < keys.length; j++) {
			const value = wells[i][keys[j]];
			if (typeof value === 'string') {
				csv = `${j !== 0 ? csv + ',' : csv}"${value}"`;
			} else {
				let stringValue = JSON.stringify(value);
				stringValue = stringValue ? stringValue.replace(/"/g, '') : '';
				csv = `${j !== 0 ? csv + ',' : csv}"${stringValue}"`;
			}
		}
	}
	return csv;
};

export const jsonToCSV = wells => {
	const keys = [];
	let csv = '';
	Object.keys(wells[0]).forEach(key => {
		csv = `${csv ? csv + ',' : ''}${key}`;
		keys.push(key);
	});
	return dataToCsv(wells, keys, csv);
};

export const wellsToCSV = wells => {
	let csv = '';
	for (let i = 0; i < wellsKeys.length; i++) {
		csv = `${csv ? csv + ',' : ''}${wellsKeys[i]}`;
	}
	return dataToCsv(wells, wellsKeys, csv);
};

export const sortColumns = (columns, gridView) => {
	if (gridView?.columns) {
		let updatedColumns = [];
		for (let i = 0; i < gridView.columns.length; i++) {
			const col = columns.find(c => c.name === gridView.columns[i].name);
			columns = columns.filter(c => c.name !== gridView.columns[i].name);
			if (col) {
				updatedColumns.push(col);
			}
		}
		updatedColumns = [...updatedColumns, ...columns];
		columns = updatedColumns;
	}

	const lastColumn = columns.filter(col => col.name === ' ');
	columns = columns.filter(col => col.name !== ' ');
	columns = [...columns, ...lastColumn];

	return columns;
};

export const formattingGridView = view => {
	if (view?.columns?.length > 0) {
		for (let i = 0; i < view.columns.length; i++) {
			if (typeof view.columns[i] === 'string') {
				view.columns[i] = { name: view.columns[i], display: true };
			}
		}
	}
	return view;
};

// This function will return the index of column
export const getIndexofColumn = (columns, columnName) => {
	return columns.indexOf(columns.find(c => c.name === columnName));
};

// This function will find value inside passed function
export const findInFunction = (value, func) => {
	const funcToString = func.toString();
	return funcToString.includes(value);
};

export const getAppliedFilters = (filters, columns, filtersData) => {
	const appliedFilters = [];
	filters.forEach((val, index) => {
		if (val.length > 0) {
			if (columns[index].custom?.isDate) {
				const filterData = filtersData[columns[index].name];
				const data = filterData.find(f => f.key === val[0]);
				appliedFilters.push({ field: columns[index].esKey, value: data.key_as_string });
			} else {
				appliedFilters.push({ field: columns[index].esKey, value: val[0] });
			}
		}
	});
	return appliedFilters;
};

export const getFilterList = columns => {
	const filterList = [];
	columns.forEach(column => {
		if (column.options.filterList) {
			filterList.push(column.options.filterList);
		}
	});
	return filterList;
};

export const removeCommasFromString = str => {
	// This function will convert "1,232,232.00" into "1232232"
	return parseFloat(str.replace(/,/g, ''));
};

export const handleCustomDateTypeChange = (
	date,
	onChange,
	CUSTOM_DATES,
	setFromDate,
	setToDate,
	minDate,
	setAllDateToNull = false
) => {
	if (onChange) {
		onChange(date);
	}
	// let minDateValue;
	// if(minDate === undefined || minDate === ''){
	//   minDateValue = moment('2021-11-01').startOf('month').format("yyyy-MM-DD");
	// } else {
	//   minDateValue = `${moment(minDate).startOf('month').format("yyyy-MM-DD")}`;
	// }
	// console.log(minDateValue);
	const currentYear = Math.round(new Date().getFullYear());
	switch (date) {
		case CUSTOM_DATES.THIS_YEAR_TO_LAST_MONTH:
			setFromDate(`${currentYear}-01-01`);
			setToDate(moment().subtract(1, 'months').endOf('month').format('yyyy-MM-DD'));
			break;
		case CUSTOM_DATES.THIS_YEAR_TO_DATE:
			setFromDate(`${currentYear}-01-01`);
			setToDate(`${moment().format('yyyy-MM-DD')}`);
			break;
		case CUSTOM_DATES.LAST_YEAR_TO_DATE:
			setFromDate(`${currentYear - 1}-01-01`);
			setToDate(`${moment().format('yyyy-MM-DD')}`);
			break;
		case CUSTOM_DATES.LAST_MONTH:
			setFromDate(`${moment().subtract(1, 'months').startOf('month').format('yyyy-MM-DD')}`);
			setToDate(`${moment().subtract(1, 'months').endOf('month').format('yyyy-MM-DD')}`);
			break;
		case CUSTOM_DATES.CUSTOM:
		case CUSTOM_DATES.THIS_MONTH:
			setFromDate(`${moment().startOf('month').format('yyyy-MM-DD')}`);
			setToDate(`${moment().endOf('month').format('yyyy-MM-DD')}`);
			break;
		case CUSTOM_DATES.LAST_QUARTER:
			setFromDate(moment().subtract(1, 'quarter').startOf('quarter').format('yyyy-MM-DD'));
			setToDate(moment().subtract(1, 'quarter').endOf('quarter').format('yyyy-MM'));
			break;
		case CUSTOM_DATES.THIS_QUARTER:
			setFromDate(`${moment().startOf('quarter').format('yyyy-MM-DD')}`);
			setToDate(`${moment().endOf('quarter').format('yyyy-MM-DD')}`);
			break;
		case CUSTOM_DATES.LAST_YEAR:
			setFromDate(`${currentYear - 1}-01-01`);
			setToDate(`${currentYear - 1}-12-31`);
			break;
		case CUSTOM_DATES.ALL_DATES:
			if (setAllDateToNull) {
				setFromDate(null);
				setToDate(null);
				break;
			}

			setFromDate(minDate ? `${moment(minDate).startOf('month').format('yyyy-MM-DD')}` : null);
			setToDate(`${moment().endOf('month').format('yyyy-MM-DD')}`);
			break;
		case CUSTOM_DATES.THIS_WEEK:
			setFromDate(`${moment().startOf('week').format('yyyy-MM-DD')}`);
			setToDate(`${moment().format('yyyy-MM-DD')}`);
			break;
		case CUSTOM_DATES.LAST_WEEK:
			setFromDate(`${moment().startOf('week').subtract(WEEK_DAYS, 'days').format('yyyy-MM-DD')}`);
			setToDate(`${moment().startOf('week').subtract(1, 'days').format('yyyy-MM-DD')}`);
			break;
		default:
			setFromDate(`${moment().startOf('month').format('yyyy-MM-DD')}`);
			setToDate(`${moment().endOf('month').format('yyyy-MM-DD')}`);
	}
};

export function generateColor() {
	// Define an array of available colors
	const colors = [
		'#ff7f50',
		'#6495ed',
		'#ff69b4',
		'#ba55d3',
		'#cd5c5c',
		'#ffa07a',
		'#f08080',
		'#90ee90',
		'#87cefa',
		'#b0c4de',
		'#ffa500',
		'#40e0d0',
		'#1e90ff',
		'#ff6347',
		'#7b68ee',
		'#00fa9a',
		'#ffd700',
		'#6b8e23',
		'#ff00ff',
		'#3cb371',
	];

	// Pick a random color from the array
	const randomColor = colors[Math.floor(Math.random() * colors.length)];

	// Remove the chosen color from the array
	colors.splice(colors.indexOf(randomColor), 1);

	// Add the chosen color to the end of the array
	colors.push(randomColor);

	// Return the chosen color
	return randomColor || '#B6D0E2'; // Default "powder blue" color
}

// Helper function to convert a hex color to an RGB array
function hexToRgb(hex) {
	const RED_SS_START = 1;
	const GREEN_SS_START = 3;
	const BLUE_SS_START = 5;
	const SS_LENGTH = 2;

	const r = parseInt(hex.substr(RED_SS_START, SS_LENGTH), 16);
	const g = parseInt(hex.substr(GREEN_SS_START, SS_LENGTH), 16);
	const b = parseInt(hex.substr(BLUE_SS_START, SS_LENGTH), 16);
	return [r, g, b];
}

export function getOppositeHexColor(inputColor) {
	const RED_LUMINANCE = 0.2126;
	const RED_INDEX = 0;
	const GREEN_LUMINANCE = 0.2126;
	const GREEN_INDEX = 1;
	const BLUE_LUMINANCE = 0.2126;
	const BLUE_INDEX = 2;

	const HALF = 0.5;

	// Convert the background color to an RGB array
	const rgbArray = hexToRgb(inputColor);

	// Calculate the relative luminance of the color using the formula
	// from the WCAG 2.0 spec: https://www.w3.org/TR/WCAG20-TECHS/G18.html#G18-tests
	const relativeLuminance =
		RED_LUMINANCE * rgbArray[RED_INDEX] +
		GREEN_LUMINANCE * rgbArray[GREEN_INDEX] +
		BLUE_LUMINANCE * rgbArray[BLUE_INDEX];

	// Return "black" if the relative luminance is less than 0.5,
	// "white" otherwise
	return relativeLuminance < HALF ? 'black' : 'white';
}

// Function to check if a string is a valid URL
export const validateUrl = text => {
	const regex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i;
	return regex.test(text);
};

export const getDateFilters = filters => {
	const customFilters = [];
	Object.entries(filters).map(filter => {
		if (filter[1].from || filter[1].to) {
			customFilters.push({
				type: 'advanced',
				field: filter[0],
				searchType: 'betweenInclusive',
				columnType: 'date',
				value: [filter[1].from ? filter[1].from : null, filter[1].to ? filter[1].to : null],
			});
		}
		return true;
	});
	return customFilters;
};

export const checkFormRequireField = (data, formSchema) => {
	let error = false;

	formSchema.forEach(field => {
		if (field.required && field?.name && !data[field.name]) {
			error = true;
		}
		if (field.renderField === 'startEndDate' && field.required && (!data['startDate'] || !data['endDate'])) {
			error = true;
		}
	});

	return error;
};

export const getFilters = appliedFilters => {
	if (Array.isArray(appliedFilters)) {
		return appliedFilters;
	}

	let filters = [];
	if (appliedFilters) {
		let range = [];
		range = getRangeFilters(
			{
				createdAt: {
					from: appliedFilters.fromDate ? new Date(appliedFilters.fromDate).toISOString() : null,
					to: appliedFilters.toDate ? new Date(appliedFilters.toDate).toISOString() : null,
				},
			},
			'simple'
		);
		if (range.length > 0) {
			filters = [...filters, ...range];
		}
		if (appliedFilters.status) {
			filters.push({
				field: 'status.keyword',
				value: appliedFilters.status,
			});
		}
		if (appliedFilters.owner) {
			filters.push({
				field: 'owner.name.keyword',
				value: appliedFilters.owner,
			});
		}
	}
	return filters;
};

export const getActivityAnalyticsFilters = appliedFilters => {
	let filters = [];
	if (appliedFilters) {
		let range = [];

		range = getDateFilters(
			{
				lastUpdateAt: {
					from: appliedFilters.fromDate ? new Date(appliedFilters.fromDate).toISOString() : null,
					to: appliedFilters.toDate ? new Date(appliedFilters.toDate).toISOString() : null,
				},
			},
			'simple'
		);
		if (range.length > 0) {
			filters = [...filters, ...range];
		}
		range = getDateFilters(
			{
				lastUpdateAt: {
					from: appliedFilters.fromDate ? new Date(appliedFilters.fromDate).toISOString() : null,
					to: appliedFilters.toDate ? new Date(appliedFilters.toDate).toISOString() : null,
				},
			},
			'simple'
		);

		if (range.length > 0) {
			filters = [...filters, ...range];
		}
		if (appliedFilters.campaignName) {
			filters.push({
				field: 'contact.campaignName.keyword',
				value: appliedFilters.campaignName,
			});
		}
		if (appliedFilters.qualifier) {
			filters.push({
				field: appliedFilters.filter === 'audit' ? 'lastUpdateBy.name.keyword' : 'ownerName.keyword',
				value: appliedFilters.qualifier,
			});
		}
		if (!filters.length && appliedFilters.length) {
			filters = appliedFilters;
		}
	}
	return filters;
};

export const compareObjects = (child, parent) => {
	for (const key in child) {
		if (child.hasOwnProperty(key)) {
			const childValue = child[key];
			const parentValue = get(parent, key);

			// If the value is an object, recursively compare
			if (isObject(childValue) && isObject(parentValue)) {
				if (compareObjects(childValue, parentValue)) {
					return true; // Found a difference
				}
			} else if (!isEqual(childValue, parentValue)) {
				// If values are not equal
				return true; // Found a difference
			}
		}
	}
	return false; // No differences found
};

export const isEven = num => isInteger(num) && num % 2 === 0;

export const convertAnalyticsDataToCSV = (data = [], months = []) => {
	const datas = data.flatMap(item => {
		const result = [];
		const newData = {};
		newData.Name = item.name;
		newData.Total = item.total?.toFixed(TO_FIXED) ?? '';
		months.forEach(key => {
			if (item.breakDown) {
				newData[key] = item.data?.[key]?.total?.toFixed(TO_FIXED) ?? '';
			} else {
				newData[key] = item.data?.[key]?.toFixed(TO_FIXED) ?? '';
			}
		});

		result.push(newData);

		if (item.breakDown) {
			Object.keys(item.breakDown).forEach(breakdownKey => {
				const newData = {};
				newData.Name = `_${breakdownKey}`;
				newData.Total = item.breakDown?.[breakdownKey]?.toFixed(TO_FIXED) ?? '';
				months.forEach(key => {
					newData[key] = item.data?.[key]?.breakDown[breakdownKey]?.toFixed(TO_FIXED) ?? '';
				});

				result.push(newData);
			});
		}

		return result;
	});
	return datas;
};

export const convertToTitleCase = str => {
	if (!str || str === '' || typeof str !== 'string') {
		return str;
	}

	// Replace underscores and hyphens with spaces
	str = str.replace(/[_-]/g, ' ');

	// Split the string by spaces
	let words = str.split(' ');

	// Capitalize the first letter of each word
	words = words.map(word => {
		return word.charAt(0).toUpperCase() + word.slice(1);
	});

	// Join the words with spaces
	str = words.join(' ');

	// Extract and append the number at the end of the string, if present
	let regex = /\d+$/;
	let match = str.match(regex);
	if (match) {
		let number = match[0];
		str = str.replace(regex, '') + ' ' + number;
	}

	return str;
};

export const fuzzySearch = (items, query, queryKey = 'name') => {
	if (!query || query === '') {
		return items;
	}

	const search = query.split(' ');
	const ret = items.reduce((found, i) => {
		let matches = 0;
		search.forEach(s => {
			if (i[queryKey].toLowerCase().indexOf(s.toLowerCase()) > -1) {
				matches++;
			}
		});
		if (matches === search.length) {
			found.push(i);
		}
		return found;
	}, []);
	return ret;
};

export const formatLayerForMap = layer => {
	let jsonLayer = layer.customLayer.shapeJson;
	if (layer.customLayer.shapeJson) {
		jsonLayer = copy(layer.customLayer.shapeJson);
	}
	if (!jsonLayer?.properties?.type && layer?.customLayer?.layer !== 'parcel') {
		jsonLayer.properties.type = layer.customLayer.layer;
	}
	if (!jsonLayer?.properties?.sdType && layer?.customLayer?.layer === 'parcel') {
		jsonLayer.properties.sdType = layer.customLayer.layer;
	}

	jsonLayer.layer = { id: layer.customLayer.layer };
	jsonLayer.id = layer.customLayer._id;
	return {
		jsonLayer,
		feature: {
			...jsonLayer.properties,
			feature: jsonLayer,
			id: layer.customLayer._id,
		},
	};
};
