import React from 'react';
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

const useStyles = makeStyles(theme => ({
  root: {
    height: "100vh",
    flexGrow: 1,
    minWidth: 300,
    transform: 'translateZ(0)',
    // The position fixed scoping doesn't work in IE 11.
    // Disable this demo to preserve the others.
    '@media all and (-ms-high-contrast: none)': {
      display: 'none',
    },
  },
  modal: {
    display: 'flex',
    padding: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    fontFamily: theme.typography.fontFamily,
  },
  header: {
    fontSize: "2em",
  },
  paragraph: {
    fontSize: "1.6em"
  },
  close: {
    fontSize: "2em",
    color: "black",
    textDecoration: "none"
  }
}));

export default function EmailSuccess() {
  const classes = useStyles();
  const rootRef = React.useRef(null);

  return (
    <div className={classes.root} ref={rootRef}>
      <Modal
        disablePortal
        disableEnforceFocus
        disableAutoFocus
        open
        aria-labelledby="server-modal-title"
        aria-describedby="server-modal-description"
        className={classes.modal}
        container={() => rootRef.current}
      >
        <div className={classes.paper}>
          <h2 className={classes.header} id="server-modal-title">Thank You For The Interest.</h2>
          <p className={classes.paragraph} id="server-modal-description">Will Be In Touch.</p>
          <Link className={classes.close} to="/">X</Link>
        </div>
      </Modal>
    </div>
  );
}