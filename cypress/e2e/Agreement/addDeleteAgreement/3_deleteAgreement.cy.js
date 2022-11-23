/* eslint-disable no-undef */

import { basic_timeouts, agreementObj } from "../../../cypressUtils/data"

describe('Delete Agreement Spec', () => {
    it('passes', () => {
        const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts

        cy.viewport(1536, 960)
        cy.visit('http://localhost:3000/land/agreements')

        cy.checkAndLogin()

        cy.get('#addButton', { timeout: longTimeout }).should('be.visible')

        cy.log('==== STEP: SEARCH AGREEMENT ON GRID ====')
        cy.gridSearch(agreementObj.agreementName.value, 'getESSimpleSearch').then(response => {
            const hits = response.response.body.data.getESSimpleSearch.hits
            const cypressAgreement = hits.find(hit => hit.agreementName === agreementObj.agreementName.value)
            const cypressAgreementId = cypressAgreement._id

            if (!cypressAgreement)
                throw new Error('Sample Agreement added by cypress not found');

            const indexOfcypressAgreement = hits.findIndex(hit => hit._id === cypressAgreement._id) + 1

            cy.log('==== STEP: OPEN CYPRESS GENERATED AGREEMENT DETAIL  ====')
            cy.getTableCell("Agreement", indexOfcypressAgreement).then(($agreementNameCell) => {
                cy.wrap($agreementNameCell).contains(`${agreementObj.agreementNumber.value} - ${agreementObj.agreementName.value}`).scrollIntoView().click({waitForAnimations: false})
                cy.get(agreementObj.agreementNumber.id, { timeout: longTimeout }).should('be.visible')

                cy.log('==== STEP: DELETE AGREEMENT PROCESS START ====')
                cy.get("#moreHorizIcon",{ timeout: longTimeout }).children().click()
                cy.interceptApi('getESSimpleSearch')
                cy.interceptApi('updateCustomLayer')
                cy.deleteConfirmation()
                cy.verifyApiResponse('@updateCustomLayerApi')

                cy.get('#addButton', { timeout: longTimeout }).should('be.visible')

                cy.gridSearch(agreementObj.agreementName.value, 'getESSimpleSearch').then(response => {
                    const hits = response.response.body.data.getESSimpleSearch.hits
                    const isAggreementExist = hits.some(hit => hit.id === cypressAgreementId)

                    if (isAggreementExist)
                        throw new Error('Agreement still exist');

                    cy.wait(500)
                })

            })
        })

    })

})