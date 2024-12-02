import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropertyInterestDetailsTable from 'components/Table/Revenue/PropertyInterestDetailsTable';
import PropertyRevenueDetailsTable from 'components/Table/Revenue/PropertyRevenueDetailsTable';
// import PropertyWellProductionTable from "components/Table/Revenue/PropertyWellProductionTable";
import TabButtons from 'components/Shared/TabPanels/TabButtons';
import RelatedAgreementsTable from 'components/Land/components/Agreements/detailComponents/relatedAgreements/RelatedAgreementsTable';

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

const PropertyInterestDetailsSection = ({
	propertyId,
	onClickAdd,
	showInterestDetails,
	setSelectedInterest,
	setNewAgmtState,
}) => {
	const classes = useStyles();
	const [selectedTab, setSelectedTab] = useState(0);

	const Header = () => (
		<TabButtons
			labels={[
				'Interest Details',
				'Revenue Details',
				'Related Agreements',
				// "Well Production"
			]}
			value={selectedTab}
			setValue={n => {
				setSelectedTab(n);
			}}
		/>
	);

	return (
		<div className={`${classes.sectionCard} flex column justifyStart alignStart w-100`}>
			{selectedTab === 0 && (
				<PropertyInterestDetailsTable
					onClickAdd={onClickAdd}
					setSelectedInterest={setSelectedInterest}
					showInterestDetails={showInterestDetails}
					targetLabel="propertyInterest"
					parent="PropertyInterestTable"
					header={<Header />}
					propertyId={propertyId}
				/>
			)}
			{selectedTab === 1 && (
				<PropertyRevenueDetailsTable
					onClickAdd={onClickAdd}
					setSelectedInterest={setSelectedInterest}
					showInterestDetails={showInterestDetails}
					targetLabel="propertyInterest"
					parent="PropertyInterestTable"
					header={<Header />}
					propertyId={propertyId}
				/>
			)}
			{selectedTab === 2 && (
				<RelatedAgreementsTable
					header={<Header />}
					moduleId={propertyId}
					dense
					setDrawer={value => setNewAgmtState(value === 'agrmt')}
				/>
			)}
			{/* {selectedTab === 2 && (
        <PropertyWellProductionTable
          onClickAdd={onClickAdd}
          setSelectedInterest={setSelectedInterest}
          showInterestDetails={showInterestDetails}
          targetLabel="propertyInterest"
          parent="PropertyInterestTable"
          header={<Header />}
          propertyId={propertyId}
        />
      )} */}
		</div>
	);
};

export default PropertyInterestDetailsSection;
