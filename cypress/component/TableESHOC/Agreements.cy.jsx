

/* eslint-disable no-undef */
import AgreementsTable from 'components/Table/Agreement/AgreementsTable';

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

  it('checks created at/by and updated at/by fields in agreement grid', () => {
    cy.get('table thead th span.MuiButton-label')
      .contains('Created By')
      .should('exist');
    cy.get('table thead th span.MuiButton-label')
      .contains('Created Date')
      .should('exist');
    cy.get('table thead th span.MuiButton-label')
      .contains('Last Updated By')
      .should('exist');
    cy.get('table thead th span.MuiButton-label')
      .contains('Last Updated Date')
      .should('exist');
  });
});
