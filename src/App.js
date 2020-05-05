import React, { useContext, useEffect,useState } from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { AppProvider, AppContext } from "./AppContext";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

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
import ExpiredStorage from 'expired-storage';
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
// pick a date util library
import MomentUtils from "@date-io/moment";

//graphQL - queries in ./graphQL example usage in ./components/Maps.js
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";
import { InMemoryCache } from 'apollo-cache-inmemory';
import { CircularProgress } from "@material-ui/core";



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


const SetApolloClient = (props) => {
  const [stateApp,setStateApp] = useContext(AppContext)
  //console.log('ep',stateApp.apolloClientEndpoint)

  useEffect( () => {
   
       
      props.setApolloClient()
    
    
  },[])

    useEffect( () => {
     
      if(stateApp.apolloClientEndpoint){
       // console.log('ue endpoint',stateApp.apolloClientEndpoint)
         
        props.setApolloClientEndpoint(stateApp.apolloClientEndpoint)
      
      }
    },[stateApp.apolloClientEndpoint])

    useEffect( () => {
      if(stateApp.user){
      
         
        props.setApolloClientToken(stateApp.user.authToken)
      
      }
    },[stateApp.user])

   /*  useEffect( () => {
      if(stateApp.user && stateApp.apolloClientEndpoint){
      
         
        props.setApolloClient(stateApp.user.authToken,stateApp.apolloClientEndpoint)
      
      }
    },[stateApp.user,stateApp.apolloClientEndpoint]) */

  return (null)
  }


const PrivateRoute = ({ component, ...options }) => {
  const [stateApp,setStateApp] = useContext(AppContext)
  const expiredStorage = new ExpiredStorage()
  let isExpired = expiredStorage.isExpired("user");
  
  const finalComponent = stateApp.user && !isExpired ? component : Login;

  return <Route {...options} component={finalComponent} />;
};

const NotFoundRedirect = () => <Redirect to='/' />

function App() {
 const [apolloClient,setApolloClient] = useState(null)
 const [apolloClientToken,setApolloClientToken] = useState(null)
 const [apolloClientEndpoint,setApolloClientEndpoint] = useState(null)
  //const apolloDevEndpoint = "https://m1graph.azurewebsites.net/api/m1graph?code=MHYChoSzLKszMTCsH9gRhPyCWGLDaU6qNFHB2YYrXHs9YXNV0BO5zA==";
//set default to core until login is complete and we can get the tenant's endpoint
//const apolloEndpoint = "https://m1gql.azurewebsites.net/api/m1graph?code=u2MVayEXvQefTpUXaydX4JtA7nQG4fFJEkHGJEaFyYuZwgYaENcdqA==";
const updateApolloClientEndpoint = (endpoint) => {
  //console.log('update apollo end',endpoint)
  setApolloClientEndpoint(endpoint)
  updateApolloClient(endpoint,apolloClientToken)
}
const updateApolloClientToken = (token) => {
  setApolloClientToken(token)
  updateApolloClient(apolloClientEndpoint,token)
}
const updateApolloClient = (endpoint,token) => {
  if(endpoint){
  console.log('endpoint',endpoint)
  if(token){
    console.log('token added to graphQL')
  }
  
  //change from default used for login to the user's tenant
    let apolloClient = new ApolloClient({
      uri: endpoint,
      headers: {
        authorization: token ? `Bearer ${token}` : ''
      },
      cache: new InMemoryCache()  
    });
    setApolloClient(apolloClient)
  }
}

   
  return   (
  <AppProvider>
    <SetApolloClient setApolloClient={updateApolloClient} setApolloClientEndpoint={updateApolloClientEndpoint} setApolloClientToken={updateApolloClientToken}/>
    {apolloClient ? (
    <ApolloProvider client={apolloClient}>
      <MuiThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
         
            <Router>
              <Switch> 
                <NavigationProvider>
                  <PrivateRoute exact path="/" component={MapProvider} />
                  <Route exact path="/signup"  component={SignUpCard} />
                  <Route exact path="/forgotpassword"  component={ForgotPassword} />
                  <PrivateRoute exact path="/track" component={TrackProvider}/>
                  <PrivateRoute exact path="/transact" component={TransactProvider}/>
                  <PrivateRoute exact path="/title" component={TitleProvider}/> 
                  <PrivateRoute exact path="/alerts" component={AlertsProvider}/>
                  <PrivateRoute exact path="/titleopinion" component={TitleOpinionProvider}/>
                  <PrivateRoute exact path="/contacts" component={ContactsProvider}/>
                  <Route component={NotFoundRedirect}/>
                </NavigationProvider>
              </Switch>
            </Router>
          
        </MuiPickersUtilsProvider>
      </MuiThemeProvider>
    </ApolloProvider>
   ):(<CircularProgress></CircularProgress>)}
  
  </AppProvider>
  )
}

export default App;