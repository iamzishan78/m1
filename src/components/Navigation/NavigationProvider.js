import React from "react";
import { NavigationContextProvider } from "./NavigationContext";
import Navigation from "./Navigation";

export default function NavigationProvider(props) {
  const routes = props.children.map((child) => child.props);
  return (
    <NavigationContextProvider>
      <Navigation>
        {React.Children.map(props.children, (child) => {
          return React.cloneElement(child, { routes: routes });
        })}
      </Navigation>
    </NavigationContextProvider>
  );
}
