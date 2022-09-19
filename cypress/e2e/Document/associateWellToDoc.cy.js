/* eslint-disable no-undef */

import { basic_timeouts } from "../../cypressUtils/data"

describe('Associate Well Spec', () => {
    it('passes', () => {
        const { longTimeout } = basic_timeouts

        cy.viewport(1400, 900)
        cy.visit('http://localhost:3000/documents')

        cy.checkAndLogin()

        cy.get('#addDocument', { timeout: longTimeout }).should('be.visible')

        cy.wait(10000)
        cy.get('tbody>tr', { timeout: longTimeout }).eq(2).children().eq(3).children().eq(1).click()

        cy.get("#wellIcon", { timeout: longTimeout }).click()

        cy.addWell('anniemae')
        cy.addWell('silver')

        cy.get("#addIcon", { timeout: 50000 }).click({ timeout: 50000 })
        cy.typeAndSelect('#wellSearch', 'silver do', "wellSearch-option-0")
        cy.verifyApiResponse('@addWellToFileDescriptorApi')
        cy.verifyApiResponse('@getWellsFromDocumentApi')

        cy.get('#wellsList', { timeout: 50000 }).children().eq(0).click({ timeout: 50000 })

        cy.wait(40000)
        cy.get('.MuiBreadcrumbs-ol', { timeout: 50000 }).should('be.visible').children().eq(0).click({ force: true }, { timeout: 50000 })

    })

})