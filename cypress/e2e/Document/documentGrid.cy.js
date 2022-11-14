/* eslint-disable no-undef */

import { basic_timeouts } from "../../cypressUtils/data"

describe('Document Grid Spec', () => {
    it('passes', () => {
        const { shorTimeout, longTimeout } = basic_timeouts

        cy.viewport(1400, 900)

        cy.interceptApi('getESDocuments')
        cy.visit('http://localhost:3000/documents')

        cy.checkAndLogin()

        cy.get('#addDocument', { timeout: longTimeout }).should('be.visible')
        cy.verifyApiResponse('@getESDocumentsApi', { responseTimeout: longTimeout })

        cy.log('==== STEP: UPDATE INTERNAL COMPANY ====')
        cy.interceptApi('updateDocument')
        cy.getTableCell('Internal Company', 1).then(($internalCompany) => {
            cy.scrollGridTo('right', '#Documents')
            cy.wrap($internalCompany).get("#selectedValues").click()
            cy.scrollGridTo('right', '#Documents')
            cy.wrap($internalCompany).get("#searchForValue").type('924{enter}{esc}{esc}')
            cy.verifyApiResponse('@updateDocumentApi', { responseTimeout: longTimeout })
        })


        cy.scrollGridTo('right', '#Documents')
        cy.log('==== STEP: UPDATE STATE ====')
        cy.interceptApi('updateDocument')
        cy.getTableCell('State', 1).then(($state) => {
            cy.wrap($state).click()

            cy.get('.react-select__menu-list').children().eq(2).trigger("click", { force: true })
            cy.verifyApiResponse('@updateDocumentApi', { responseTimeout: shorTimeout })

            cy.get('.react-select__menu-list').children().eq(3).trigger("click", { force: true })
            cy.scrollGridTo('right', '#Documents')
            cy.wrap($state).click()
            cy.verifyApiResponse('@updateDocumentApi', { responseTimeout: shorTimeout })
        })

    })

})