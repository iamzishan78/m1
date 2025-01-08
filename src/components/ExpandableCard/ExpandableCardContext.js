import React, { useState, createContext } from 'react';

import { drawBoundary, drawWellBoundary } from 'components/MapControls/components/DrawShapes/drawShapesHelpers';

const ExpandableCardContext = createContext([{}, () => {}]);

const ExpandableCardContextProvider = React.memo(props => {
	const [stateExpandableCard, setStateExpandableCard] = useState({
		expanded: false,
	});
	const handleCloseExpandableCard = () => {
		props.handleCloseExpandableCard();
		drawBoundary();
		drawWellBoundary();
	};

	return (
		<ExpandableCardContext.Provider value={[stateExpandableCard, setStateExpandableCard, handleCloseExpandableCard]}>
			{props.children}
		</ExpandableCardContext.Provider>
	);
});

ExpandableCardContext.whyDidYouRender = true;
ExpandableCardContextProvider.whyDidYouRender = true;
export { ExpandableCardContext, ExpandableCardContextProvider };
