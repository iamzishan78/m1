/* eslint-disable no-undef */

import { basic_timeouts } from "../../cypressUtils/data"

// Click a unit on the map and open the detail card for Panther 1H (id = 628410d19ec87abf87b956e0)
// Click the wells tab and scroll the right until the location/flyTo icon appears
// Click the flyTo icon to ensure the unit detail screen closes and well detail card appears
// Close out of the well detail card

describe('open well detail card of Unit', () => {
    it('passes', () => {

        // Constants 
        const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts

        cy.viewport(1920, 1080)

        cy.visit('http://localhost:3000/')
        
        cy.checkAndLogin()
        
        cy.get('#dataNameSelect', { timeout: longTimeout }).should('be.visible').trigger("click");
        
        cy.get('#customized-menu .MuiList-root .MuiGrid-root li',{ timeout: shorTimeout }).contains("Units").trigger('click')
        
        cy.interceptApi('getESSimpleSearch')
        cy.get('#cognitive-search-autocomplete').should('be.visible').type("panther");

        cy.verifyApiResponse('@getESSimpleSearchApi', { reponseTimeout: longTimeout }).then(response => {
            cy.get('.MuiAutocomplete-popper ul li').first().should("be.visible").trigger('click')
            cy.interceptApi('UpsertComment')
            cy.get("#expandIcon").should("be.visible").trigger("click");
            cy.get("#unitWells3",{ reponseTimeout: longTimeout }).should("be.visible").trigger("click");
            cy.get("table tbody tr:first-child td:last-child button",{ timeout: longTimeout }).should("be.visible").trigger("click");
            cy.get('.MuiCardHeader-root .MuiCardHeader-content').should('be.visible');
        })



    })
})