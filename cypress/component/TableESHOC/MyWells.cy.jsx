/* eslint-disable no-undef */
import Wells from 'components/Land/components/Wells';
import { REMOVE_WELLS } from 'graphQL/useMutationRemoveWells';
import { basic_timeouts } from '../../cypressUtils/data';
import ldata from '../../fixtures/ldata.json';

const headers = {
  'Content-Type': 'application/json',
  'X-ZUMO-AUTH': ldata.x_zumo_auth,
};

let wellIds;
let wellName;

describe('MyWells ESHOC Table', () => {
  // added test case to add well first before running test case
  it('adds well from slideout', () => {
    let addedWellId;
    cy.interceptAndWait(['getESSimpleSearch', 'mywells_flat'], () => {
      cy.viewport(1600, 1200).mount(<Wells />, { testCase: 'MyWellsNameUpdate' });
    });
    cy.contains('+ ADD WELL').click();
    cy.get('[data-testid="well-search-field"]').clear().type("JJ PRATER HEIRS JJ-I1");
    cy.wait(15000);
    cy.interceptAndWait(
      ['getESSimpleSearch'],
      alias => {
        cy.get('.MuiAutocomplete-option').first().click();
        cy.wait(10000)
        cy.get('[data-testid="close-dialog"]').click();
        cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then(response => {
          addedWellId = response.response.body.data.getESSimpleSearch.hits[0]._id;
        });
      },
      { wait: false }
    );
  });
  it('checks well name is updating correctly', () => {
    cy.interceptAndWait(['getESSimpleSearch', 'mywells_flat'], () => {
      cy.viewport(1600, 1200).mount(<Wells />, { testCase: 'MyWellsNameUpdate' });
    });

    // Generate a random number between 1 and 1000 (adjust range as needed)
    const randomNumber = Math.floor(Math.random() * 1000) + 1;
    wellName = `Testing well name ${randomNumber}`;

    cy.get(
      '#MUIDataTableBodyRow-0 > td:nth-child(2) > div:nth-child(2) > div > div > a'
    ).click();
    cy.wait(15000);

    cy.get('[data-testid="Well Name"]').clear().type(wellName);
    cy.wait(15000);

    cy.get('[data-testid="close-dialog"]').click();

    cy.get(
      '#MUIDataTableBodyRow-0 > td:nth-child(2) > div:nth-child(2) > div > div > a'
    ).should('have.text', wellName);
  });

  it('deletes wells correctly', () => {
    cy.interceptAndWait(['getESSimpleSearch', 'mywells_flat'], () => {
      cy.viewport(1600, 1200).mount(
        <Wells
          defaultFilters={[
            {
              field: 'wellData.wellName.keyword',
              value: wellName,
            },
          ]}
        />,
        { testCase: 'MyWellsNameUpdate' }
      );
    });

    cy.get('th span[data-description="row-select-header"]').click();

    cy.get('button.MuiButtonBase-root[aria-label="delete"]').click();

    cy.interceptAndWait(
      ['removeWells'],
      alias => {
        cy.get('button.MuiButtonBase-root#deleteButton').click();

        cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then(response => {
          wellIds = response.request.body.variables.wellIds;
        });

        cy.get('table > tbody > tr > td').contains('Sorry, no matching records found');
      },
      { wait: false }
    );
  });

  // it('restores deleted wells', () => {
  //   const payload = {
  //     operationName: 'removeWells',
  //     variables: {
  //       wellIds,
  //       isDeleted: false,
  //     },
  //     query: REMOVE_WELLS.loc.source.body,
  //   };

  //   cy.request({
  //     method: 'POST',
  //     url: ldata.url,
  //     headers: headers,
  //     body: payload,
  //   }).then(response => {
  //     expect(response.status).to.eq(200);
  //     expect(response.body.data.removeWells.success).to.eq(true);
  //   });
  // });
});
