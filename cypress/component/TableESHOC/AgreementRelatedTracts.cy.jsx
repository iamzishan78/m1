/* eslint-disable no-undef */
import AgreementOwnersTractsTable from 'components/Table/Agreement/AgreementOwnersTractsTable'
describe('Agreement_relatedTracts.cy.jsx', () => {
  beforeEach(() => {

    cy.interceptAndWait(['getESSimpleSearch', 'shapeowners_flat'], () => {
      cy.viewport(1600, 1200).mount(<AgreementOwnersTractsTable
        id="AgreementOwnersTractsTable"
        setRecord={() => null}
        customLayer={null}
        isTestcase={true}
        shapeType="Agreement"
        header={"Tracts"}
        setTractsNumber={() => null}
        dense
        commentType="Ownership"
        targetLabel="Tract"
        portal={"#agreementDetailsDrawer"}
      />)
    });
  });

  it('check lease RI and RI fields', () => {
    // Check that "RI" label does not exist
    cy.get('#AgreementOwnersTractsTable thead th span.MuiButton-label').contains("RI").should('exist');

    // // Check that "Lease RI" label does not exist
    cy.get('#AgreementOwnersTractsTable thead th span.MuiButton-label').contains("Lease RI").should('not.exist');
  });
});
