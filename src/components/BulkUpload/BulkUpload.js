import React,{useEffect} from "react";
import {AppContext} from '../../AppContext'
import { makeStyles } from "@material-ui/core/styles";
import Stepper from './components/stepper'


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor:'white',
  },
  header: {    
    paddingTop: '25px',
    paddingBottom: '75px',
    paddingLeft: "20px"
  }
}));

export default function BulkUpload(props) {
  const [stateApp,setStateApp] = React.useContext(AppContext);

  useEffect(()=>{
    reset_state()
  },[])
  const M1neral_headers = [
    {
        label: "First Name",
        mapped_key: "",
        required: false,
        actual_key: "first_name",
    },
    {
        label: "Last Name",
        mapped_key: "",
        required: false,
        actual_key: "last_name",
    },
    {
        label: "Street Address",
        mapped_key: "",
        required: false,
        actual_key: "address1",
    },
    {
        label: "City",
        mapped_key: "",
        required: false,
        actual_key: "city",
    },
    {
        label: "State",
        mapped_key: "",
        required: false,
        actual_key: "state",
    },
    {
        label: "Zip",
        mapped_key: "",
        required: false,
        actual_key: "zip",
    },
    {
      label: "Email",
      mapped_key: "",
      required: false,
      actual_key: "primaryEmail",
    },
    {
        label: "Phone Number",
        mapped_key: "",
        required: false,
        actual_key: "mobilePhone",
    },
  ]
  const reset_state = ()=>{
    setStateApp((state)=>({
      ...state,
      csvContactsListToSend: [],
      activeStepNumber: 0,
      csvContactsList: [],
      m1neralHeaders: M1neral_headers,
      mappedHeadersFromCSV: []
    }))
  }
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Stepper>{props.children}</Stepper>
    </div>
  );
};
