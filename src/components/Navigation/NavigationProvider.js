import React from 'react';

import Navigation from './Navigation';
import { NavigationContextProvider } from './NavigationContext';

export default function NavigationProvider(props) {
	const routes = props.children.map?.(child => child.props);
	return (
		<NavigationContextProvider>
			<Navigation isMap={props.isMap}>
				{routes
					? React.Children.map(props.children, child => {
							return React.cloneElement(child, { routes: routes });
						})
					: props.children}
			</Navigation>
		</NavigationContextProvider>
	);
}
