import { hookstate } from '@hookstate/core';
import { copy, deepEqual } from 'components/Shared/functions';
import { hookStateController } from 'hookstate';
import { globalStateController } from './globalStateController';

const initialState = {
	polygonFilter: null,
	unit: {
		layerName: 'Units',
		variables: {
			index: 'shapes_flat',
			sort: {
				field: '_ts',
				order: 'desc',
			},
			pagination: {
				first: 10000,
				after: null,
			},
			filters: [
				{
					field: 'layer.keyword',
					value: 'unit',
				},
			],
			search: {
				query: null,
				fields: [
					'name',
					'shapeJson.properties.uNumber',
					'shapeJson.properties.originalProperties.State',
					'shapeJson.properties.originalProperties.County',
					'shapeJson.properties.originalProperties.Survey',
					'shapeJson.properties.originalProperties.PrincipalMeridian',
					'shapeJson.properties.originalProperties.Block',
					'shapeJson.properties.originalProperties.Township',
					'shapeJson.properties.originalProperties.Section',
					'shapeJson.properties.originalProperties.Range',
					'shapeJson.properties.originalProperties.AbstractName',
					'shapeJson.properties.originalProperties.ShortName',
					'shapeJson.properties.shapeArea',
					'shapeJson.properties.uStatus',
					'shapeJson.properties.uPrimaryOperator',
					'shapeJson.properties.uUnitPricing',
					'shapeJson.properties.campaignName',
					'shapeJson.properties.qualifier.name',
					'shapeJson.properties.reviewer.name',
					'tags.tag',
				],
			},
		},
	},
	wells: {
		layerName: 'Wells',
		id: 'wells',
		variables: {
			index: 'platformData:wells',
			pagination: {
				first: 10000,
				after: null,
			},
			filters: [],
		},
	},
	parcel: {
		layerName: 'Parcels',
		variables: {
			index: 'shapes_flat',
			sort: {
				field: '_ts',
				order: 'desc',
			},
			pagination: {
				first: 10000,
				after: null,
			},
			filters: [
				{
					field: 'layer.keyword',
					value: 'parcel',
				},
			],
			search: {
				query: null,
				fields: [
					'name',
					'shapeJson.properties.originalProperties.State',
					'shapeJson.properties.originalProperties.County',
					'shapeJson.properties.originalProperties.Survey',
					'shapeJson.properties.originalProperties.PrincipalMeridian',
					'shapeJson.properties.originalProperties.Block',
					'shapeJson.properties.originalProperties.Township',
					'shapeJson.properties.originalProperties.Section',
					'shapeJson.properties.originalProperties.Range',
					'shapeJson.properties.originalProperties.AbstractName',
					'shapeJson.properties.originalProperties.ShortName',
					'shapeJson.properties.sdGrossAcres',
					'shapeJson.properties.shapeArea',
					'shapeJson.properties.department',
					'tags.tag',
					'name',
					'shapeLabel',
					'state',
				],
			},
		},
	},
	interest: {
		layerName: 'Area of Interest',
		variables: {
			index: 'shapes_flat',
			sort: {
				field: '_ts',
				order: 'desc',
			},
			pagination: {
				first: 10000,
				after: null,
			},
			filters: [
				{
					field: 'layer.keyword',
					value: 'interest',
				},
			],
			search: {
				query: null,
				fields: ['name'],
			},
		},
	},
	agreement: {
		layerName: 'Agreements',
		variables: {
			index: 'shapes_flat',
			sort: {
				field: '_ts',
				order: 'desc',
			},
			pagination: {
				first: 10000,
				after: null,
			},
			filters: [
				{
					field: 'shapeJson.properties.type.keyword',
					value: 'agreement',
				},
			],
			search: {
				query: null,
				fields: ['name'],
			},
		},
	},
	mywell: {
		layerName: 'My Wells',
		geoBoundingField: 'wellData.geoJSON',
		variables: {
			index: 'mywells_flat',
			sort: { field: 'lastUpdateAt', order: 'desc' },
			pagination: {
				first: 100,
				after: null,
			},
			filters: [],
			search: {
				query: null,
				fields: ['wellData.wellName', 'wellData.api', 'wellData.WellName', 'wellData.ApiNumber'],
			},
		},
	},
	landgrid: {
		layerName: 'Land Grid',
		abstractZoom: 12,
		pllsZoom: 14,
	},
	basins: {
		layerName: 'Basins',
	},
};

export const layerFilters = hookstate(copy(initialState));

const layerFiltersControllerHandler = () => ({
	setVariables: (layerType, variables) => {
		const filters = layerFilters[layerType].get({ noproxy: true });

		if (!deepEqual(filters.variables, variables)) layerFilters[layerType]?.set({ ...filters, variables });
	},
	getBeforeLayer: index => {
		const layers = globalStateController.getValue('layers');

		let id;

		while (index > 1) {
			const layer = layers?.[index - 1];
			index--;

			if (!layer.layerSettings.showable) continue;

			id = layer?.layerPaintProps?.[0]?.id;

			if (id) break;

			id = Object.values(initialState).find(filter => filter?.layerName === layer.layerName)?.id;

			if (id) break;
		}

		return id;
	},
	setWellsVariables: (field, value, type) => {
		// eslint-disable-next-line no-use-before-define
		const { variables } = layerFiltersController.getValue('wells');

		const filters = variables.filters.filter(filter => filter.field !== field);

		if (value?.length > 0 || value?.hasOwnProperty?.('min') || value?.hasOwnProperty?.('max'))
			filters.push({
				field,
				value,
				type,
			});

		// eslint-disable-next-line no-use-before-define
		layerFiltersController.setVariables('wells', {
			...variables,
			filters,
		});
	},
});

export const layerFiltersController = {
	...layerFiltersControllerHandler(layerFilters),
	...hookStateController(layerFilters, initialState),
};
