import React, { useContext } from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles'
//import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
//import List from '@material-ui/core/List';
//import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon'
//import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
//import IconButton from '@material-ui/core/IconButton';
//import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'

import { MapControlsContext } from '../MapControlsContext'
import { MapContext } from '../../Map/MapContext'

const useStyles = makeStyles(theme => ({
  subHeaderItem: {
    backgroundColor: '#011133 !important'
  }
}))

export default function CheckboxListHeatmaps(props) {
  const [stateMap, setStateMap] = useContext(MapContext)
  const [state, setState] = useContext(MapControlsContext)
  // const theme = useTheme()
  const classes = useStyles()
  const handleToggle = idx => () => {
    const currentIndex = state.checkedHeats.indexOf(idx)
    const newChecked = [...state.checkedHeats]
    console.log(idx)
    console.log('toggle stateMap.checkedHeats before',stateMap.checkedHeats)

    if (currentIndex === -1) {
      newChecked.push(idx)
    } else {
      newChecked.splice(currentIndex, 1)
    }
   // setState(state => ({ ...state, checkedHeats: newChecked }))
    //props.changeHeatmaps(newChecked)
    console.log('newchecked',newChecked)

    setStateMap(stateMap => ({ ...stateMap, checkedHeats: newChecked}))
    console.log('toggle stateMap.checkedHeats after',stateMap.checkedHeats)

  }

  const StyledMenu = withStyles({
    paper: {
      border: '1px solid #011133'
    }
  })(props => (
    <Menu
      elevation={0}
      variant="menu"
      transitionDuration={0}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left'
      }}
      MenuListProps={{
        disablePadding: true
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      {...props}
    />
  ))

  const StyledMenuItem = withStyles(theme => ({
    root: {
      fontFamily: 'Poppins',
      '&:hover': {
        background: '#4B618F'
      },
      backgroundColor: '#263451',
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white
        // },
      }
    }
  }))(MenuItem)

  const handleClose = () => {
    setState(state => ({ ...state, anchorEl: null }))
  }

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <StyledMenu
        id="checklist-heats"
        anchorEl={state.anchorEl}
        keepMounted
        open={Boolean(state.anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem
          disableRipple
          key="subheader"
          role={undefined}
          dense
          className={classes.subHeaderItem}
        >
          <ListItemText primary="Heatmap Visibility" />
        </StyledMenuItem>
        {state.heatmaps.map(layer => {
          const labelId = `checkbox-list-label-${layer.id}`

          return (
            <StyledMenuItem
              disableRipple
              key={layer.idx}
              role={undefined}
              dense
            >
              <ListItemIcon>
                <Checkbox
                  icon={<VisibilityOffIcon htmlColor="#fff" />}
                  checkedIcon={<VisibilityIcon htmlColor="#fff" />}
                  edge="start"
                  checked={
                    state.checkedHeats
                      ? state.checkedHeats.indexOf(layer.idx) !== -1
                      : false
                  }
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                  onChange={handleToggle(layer.idx)}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={layer.name} />
            </StyledMenuItem>
          )
        })}
      </StyledMenu>
    </ClickAwayListener>
  )
}
