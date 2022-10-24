/* eslint-disable no-undef */

import { basic_timeouts } from "../../cypressUtils/data"
import { isArraysEqual } from "../../cypressUtils/helper"

describe('Verify QTR Calls Spec', () => {
    it('passes', () => {
        const { shorTimeout, longTimeout } = basic_timeouts
        const tractName = "FRASER, BURR & OLYPHANT A-1393"

        cy.viewport(1400, 900)

        cy.interceptApi('getESSimpleSearch')
        cy.visit('http://localhost:3000/land/agreements')

        cy.checkAndLogin()

        cy.get('#addButton', { timeout: longTimeout }).should('be.visible')

        cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: shorTimeout })

        cy.interceptApi('getESSimpleSearch')

        cy.log('==== STEP: OPEN AGREEMENT DETAIL ====')

        cy.getTableCell('Agreement', 7).then($element => {
            cy.wrap($element).get('.MuiBox-root').eq(5).click()
        })

        cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout }).then(response => {
            const hits = response.response.body.data.getESSimpleSearch.hits
            const tractToTest = hits.find(hit => hit?.shapeLabel === tractName)

            const selectedQTR = tractToTest?.qtrQtrSelection?.selectedQtr
            console.log("selectedQTR : ", selectedQTR)

            cy.get('#documentIcon', { timeout: longTimeout }).should('be.visible')
            cy.get("#AgreementOwnersTractsTable").scrollIntoView().click()

            cy.log(`==== STEP: ADD ${tractName} IF NOT EXIST ====`)
            if (!tractToTest)
                cy.addTract(tractName)

            cy.log('==== STEP: MAKING IT WAIT ====')
            cy.wait(15000)
            cy.log(`==== STEP: OPEN ${tractName} TRACT EDIT DRAWER ====`)
            cy.get(".MuiTableCell-body", { timeout: longTimeout }).contains(tractName, { timeout: longTimeout }).click({ force: true })

            cy.log('==== STEP: OPEN SELECT QTR 2  ====')
            cy.interceptApi('updateShapeOwners')
            cy.get("#autocompleteQTR2").click({ force: true }).wait(500).type("{downArrow}{downArrow}{enter}", { force: true })
            cy.get("#saveButton").scrollIntoView().click()

            cy.get('#saveButton', { timeout: longTimeout }).should('not.exist', { timeout: longTimeout });

            cy.verifyApiResponse('@updateShapeOwnersApi', { responseTimeout: longTimeout }).then(response => {
                const updatedSelectedQTR = response.response.body.data.updateShapeOwners.data[0]?.tract.qtrQtrSelection?.selectedQtr

                if (isArraysEqual(selectedQTR, updatedSelectedQTR))
                    throw new Error(`QTR not saved successfully`)

                cy.log('==== STEP: VISIT MAP PAGE  ====')
                cy.interceptApi('getCustomLayer')
                cy.visit('http://localhost:3000')

                cy.log(`==== STEP: SELECT AND OPEN TRACT ${tractName} ====`)
                cy.searchOnMap('Tracts', tractName)

                cy.verifyApiResponse('@getCustomLayerApi', { responseTimeout: longTimeout }).then(response => {
                    const customLayerQtr = response.response.body.data.customLayer.qtrQtrSelection?.selectedQtr

                    cy.log(`==== STEP: MATCHING PREVIOUSLY ADDED QTR ====`)
                    if (!isArraysEqual(updatedSelectedQTR, customLayerQtr))
                        throw new Error(`Something is wrong with QTR `)

                    cy.log(`==== STEP: QTR VERIFIED ====`)
                })
            })

        })

    })

})