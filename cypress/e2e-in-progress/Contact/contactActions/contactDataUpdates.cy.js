/* eslint-disable no-undef */

/* 
click jacob steve kyle in grid ==
change first name to jacob2 ==
change middle name to steve2 ==
change last name to kyle2 ==
update primary address ==
update primary address 2 ==
update city ==
update state ==
update zip ==
update phone ==
update phone 2 ==
add phone 3
add phone 4
update email ==
change contact owner to kyle ==
Then verify if the appear on grid
*/

import { contactObj, basic_timeouts } from '../../../cypressUtils/data';

describe('Contact Data Updates Spec', () => {
	it('passes', () => {
		// Constants
		const { longTimeout } = basic_timeouts;

		cy.viewport(1400, 900);

		cy.interceptApi('getESSimpleSearch');
		cy.visit('http://localhost:3000/contacts');
		cy.reload();
		cy.checkAndLogin();

		cy.get('#addButton', { timeout: longTimeout }).should('be.visible');
		cy.wait(3000);

		cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout }).then(response => {
			const hits = response.response.body.data.getESSimpleSearch.hits;
			const contactToUpdate = hits.find(hit => hit.name === contactObj.name.value);

			if (!contactToUpdate) throw new Error('Sample contact not found, Run addContact spec first!!!');

			const indexOfSampleContact = hits.findIndex(hit => hit._id === contactToUpdate._id) + 1;

			cy.getTableCell('Name', indexOfSampleContact).then($name => {
				const fullName = `${contactToUpdate.name}`;
				cy.wrap($name).contains(fullName).should('exist').click();
			});

			cy.interceptApi('UpdateContact');
			cy.interceptApi('getContact');

			const notToUpdate = ['name', 'country', 'enityType', 'contactOwner', 'fileAddress'];
			for (const key in contactObj) {
				if (!notToUpdate.includes(key)) {
					cy.log(`==== STEP: UPDATE ${key.toUpperCase()} ====`);

					cy.updateAndVerifyContact(contactObj[key].id, key, contactToUpdate);
				}
			}

			cy.log('==== STEP: UPDATE PHONE 3 ====');
			cy.get('#field-13', { timeout: longTimeout }).type('084933994503');
			cy.get("[id='Full Name']", { timeout: longTimeout }).click();
			cy.verifyApiResponse('@UpdateContactApi', { responseTimeout: longTimeout });

			cy.log('==== STEP: UPDATE PHONE 4 ====');
			cy.get('#field-14', { timeout: longTimeout }).type('08493399345');
			cy.get("[id='Full Name']", { timeout: longTimeout }).click();
			cy.verifyApiResponse('@UpdateContactApi', { responseTimeout: longTimeout });

			cy.log('==== STEP: UPDATE CONTACT OWNER ====');
			const searchContact = 'Kyle';
			cy.wait(9000);
			cy.get('#userList', { timeout: longTimeout }).clear().type(searchContact);
			cy.wait(9000);

			cy.get('#userList-option-0', { timeout: longTimeout })
				.invoke('text')
				.then(contact => {
					if (searchContact === contact) cy.get('#userList-option-0', { timeout: longTimeout }).click();
					else throw new Error(`User list searching is not working as expected`);
				});
		});
	});
});
