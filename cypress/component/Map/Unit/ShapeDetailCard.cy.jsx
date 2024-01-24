import ExpandableCardProvider from 'components/ExpandableCard/ExpandableCardProvider';
import ShapeDetailCard from 'components/ShapeDetailCard';
import { popupController } from 'hookstate/popupStateController';
import ldata from '../../../fixtures/ldata.json';
import { basic_timeouts } from '../../../cypressUtils/data';

const selectedShape = {
  id: '65b0c87166115215f9155bc4',
  type: 'unit',
  layerType: 'unit',
  shapeLabel: 'T004S R066W — Section 36',
  shapeSubtitle: 'Arapahoe, CO - T004S R066W — Section 36',
};

const setMapData = ({ testId, value, autoCompleteAlias = '@autoCompleteListApi' }) => {
  cy.get(`[data-testid="data-cell-${testId}"]`).trigger('mouseover');
  cy.get(`button[data-testid="edit-${testId}"]`).click();

  cy.get(`input#filter-autocomplete-${testId}`).type(value);

  cy.verifyApiResponse(autoCompleteAlias, {
    responseTimeout: basic_timeouts.midTimeout,
  });

  cy.get('.MuiAutocomplete-popper').should('exist');

  cy.get('.MuiAutocomplete-option').first().click();

  cy.get('body').click();

  cy.verifyApiResponse('@updateCustomLayerApi', {
    responseTimeout: basic_timeouts.midTimeout,
  });

  cy.get(`@updateCustomLayerApi`).then(interception => {
    cy.get(`[data-testid="data-cell-${testId}"]`).contains(value);
  });
};

describe('ShapeDetailCard.cy.jsx', () => {
  beforeEach(() => {
    popupController.updateState({ selectedShape });

    cy.viewport(1600, 1200).mount(
      <ExpandableCardProvider
        expanded={true}
        // handleCloseExpandableCard={handleCloseExpandableCard}
        component={<ShapeDetailCard type={selectedShape.type}></ShapeDetailCard>}
        title={selectedShape?.shapeLabel}
        subTitle={selectedShape?.shapeSubtitle || selectedShape?.unitInfo}
        parent="map"
        position="relative"
        cardTop={0}
        cardLeft={0}
        zIndex={99}
        cardWidthExpanded="50vw"
        cardHeightExpanded="calc(100vh - 64px)"
        targetSourceId={selectedShape?.id}
        targetLabel={selectedShape.type}
        // deleteCustomLayer={deleteCustomLayer}
      ></ExpandableCardProvider>
    );

    cy.interceptApi('getCustomLayer', null, null, ldata.url);
    cy.verifyApiResponse('@getCustomLayerApi', {
      responseTimeout: basic_timeouts.midTimeout,
    });

    cy.interceptApi('updateCustomLayer', null, null, ldata.url);
    cy.interceptApi('autoCompleteList', null, null, ldata.url);
    cy.interceptApi('getESSimpleFilter', null, null, ldata.url);
  });

  it('mounts', () => {});

  it('displays editable county field', () => {
    cy.get('[data-testid="data-cell-County"]').trigger('mouseover');
    cy.get('button[data-testid="edit-County"]').click();
  });

  it('shows one option on searching tx in state field', () => {
    cy.get('[data-testid="data-cell-State"]').trigger('mouseover');
    cy.get('button[data-testid="edit-State"]').click();

    cy.get('input#filter-autocomplete-State').type('co');

    cy.verifyApiResponse('@getESSimpleFilterApi', {
      responseTimeout: basic_timeouts.midTimeout,
    });

    // Assert that the Autocomplete options are displayed
    cy.get('.MuiAutocomplete-popper').should('exist');

    // Optionally, you can assert the specific options displayed
    cy.get('.MuiAutocomplete-option').should('have.length', 1);
  });

  it('state can be updated to tx', () => {
    setMapData({
      testId: 'State',
      value: 'TX',
      autoCompleteAlias: '@getESSimpleFilterApi',
    });
  });

  it('state can be updated to co', () => {
    cy.get('[data-testid="data-cell-State"]').contains('TX');

    setMapData({
      testId: 'State',
      value: 'CO',
      autoCompleteAlias: '@getESSimpleFilterApi',
    });
  });

  it('sets State, County, Township, Range, Section to TX, Anderson, 035S, 055W, 47', () => {
    setMapData({
      testId: 'State',
      value: 'TX',
      autoCompleteAlias: '@getESSimpleFilterApi',
    });
    setMapData({ testId: 'County', value: 'Anderson' });
    setMapData({ testId: 'Township', value: '035S' });
    setMapData({ testId: 'Range', value: '055W' });
    setMapData({ testId: 'Section', value: '47' });
  });

  it('sets State, County, Township, Range, Section to CO, Arapahoe, 004S, 066W, 36', () => {
    setMapData({
      testId: 'State',
      value: 'CO',
      autoCompleteAlias: '@getESSimpleFilterApi',
    });
    setMapData({ testId: 'County', value: 'Arapahoe' });
    setMapData({ testId: 'Township', value: '004S' });
    setMapData({ testId: 'Range', value: '066W' });
    setMapData({ testId: 'Section', value: '36' });
  });
});
