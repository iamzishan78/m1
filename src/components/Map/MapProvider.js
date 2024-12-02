import React from 'react';
import Map from './Map.Deckgl';
// import ErrorBoundaryComponent from 'components/Shared/ErrorBoundary/ErrorBoundary'

export default function MapProvider(props) {
	return (
		// <ErrorBoundaryComponent>
		<Map {...props.match.params}>{props.children}</Map>
		// </ErrorBoundaryComponent>
	);
}
