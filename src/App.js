import React, { useContext } from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { AppProvider, AppContext } from "./AppContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//components
import Login from "./components/Login/Login";
import SignUpCard from "./components/Login/SignUpCard";
import NavigationProvider from "./components/Navigation/NavigationProvider";
import MapProvider from "./components/Map/MapProvider";
import TrackProvider from "./components/Track/TrackProvider";
import TransactProvider from "./components/Transact/TransactProvider";
import TitleProvider from "./components/Title/TitleProvider";
import TitleOpinionProvider from "./components/TitleOpinion/TitleOpinionProvider";
import AlertsProvider from "./components/Alerts/AlertsProvider";
import { Redirect } from "react-router";

import { MuiPickersUtilsProvider } from "@material-ui/pickers";
// pick a date util library
import MomentUtils from "@date-io/moment";

//graphQL - queries in ./graphQL example usage in ./components/Maps.js
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";
import { InMemoryCache } from 'apollo-cache-inmemory';

const apolloDevEndpoint = "https://m1graph.azurewebsites.net/api/m1graph?code=MHYChoSzLKszMTCsH9gRhPyCWGLDaU6qNFHB2YYrXHs9YXNV0BO5zA==";
const apolloEndpoint = "https://m1gql.azurewebsites.net/api/m1graph?code=u2MVayEXvQefTpUXaydX4JtA7nQG4fFJEkHGJEaFyYuZwgYaENcdqA==";
const client = new ApolloClient({
  uri: apolloEndpoint,
  cache: new InMemoryCache()  
});

//app theme overrides to the default material-ui theme found here https://material-ui.com/customization/default-theme/#explore
const theme = createMuiTheme({
  palette: {
    type: "light",
    common: { black: "#000", white: "#fff" },
    background: { paper: "#fff", default: "#fafafa" },
    primary: {
      light: "rgba(75, 97, 143, 1)",
      main: "rgba(1, 17, 51, 1)",
      dark: "rgba(38, 52, 81, 1)",
      contrastText: "rgba(255, 255, 255, 1)"
    },
    secondary: {
      light: "rgba(75, 97, 143, 1)",
      main: "rgba(23, 170, 221, 1)",
      dark: "rgba(38, 52, 81, 1)",
      contrastText: "#fff"
    },
    error: {
      light: "#e57373",
      main: "#f44336",
      dark: "#d32f2f",
      contrastText: "rgba(255, 255, 255, 1)"
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.54)",
      disabled: "rgba(0, 0, 0, 0.38)",
      hint: "rgba(0, 0, 0, 0.38)"
    },
    action: {
      active: "rgba(0, 0, 0, 0.54)",
      hover: "rgba(0, 0, 0, 0.08)",
      hoverOpacity: 0.08,
      selected: "rgba(0, 0, 0, 0.14)",
      disabled: "rgba(0, 0, 0, 0.26)",
      disabledBackground: "rgba(0, 0, 0, 0.12)"
    }
  },
  typography: {
    fontFamily: "Poppins"
  }
});

const PrivateRoute = ({ component, ...options }) => {
  const [stateApp,setStateApp] = useContext(AppContext)
  
  const finalComponent = stateApp.user ? component : Login;

  return <Route {...options} component={finalComponent} />;
};

// const PublicRoute = ({component, ...options}) => {
//   const [stateApp,setStateApp] = useContext(AppContext)
//   const 
// }

function App() {
  return (
    <ApolloProvider client={client}>
      <MuiThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <AppProvider>
            <Router>
              <Switch> 
                <NavigationProvider>
                  <PrivateRoute exact path="/" component={MapProvider} />
                  <Route exact path="/signup"  component={SignUpCard} />
                  <PrivateRoute exact path="/track" component={TrackProvider}/>
                  <PrivateRoute exact path="/transact" component={TransactProvider}/>
                  <PrivateRoute exact path="/title" component={TitleProvider}/> 
                  <PrivateRoute exact path="/alerts" component={AlertsProvider}/>
                  <PrivateRoute exact path="/titleopinion" component={TitleOpinionProvider}/>
                </NavigationProvider>
              </Switch>
            </Router>
          </AppProvider>
        </MuiPickersUtilsProvider>
      </MuiThemeProvider>
    </ApolloProvider>
  );
}

export default App;
