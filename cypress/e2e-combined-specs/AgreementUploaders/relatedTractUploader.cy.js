/* eslint-disable no-undef */

import { basic_timeouts } from "../../cypressUtils/data"

describe('Related Tracts Uploader Spec', () => {
    it('passes', () => {
        // Constants 
        const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts

        cy.viewport(1536, 960)

        cy.interceptApi('getESSimpleSearch')
        cy.visit('http://localhost:3000/land/agreements')

        cy.checkAndLogin()

        cy.get('#addButton', { timeout: longTimeout }).should('be.visible')

        cy.task('getGlobalData').then((globalData) => {
            const { agreementData } = globalData
            // const agreementData = [{ agreementName: 'JOANIE MILLER GREEN', agreementNumber: '100-100-10001' },
            // { agreementName: 'JIMMY NELSON WHITE', agreementNumber: '100-100-10002' }
            // ]

            console.log("Agreement Data : ", agreementData)

            cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout }).then(response => {
                cy.log('==== STEP: OPEN UPLOADER ====')

                cy.get('#addButtonArrowIcon', { timeout: longTimeout }).click()
                cy.get("[id='menu-item-Import Agreements']", { timeout: longTimeout }).click()

                cy.get('.MuiTypography-root', { timeout: longTimeout }).contains("Agreement Upload (Agreement Header Info)", { timeout: longTimeout }).click()

                cy.get('.MuiListItem-root', { timeout: longTimeout }).contains("Agreement Upload (Related Tracts)", { timeout: longTimeout }).click()

                cy.log('==== STEP: UPLOAD FILE ====')
                cy.get('input[type=file]', { force: true }).selectFile('cypress/files/Sample_AGREEMENT_RELATED_TRACTS_Upload_20221217.csv', {
                    force: true
                })

                cy.log('==== STEP: CHECK IF ALL FIELDS ARE MAPPED ====')
                cy.get("#headerTable", { timeout: longTimeout }).should("be.visible")
                    .find("tr")
                    .then((row) => {
                        const totalRows = row.length - 1
                        // row.length will give you the row count
                        for (let i = 0; i < totalRows; i++) {
                            cy.get(`#checkbox-${i}`).scrollIntoView()
                                .should('not.be.visible') // Passes
                                .should('be.checked')
                        }
                    });

                // cy.get("#agreement-outlined", { timeout: longTimeout }).click()
                // cy.get("[id='Only create new']", { timeout: longTimeout }).click()

                cy.log('==== STEP: CLICK ON CONTINUE BUTTON ====')
                cy.get("#continueButton", { timeout: longTimeout }).scrollIntoView().should('not.be.disabled').click()

                cy.wait(5000)

                cy.log('==== STEP: EXTRACT TRACT DATA FROM THE TABLE  ====')
                cy.get("#materialTable", { timeout: longTimeout }).should("be.visible").get('.MuiTable-root')
                    .find("tr")
                    .then((row) => {
                        const totalRows = row.length - 4
                        cy.log(totalRows)
                        cy.log(row.length)
                        //row.length will give you the row count
                        let tractData = []

                        for (let i = 1; i < totalRows; i++) {
                            // eslint-disable-next-line no-loop-func
                            cy.getTableCell('Agreement Number', i).then(($tableCell) => {
                                cy.wrap($tableCell).scrollIntoView().then(function ($numberCellText) {
                                    cy.getTableCell('Parcel Name', i).then(($tableCell) => {
                                        cy.wrap($tableCell).scrollIntoView().then(function ($nameCellText) {
                                            tractData.push({ agreementNumber: $numberCellText.text(), parcelName: $nameCellText.text(), })
                                            cy.wrap(tractData).as('tractData');
                                        })

                                    })
                                })

                            })
                        }

                        cy.log('==== STEP: CLICK ON UPLOAD BUTTON ====')
                        cy.get("#continueButton", { timeout: longTimeout }).scrollIntoView().should('not.be.disabled').click()

                        cy.log('==== STEP: VERIFY EXPORT STATUS ====')
                        cy.get('.MuiTypography-root.MuiTypography-caption', { timeout: extraTimeout }).contains("Export successfully completed", { timeout: longTimeout }).should('be.visible')

                        cy.log('==== STEP: VERIFYING RELATED TRACTS FOR AGREEMENTS ====')
                        agreementData.forEach(data => {
                            cy.visit('http://localhost:3000/land/agreements')

                            cy.get('#addButton', { timeout: longTimeout }).should('be.visible')

                            const { agreementName, agreementNumber } = data
                            cy.log(`==== STEP: VERIFYING RELATED TRACTS FOR AGREEMENT : ${agreementName} ====`)
                            cy.wait(5000)

                            cy.gridSearch(agreementName, 'getESSimpleSearch').then(response => {
                                const hits = response.response.body.data.getESSimpleSearch.hits

                                const cypressAgreement = hits.find(hit => hit.agreementName === agreementName)

                                if (!cypressAgreement)
                                    throw new Error('Agreement added by cypress Uploader not found');

                                const indexOfcypressAgreement = hits.findIndex(hit => hit._id === cypressAgreement._id) + 1

                                cy.log('==== STEP: OPEN CYPRESS AGREEMENT DETAIL  ====')
                                cy.getTableCell("Agreement", indexOfcypressAgreement).then(($agreementNameCell) => {
                                    cy.interceptApiByIndex('getESSimpleSearch', 'shapeowners_flat')
                                    cy.wrap($agreementNameCell).contains(`${agreementNumber} - ${agreementName}`).scrollIntoView().click({ waitForAnimations: false })
                                    cy.get("#legalDescriptionTab", { timeout: longTimeout }).should('be.visible').click()

                                    cy.verifyApiResponse('@getESSimpleSearchApiByIndex', { responseTimeout: longTimeout }).then(result => {
                                        const filesNames =
                                            result.response?.body?.data?.getESSimpleSearch.hits.map(
                                                (hit) => hit.name
                                            )
                                        cy.log(JSON.stringify(filesNames))

                                        cy.get('@tractData').then(tractData => {
                                            console.log("agreement final: ", agreementName)
                                            console.log("agreement number final: ", agreementNumber)
                                            console.log("tractData final: ", tractData)

                                            const tractNames = tractData.filter(td => td.agreementNumber === agreementNumber)?.map((tract) => tract.parcelName)

                                            console.log("tractNames final: ", tractNames)
                                            expect(filesNames).to.deep.eq(tractNames)
                                        })


                                    })
                                })
                            })
                        })
                    })

            })


        });

    })
})