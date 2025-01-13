/* eslint-disable no-undef */
import React from 'react';

import ContactDetailCard from 'components/ContactDetailCard/ContactDetailCard';

import { UPDATE_META_DATA } from 'graphQL/useMutationUpdateMetaData.js';

import { headers } from '../../cypressUtils/cypressHeaders';
import { basic_timeouts } from '../../cypressUtils/data';
import ldata from '../../fixtures/ldata.json';

const addresses = [
	{
		address1Alt: 'P O BOX 2367',
		cityAlt: 'GALVESTON',
		stateAlt: 'TX',
		zipAlt: '77553',
	},
	{
		address1Alt: '5302 BEVERLY DR',
		cityAlt: 'SAN ANGELO',
		stateAlt: 'TX',
		zipAlt: '76904',
	},
];

// Describe block for testing the ContactDetailsSection
describe('ContactDetailsSection', () => {
	beforeEach(() => {
		cy.interceptAndWait(['getContact'], () => {
			// Mounting the ContactDetailCard component with predefined props
			cy.viewport(1600, 1200).mount(<ContactDetailCard contactId="65ad9213ede1b8fc69df499f" />, {
				// Providing additional props for test case execution
				testCase: {
					contactId: '65ad9213ede1b8fc69df499f',
				},
			});
		});
	});

	let addDealName = 'test deal';
	let updateDealName = 'test deal updated';

	// Test case to verify the functionality of custom meta data
	it('verifies custom meta data functionality', () => {
		// Opening  popup
		cy.contains('span', 'Add Custom Data').click();
		cy.get('input[placeholder="e.g. Priority, Stage, Status"]').click().type('cypress test custom field');

		// Click on the Select component to open the dropdown
		cy.get('input[id^="react-select-"]').first().click({ force: true });

		// Choose the option with the text "Text"
		cy.get('div[id^="react-select-"]').contains('Text').click();

		// Intercepting addMetaDaa Api to get metadata Id
		cy.interceptAndWait(
			['addMetaData'],
			alias => {
				cy.contains('span', 'Create Field').click();

				cy.wait(alias).then(creationResponse => {
					expect(creationResponse?.response?.statusCode).to.eq(200);
					expect(creationResponse?.response?.body?.data?.addMetaData?.success).to.eq(true);
					const metaDataId = creationResponse?.response?.body?.data?.addMetaData?.newGridView?._id;

					// Scroll to the element and verify that it is visible
					cy.contains('p.dataLabels', 'cypress test custom field').scrollIntoView().should('be.visible');

					// Delete created custom field
					cy.request({
						method: 'POST',
						url: ldata.url,
						headers: headers,
						body: {
							operationName: 'updateMetaData',
							variables: {
								metaData: {
									_id: metaDataId,
									isDeleted: true,
								},
							},
							query: UPDATE_META_DATA.loc.source.body,
						},
					});
				});
			},
			{ wait: false }
		);
	});

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

				cy.wait(alias, { timeout: 100000 }).then(deleteResponse => {
					expect(deleteResponse?.response?.statusCode).to.eq(200);
					expect(deleteResponse?.response?.body?.data?.updateDeal?.success).to.eq(true);
				});
			},
			{ wait: false }
		);
	});

	// Test case to Update Secondary Adderss
	it('Updates Secondary Adderss', () => {
		cy.get('[data-testid="Secondary Address"]') // Get the element with data-testid "Secondary Address"
			.invoke('text') // Get the text content of the element
			.then(text => {
				// Execute the following code after getting the text
				// Determine which address to use based on whether the text includes the address1Alt property of the first or second address
				const address = text.includes(addresses[0].address1Alt) ? addresses[1] : addresses[0];

				// Find and click on the pencil icon within the "Secondary Address" element
				cy.get('[data-testid="Secondary Address"]').find('#contPencilIcon').click({ force: true }); // Use force to click even if the element is covered

				// Clear and type new values for address fields
				cy.get('#fieldContentInputaddress1Alt').clear().type(address.address1Alt);
				cy.get('#fieldContentInputcityAlt').clear().type(address.cityAlt);
				cy.get('#fieldContentInputstateAlt').clear().type(address.stateAlt);
				cy.get('#fieldContentInputzipAlt').clear().type(address.zipAlt);

				// Intercept and wait for 'getContact' request before continuing
				cy.interceptAndWait(['getContact'], () => {
					cy.get('[data-testid="checkIcon"]').click(); // Click on the check icon
				});

				cy.wait(25000);

				// Check if the updated secondary address is displayed correctly
				cy.get('[data-testid="Secondary Address"]').contains(address.address1Alt);
			});
	});
});
