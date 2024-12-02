import React from 'react';
import { NavigationContextProvider } from './NavigationContext';
import Navigation from './Navigation';

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
