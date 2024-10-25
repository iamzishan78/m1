import React from 'react';
import { useHistory } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import { IconButton } from '@material-ui/core';
import RoomIcon from '@material-ui/icons/Room';
import { makeStyles } from '@material-ui/core/styles';
import { popupController } from 'hookstate/popupStateController';
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

const FlyToMap = ({ id, targetLabel, disabled = false }) => {
  const classes = useStyles();
  const history = useHistory();

  const handleWellFlyTo = value => {
    const shapeId = history.location.pathname.split('/');
    const selectedShape = popupController.getValue('selectedShape');
    const shapeType = selectedShape?.type;
    history.push(
      `/map/wells/${value?.wellId}`,
      shapeType
        ? {
          fromShapeDetail: true,
          shapeName: selectedShape?.shapeLabel,
          shapeId: shapeId[shapeId.length - 1],
          shapeType: shapeType === 'agreement' ? 'Agreements' : 'Units',
          link:
            shapeType === 'agreement'
              ? `/land/agreement/details/${selectedShape?.id}`
              : `/map/units/${shapeId[shapeId.length - 1]}`,
        }
        : null
    );
    mapControlsController.updateState({ mapGridCardActivated: false });
    popupController.setState({
      selectedWellId: value.wellId ? value.wellId.toLowerCase() : null,
      wellSelectedCoordinates: value.center ? [value.center[0], value.center[1]] : null,
    });
  };

  return (
    <Tooltip title="Fly To Map" placement="top" style={{ marginRight: '10px' }}>
      <IconButton
        id={`map-fly-to-${id}`}
        size={'medium'}
        color="secondary"
        className={`${classes.icons}`}
        disabled={disabled}
        onClick={e => {
          e.stopPropagation();

          if (targetLabel === 'well') {
            handleWellFlyTo({
              wellId: id,
            });
          }
        }}
        aria-label="fly"
      >
        <RoomIcon />
      </IconButton>
    </Tooltip>
  );
};

export default FlyToMap;
