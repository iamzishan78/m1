/* eslint-disable no-undef */
/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { deepEqualObjects } from "../../src/components/Shared/functions";
import { baseUrls, loginCredential } from "../cypressUtils/data";
import { findInObject } from "../cypressUtils/helper";

// Constants
const workSpace = Cypress.env('WORK_SPACE') || "enerx"

// Common Commands
Cypress.Commands.add("checkAndLogin", () => {
    //This command will logged in if it is not already logged in
    cy.get('body').then(($body) => {
        if ($body.find('#workSpaceSignin').length) {
            cy.get('input').type(workSpace)
            cy.get('.MuiButtonBase-root').click()

            cy.get('#signInName', { timeout: 30000 }).should('be.visible').type(loginCredential.email)
            cy.get('#password').type(loginCredential.passsword)

            cy.get('#next').click()
        }
    })
})

// This command is to type  in autocomplete search bar and then select first matched option
Cypress.Commands.add('typeAndSelect', (searchId, stringToType, optionId) => {
    cy.get(searchId).type(stringToType)
    cy.get(`[id="${optionId}"]`, { timeout: 50000 }).should('be.visible')
    cy.get(searchId).type('{downArrow}{enter}')
})

/*This command is to intercept graphql api by operation name and if searchString is passed it will only
intercept if api payload has that string in search */
Cypress.Commands.add('interceptApi', (operationName, payloadKey = null) => {

    cy.intercept('POST', baseUrls[workSpace], req => {

        if (req.body.operationName === operationName) {

            if (payloadKey) {
                const { variables } = req.body
                if (payloadKey.searchString && (variables?.search?.query === payloadKey.searchString
                    || variables?.search === `${payloadKey.searchString}*`)) {
                    req.alias = `${operationName}WithSearchStringApi`;
                }
                else if (payloadKey?.sortOrder && variables?.sort?.order === payloadKey.sortOrder) {
                    req.alias = `${operationName}WithSortOrderApi`;
                }
                else if (payloadKey?.filter && variables?.filters.length &&
                    deepEqualObjects(variables.filters[0], payloadKey.filter)) {
                    req.alias = `${operationName}WithFilterApi`;
                }
            }
            else {
                // req.alias will use as api title 
                req.alias = `${operationName}Api`;
            }
        }
    });
})

// This command is to check api was successful or not
Cypress.Commands.add('verifyApiResponse', (apiTitle) => {
    cy.wait(apiTitle, { timeout: 30000 }).then((interception) => {
        assert.isNotNull(interception.response.body, `${apiTitle} run succesfully`)
        return interception
    })
})

Cypress.Commands.add('deleteConfirmation', () => {
    cy.log('==== STEP: CLICKING ON HORIZON ICON ====')
    cy.get(".MuiTypography-root").contains('Delete').click()

    cy.log('==== STEP: CLICKING ON DELETE FROM CONFIRMATION DIALOGUE BOX  ====')
    cy.get(".MuiButton-label").contains('Delete', { timeout: 30000 }).should('be.visible').click()
})

/*This command will take css id and containing string to click on action
command will then varify api response and if isFilter is passed it will verify
filter was applied or not */
Cypress.Commands.add('selectQuickAction', (actionId, containsString, isFilter = false) => {
    cy.get(`[id="${actionId}"]`).trigger('click');
    cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: 30000 })

    if (isFilter)
        cy.get('.MuiChip-label', { timeout: 10000 }).contains(containsString)
    else
        cy.get('.MuiTypography-root', { timeout: 10000 }).contains(containsString);
})

//DocumentGrid Commands
Cypress.Commands.add('addWell', (wellName) => {
    cy.interceptApi('addWellToFileDescriptor')
    cy.interceptApi('getWellsFromDocument')

    cy.get("#addIcon").click()
    cy.typeAndSelect('#wellSearch', wellName, 'wellSearch-option-0')
    cy.verifyApiResponse('@addWellToFileDescriptorApi')
    cy.verifyApiResponse('@getWellsFromDocumentApi')
})

Cypress.Commands.add('clickWellIcon', (wellName) => {
    cy.log('==== STEP: CLICK ON WELL ICON ====')
    cy.interceptApi('getWellsFromDocument')
    cy.get("#wellIcon", { timeout: 3000 }).click()
})

Cypress.Commands.add('gridSearch', (searchString, gridOperationName) => {
    cy.interceptApi(gridOperationName, { searchString: searchString })
    cy.get('.MuiInputBase-input.MuiOutlinedInput-input.MuiInputBase-inputAdornedStart').focus().clear().type(searchString)

    cy.verifyApiResponse(`@${gridOperationName}WithSearchStringApi`, { responseTimeout: 30000 }).then((apiResponse) => {
        let hits = apiResponse.response.body.data?.getESSimpleSearch?.hits

        if (gridOperationName === 'getESDocuments')
            hits = apiResponse.response.body.data.getESFiles.hits

        const unmatchedHit = hits.find(hit => !findInObject(hit, searchString.toLowerCase()))

        if (unmatchedHit) {
            throw new Error(`Record with _id:${unmatchedHit._id} does not contains searched String`)
        }
    })
})
Cypress.Commands.add('getTableCell', (columnName, rowIndex) => {
    cy.contains('th', columnName)
        .invoke('index')
        .then(colIndex => {
            cy.get('tr')
                .eq(rowIndex)
                .within((row) => {
                    cy.get('td').eq(colIndex).as('cell')
                })
            cy.get('@cell')   // last command, it's result will be returned
        });
}
)

// ContactGrid Commands

Cypress.Commands.add('gridSearch', (searchString, gridOperationName) => {
    cy.interceptApi(gridOperationName, { searchString: searchString })
    cy.get('.MuiInputBase-input.MuiOutlinedInput-input.MuiInputBase-inputAdornedStart').focus().clear().type(searchString)

    cy.verifyApiResponse(`@${gridOperationName}WithSearchStringApi`, { responseTimeout: 30000 }).then((apiResponse) => {
        let hits = apiResponse.response.body.data?.getESSimpleSearch?.hits

        if (gridOperationName === 'getESDocuments')
            hits = apiResponse.response.body.data.getESFiles.hits

        const unmatchedHit = hits.find(hit => !findInObject(hit, searchString.toLowerCase()))

        if (unmatchedHit) {
            throw new Error(`Record with _id:${unmatchedHit._id} does not contains searched String`)
        }
    })
})

Cypress.Commands.add('sortColumn', (columnName, sortOrder) => {
    cy.interceptApi('getESSimpleSearch', { sortOrder: sortOrder })
    cy.get('.MuiButton-label', { timeout: 10000 }).contains(columnName).click({ force: true })
    cy.verifyApiResponse('@getESSimpleSearchWithSortOrderApi', { responseTimeout: 30000 })
})

Cypress.Commands.add('removeFilter', (filterLabel) => {
    cy.interceptApi('getESSimpleSearch')
    cy.get('.MuiChip-label', { timeout: 10000 }).contains(filterLabel).siblings().click()
    cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: 30000 })
    cy.get('.MuiChip-label', { timeout: 30000 }).contains(filterLabel).should('not.exist');
})


