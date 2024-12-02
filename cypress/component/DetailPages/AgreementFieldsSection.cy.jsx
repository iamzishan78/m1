/* eslint-disable no-undef */
import Summary from 'components/Land/components/Agreements/detailComponents/summary';

// Describe block for testing the AgreementFieldsSection
describe('AgreementFieldsSection', () => {
	// Before each test, mount the Summary component with predefined props
	beforeEach(() => {
		cy.viewport(1600, 1200).mount(
			<Summary
				agreementDetails={{
					id: '65dacc1a03f30ec669391fbf',
					shapeSubtitle: '',
					type: 'agreement',
					layerType: 'agreement',
					layerSubType: 'contract',
					shapeLabel: 'NIC-ASIA-405 AGREEMENT',
					agreementName: '405 AGREEMENT',
					agreementType: 'contract',
					shapeArea: '232,699.73',
					agreementNumber: 'NIC-ASIA',
					name: 'NIC-ASIA-405 AGREEMENT',
					netRoyalityAcres: null,
					acquisitionID: '',
					agreementStatus: 'ON HOLD',
					agreementSubtype: 'tester 123',
					rightsType: 'tester 345',
					prospectID: '44433899',
					internalCompany: 'test',
					qtrQtrSelection: null,
					shape:
						'{"id":"65dacc1a03f30ec669391fbf","type":"Feature","geometry":{"coordinates":[[[-98.58057784757655,34.874191788354324],[-98.21063646483867,34.874191788354324],[-98.21063646483867,34.62418612847762],[-98.58057784757655,34.62418612847762],[-98.58057784757655,34.874191788354324]]],"type":"Polygon"},"properties":{"shapeSubtitle":"","type":"agreement","layerType":"agreement","layerSubType":"contract","shapeLabel":"NIC-ASIA-405 AGREEMENT","agreementName":"405 AGREEMENT","agreementType":"contract","shapeArea":"232,699.73","shapeCenter":[-98.3956071562076,34.74918895841597],"id":"65dacc1a03f30ec669391fbf","agreementNumber":"NIC-ASIA","name":"NIC-ASIA-405 AGREEMENT","netRoyalityAcres":null,"acquisitionID":"","agreementStatus":"ON HOLD","agreementSubtype":"tester 123","rightsType":"tester 345","prospectID":"44433899","internalCompany":"test"},"name":"NIC-ASIA-405 AGREEMENT","layer":{"id":"contract"}}',
					layer: 'contract',
					state: null,
				}}
				activeAgreement={{
					id: '65dacc1a03f30ec669391fbf',
				}}
				agreementProvisions={[]}
				standardProvisions={[]}
				updateAgreement={() => null}
				shapeSummaryDetails={null}
			/>
		);
	});

	// Test case to verify auto-completion functionality for agreement detail fields
	it('Checks agreement detail page auto-completes are working', () => {
		// Clearing and entering values for the 'prospectID' field
		cy.get('#field-prospectID').clear();
		cy.get('body').click();
		cy.get('#field-prospectID').click().wait(100).type('cypress test value');
		cy.wait(100);
		cy.get('.MuiAutocomplete-option').first().click();
		cy.get('body').click();
		cy.wait(1000);
		cy.get('#field-prospectID').should('have.value', 'cypress test value');

		// Clearing and entering values for the 'acquisitionID' field
		cy.get('#field-acquisitionID').clear();
		cy.get('body').click();
		cy.get('#field-acquisitionID').click().wait(100).type('cypress test value');
		cy.wait(100);
		cy.get('.MuiAutocomplete-option').first().click();
		cy.get('body').click();
		cy.wait(1000);
		cy.get('#field-acquisitionID').should('have.value', 'cypress test value');

		// Clearing and entering values for the 'internalCompany' field
		cy.get('#field-internalCompany').clear();
		cy.get('body').click();
		cy.get('#field-internalCompany').click().wait(100).type('cypress test value');
		cy.wait(100);
		cy.get('.MuiAutocomplete-option').first().click();
		cy.get('body').click();
		cy.wait(1000);
		cy.get('#field-internalCompany').should('have.value', 'cypress test value');
	});
});
