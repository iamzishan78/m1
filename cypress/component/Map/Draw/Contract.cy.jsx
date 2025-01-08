/* eslint-disable no-undef */
import MapProvider from 'components/Map/MapProvider';

import { addShapePolygon, drawAreaGeometry, redrawnPolygon } from './data';
import { basic_timeouts } from '../../../cypressUtils/data';

let newCustomLayer = {};

describe('Map Component Draw Contract', () => {
	beforeEach(() => {
		cy.interceptAndWait(['getAllLayerSettingsByUser'], () => {
			cy.viewport(1800, 1200).mount(<MapProvider match={{ params: {} }} />, {
				testCase: 'AgreementDraw',
			});
		});

		cy.waitUntilMapRefDefined().then(() => {
			window.mapRef.jumpTo({
				center: {
					lng: -104.55022961850318,
					lat: 34.84921034658842,
				},
				zoom: 12.9,
			});

			cy.wait(basic_timeouts.shorTimeout);
		});
	});

	it('User Layer Settings are updated', () => {
		cy.updateAllUserLayersVisibility({
			layersToShow: ['Contracts', 'Land Grid'],
		});
		cy.deleteCypressCustomLayers({
			shapeTypes: ['contract'],
			geometry: drawAreaGeometry,
		});
	});

	it('Contract is created using polygon draw and correct popup opens', () => {
		cy.get('#mapEditIcon', { timeout: basic_timeouts.longTimeout }).should('be.visible').click();

		cy.drawAndCreateShape({
			drawType: 'polygon',
			shapeType: 'contract',
			points: [
				{ x: 846, y: 712 },
				{ x: 1246, y: 612 },
				{ x: 946, y: 512 },
			],
		}).then(({ customLayer }) => {
			newCustomLayer = customLayer;
		});
	});

	it('Shape redraw works', () => {
		cy.openAndEditShape({
			x: 1000,
			y: 550,
			points: [
				{ x: 850, y: 750 },
				{ x: 1250, y: 750 },
				{ x: 1250, y: 550 },
				{ x: 850, y: 550 },
				{ x: 700, y: 650 },
			],
			type: 'redraw',
			drawType: 'polygon',
			shapeType: 'contract',
			expectedShape: redrawnPolygon,
			openPoint: { x: 1000, y: 550 },
			newCustomLayer,
		}).then(({ customLayer }) => {
			newCustomLayer = customLayer;
		});
	});

	// it('Add to Shape works', () => {
	//   cy.openAndEditShape({
	//     x: 1000,
	//     y: 550,
	//     points: [
	//       { x: 1000, y: 450 },
	//       { x: 1200, y: 450 },
	//     ],
	//     type: 'addshape',
	//     drawType: 'landgrid',
	//     shapeType: 'contract',
	//     expectedShape: addShapePolygon,
	//     openPoint: { x: 1000, y: 550 },
	//     newCustomLayer
	//   }).then(({ customLayer }) => {
	//     newCustomLayer = customLayer;
	//   });
	// });

	it('Contract created by polygon draw opens correct popup on click & delete works', () => {
		cy.openAndDeleteShape({ x: 1000, y: 550, shapeType: 'contract', newCustomLayer });
	});
});
