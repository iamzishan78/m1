/* eslint-disable no-undef */
import AddUnitTractDialog from 'components/Table/TableAddDialog/AddUnitTractDialog';

describe('UnitRelatedTractSlideout', () => {
	beforeEach(() => {
		cy.viewport(1600, 1200).mount(
			<AddUnitTractDialog
				open={true}
				width="450px"
				shapeId={null}
				shapeType={'parcel'}
				seletedTract={null}
				onClose={() => null}
			/>
		);
	});

	it('checks Unit Tract ID input field and Unit Tract Acres input field', () => {
		cy.contains('label', 'Unit Tract ID').should('exist');
		cy.contains('label', 'Unit Tract Acres').should('exist');
	});
});
