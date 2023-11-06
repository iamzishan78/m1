import React from 'react';
import { useDispatch } from 'react-redux';
import { setMapGridCardState } from 'actions';
import { useHistory } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import { IconButton } from '@material-ui/core';
import RoomIcon from '@material-ui/icons/Room';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  icons: {
    backgroundColor: 'transparent',
    marginLeft: 'auto',
    '&:hover': {
      backgroundColor: '#dadbde !important',
    },
  },
}));

const FlyToMap = ({ id }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const openUnitDetailCard = unitId => {
    dispatch(
      setMapGridCardState({
        mapGridCardActivated: false,
      })
    );
    history.push(`/map/units/${unitId}`);
  };

  return (
    <Tooltip title="Fly To Map" placement="top" style={{ marginRight: '10px' }}>
      <IconButton
        id={`map-fly-to-${id}`}
        size={'medium'}
        color="secondary"
        className={`${classes.icons}`}
        disabled={false}
        onClick={e => {
          e.stopPropagation();
          openUnitDetailCard(id);
        }}
        aria-label="fly"
      >
        <RoomIcon />
      </IconButton>
    </Tooltip>
  );
};

export default FlyToMap;
