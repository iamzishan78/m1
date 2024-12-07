/* eslint-disable no-undef */

/* 
launch contacts 
click add contact 
add jacob to FName 
add steve to MName
add kyle to LName
add individual to entity type 
add moble phone 
add home phone 
add email
add address 1 
add address 2 
add city 
add state to LA 
add zip code
add country
add jacob as contact owner 
click add 

Then verify if the appear on grid
*/

import { contactObj, basic_timeouts } from '../../../cypressUtils/data';

describe('Add Contact Spec', () => {
	it('passes', () => {
		// Constants
		const { longTimeout } = basic_timeouts;

		cy.viewport(1400, 900);

		cy.visit('http://localhost:3000/contacts');
		cy.reload();
		cy.checkAndLogin();

		cy.get('#addButton', { timeout: longTimeout }).should('be.visible');
		cy.wait(3000);

		cy.log('==== STEP: CLICK ON ADD CONTACT BUTTON ====');
		cy.get('#addButton').click();
		cy.get('#addContactHeading', { timeout: longTimeout }).should('be.visible');

		cy.log('==== STEP: ENTER FIRST NAME ====');
		cy.get('#firstName').type(contactObj.firstName.value);

		cy.log('==== STEP: ENTER MIDDLE NAME ====');
		cy.get('#middleName').type(contactObj.middleName.value);

		cy.log('==== STEP: ENTER LAST NAME ====');
		cy.get('#lastName').type(contactObj.lastName.value);

		cy.log('==== STEP: SELECT ENTITY TYPE ====');
		cy.get('#entityType').type(contactObj.enityType.value).wait(1000).type('{downArrow}{downArrow}{enter}');

		cy.log('==== STEP: ENTER MOBILE PHONE NUMBER ====');
		cy.get('#mobilePhone').type(contactObj.mobilePhone.value);

		cy.log('==== STEP: ENTER HOME PHONE NUMBER ====');
		cy.get('#homePhone').type(contactObj.homePhone.value);

		cy.log('==== STEP: ENTER EMAIL ====');
		cy.get('#email').type(contactObj.primaryEmail.value);

		cy.log('==== STEP: ENTER ADDRESS 1 ====');
		cy.get('#address1').type(contactObj.address1.value);

		cy.log('==== STEP: ENTER ADDRESS 2 ====');
		cy.get('#address2').type(contactObj.address2.value);

		cy.log('==== STEP: ENTER CITY ====');
		cy.get('#city').type(contactObj.city.value);

		cy.log('==== STEP: ENTER STATE ====');
		cy.get('#state').type(contactObj.state.value);

		cy.log('==== STEP: ZIP CODE ====');
		cy.get('#zipCode').type(contactObj.zip.value);

		cy.log('==== STEP: ENTER COUNTRY ====');
		cy.get('#country').type(contactObj.country.value);

		cy.log('==== STEP: SELECT CONTACT OWNER ====');
		cy.get('#contactOwner').type(contactObj.contactOwner.value).wait(1000).type('{downArrow}{enter}');

		cy.interceptApi('AddContact');

		cy.log('==== STEP: CLICK ON ADD BUTTON ====');
		cy.interceptApi('getESSimpleSearch');
		cy.get('#addContactButton').click();

		cy.verifyApiResponse('@AddContactApi', { responseTimeout: longTimeout });
		cy.verifyApiResponse('@getESSimpleSearchApi', { responseTimeout: longTimeout }).then(response => {
			const hits = response.response.body.data.getESSimpleSearch.hits;
			const recentlyAdded = hits.find(hit => hit.primaryEmail === contactObj.primaryEmail.value);

			console.log(hits);
			console.log(recentlyAdded);

			if (!recentlyAdded) throw new Error('SomeThing is wrong');

			const indexOfRecentlyAdded = hits.findIndex(hit => hit._id === recentlyAdded._id) + 1;

			cy.log('==== STEP: VERIFY NAME ====');
			cy.getTableCell('Name', indexOfRecentlyAdded).then($name => {
				const fullName = `${recentlyAdded.firstName} ${recentlyAdded.middleName} ${recentlyAdded.lastName}`;
				cy.wrap($name).contains(fullName).should('exist');
			});

			cy.log('==== STEP: VERIFY FIRST NAME ====');
			cy.getTableCell('First Name', indexOfRecentlyAdded).then($firstName => {
				cy.wrap($firstName).contains(recentlyAdded.firstName).should('exist');
			});

			cy.log('==== STEP: VERIFY MIDDLE NAME ====');
			cy.getTableCell('Middle Name', indexOfRecentlyAdded).then($middleName => {
				cy.wrap($middleName).contains(recentlyAdded.middleName).should('exist');
			});

			cy.log('==== STEP: VERIFY LAST NAME ====');
			cy.getTableCell('Last Name', indexOfRecentlyAdded).then($lastName => {
				cy.wrap($lastName).contains(recentlyAdded.lastName).should('exist');
			});

			cy.log('==== STEP: VERIFY PRIMARY ADDRESS====');
			cy.getTableCell('Primary Address', indexOfRecentlyAdded).then($name => {
				const completeAddress = `${recentlyAdded.address1}, ${recentlyAdded.address2}, ${recentlyAdded.city} ${recentlyAdded.state} ${recentlyAdded.zip}`;

				cy.wrap($name).contains(completeAddress).should('exist');
			});

			cy.log('==== STEP: VERIFY HOME PHONE ====');
			cy.getTableCell('Phone 1', indexOfRecentlyAdded).then($phone1 => {
				cy.wrap($phone1).contains(recentlyAdded.homePhone).should('exist');
			});

			cy.log('==== STEP: VERIFY MOBILE PHONE ====');
			cy.getTableCell('Phone 2', indexOfRecentlyAdded).then($phone2 => {
				cy.wrap($phone2).contains(recentlyAdded.mobilePhone).should('exist');
			});

			cy.log('==== STEP: VERIFY EMAIL ====');
			cy.getTableCell('Primary Email', indexOfRecentlyAdded).then($primaryEmail => {
				cy.wrap($primaryEmail).contains(recentlyAdded.primaryEmail).should('exist');
			});

			cy.log('==== STEP: VERIFY CONTACT OWNER ====');
			cy.getTableCell('Contact Owner', indexOfRecentlyAdded).then($contactOwner => {
				cy.wrap($contactOwner).contains(recentlyAdded.contactOwner).should('exist');
			});
		});
	});
});
