import React, { useContext, useEffect, useState } from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { AppProvider, AppContext } from "./AppContext";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

//components
import Login from "./components/Login/Login";
import SignUpCard from "./components/Login/SignUpCard";
import ForgotPassword from "./components/Login/ForgotPassword";
import NavigationProvider from "./components/Navigation/NavigationProvider";
import MapProvider from "./components/Map/MapProvider";
import TrackProvider from "./components/Track/TrackProvider";
import TransactProvider from "./components/Transact/TransactProvider";
import TitleProvider from "./components/Title/TitleProvider";
import TitleOpinionProvider from "./components/TitleOpinion/TitleOpinionProvider";
import ContactsProvider from "./components/Contacts/ContactsProvider";
import AlertsProvider from "./components/Alerts/AlertsProvider";
import DashboardProvider from "./components/Dashboard/DashboardProvider";
import StudioProvider from "./components/Studio/StudioProvider";
import BulkUpload from "./components/BulkUpload/BulkUpload"
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
// pick a date util library
import MomentUtils from "@date-io/moment";

//graphQL - queries in ./graphQL example usage in ./components/Maps.js
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";
import { InMemoryCache } from "apollo-cache-inmemory";
import { CircularProgress } from "@material-ui/core";
import Profile from "./components/Profile/Profile"

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
      contrastText: "rgba(255, 255, 255, 1)",
    },
    secondary: {
      light: "rgba(75, 97, 143, 1)",
      main: "rgba(23, 170, 221, 1)",
      dark: "rgba(38, 52, 81, 1)",
      contrastText: "#fff",
    },
    error: {
      light: "#e57373",
      main: "#f44336",
      dark: "#d32f2f",
      contrastText: "rgba(255, 255, 255, 1)",
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.54)",
      disabled: "rgba(0, 0, 0, 0.38)",
      hint: "rgba(0, 0, 0, 0.38)",
    },
    action: {
      active: "rgba(0, 0, 0, 0.54)",
      hover: "rgba(0, 0, 0, 0.08)",
      hoverOpacity: 0.08,
      selected: "rgba(0, 0, 0, 0.14)",
      disabled: "rgba(0, 0, 0, 0.26)",
      disabledBackground: "rgba(0, 0, 0, 0.12)",
    },
  },
  typography: {
    fontFamily: "Poppins",
  },
});

const SetApolloClient = (props) => {
  const [stateApp, setStateApp] = useContext(AppContext);
  //console.log('ep',stateApp.apolloClientEndpoint)

  useEffect(() => {
    props.setApolloClient();
  }, []);

  useEffect(() => {
    if (stateApp.apolloClientEndpoint) {
      // console.log('ue endpoint',stateApp.apolloClientEndpoint)

      props.setApolloClientEndpoint(stateApp.apolloClientEndpoint);
    }
  }, [stateApp.apolloClientEndpoint]);

  useEffect(() => {
    if (stateApp.user) {
      props.setApolloClientToken(stateApp.user.authToken);
    }
  }, [stateApp.user]);
  

  
  useEffect(() => {
    if (stateApp.userSnap === true) {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src =
        "//api.usersnap.com/load/64ab8ea7-9417-41a0-b565-eb7ad69da871.js";
      script.async = true;
      script.setAttribute("id", "feedback-script");

      var x = document.getElementsByTagName("script")[0];
      x.parentNode.insertBefore(script, x);

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    } else if (stateApp.userSnap === false){
      const feedbackScript = document.querySelector("#feedback-script");
      feedbackScript && feedbackScript.remove();
      const element = document.getElementsByName("us-entrypoint-button");
      element && element[0] && element[0].remove();
    }
  }, [stateApp.userSnap]);



  /*  useEffect( () => {
      if(stateApp.user && stateApp.apolloClientEndpoint){
      
         
        props.setApolloClient(stateApp.user.authToken,stateApp.apolloClientEndpoint)
      
      }
    },[stateApp.user,stateApp.apolloClientEndpoint]) */

  return null;
};

const PrivateRoute = ({ component, ...options }) => {
  const [stateApp, setStateApp] = useContext(AppContext);

  if (
    stateApp.user &&
    Date.parse(stateApp.user.authTokenExpires) < Date.now()
  ) {
    sessionStorage.clear();
    window.location.replace(window.location.origin);

    // setStateApp((stateApp) => ({ ...stateApp, user: null }));
    // setStateNav((stateNav) => ({ ...stateNav, defaultOn: false }));
  }

  const finalComponent =
    stateApp.user && Date.parse(stateApp.user.authTokenExpires) > Date.now()
      ? component
      : Login;

  return <Route {...options} component={finalComponent} />;
};

const NotFoundRedirect = () => <Redirect to="/" />;

function App() {
  const [apolloClient, setApolloClient] = useState(null);
  const [apolloClientToken, setApolloClientToken] = useState(null);
  const [apolloClientEndpoint, setApolloClientEndpoint] = useState(null);
  //const apolloDevEndpoint = "https://m1graph.azurewebsites.net/api/m1graph?code=MHYChoSzLKszMTCsH9gRhPyCWGLDaU6qNFHB2YYrXHs9YXNV0BO5zA==";
  //set default to core until login is complete and we can get the tenant's endpoint
  //const apolloEndpoint = "https://m1gql.azurewebsites.net/api/m1graph?code=u2MVayEXvQefTpUXaydX4JtA7nQG4fFJEkHGJEaFyYuZwgYaENcdqA==";
  const updateApolloClientEndpoint = (endpoint) => {
    //console.log('update apollo end',endpoint)
    setApolloClientEndpoint(endpoint);
    updateApolloClient(endpoint, apolloClientToken);
  };
  const updateApolloClientToken = (token) => {
    setApolloClientToken(token);
    updateApolloClient(apolloClientEndpoint, token);
  };
  const updateApolloClient = (endpoint, token) => {
    if (endpoint) {
      console.log("endpoint", endpoint);
      if (token) {
        console.log("token added to graphQL");
      }

      //change from default used for login to the user's tenant
      let apolloConfig = {
        uri: endpoint,
        // fetchOptions: {
        //   mode: 'no-cors',
        // },
        headers: {},
        cache: new InMemoryCache(),
      };
      if (token) {
        apolloConfig.headers["X-ZUMO-AUTH"] = token;
      }

      let apolloClient = new ApolloClient(apolloConfig);

      setApolloClient(apolloClient);
    }
  };


  return (
    <AppProvider>
      <SetApolloClient
        setApolloClient={updateApolloClient}
        setApolloClientEndpoint={updateApolloClientEndpoint}
        setApolloClientToken={updateApolloClientToken}
      />
      {apolloClient ? (
        <ApolloProvider client={apolloClient}>
          <MuiThemeProvider theme={theme}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <Router>
                <Switch>
                  <NavigationProvider>
                    <PrivateRoute exact path="/" component={MapProvider} />
                    <PrivateRoute exact path="/profile" component={Profile} />
                    <Route exact path="/signup" component={SignUpCard} />
                    <Route
                      exact
                      path="/forgotpassword"
                      component={ForgotPassword}
                    />
                    <PrivateRoute
                      exact
                      path="/track"
                      component={TrackProvider}
                    />
                    <PrivateRoute
                      exact
                      path="/transact"
                      component={TransactProvider}
                    />
                    <PrivateRoute
                      exact
                      path="/title"
                      component={TitleOpinionProvider}
                    />
                    <PrivateRoute
                      exact
                      path="/alerts"
                      component={AlertsProvider}
                    />
                    <PrivateRoute
                      exact
                      path="/titleopinion"
                      component={TitleOpinionProvider}
                    />
                    <PrivateRoute
                      exact
                      path="/contacts"
                      component={ContactsProvider}
                    />
                    <PrivateRoute
                      exact
                      path="/dashboard"
                      component={DashboardProvider}
                    />
                    <PrivateRoute
                      exact
                      path="/studio"
                      component={StudioProvider}
                    />
                    <PrivateRoute
                    exact
                    path="/bulkupload"
                    component={BulkUpload}
                    />
                    {/* <Route component={NotFoundRedirect} /> */}
                  </NavigationProvider>
                </Switch>
              </Router>
            </MuiPickersUtilsProvider>
          </MuiThemeProvider>
        </ApolloProvider>
      ) : (
        <CircularProgress></CircularProgress>
      )}
    </AppProvider>
  );
}

export default App;
