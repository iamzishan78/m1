import React, { Fragment, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import M1nTable from "../Shared/M1nTable/M1nTable";
import { NavigationContext } from "../Navigation/NavigationContext";
import { useHistory } from "react-router-dom";
import { Modals } from "../../styles/Modal";
import { UserManagementContext } from "./UserManagementContext";

// import FormControl from '@material-ui/core/FormControl';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import InputLabel from '@material-ui/core/InputLabel';
// import MenuItem from '@material-ui/core/MenuItem';
// import Select from '@material-ui/core/Select';
// import Switch from '@material-ui/core/Switch';

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
  },
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: 120,
  },
  formControlLabel: {
    marginTop: theme.spacing(1),
  },
  header :{
      backgroundColor: theme.palette.primary.main,
  }
}));

export default function UserManagementContainer() {
  const classes = useStyles();
  const modalClass = Modals();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [stateUsers, setStateUsers] = useContext(UserManagementContext);
  const { isUserManagementOpen } = stateNav;
  const windowsHeight = window.innerHeight;
  
  const history = useHistory();
  const handleClose = () => {
    setStateNav({...stateNav, isUserManagementOpen: false})
  };

  return (
    <Fragment>
      <Dialog
        fullWidth
        maxWidth="xl"
        open={isUserManagementOpen}
        onClose={handleClose}
      >
         <DialogTitle className={modalClass.title} id="customized-dialog-title">
        User Management
        <HighlightOffIcon
          fontSize="large"
          className={modalClass.titleClose}
          onClick={handleClose}
        />
        </DialogTitle>
        <DialogContent style={{height: windowsHeight}}>
            <M1nTable 
                dense
                parent="UserManagement"
            />
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}