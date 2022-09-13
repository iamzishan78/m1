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
import { findInObject } from "../cypresshelpers";
// Constants
const workSpace = Cypress.env('WORK_SPACE') || "enerx"
const baseUrls = {
    enerx: "https://enerxgraphql.azurewebsites.net/api/m1graph?code=Rhr8LQFXNnl/TE26EVD296voKbGVWZQDupqWAAWMaZXjzvgdvktPqg==",
    localhost: "http://localhost:7071/api/m1graph"
}

// Common Commands
Cypress.Commands.add("checkAndLogin", () => {
    //This command will logged in if it is not already logged in
    cy.get('body').then(($body) => {
        if ($body.find('#workSpaceSignin').length) {
            cy.get('input').type(workSpace)
            cy.get('.MuiButtonBase-root').click()

            cy.get('#signInName', { timeout: 30000 }).should('be.visible').type('support@m1neral.com')
            cy.get('#password').type('M1neral2022')

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
    cy.wait(apiTitle, { timeout: 10000 }).then((interception) => {
        assert.isNotNull(interception.response.body, `${apiTitle} run succesfully`)
    })
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


