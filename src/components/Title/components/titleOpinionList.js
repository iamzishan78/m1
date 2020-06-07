import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";
import FolderIcon from "@material-ui/icons/Folder";
import { AppContext } from "../../../AppContext";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 752
  },
  demo: {
    backgroundColor: theme.palette.background.paper
  },
  folderIcon: {
    color: "#17AADD"
  },
  TO: {
    "&:hover": {
      cursor: "pointer"
    }
  }
}));

export default function InteractiveList(props) {
  const classes = useStyles();
  let history = useHistory();
  const [, setStateApp] = useContext(AppContext);
  const [dense] = React.useState(false);

  const handleTOClick = (e, id) => {
    e.preventDefault();
    setStateApp(stateApp => {
      return {
        ...stateApp,
        selectedTitleOpinionId: id
      };
    });
    history.push("/titleopinion");
  };

  return (
    <div className={classes.root}>
      <Grid>
        <div className={classes.demo}>
          <List dense={dense}>
            {props.titleOpinions.map((titleOpinion, i) => {
              return (
                <div key={titleOpinion.id}>
                  {/* <NavLink to="/titleOpinion"> */}
                  <ListItem className={classes.TO}>
                    <ListItemIcon>
                      <FolderIcon className={classes.folderIcon} />
                    </ListItemIcon>
                    <ListItemText
                      primary={titleOpinion.name}
                      onClick={e => {
                        handleTOClick(e, titleOpinion.id);
                      }}
                    />
                  </ListItem>
                  {/* </NavLink> */}
                </div>
              );
            })}
          </List>
        </div>
      </Grid>
    </div>
  );
}
