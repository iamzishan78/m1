/* eslint-disable no-undef */

import { basic_timeouts } from "../../../cypressUtils/data"


describe('test 3  Spec', () => {
    it('passes', () => {
        // Constants 
        const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts

        cy.viewport(1536, 960)

        cy.interceptApi('getESSimpleSearch')
        cy.visit('http://localhost:3000/land/agreements')

        cy.checkAndLogin()

        cy.get('#addButton', { timeout: longTimeout }).should('be.visible')

        cy.log("setting value")

        cy.task('getGlobalData').then((userData) => {
            cy.log(userData);
            console.log(userData);
            // voila! Stored data between two .spec files
        });

    })
})