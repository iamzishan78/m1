import * as React from 'react';

import { Provider, createStore } from 'jotai';
import PropTypes from 'prop-types';

export const store = createStore();

export function JotaiProvider({ children }) {
	return <Provider store={store}>{children}</Provider>;
}
JotaiProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
