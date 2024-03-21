/* eslint-disable no-undef */
import UnitTractsTable from "components/Table/Shape/UnitTractsTable";

describe('UnitRelatedTracts ESHOC Table', () => {
  beforeEach(() => {
    cy.interceptAndWait(['getESPaginatedList', 'shapetracts_flat'], () => {
      cy.viewport(1600, 1200).mount(
        <UnitTractsTable
          customLayer={{ _id: "659ce96d97935e0ffa85792e" }}
          shapeType="Unit"
          dense
        />
      );
    });
  });

  it('checks Unit Tract ID and Unit Tract Acres field', () => {
    cy.get('table thead th span.MuiButton-label')
      .contains('Unit Tract ID')
      .should('exist');
    cy.get('table thead th span.MuiButton-label')
      .contains('Unit Tract Acres')
      .should('exist');
    cy.get('table thead th span.MuiButton-label')
      .contains('Tract Unit Acres')
      .should('not.exist');
  });
});
