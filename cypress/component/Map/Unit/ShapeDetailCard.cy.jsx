import ExpandableCardProvider from 'components/ExpandableCard/ExpandableCardProvider';
import ShapeDetailCard from 'components/ShapeDetailCard';
import { popupController } from 'hookstate/popupStateController';
import ldata from '../../../fixtures/ldata.json'

const selectedShape = {
  id: '65af6207f9389596f71f5051',
  type: 'unit',
  layerType: 'unit',
  shapeLabel: 'T004S R066W — Section 36',
  shapeSubtitle: 'Arapahoe, CO - T004S R066W — Section 36',
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

    cy.intercept('POST', ldata.url, req => {
      if (req.body && req.body.operationName === 'updateCustomLayer') {
        req.alias = 'updateCustomLayerMutation';
      }
    });
  });

  it('mounts', () => { });

  it('displays editable county field', () => {
    cy.get('[data-testid="data-cell-County"]').trigger('mouseover');
    cy.get('button[data-testid="edit-County"]').click();
  });

  it('shows one option on searching tx in state field', () => {
    cy.get('[data-testid="data-cell-State"]').trigger('mouseover');
    cy.get('button[data-testid="edit-State"]').click();

    cy.get('input#filter-autocomplete-State').type('co');

    // Assert that the Autocomplete options are displayed
    cy.get('.MuiAutocomplete-popper').should('exist');

    // Optionally, you can assert the specific options displayed
    cy.get('.MuiAutocomplete-option').should('have.length', 1);
  });

  it('state can be updated to tx', () => {
    cy.get('[data-testid="data-cell-State"]').trigger('mouseover');
    cy.get('button[data-testid="edit-State"]').click();

    cy.get('input#filter-autocomplete-State').type('tx');

    cy.get('.MuiAutocomplete-popper').should('exist');

    cy.get('.MuiAutocomplete-option').first().click();

    cy.get('body').click();

    cy.wait('@updateCustomLayerMutation', { timeout: 10 * 1000 });

    cy.get('@updateCustomLayerMutation').then(interception => {
      cy.get('[data-testid="data-cell-State"]').contains('TX');
    });
  });

  it('state can be updated to co', () => {
    cy.get('[data-testid="data-cell-State"]').contains('TX');
    cy.get('[data-testid="data-cell-State"]').trigger('mouseover');
    cy.get('button[data-testid="edit-State"]').click();

    cy.get('input#filter-autocomplete-State').type('co');

    cy.get('.MuiAutocomplete-popper').should('exist');

    cy.get('.MuiAutocomplete-option').first().click();

    cy.get('body').click();

    cy.wait('@updateCustomLayerMutation', { timeout: 10 * 1000 });

    cy.get('@updateCustomLayerMutation').then(interception => {
      cy.get('[data-testid="data-cell-State"]').contains('CO');
    });
  });
});
