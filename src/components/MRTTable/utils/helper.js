import { Tooltip, Typography } from '@material-ui/core';

export const formatGridViewToMRT = selectedGridView => {
	const tableProperties = {};
	if (selectedGridView?.columns) {
		tableProperties.columnVisibility = selectedGridView?.columns.reduce((acc, obj) => {
			acc[obj.name] = obj.display;
			return acc;
		}, {});
	}
	if (selectedGridView?.filters?.length) {
		tableProperties.filters = selectedGridView.filters;
	}
	if (selectedGridView?.sorting?.length) {
		tableProperties.sorting = selectedGridView.sorting;
	}
	if (selectedGridView?.columnPinning) {
		tableProperties.columnPinning = selectedGridView.columnPinning;
	}
	if (selectedGridView?.columnOrdering) {
		tableProperties.columnOrdering = selectedGridView.columnOrdering;
	}

	return tableProperties;
};

// Helper for extracting values
export const extractValueRecursively = obj => {
	if (obj === null || obj === undefined) {
		return undefined;
	}
	if (obj === 'NaN') {
		return null;
	}

	if (typeof obj === 'object' && !Array.isArray(obj)) {
		return Object.keys(obj).reduce((acc, key) => {
			const value = extractValueRecursively(obj[key]?.value !== undefined ? obj[key]?.value : obj[key]);
			acc[key] = value !== undefined ? value : obj[key];
			return acc;
		}, {});
	}

	return obj;
};

// Helper for document type extraction
export const getDocumentType = name => {
	return name?.split('.')[name?.split('.')?.length - 1].toUpperCase() || '';
};

// Helper for document size extraction
export const getDocumentSizeInKBs = size => {
	return Math.round((size || 0) / 1024) + ' KB';
};

export const getTruncateText = value => {
	return (
		<Tooltip title={value} arrow>
			<Typography
				style={{
					whiteSpace: 'nowrap',
					overflow: 'hidden',
					textOverflow: 'ellipsis',
				}}
			>
				{value}
			</Typography>
		</Tooltip>
	);
};

// Helper for extracting values
export const getArrayValue = (array, valueKey, id, idKey) => {
	if (id) {
		const val = array.find(e => e?.[idKey] === id);
		if (val) {
			return val[valueKey];
		}
	}
};

// Helper for removing spaces
export const removeSpaces = key => key?.replace(/\s+/g, '_')?.toLowerCase();

export const replaceUnderscoreAndCapitalize = str => {
	return str
		?.toLowerCase()
		?.replace(/_/g, ' ')
		?.split(' ')
		?.map(word => word?.charAt(0)?.toUpperCase() + word?.slice(1)) // Capitalize the first letter of each word
		?.join(' ');
};
