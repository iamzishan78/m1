/* eslint-disable no-undef */
import * as turf from '@turf/turf';
import MapProvider from 'components/Map/MapProvider';
import { getUdLayerCardTitle } from 'components/UdLayerCard/UdLayerCard';
import { popupController } from 'hookstate/popupStateController';
import { basic_timeouts } from '../../cypressUtils/data';

describe('Map Component', () => {
  beforeEach(() => {
    cy.viewport(1800, 1200).mount(<MapProvider match={{ params: {} }} />);

    cy.wait(basic_timeouts.midTimeout);
  });

  it('Shapefile grid flyto works', () => {
    cy.interceptAndWait(['getESSimpleSearch', 'shapefile_flat'], () => {
      cy.get('[data-testid="dataset-custom"]').eq(0).click();
    });

    cy.get('[data-testid="mrt-fly-to-map"]').eq(0).click();

    cy.wait(basic_timeouts.shorTimeout).then(() => {
      const { selectedShapeFile, selectedUserDefinedLayer } = popupController.getValues([
        'selectedShapeFile',
        'selectedUserDefinedLayer',
      ]);

      expect(!!selectedShapeFile).to.be.equal(true);

      const bounds = window.mapRef.getBounds();
      const bbox = [
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ];
      const bboxPolygon = turf.bboxPolygon(bbox);

      let isGeometryWithinBbox = false;

      if (selectedShapeFile.geometry.type === 'MultiPolygon')
        for (let i = 0; i < selectedShapeFile.geometry.coordinates.length; i++) {
          let polygon = turf.polygon(selectedShapeFile.geometry.coordinates[i]);
          if (turf.booleanWithin(polygon, bboxPolygon)) {
            isGeometryWithinBbox = true;
            break;
          }
        }
      else
        isGeometryWithinBbox = turf.booleanWithin(
          selectedShapeFile.geometry,
          bboxPolygon
        );

      expect(isGeometryWithinBbox).to.be.equal(true);

      cy.get('[data-testid="ud-layer-card-header"] .MuiCardHeader-title').contains(
        getUdLayerCardTitle(selectedUserDefinedLayer)
      );

      cy.get('[data-testid="ud-layer-card-header"] .MuiCardHeader-subheader').contains(
        selectedUserDefinedLayer.layer.groupName
          ? selectedUserDefinedLayer.layer.layerName
          : ''
      );
    });
  });
});
