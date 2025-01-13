import React from 'react';

import WellCard from './WellCard';
import { WellCardContextProvider } from './WellCardContext';

function WellCardProvider(props) {
	return (
		<WellCardContextProvider>
			<WellCard selectedWell={props.selectedWell} />
		</WellCardContextProvider>
	);
}

WellCardProvider.whyDidYouRender = true;
export default React.memo(WellCardProvider);
