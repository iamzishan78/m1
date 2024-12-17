import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropertyRevenueDetailsTable from 'components/Table/Revenue/PropertyRevenueDetailsTable';
// import PropertyWellProductionTable from "components/Table/Revenue/PropertyWellProductionTable";
import TabButtons from 'components/Shared/TabPanels/TabButtons';
import PropertyRevenueDetailToolBar from 'components/MRTTable/TablesOverride/PropertyRelatedAgreementTable/PropertyRelatedAgreementToolBar';
import MRTTable from 'components/MRTTable';
import { tableController, tableGlobalController } from 'hookstate/tableController';
import { simpleTableGlobalController } from 'hookstate/simpleTableController';
import TabPanels from 'components/Shared/TabPanels';

const onClickedRow = selectedRow => {
	const Controller = tableController('PropertyRelatedAgreementTable');
	const { propertyId } = Controller.getValue('customProps');

	tableGlobalController.updateState({
		propertyRevenueDetailDialog: {
			type: 'addRelatedAgreement',
			customLayerId: propertyId,
			relatedAgreement: selectedRow,
		},
	});
};

const useStyles = makeStyles(() => ({
	sectionCard: {
		padding: '20px 15px',
		maxWidth: '100%',
		margin: '0 auto',
		background: '#ffffff',
		borderBottonLeftRadius: 8,
		borderBottomRightRadius: 8,
	},
	titleField: {
		padding: 20,
	},
	titleText: {
		textTransform: 'uppercase',
		margin: '5px 16px 10px',
		fontWeight: 'bold',
	},
}));

const PropertyInterestDetailsSection = ({ propertyId, onClickAdd, showInterestDetails, setSelectedInterest }) => {
	const classes = useStyles();
	const setSelectedTab = simpleTableGlobalController.setSelectedTab;
	const {
		stateValues: { tabKey: selectedTab },
	} = simpleTableGlobalController.useState(['tabKey']);

	const Header = () => (
		<TabButtons
			labels={['Interest Details', 'Revenue Details', 'Related Agreements']}
			value={selectedTab}
			setValue={n => {
				setSelectedTab(n);
			}}
		/>
	);

	const RelatedAgreementOverrideMeta = useMemo(
		() => ({
			defaultFilters: [{ field: 'relatedAgreements._id', value: propertyId }],
			onClickedRow,
			CustomToolBar: PropertyRevenueDetailToolBar,
			tabLabels: ['Interest Details', 'Revenue Details', 'Related Agreements'],
			deletedKeys: {
				mainRecord: { key: '_id' },
				parentRecord: { value: propertyId },
			},
			customValue: { parentRecord: propertyId },
		}),
		[propertyId]
	);

	const InterestDetailoverrideMeta = useMemo(
		() => ({
			defaultFilters: [{ field: 'property._id', value: propertyId }],
			tabLabels: ['Interest Details', 'Revenue Details', 'Related Agreements'],
		}),
		[propertyId]
	);

	return (
		<div className={`${classes.sectionCard}`}>
			<TabPanels
				value={selectedTab}
				panels={[
					<MRTTable name="PropertyInterestDetailTable" overrideMeta={InterestDetailoverrideMeta} />,
					<PropertyRevenueDetailsTable
						onClickAdd={onClickAdd}
						setSelectedInterest={setSelectedInterest}
						showInterestDetails={showInterestDetails}
						targetLabel="propertyInterest"
						parent="PropertyInterestTable"
						header={<Header />}
						propertyId={propertyId}
					/>,
					<MRTTable name="PropertyRelatedAgreementTable" overrideMeta={RelatedAgreementOverrideMeta} />,
				]}
			/>
		</div>
	);
};

export default PropertyInterestDetailsSection;
