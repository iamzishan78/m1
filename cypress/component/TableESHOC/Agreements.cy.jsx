/* eslint-disable no-undef */
import AgreementsTable from "components/Table/Agreement/AgreementsTable";

describe('Agreements ESHOC Table', () => {
  beforeEach(() => {
    cy.interceptAndWait(['getESSimpleSearch', 'shapes_flat'], () => {
      cy.viewport(1600, 1200).mount(
        <AgreementsTable
          esIndex={"shapes_flat"}
          isCheckboxSticky={true}
          header="Agreements"
          esFilters={[]}
          targetLabel="agreement"
          parent="AgreementsTable"
          setESFilters={() => null}
          landSearchQuery={null}
          loadMore={null}
        />
      );
    });
  });

  it('checks company_id, total_acqusition_cost and description in agreement', () => {
    cy.get('table thead th span.MuiButton-label')
      .contains('Total Acquisition Cost')
      .should('exist');
    cy.get('table thead th span.MuiButton-label')
      .contains('Company ID')
      .should('exist');
    cy.get('table thead th span.MuiButton-label')
      .contains('Description')
      .should('exist');
    cy.get('table thead th span.MuiButton-label')
      .contains('INTEREST TYPE')
      .should('not.exist');
    cy.get('table thead th span.MuiButton-label')
      .contains('TRACT STATUS')
      .should('not.exist');
  });
});
