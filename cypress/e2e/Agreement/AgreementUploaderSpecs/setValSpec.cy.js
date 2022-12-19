/* eslint-disable no-undef */

import { basic_timeouts } from "../../../cypressUtils/data"

describe('test 1  Spec', () => {
    it('passes', () => {
        // Constants s
        const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts

        cy.viewport(1536, 960)

        cy.interceptApi('getESSimpleSearch')
        cy.visit('http://localhost:3000/land/agreements')

        cy.checkAndLogin()

        cy.get('#addButton', { timeout: longTimeout }).should('be.visible')

        cy.log("setting value")

        cy.task('setAgreementData', { fisrtOb: "check first obj" });

    })
})