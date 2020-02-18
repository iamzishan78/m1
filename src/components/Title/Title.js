import React, { useContext } from "react";
// import { AppContext } from "../../AppContext";
import { TitleContext } from "./TitleContext";
// import { MapContext } from "../Map/MapContext";
import Card from "./components/card";
import { fade, makeStyles } from "@material-ui/core/styles";
import ProjectList from "./components/projectsList";

export default function Title() {
  // const [stateApp, setStateApp] = useContext(AppContext);
  const [stateTitle, setStateTitle] = useContext(TitleContext);
  // const [stateMap, setStateMap] = useContext(MapContext);

  const useStyles = makeStyles(theme => ({
 
    grow: {
      flexGrow: 1
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      display: "none",
      [theme.breakpoints.up("sm")]: {
        display: "block"
      }
    },
   
    inputInput: {
      padding: theme.spacing(1, 1, 1, 7),
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: 200
      }
    },
    sectionDesktop: {
      display: "none",
      [theme.breakpoints.up("md")]: {
        display: "flex"
      }
    },
    sectionMobile: {
      display: "flex",
      [theme.breakpoints.up("md")]: {
        display: "none"
      }
    }
  }));

  let classes = useStyles();
  return (
    <Card >
      {stateTitle.Projects.map((project, i) => {
        return <ProjectList key={i} project={project} />;
      })}
    </Card>
  );
}
