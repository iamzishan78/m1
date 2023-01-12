/* eslint-disable no-undef */

import { basic_timeouts } from "../cypressUtils/data"

describe('Open Revenue Property Detail Card  Spec', () => {
  it('passes', () => {
    // Constants
    const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts

    cy.viewport(1400, 900)

    cy.interceptApi('getESSimpleSearch')
    cy.visit('http://localhost:3000/revenue/properties')

    cy.checkAndLogin()

    cy.get('#addButton', { timeout: longTimeout }).should('be.visible')

    cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout }).then(response => {

      cy.getTableCell('Property', 1).then(($row) => {
        cy.log('==== STEP: OPEN TAGGER ====')
        cy.wrap($row).click()

        cy.interceptApi('getESSimpleSearch');

        cy.verifyApiResponse('@getESSimpleSearchApi').then(response => {

          cy.log(JSON.stringify(response.response.body.data.getESSimpleSearch.hits[0].property));
          let {internalID, number}= response?.response?.body?.data?.getESSimpleSearch?.hits?.[0]?.property || {};

          if(internalID || number){
            cy.log("Navigating Back")
            cy.get(".MuiBreadcrumbs-li").should("be.visible").first().trigger("click");
          } else {
            cy.log("Can't navigate back because both internalID and number is empty.")
          }
        })
      })
    })

  })
})
