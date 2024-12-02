import React, { useState, createContext } from 'react';

const TractContext = createContext([{}, () => {}]);

const TractContextProvider = props => {
	const [stateDocument, setStateDocument] = useState({
		openDialog: false,
	});
	return <TractContext.Provider value={[stateDocument, setStateDocument]}>{props.children}</TractContext.Provider>;
};

export { TractContext, TractContextProvider };
