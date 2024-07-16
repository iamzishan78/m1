import React from 'react';
import { useDispatch } from 'react-redux';
import { setMapGridCardState } from 'actions';
import { useHistory } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import { IconButton } from '@material-ui/core';
import RoomIcon from '@material-ui/icons/Room';
import { makeStyles } from '@material-ui/core/styles';
import { popupController } from 'hookstate/popupStateController';

const useStyles = makeStyles(() => ({
  icons: {
    backgroundColor: 'transparent',
    marginLeft: 'auto',
    '&:hover': {
      backgroundColor: '#dadbde !important',
    },
  },
}));

const FlyToMap = ({ id, type, row }) => {
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

  const openWellPopUp = wellId => {
    dispatch(
      setMapGridCardState({
        mapGridCardActivated: false,
      })
    );
    history.push(`/map/wells/${wellId}`);
  };

  const openShapePopup = selectedShapeFile => {
    popupController.updateState({
      selectedShapeFile,
    })
  };

  const handleClick = () => {
    switch (type) {
      case 'unit':
        openUnitDetailCard(id);
        break;

      case 'shapefile':
        openShapePopup(row);
        break;

      case 'wells':
        openWellPopUp(id);
        break;

      default:
        break;
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
        disabled={false}
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
