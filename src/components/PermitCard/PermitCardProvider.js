import React from 'react';

import PermitCard from './PermitCard';
import { PermitCardContextProvider } from './PermitCardContext';

function PermitCardProvider(props) {
	const handleClosePermitCard = () => {
		props.closePermitCard();
	};

	return (
		<PermitCardContextProvider>
			<PermitCard closePermitCard={handleClosePermitCard} selectedPermit={props.selectedPermit} />
		</PermitCardContextProvider>
	);
}

PermitCardProvider.whyDidYouRender = true;
export default React.memo(PermitCardProvider);
