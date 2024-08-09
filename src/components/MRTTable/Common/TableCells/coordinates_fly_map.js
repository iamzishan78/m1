import React from 'react';
import { useHistory } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import { IconButton } from '@material-ui/core';
import RoomIcon from '@material-ui/icons/Room';
import { makeStyles } from '@material-ui/core/styles';
import { mapControlsController } from 'hookstate/mapControlsController';

const useStyles = makeStyles(() => ({
  icons: {
    backgroundColor: 'transparent',
    marginLeft: 'auto',
    '&:hover': {
      backgroundColor: '#dadbde !important',
    },
  },
}));

const FlyToMap = ({ id, type, Action, disabled = false }) => {
  const classes = useStyles();
  const history = useHistory();

  const handleClick = () => {

    if (Action) Action()
    else {
      mapControlsController.updateState({ mapGridCardActivated: false });
      history.push(`/map/${type}/${id}`);
    }
  }

  return (
    <Tooltip title="Fly To Map" placement="top" style={{ marginRight: '10px' }}>
      <IconButton
        id={`map-fly-to-${id}`}
        data-testid='mrt-fly-to-map'
        size={'medium'}
        color="secondary"
        className={`${classes.icons}`}
        disabled={disabled}
        onClick={e => {
          e.stopPropagation();
          handleClick();
        }}
        aria-label="fly"
      >
        <RoomIcon />
      </IconButton>
    </Tooltip>
  );
};

export default FlyToMap;
