/* eslint-disable no-undef */

import { basic_timeouts } from "../../cypressUtils/data"


describe('Shape File Upload Spec', () => {
    it('passes', () => {
        const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts

        cy.viewport(1400, 900)
        cy.visit('http://localhost:3000')

        cy.interceptApi('getDatasets')

        cy.checkAndLogin('#workSpaceSignin')
        const fileName = "cypressford.zip"
        cy.log('==== STEP: WAIT FOR LAYERS TO POPULATE ===')
        cy.verifyApiResponse('@getDatasetsApi', { responseTimeout: longTimeout }).then(response => {
            cy.log('==== STEP: CLICKING ON MANAGER BUTTON ===')
            cy.get('#managerButton', { timeout: longTimeout }).should('be.visible').click()

            const hits = response.response.body.data.getDatasets

            cy.log('==== STEP: CHECING IF FILE IS ALREADY THERE THEN DELETE IT ===')
            if (hits.some(hit => hit.fileName === fileName)) {
                cy.log('==== STEP: STARTING PROCESS TO DELETE FILE ===')
                cy.wait(1000)
                cy.get('#sourceManagerDiv', { timeout: longTimeout }).should('be.visible')

                cy.interceptApi('updateDataset')
                cy.interceptApi('updateManyLayer')
                cy.interceptApi('getDatasets')
                cy.get("[id='source-checkbox-cypressford']", { timeout: longTimeout }).scrollIntoView().trigger('mouseover')
                cy.wait(3000)
                cy.log('==== STEP: CLICKING ON MORE HORZ ICON ===')
                cy.get("[id='more-horiz-cypressford']", { timeout: longTimeout }).scrollIntoView().invoke('show').click({ force: true })

                cy.log('==== STEP: CLICKING ON DELETE BUTTON AND CONFIRMATION ===')
                cy.get("#deleteSource", { timeout: longTimeout }).click()
                cy.get("#deleteConfirmation", { timeout: longTimeout }).click()


                cy.log('==== STEP: VERIFYING IF FILE WAS DELETED SUCCESFULLY ===')
                cy.verifyApiResponse('@updateDatasetApi', { responseTimeout: longTimeout })
                cy.verifyApiResponse('@updateManyLayerApi', { responseTimeout: longTimeout })
                cy.verifyApiResponse('@getDatasetsApi', { responseTimeout: longTimeout }).then(result => {
                    const filesNames =
                        result.response?.body?.data?.getDatasets.map(
                            (hit) => hit.fileName
                        )
                    cy.log(JSON.stringify(filesNames))
                    expect(filesNames).to.not.include(fileName)
                })

            }

            cy.get('#managerButton', { timeout: longTimeout }).scrollIntoView()
            cy.wait(1000)

            cy.get('#sourceManagerDiv', { timeout: longTimeout }).should('be.visible')

            cy.log('==== STEP: UPLOADING CYPRESSFORD.ZIP FILE ===')
            cy.get('input[type=file]', { force: true }).scrollIntoView().selectFile("cypress/files/cypressford.zip", {
                force: true
            })

            cy.log('==== STEP: CLICKING ON CREATE SOURCE BUTTON ===')
            cy.interceptApi('AddFile')
            cy.interceptApi('addDataset')
            cy.interceptApi('getDatasets')
            cy.interceptApi('getDatasets')
            cy.get('#createSourceButton', { timeout: longTimeout }).click()
            cy.interceptApi('getDatasets')
            cy.verifyApiResponse('@AddFileApi', { responseTimeout: longTimeout })
            cy.verifyApiResponse('@AddFileApi', { responseTimeout: longTimeout })
            cy.verifyApiResponse('@addDatasetApi', { responseTimeout: longTimeout })

            cy.get('#createSourceButton', { timeout: longTimeout }).should('not.be.visible');

            cy.log('==== STEP: Wait for Layers ===')
            cy.wait(3000)
            cy.verifyApiResponse('@getDatasetsApi', { responseTimeout: longTimeout }).then(result => {
                const filesNames =
                    result.response?.body?.data?.getDatasets.map(
                        (hit) => hit.fileName
                    )

                cy.log('==== STEP: CHECING IF SOURCE WAS CREATED SUCCESFULLY ===')
                if (!filesNames.includes(fileName)) {
                    cy.verifyApiResponse('@getDatasetsApi', { responseTimeout: longTimeout }).then(result2 => {
                        console.log("result2 : ", result2)
                        const filesNames2 =
                            result2.response?.body?.data?.getDatasets.map(
                                (hit) => hit.fileName
                            )

                        expect(filesNames2).to.include(fileName)
                    })
                }

                cy.wait(5000)

                cy.log('==== STEP: CLICKING ON GRID BUTTON TO OPEN SOURCE GRID ===')
                cy.interceptApi('getOpenDeals')
                cy.interceptApi('getAllMongoUsers')
                cy.interceptApi('getESSimpleSearch')
                cy.get("[id='grid-icon-cypressford']", { timeout: longTimeout }).scrollIntoView().click({ force: true })

                cy.log('==== STEP: WAITING ===')

                cy.verifyApiResponse('@getOpenDealsApi', { responseTimeout: longTimeout })
                cy.verifyApiResponse('@getAllMongoUsersApi', { responseTimeout: longTimeout })
                cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout })

                cy.wait(15000)

                cy.gridSearch('1', 'getESSimpleSearch', "#mapGridCardSearch-basic")

                cy.log('==== STEP: VERIFYING THE DATA SHOWING IN GRID OR NOT ===')
                cy.get("#layerSnapGrid", { timeout: longTimeout }).should('be.visible').getTableCell('geom', 1).then(($tableCell) => {
                    cy.log('==== STEP: OPEN ACTIVIY MODEL ====');
                    cy.wrap($tableCell).should('exist')

                })
            })

        })

    })

})