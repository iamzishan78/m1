/* eslint-disable no-undef */
import MapProvider from 'components/Map/MapProvider';
import { basic_timeouts } from '../../../cypressUtils/data';
import { isEqual } from 'lodash';

const colors = {
  black: {
    hex: '000000',
    rgba: [0, 0, 0, 255],
  },
  white: {
    hex: 'FFFFFF',
    rgba: [255, 255, 255, 255],
  },
  blue: {
    hex: '2C83AB',
    rgba: [44, 131, 171, 255],
  },
  red: {
    hex: 'ab2c63b7',
    rgba: [171, 44, 99, 183],
  },
};

describe('Map Component Layer Settings', () => {
  beforeEach(() => {
    cy.interceptAndWait(['getAllLayerSettingsByUser'], () => {
      cy.viewport(1800, 1200).mount(<MapProvider match={{ params: {} }} />);
    });
    cy.wait(100).then(() => {
      window.mapRef.jumpTo({
        center: {
          lng: -99.13764727392922,
          lat: 31.819087912619537,
        },
        zoom: 10.5,
      });
      cy.wait(basic_timeouts.shorTimeout);
    });
  });

  it('User Layer Settings are updated', () => {
    cy.updateAllUserLayersVisibility({ layersToShow: ['Land Grid'] });
  });

  it('Layer visibiility works', () => {
    let unitLayer = window.mapRef.__deck.layerManager.layers.find(
      l => l.props.type.layerName === 'GeoJsonLayer' && l.id.startsWith('Units_')
    );

    expect(!!unitLayer?.props?.visible).to.be.equal(false);

    cy.interceptAndWait(['UpdateLayerSettings'], () => {
      cy.get(
        '[data-testid="layer-Units"] [data-testid="layer-Units-toggle"]'
      ).click();
    });

    cy.wait(100).then(() => {
      unitLayer = window.mapRef.__deck.layerManager.layers.find(
        l => l.constructor.layerName === 'GeoJsonLayer' && l.id.startsWith('Units_')
      );

      expect(unitLayer.props.visible).to.be.equal(true);
    });
  });

  it('Layer text visibiility works', () => {
    let unitTextLayer = window.mapRef.__deck.layerManager.layers.find(
      l => l.constructor.layerName === 'TextLayer' && l.id.startsWith('Units_')
    );

    const isTextVisible = !!unitTextLayer?.props?.visible;

    if (isTextVisible) {
      cy.toggleLayerSettings({ shapeName: 'Units', type: 'text', isTrue: true });
    }

    cy.wait(1000);

    cy.toggleLayerSettings({ shapeName: 'Units', type: 'text', isTrue: false });
  });

  it('Layer pickable toggle works', () => {
    let unitLayer = window.mapRef.__deck.layerManager.layers.find(
      l => l.props.type.layerName === 'GeoJsonLayer' && l.id.startsWith('Units_')
    );

    const isLayerPickable = !!unitLayer?.props?.pickable;

    if (isLayerPickable) {
      cy.toggleLayerSettings({ shapeName: 'Units', type: 'pickable', isTrue: true });
    }

    cy.wait(1000);

    cy.toggleLayerSettings({ shapeName: 'Units', type: 'pickable', isTrue: false });
  });

  it('Layer Color Settings Work', () => {
    // Clicking on layer settings for the specified shape
    cy.get('[data-testid="layer-Units"] [data-testid="layer-settings"]').click();

    // Waiting for 1 second
    cy.wait(1000);

    // Finding the unit layer in the map reference
    let unitLayer = window.mapRef.__deck.layerManager.layers.find(
      l => l.props.type.layerName === 'GeoJsonLayer' && l.id.startsWith('Units_')
    );

    // Check if the current fill color is blue
    const isBlue = isEqual(colors.blue.rgba, unitLayer.props.getFillColor);

    // Clear the fill color input box and input a new color based on the previous color
    cy.get('#fill-picker-box input#hex')
      .clear()
      .type(isBlue ? colors.red.hex : colors.blue.hex);

    // Intercepting and waiting for 'UpdateLayerSettings' event
    cy.interceptAndWait(['UpdateLayerSettings'], () => {
      // Clicking on close button
      cy.get('[data-testid="close"]').click();
    });

    // Waiting for 100 milliseconds and then asserting the visibility of the text layer
    cy.wait(100).then(() => {
      // Finding the unit layer in the map reference again after settings update
      let unitLayer = window.mapRef.__deck.layerManager.layers.find(
        l => l.props.type.layerName === 'GeoJsonLayer' && l.id.startsWith('Units_')
      );

      // Assert whether the fill color of the unit layer has been changed as expected
      expect(
        isEqual(isBlue ? colors.red.rgba : colors.blue.rgba, unitLayer.props.getFillColor)
      ).to.be.equal(true);
    });
  });

  it('Layer Stroke Color Settings Work', () => {
    // Clicking on layer settings for the specified shape
    cy.get('[data-testid="layer-Units"] [data-testid="layer-settings"]').click();

    // Waiting for 1 second
    cy.wait(1000);

    // Finding the unit layer in the map reference
    let unitLayer = window.mapRef.__deck.layerManager.layers.find(
      // Locate the layer with the specified properties
      l => l.props.type.layerName === 'GeoJsonLayer' && l.id.startsWith('Units_')
    );

    // Check if the current stroke color is black
    const isBlack = isEqual(colors.black.rgba, unitLayer.props.getLineColor);

    // Clear the stroke color input box and input a new color based on the previous color
    cy.get('#stroke-picker-box input#hex')
      .clear()
      .type(isBlack ? colors.white.hex : colors.black.hex);

    // Intercepting and waiting for 'UpdateLayerSettings' event
    cy.interceptAndWait(['UpdateLayerSettings'], () => {
      // Clicking on close button
      cy.get('[data-testid="close"]').click();
    });

    // Waiting for 100 milliseconds and then asserting the visibility of the text layer
    cy.wait(100).then(() => {
      // Finding the unit layer in the map reference again after settings update
      let unitLayer = window.mapRef.__deck.layerManager.layers.find(
        l => l.props.type.layerName === 'GeoJsonLayer' && l.id.startsWith('Units_')
      );

      // Assert whether the stroke color of the unit layer has been changed as expected
      expect(
        isEqual(
          isBlack ? colors.white.rgba : colors.black.rgba,
          unitLayer.props.getLineColor
        )
      ).to.be.equal(true);
    });
  });
});
