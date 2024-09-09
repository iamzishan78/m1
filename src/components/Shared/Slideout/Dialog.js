import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';

import Drawer from './Drawer';
import DialogContent from './DialogContent';

const useStyles = makeStyles(theme => ({
  contentRoot: {
    overflowY: 'overlay',
    overflowX: 'hidden',
    marginRight: '60px',
  },
}));

function Dialog(props) {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);

  if (loading)
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 5,
        }}
      >
        <CircularProgress size="20px" />
      </div>
    );

  return (
    <div className={classes.contentRoot}>
      <Drawer
        dealSettingsNumber={/* getSubtaskNumber() */ null}
        mapSettings={/* mapSettings */ null}
      />
      <DialogContent />
    </div>
  );
}

export default Dialog;
