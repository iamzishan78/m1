/* eslint-disable no-undef */
import React from 'react';
import ContactDetailCard from 'components/ContactDetailCard/ContactDetailCard';
import { basic_timeouts } from '../../cypressUtils/data';

// Describe block for testing the ContactDetailsSection
describe('ContactDetailsSection', () => {
  beforeEach(() => {
    cy.interceptAndWait(['getContact'], () => {
      // Mounting the ContactDetailCard component with predefined props
      cy.viewport(1600, 1200).mount(
        <ContactDetailCard contactId="65ad9213ede1b8fc69df499f" />,
        {
          // Providing additional props for test case execution
          testCase: {
            contactId: '65ad9213ede1b8fc69df499f',
          },
        }
      );
    });
  });

  let addDealName = 'test deal';
  let updateDealName = 'test deal updated';

  // Test case to verify contact deal creation
  it('Add contact deal', () => {
    // Clicking on deals menu to load deals grid
    cy.interceptAndWait(['getContactDeals'], () => {
      cy.get('#Deals', {
        timeout: basic_timeouts.longTimeout,
      })
        .scrollIntoView()
        .click({ force: true });
    });

    cy.get('#addButton').click({ force: true });

    // Selecting the textarea for typing deal name
    cy.get('textarea[placeholder="Click to enter deal name"]')
      .click()
      .wait(100)
      .clear()
      .wait(100)
      .type(addDealName)
      .wait(100);

    // Waiting for the creation response and processing the response data
    cy.interceptAndWait(
      ['addDeal'],
      alias => {
        cy.get('[data-testid="add-deal-icon-button"]').click();

        cy.wait(alias).then(creationResponse => {
          expect(creationResponse?.response?.statusCode).to.eq(200);
          expect(creationResponse?.response?.body?.data?.addDeal?.success).to.eq(true);
          addDealName = creationResponse?.response?.body?.data?.addDeal?.deal?.name;
        });
      },
      { wait: false }
    );
  });

  // Test case to verify contact deal updation
  it('Update contact deal', () => {
    // Clicking on deals menu to load deals grid
    cy.interceptAndWait(['getContactDeals'], () => {
      cy.get('#Deals', {
        timeout: basic_timeouts.longTimeout,
      })
        .scrollIntoView()
        .click({ force: true });
    });

    cy.get('td[data-colindex="1"]') // Find all table rows 1st column
      .contains(addDealName) // Find the cell whoes value equal to deal name
      .click();

    // Selecting the textarea for updating deal name
    cy.get('textarea[placeholder="Click to enter deal name"]')
      .click()
      .wait(100)
      .clear()
      .wait(100)
      .type(updateDealName)
      .wait(100);

    // Waiting for the creation response and processing the response data
    cy.interceptAndWait(
      ['updateDeal'],
      alias => {
        cy.get('.MuiButtonBase-root[data-testid="add-deal-icon-button"]').click();

        cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then(updateResponse => {
          expect(updateResponse?.response?.statusCode).to.eq(200);
          expect(updateResponse?.response?.body?.data?.updateDeal?.success).to.eq(true);
          updateDealName = updateResponse?.response?.body?.data?.updateDeal?.deal?.name;
        });
      },
      { wait: false }
    );
  });

  // Test case to verify contact deal deletion
  it('Delete contact deal', () => {
    // Clicking on deals menu to load deals grid
    cy.interceptAndWait(['getContactDeals'], () => {
      cy.get('#Deals', {
        timeout: basic_timeouts.longTimeout,
      })
        .scrollIntoView()
        .click({ force: true });
    });

    cy.get('td[data-colindex="1"]') // Find all table rows 1st column
      .contains(updateDealName) // Find the cell whoes value equal to deal name
      .click();

    // Click on delete icon button
    cy.get('.MuiButtonBase-root[data-testid="delete-deal-icon-button"]').click();

    // Click on delete menu item
    cy.get('li[data-testid="delete-confirm"]').click({ force: true });

    // Waiting for the creation response and processing the response data
    cy.interceptAndWait(
      ['updateDeal'],
      alias => {
        // Click on delete dialog button
        cy.get('#deleteButton').click();

        cy.wait(alias).then(deleteResponse => {
          expect(deleteResponse?.response?.statusCode).to.eq(200);
          expect(deleteResponse?.response?.body?.data?.updateDeal?.success).to.eq(true);
        });
      },
      { wait: false }
    );
  });
});
