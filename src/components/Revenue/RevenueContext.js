import React, { useState, createContext } from 'react';

const RevenueContext = createContext([{}, () => {}]);
createContext([{}, () => {}]);

const RevenueContextProvider = props => {
	const [stateRevenue, setStateRevenue] = useState({
		expandedPanel: true,
	});

	return <RevenueContext.Provider value={[stateRevenue, setStateRevenue]}>{props.children}</RevenueContext.Provider>;
};

export { RevenueContext, RevenueContextProvider };
