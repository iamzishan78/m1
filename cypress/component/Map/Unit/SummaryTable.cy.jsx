/* eslint-disable no-undef */
import SummaryTable from 'components/ShapeDetailCard/Common/SummaryTable';
import unitDefaultData from 'components/ShapeDetailCard/Common/SummaryTable/unitDefaultData';
import { UnitSummaryData } from './UnitSummary.cy';

const metaDataRes = {
  getMetaData: {
    success: true,
    message: 'Fetched',
    metaData: [],
  },
};

describe('SummaryTable.cy.jsx', () => {
  beforeEach(() => {
    cy.viewport(800, 1200).mount(
      <SummaryTable
        tableData={unitDefaultData}
        properties={UnitSummaryData.properties}
        updateProperties={() => { }}
        updateCustomProperties={() => { }}
        search={''}
        metaData={metaDataRes}
        id={UnitSummaryData.id}
        updating={UnitSummaryData.updating}
      />
    );
  });

  it('Displays editable county field', () => {
    cy.get('[data-testid="data-cell-County"]').trigger('mouseover');
    cy.get('button[data-testid="edit-County"]').click();
  });

  it('shows one option on searching tx in state field', () => {
    cy.get('[data-testid="data-cell-State"]').trigger('mouseover');
    cy.get('button[data-testid="edit-State"]').click();

    cy.get('input#filter-autocomplete-State').type('TX');

    // Assert that the Autocomplete options are displayed
    cy.get('.MuiAutocomplete-popper').should('exist');

    // Optionally, you can assert the specific options displayed
    cy.get('.MuiAutocomplete-option', { timeout: 10000 }).should('have.length', 1);
  });
});
