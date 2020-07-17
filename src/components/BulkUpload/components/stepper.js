import React,{useEffect} from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Radio } from '@material-ui/core';
import clsx from 'clsx';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Check from '@material-ui/icons/Check';
import StepConnector from '@material-ui/core/StepConnector';
import Button from '@material-ui/core/Button';
import CSVFileReader from './CSVFileReader'
import M1neralHeaders from './M1neralHeaders';
import ReviewCSV from './ReviewCSV'
import UploadStepperComponent from './UploadStepperComponent'
import {AppContext} from '../../../AppContext'
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import {ADDBULKCONTACT} from '../../../graphQL/useMutationAddBulkContacts'

const QontoConnector = withStyles({
  alternativeLabel: {
    flexDirection: 'column-reverse',
    top: 49,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  active: {
    '& $line': {
      borderColor: '#0084e2',
    },
  },
  completed: {
    '& $line': {
      borderColor: '#0084e2',
    },
  },
  line: {
    borderColor: '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
})(StepConnector);

const NewSteplabel = withStyles({
  alternativeLabel:{
    flexDirection: 'column-reverse !important'
  },
  active:{
    color: '#0084e2 !important'
  },
  completed:{
    color: '#0084e2 !important'
  }
})(StepLabel)
const useQontoStepIconStyles = makeStyles({
  root: {
    color: '#0084e2',
    display: 'flex',
    height: 22,
    alignItems: 'center',
    flexDirection: 'column-reverse !important',
  },
  active: {
    color: '#784af4',
  },
  circle: {
    width: 15,
    height: 15,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
  completed: {
    color: '#0084e2',
    zIndex: 1,
    fontSize: 18,
  },
  alternativeLabel:{
    flexDirection: 'column-reverse !important',
  },
});

const style_radio = {
  padding: '0px',
  color: '#0084e2',
  width: 15,
  height: 15,
}
const style_hollow_grey = {
  height: 15,
  width: 15,
  color: '#eaeaf0',
  border: '3px solid',
  borderRadius: '50%',
}
function QontoStepIcon(props) {
  const classes = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}
    >
      {completed ? <div className={classes.circle}/> : active? <Radio style={style_radio} color="primary" checked={true} /> : <div style={style_hollow_grey}/> }
    </div>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   */
  active: PropTypes.bool,
  /**
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
  return ['Select', 'Match', 'Review','Upload'];
}

const mapping_buttons_div ={
    maxWidth: '20%',
    margin: '0px auto',
    textAlign: 'center'
}
const stepper_style = {
  padding: '3px 24px'
}
export default function CustomizedSteppers(props) {
  const classes = useStyles();
  const [stateApp, setStateApp] = React.useContext(AppContext);
  const steps = getSteps();
  const [createBulkContacts] = useMutation(ADDBULKCONTACT);
  const userID = stateApp.user.mongoId;
  let data_to_send = stateApp.csvContactsListToSend
  const handleNext = () => {
    if(stateApp.activeStepNumber  === steps.length - 2){
      data_to_send.forEach(element => {
        element.createBy = userID;
        element.lastUpdateBy = userID;
        delete element.first_name
        delete element.last_name
        delete element.tableData
      });
      createBulkContacts({
        variables: {
          contactList: data_to_send,
        },
        refetchQueries: [
          "getContacts",
          "getContactsByOwnerId",
          "getContactsCounter",
          "getContact",
        ],
        awaitRefetchQueries: true,
      });
      setStateApp((state) => ({...state,activeStepNumber: stateApp.activeStepNumber + 1}));
    }else{
        setStateApp((state) => ({...state,activeStepNumber: stateApp.activeStepNumber + 1}));
    }
    if(stateApp.activeStepNumber === steps.length -1){
      handleReset()
      routeChange('/contacts')
    }
  };

  const handleBack = () => {
    if(stateApp.activeStepNumber === 0){
        handleReset();
        routeChange('/contacts');
    }else{
        setStateApp((state) => ({...state,activeStepNumber: stateApp.activeStepNumber - 1}));
    }
  };

  const handleReset = () => {
    setStateApp((state) => ({...state,activeStepNumber: 0, csvContactsList:[], csvContactsListToSend: [], mappedHeadersFromCSV: []}))
  };

  let history = useHistory();

  let routeChange =(route)=> {
    history.push(route);
  }

  return (
    <div className={classes.root}>
      <Stepper style={stepper_style} alternativeLabel activeStep={stateApp.activeStepNumber} connector={<QontoConnector />}>
        {steps.map((label) => (
          <Step key={label}>
            <NewSteplabel StepIconComponent={QontoStepIcon}>{label}</NewSteplabel>
          </Step>
        ))}
      </Stepper>
      <br/>
      <hr/>
      <div>
        <div>
          <div>
          {stateApp.activeStepNumber === 0 ? <CSVFileReader/>: null}
          {stateApp.activeStepNumber === 1 ? <M1neralHeaders/>: null}
          {stateApp.activeStepNumber === 2 ? <ReviewCSV/>: null}
          {stateApp.activeStepNumber === 3 ? <UploadStepperComponent/>: null}
          </div>
          <div style={mapping_buttons_div}>
            { stateApp.activeStepNumber < 3 ?
            <Button  onClick={handleBack} className={classes.button}>
              Back
            </Button>
            :null
            }
            {stateApp.activeStepNumber > 0 ? 
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
              >
                {stateApp.activeStepNumber >= steps.length - 2 ? stateApp.activeStepNumber === steps.length - 1?'Done' :'Upload' : 'Submit'}
              </Button>
            : null}
          </div>
        </div>
      </div>
    </div>
  );
}
