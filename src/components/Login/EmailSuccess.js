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
    maxWidth: 600,
    height: "60vh",
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
    fontSize: "1.9em"
  },
  close: {
    fontSize: "2em",
    color: "#000000c2",
    textDecoration: "none",
    float: "right",
  }, 
  aTag: {
    color: "#000",
    paddingLeft: 6,
    paddingRight: 6
  },
  news: {
    fontSize: "1.5em",
  },
  containerContent: {
    margin: 50
  }
}));


const M1neralIconSvg = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100"
      height="100"
      // viewBox="0 0 11320 2490"
      viewBox="0 0 2100 2500"
      
    >
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <path
          fill="#12ABE0"
          d="M1396 1823c-201 202-528 202-729 0-15-15-30-31-43-48l-366 366c14 16 29 31 44 47 403 402 1056 402 1459 0 356-356 397-908 124-1309l-379 378c80 188 43 413-110 566zm-839-163c-80-188-43-413 110-566 201-201 528-201 729 0 16 15 30 32 43 48l366-366c-14-16-29-31-44-47L1032 0 302 729c-356 356-397 908-124 1309l379-378zm292-384c101-100 264-100 365 0 101 101 101 264 0 365s-264 101-365 0c-100-101-100-264 0-365z"
        ></path>
      </g>
    </svg>
  );
};


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
          <Link className={classes.close} to="/">X</Link>
          <div className={classes.containerContent}>
            <M1neralIconSvg/>
            <h2 className={classes.header} id="server-modal-title">Thank You For The Interest And Will Be In Touch.</h2>
            <p className={classes.paragraph} id="server-modal-description"></p>
            <p className={classes.news} id="server-modal-description">
              In the meantime, you can stay up to date with the 
              <a className={classes.aTag} rel="noopener noreferrer" target="_blank" href="https://www.m1neral.com/">latest</a>
              news.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}