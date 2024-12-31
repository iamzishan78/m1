/* eslint-disable no-undef */
import _ from 'lodash';

import MRTTable from 'components/MRTTable';

import { basic_timeouts } from '../../cypressUtils/data';

let responseHits;
describe('Unit Interest Owners Table', () => {
	beforeEach(() => {
		cy.interceptAndWait(
			['getDbData', 'shapeowners_flat'],
			alias => {
				cy.viewport(1600, 1200).mount(
					<MRTTable
						name="OwnersPerUnitTable"
						overrideMeta={{
							defaultFilters: [
								{
									field: 'shape._id',
									value: '66695705caec050a1613921d',
								},
								{
									field: 'contact.IsDeleted',
									value: 'false',
								},
							],
						}}
					/>,
					{
						spec: 'OwnersPerUnitTable',
					}
				);

				cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then(response => {
					responseHits = response.response.body.data.getDbData.hits;
				});
			},
			{ wait: false }
		);
	});

	it('checks slideouts has offer price fields and there calculation logic', () => {
		cy.wait(15000);
		cy.get('tr').eq(1).find('td').eq(3).click();
		cy.wait(10000);

		// Will check if the field exists
		cy.get('[data-testid="max_offer_price-field"]').should('exist');
		cy.get('[data-testid="uUnitPricingInterest-field"]').should('exist');
		cy.get('[data-testid="uMaxUnitPricingInterest-field"]').should('exist');

		// Checking target offer price calculation
		cy.get('[data-testid="nra-field"] div input')
			.invoke('val')
			.then(nra => {
				cy.get('[data-testid="offer_price-field"] div input')
					.invoke('val')
					.then(targetOfferPrice => {
						cy.get('[data-testid="max_offer_price-field"] div input')
							.invoke('val')
							.then(maxOfferPrice => {
								cy.get('[data-testid="uUnitPricingInterest-field"] div input')
									.invoke('val')
									.then(targetPriceInterest => {
										cy.get('[data-testid="uMaxUnitPricingInterest-field"] div input')
											.invoke('val')
											.then(maxOfferPriceInterest => {
												// Remove dollar sign and convert to integer
												nra = parseInt(nra || '0');
												targetOfferPrice = targetOfferPrice.replace(/\$|,/g, '');
												maxOfferPrice = maxOfferPrice.replace(/\$|,/g, '');
												targetPriceInterest = parseInt(targetPriceInterest.replace('$', ''));
												maxOfferPriceInterest = parseInt(maxOfferPriceInterest.replace('$', ''));

												// Added buffer of 1 because we show values on frontend upto 2 decimal points and caluclation can differ from 1
												expect(parseInt(targetOfferPrice.split('.')[0] || '0')).to.oneOf([
													parseInt((nra * targetPriceInterest).toString().split('.')[0]) || 0 - 1,
													parseInt((nra * targetPriceInterest).toString().split('.')[0]) || 0,
													parseInt((nra * targetPriceInterest).toString().split('.')[0]) || 0 + 1,
												]);
												expect(parseInt(maxOfferPrice.split('.')[0] || '0')).to.oneOf([
													parseInt((nra * maxOfferPriceInterest).toString().split('.')[0]) || 0 - 1,
													parseInt((nra * maxOfferPriceInterest).toString().split('.')[0] || 0),
													parseInt((nra * maxOfferPriceInterest).toString().split('.')[0]) || 0 + 1,
												]);
											});
									});
							});
					});
			});
		cy.get('body').click();
	});

	it('should export contact and contact purchaser', () => {
		cy.wait(1000);
		cy.get('[data-testid="over-ride-select-all-div"] input').click();
		cy.get('.MuiButtonBase-root[data-testid="export-contact-and-purchse-icon-button"]').click();

		cy.interceptAndWait(
			['initializeExportJob'],
			alias => {
				cy.get('[data-testid="export-contact-and-purchse-icon-checkbox"]').click();

				cy.get('.MuiButtonBase-root[data-testid="export-contact-and-purchse-confirm-button"]').click();

				cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then(jobResponse => {
					const jobId = jobResponse.response.body.data.initializeExportJob.job._id;

					const callback = res => {
						const datasets = res.resultsPayload.datasets;
						let exportData = _.find(datasets, { dataset: 'exportContacts' }) || {};
						exportData = exportData.exportResponse;

						expect(responseHits).to.have.lengthOf(exportData.length);

						const gridFullName =
							responseHits[0]?.contact?.entityDetail?.name ||
							`${responseHits[0]?.firstName} ${responseHits[0]?.lastName}`;

						expect(exportData[0]['Full Name']).to.equal(gridFullName);
					};

					cy.pollJobStatus({ jobId, callback });
				});
			},
			{ wait: false }
		);
	});

	it('should verify purchased icon in contact link', () => {
		const purschasedContact = responseHits.find(hit => hit.contact && hit.contact.isPurchased === true);
		const contactName =
			purschasedContact?.contact?.entityDetail?.name ||
			`${purschasedContact?.firstName} ${purschasedContact?.lastName}`;

		cy.get('[data-testid="MoreVertIcon"]').first().click();
		cy.wait(basic_timeouts.shorTimeout);
		cy.get('[data-testid="sentinelStart"] + div ul li:nth-child(5)').click();
		cy.wait(basic_timeouts.shorTimeout);
		cy.get('[data-testid="MoreVertIcon"]').first().click();
		cy.wait(basic_timeouts.shorTimeout);
		cy.get('[data-testid="sentinelStart"] + div ul li:nth-child(5)').click();
		cy.wait(basic_timeouts.shorTimeout);
		cy.get('[data-testid="sentinelStart"] + div ul li:nth-child(9):eq(1)').click();
		cy.get('.MuiButtonBase-root[aria-label="Show/Hide filters"]').click();

		cy.mrtFilterBySearch({
			value: contactName,
			columnlabel: 'Owner Name',
			alias: 'Owner Name',
		});

		cy.get('[data-testid="monetization-icon"]').should('exist');
	});
});
