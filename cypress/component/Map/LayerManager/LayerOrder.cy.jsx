/* eslint-disable no-undef */
import React from 'react';

import MapProvider from 'components/Map/MapProvider';

import { REVERTCYPRESSDELETE } from 'graphQL/useMutationCommonCypressRevert';
import { UPDATEMANYLAYERSETTINGS } from 'graphQL/useMutationUpdateManyLayerSettings';

import { basic_timeouts } from '../../../cypressUtils/data';
import ldata from '../../../fixtures/ldata.json';
import { drawAreaGeometry } from '../Draw/data';

const headers = {
	'Content-Type': 'application/json',
	'ID-TOKEN': ldata.access_token,
};

let layerSettings;
let isUnitOnTop;
let createdShapes = [];
let newUnitLayer = {};
let newTractLayer = {};

// Moves layerToMove above beforeLayer
const getSettiingsToUpdate = (layerToMove, beforeLayer) => {
	const layerIndex = layerSettings.findIndex(layer => layer.identifier === layerToMove);
	const beforeLayerIndex = layerSettings.findIndex(layer => layer.identifier === beforeLayer);

	if (layerIndex > beforeLayerIndex) {
		const settingsToUpdate = [
			{
				...layerSettings[layerIndex],
				position: layerSettings[beforeLayerIndex].position,
			},
		];

		for (let index = beforeLayerIndex; index < layerIndex; index++) {
			const element = layerSettings[index];

			settingsToUpdate.push({
				...element,
				position: element.position + 1,
			});
		}

		return settingsToUpdate;
	}

	const settingsToUpdate = [];

	for (let index = layerIndex + 1; index < beforeLayerIndex; index++) {
		const element = layerSettings[index];

		settingsToUpdate.push({
			...element,
			position: element.position - 1,
		});
	}

	settingsToUpdate.push({
		...layerSettings[layerIndex],
		position: layerSettings[beforeLayerIndex].position - 1,
	});

	return settingsToUpdate;
};

describe('Map Component Layer Order', () => {
	beforeEach(() => {
		cy.interceptAndWait(
			['getAllLayerSettingsByUser'],
			alias => {
				cy.viewport(1800, 1200).mount(<MapProvider match={{ params: {} }} />);

				cy.wait(alias, { timeout: basic_timeouts.longTimeout })
					.then(response => {
						layerSettings = response.response.body.data.allLayerSettingsByUser;

						const unitIndex = layerSettings.findIndex(layer => layer.identifier === 'Units');
						const tractIndex = layerSettings.findIndex(layer => layer.identifier === 'Parcels');

						isUnitOnTop = isUnitOnTop ?? tractIndex > unitIndex;
						cy.wait(basic_timeouts.midTimeout);
					})
					.then(() => {
						cy.window().then(win => {
							cy.wrap(win)
								.its('mapRef')
								.should('exist')
								.then(mapRef => {
									mapRef.jumpTo({
										center: {
											lng: -104.55022961850318,
											lat: 34.84921034658842,
										},
										zoom: 12.9,
									});
								});
						});
						cy.wait(basic_timeouts.shorTimeout);
					});
			},
			{ wait: false }
		);
	});

	it('User Layer Settings are updated', () => {
		cy.updateAllUserLayersVisibility({ layersToShow: ['Units', 'Parcels', 'Land Grid'] });
		cy.deleteCypressCustomLayers({
			shapeTypes: ['unit', 'parcel'],
			geometry: drawAreaGeometry,
		});
	});

	it('Unit is created using rectangle draw and correct popup opens', () => {
		cy.get('#mapEditIcon', { timeout: basic_timeouts.longTimeout }).should('be.visible').click();

		cy.drawAndCreateShape({
			drawType: 'rectangle',
			shapeType: 'unit',
			points: [
				{ x: 846, y: 712 },
				{ x: 1246, y: 612 },
			],
		}).then(({ createdShapeId, customLayer }) => {
			createdShapeId && createdShapes.push(createdShapeId);
			newUnitLayer = customLayer;
		});
	});

	it('Tract is created using rectangle draw and correct popup opens', () => {
		cy.get('#mapEditIcon', { timeout: basic_timeouts.longTimeout }).should('be.visible').click();

		cy.drawAndCreateShape({
			drawType: 'rectangle',
			shapeType: 'parcel',
			points: [
				{ x: 846, y: 712 },
				{ x: 1246, y: 612 },
			],
		}).then(({ createdShapeId, customLayer }) => {
			createdShapeId && createdShapes.push(createdShapeId);
			newTractLayer = customLayer;
		});
	});

	it('On Click Unit/Tract opens as its above', () => {
		cy.log(`On Click ${isUnitOnTop ? 'Unit' : 'Tract'} opens as its above`);
		cy.openAndVerifyShape({
			x: 900,
			y: 650,
			shapeType: isUnitOnTop ? 'unit' : 'parcel',
			newCustomLayer: isUnitOnTop ? newUnitLayer : newTractLayer,
		});
	});

	it('Should move Tract/Unit above Unit/Tract', () => {
		cy.log(`Should move ${isUnitOnTop ? 'Tract' : 'Unit'} above ${isUnitOnTop ? 'Unit' : 'Tract'}`);
		//   cy.get('[data-testid="layers"]').as('layers');
		//   cy.get('@layers')
		//     .trigger('mouseover', 28, 30 + 50 * 4)
		//     .trigger('mousedown', 28, 30 + 50 * 4, { which: 1 })
		//     .trigger('mousemove', 28, 30 + 50 * 3, { which: 1 })
		//     .wait(1000)
		//     .trigger('mouseup', 28, 30 + 50 * 3);

		// Moves Parcels layer above Units layer
		let settingsToUpdate = getSettiingsToUpdate(isUnitOnTop ? 'Parcels' : 'Units', isUnitOnTop ? 'Units' : 'Parcels');

		cy.request({
			method: 'POST',
			url: ldata.url,
			headers: headers,
			body: {
				operationName: 'UpdateManyLayerSettings',
				variables: {
					manySettings: settingsToUpdate.map(s => ({ _id: s._id, position: s.position })),
				},
				query: UPDATEMANYLAYERSETTINGS.loc.source.body,
			},
		}).then(response => {
			expect(response.status).to.eq(200);
			expect(response?.body?.data?.updateManyUserLayerSettings.success).to.eq(true);
		});
	});

	it('On Click Tract/Unit opens as its above and it is deleted', () => {
		cy.log(`On Click ${isUnitOnTop ? 'Tract' : 'Unit'} opens as its above and it is deleted`);
		cy.openAndDeleteShape({
			x: 900,
			y: 650,
			shapeType: isUnitOnTop ? 'parcel' : 'unit',
			newCustomLayer: isUnitOnTop ? newTractLayer : newUnitLayer,
		});
	});

	it('Delete remaining created shapes', () => {
		const data = {
			modelKey: 'CustomLayer',
			keyToBeUpdate: 'IsDeleted',
			shouldDelete: true,
			deletedData: {
				mainRecord: createdShapes,
			},
		};
		const getLayerPayload = {
			operationName: 'revertCypressDelete',
			variables: { data },
			query: REVERTCYPRESSDELETE.loc.source.body,
		};
		// Making a request to revert the deletion
		cy.request({
			method: 'POST',
			url: ldata.url,
			headers: headers,
			body: getLayerPayload,
		}).then(r => {
			// Asserting that the revert operation is successful
			expect(r.status).to.eq(200);
			expect(r.body.data?.revertCypressDelete?.success).to.eq(true);
		});
	});
});
