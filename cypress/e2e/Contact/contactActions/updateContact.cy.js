/* eslint-disable no-undef */

/* 

Then verify if the appear on grid
*/

import { contactObj, basic_timeouts } from "../../../cypressUtils/data"

describe('Add Contact Spec', () => {
    it('passes', () => {
        // Constants 
        const { longTimeout } = basic_timeouts

        cy.viewport(1400, 900)

        cy.interceptApi('getESSimpleSearch')
        cy.visit('http://localhost:3000/contacts')
        cy.reload()
        cy.checkAndLogin()

        cy.get('#addButton', { timeout: longTimeout }).should('be.visible')
        cy.wait(3000)

        cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout }).then(response => {
            const hits = response.response.body.data.getESSimpleSearch.hits
            const sampleContact = hits.find(hit => hit.primaryEmail === contactObj.email)

            if (!sampleContact)
                throw new Error('Sample contact not found, Run addContact spec first!!!');

            const indexOfSampleContact = hits.findIndex(hit => hit._id === sampleContact._id) + 1

            cy.getTableCell("Name", indexOfSampleContact).then(($name) => {
                const fullName = `${sampleContact.firstName} ${sampleContact.middleName} ${sampleContact.lastName}`
                cy.wrap($name).contains(fullName).should('exist').click()
            })
        })

    })

})