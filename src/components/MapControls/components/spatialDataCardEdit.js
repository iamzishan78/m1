import React, { useState, useContext, useRef, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";

//material-ui components
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Modal from '@material-ui/core/Modal';
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
//import Avatar from '@material-ui/core/Avatar'
import IconButton from "@material-ui/core/IconButton";
// import Typography from '@material-ui/core/Typography'
// import Table from '@material-ui/core/Table'
// import TableBody from '@material-ui/core/TableBody'
// import TableCell from '@material-ui/core/TableCell'
// import TableRow from '@material-ui/core/TableRow'
// import useMediaQuery from '@material-ui/core/useMediaQuery'
// import Dialog from '@material-ui/core/Dialog'
// import DialogActions from '@material-ui/core/DialogActions'
// import DialogContent from '@material-ui/core/DialogContent'
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { AppContext } from "../../../AppContext";

// Helpers for area calcs
import { area, convertArea, length } from "@turf/turf";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    padding: "0px"
  },

  card: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontSize: ".75rem",
    background: "#011133",
    borderStyle: "solid",
    borderWidth: "thin",
    borderColor: "#011133",
    width: "325px",
    height: "auto",
    position: "relative",
    top: "10vh",
    left: "10vw"
  },

  cardPopup: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontSize: ".75rem",
    background: "#011133",
    borderStyle: "solid",
    borderWidth: "thin",
    borderColor: "#011133",
    width: "325px",
    height: "auto",
    position: "relative",
  },

  cardHeader: {
    padding: "2%",
    height: "15%"
  },

  cardTitle: {
    fontWeight: 600,
    fontSize: "1rem",
    lineHeight: "1rem",
    color: "#FFFFFF",
    textTransform: "uppercase",
    position: "relative",
    height: "1rem",
    left: "7.46%",
    right: "39.32%",
    top: "calc(50% - 23px/2 - 140px)"
  },

  subheader: {
    fontWeight: 300,
    lineHeight: "16px",
    color: "#FFFFFF",
    position: "relative",
    height: "17px",
    left: "7.46%",
    right: "58.31%",
    top: "calc(50% - 17px/2 - 120px)"
  },

  cardAction: {
    color: "black",
    width: "100%",
    height: "80%",
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    //alignItems: "flex-start",
    backgroundColor: "#fff"
  },
  cardContent: {
    height: "10%",
    backgroundColor: "#fff",
    padding: "0px",
    paddingBottom: "0px"
  },
  actionWrapper: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "space-evenly"
  },
  input: {
    display: "flex",
    marginLeft: "0px",
    marginBottom: "15px"
  },

  buttonContainer: {
    //height: "25%",
    display: "flex",
    //paddingRight: "3%",
    //paddingLeft: "3%",
    backgroundColor: "#fff",
    //paddingBottom: "3%",
    //"&:last-child": { padding: "0px" }
    justifyContent: "space-evenly"
  },
  button: {
    width: "40%",
    //margin: "3%",
    justifyContent: "space-evenly"
  },

  formControl: {
    margin: theme.spacing(1),
    minWidth: 265,
    color: "black",
    //paddingBottom: 3
  },
  label: {
    background: "white",
    padding: "0px 4px"
  },
  TextField: {
    display: "flex",
    margin: theme.spacing(1),
    minWidth: 265,
    color: "black"
  },
  modalContainer: {
    background: "white",
    width: "500px",
    textAlign: "center",
    padding: "15px",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
  }
}));

export default function SpatialDataCardEdit(props) {
  const classes = useStyles();
  const {
    sdType,
    shapeLabel,
    projectName,
    sdNotes,
    sdGrossAcres,
  } = props.selectedFeature.properties;
  const { cardClass = "card" } = props;
  const [dataType, setDataType] = useState(sdType);
  const [dataName, setDataName] = useState(shapeLabel);
  const [dataProject, setDataProject] = useState(projectName);
  const [grossAcres, setGrossAcres] = useState(sdGrossAcres);
  const [dataNotes, setDataNotes] = useState(sdNotes);
  
  const [stateApp, setStateApp] = useContext(AppContext);
  const [drawFeatureId, setDrawFeatureId] = useState("");
  const [custLayers, setCustLayers] = useState([]);

  const [openDeleteModal, setDeleteModal] = useState(false);
  const [showError, setShowError] = useState(false);


  const inputLabel = useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);

  useEffect(() => {
    setDataType(sdType);
    setDataName(shapeLabel);
    setDataProject(projectName);
    setDataNotes(sdNotes);
  }, [props.selectedFeature]);

  useEffect(() => {
    let udName = ""
    switch (dataType) {
      case "interest":
        udName = "Area of Interest";
        break;
      case "parcel":
        udName = "Parcels";
        break;
      default:
        udName = "";
        break;
    }
    if (udName) {
      const layerIndex = stateApp.userDefinedLayers.findIndex(layer => layer.name == udName);
      setStateApp({
        ...stateApp,
        tempCheckedUserDefinedLayers: layerIndex
      });
    } else {
      setStateApp({
        ...stateApp,
        tempCheckedUserDefinedLayers: null
      });
    }
  }, [dataType]);

  const updateDataNotes = evt => {
    let updatedNotes = evt.target.value;
    setDataNotes(updatedNotes);
  };
  const saveSpatialData = () => {
    if (dataName) {
      const spatialData = {
        sdType: dataType === "" ? "interest" : dataType,
        shapeLabel: dataName,
        projectName: dataProject,
        sdGrossAcres: grossAcres,
        // sdNotes: dataNotes
      };
      props.saveSpatialData(spatialData, dataType);
  
      const tmpChecked = stateApp.tempCheckedUserDefinedLayers;
      const checkedLayers = stateApp.checkedUserDefinedLayers.slice(0);
      if (tmpChecked != null && stateApp.checkedUserDefinedLayers.indexOf(tmpChecked) === -1) {
        checkedLayers.push(tmpChecked)
      }
      setStateApp({
        ...stateApp,
        checkedUserDefinedLayers: checkedLayers,
        tempCheckedUserDefinedLayers: null
      })
    } else {
      setShowError(true);
    }
  };

  const closeSpatialDataCard = () => {
    if (drawFeatureId) {
      stateApp.draw.delete(drawFeatureId);
      setDrawFeatureId("");
    }
    setStateApp({
      ...stateApp,
      tempCheckedUserDefinedLayers: null,
    });
    if (custLayers.length > 0) {
      setStateApp({
        ...stateApp,
        customLayers: custLayers
      });
    }
    
    props.closeSpatialDataCard(false);
  }

  const deleteSpatialData = () => {
    setStateApp({
      ...stateApp,
      tempCheckedUserDefinedLayers: null
    });
    props.deleteSpatialDataAndShape();
  };
  const calculateLandArea = () => {
    const { selectedFeature } = props;
    if (selectedFeature) {
      if (selectedFeature.geometry.type === "Polygon") {
        const areaInSqMeters = area(selectedFeature);
        const areaInAcres = convertArea(areaInSqMeters, "meters", "acres");
        return `${Math.round(areaInAcres * 100) / 100} acres`;
      }
      if (selectedFeature.geometry.type === "LineString") {
        const distanceInMiles = length(selectedFeature, { units: "miles" });
        return `${Math.round(distanceInMiles * 100) / 100} miles`;
      }
    }
  };

  const handleClose = () => {
    setDeleteModal(false);
  }

  const showDeleteModal = () => {
    setDeleteModal(true);
  }

  const editShape = () => {
    const { selectedFeature } = props;
    const featureId = selectedFeature.properties.id;
    const featureLabelId = featureId + '_label';
    if (stateApp.draw) {
      selectedFeature.id = `edit_polygon_${selectedFeature.properties.id}`;
      stateApp.draw.add(selectedFeature);
      stateApp.draw.changeMode("direct_select", { featureId: selectedFeature.id });
      const { customLayers } = stateApp;
      if (customLayers && customLayers.length > 0) {
        // const index = customLayers.findIndex(layer => JSON.parse(layer.shape).properties.id === selectedFeature.properties.id);
        const filteredLayers = customLayers.filter(layer => JSON.parse(layer.shape).properties.id !== featureId && JSON.parse(layer.shape).properties.id !== featureLabelId);
        const editingLayers = customLayers.filter(layer => JSON.parse(layer.shape).properties.id === featureId || JSON.parse(layer.shape).properties.id === featureLabelId);
        setCustLayers(customLayers);
        setStateApp({
          ...stateApp,
          customLayers: filteredLayers,
          editingUserDefinedLayers: editingLayers,
          // selectedUserDefinedLayer: selectedFeature,
          editLayer: true,
        });
      }
      props.closeSpatialDataCard();
    }
  }

  return (
    <Card className={classes[cardClass]}>
      <CardHeader
        className={classes.cardHeader}
        classes={{
          title: classes.cardTitle,
          subheader: classes.subheader
        }}
        title="Spatial Data"
        action={
          <div className={classes.actionWrapper}>
            <IconButton color="secondary" onClick={showDeleteModal}>
              <DeleteIcon />
            </IconButton>
            <IconButton color="secondary" onClick={editShape}>
              <EditIcon />
            </IconButton>

            <IconButton color="secondary" onClick={closeSpatialDataCard}>
              <CloseIcon />
            </IconButton>
          </div>
        }
      ></CardHeader>
      <CardActions classes={{ root: classes.cardAction }}>
        {/*Drop-down menu for Boundary Type */}
        <div>
          <FormControl
            required
            variant="outlined"
            className={classes.formControl}
          >
            <InputLabel ref={inputLabel} className={classes.label}> Boundary Type </InputLabel>
            <Select
              value={dataType}
              onChange={evt => setDataType(evt.target.value)}
              labelWidth={labelWidth}
            >
              <MenuItem value="interest">Area of Interest</MenuItem>
              <MenuItem value="parcel">Parcel/Tract</MenuItem>
              {/* {stateApp.currentFeature &&
                stateApp.currentFeature.geometry.type === "Polygon" &&
                !stateApp.currentFeature.properties.isCircle && (
                  <MenuItem value="title">Title Opinion</MenuItem>
                )} */}
            </Select>
          </FormControl>
        </div>
        {(dataType === "interest" || dataType === "parcel") && (
          <div style={{ marginLeft: "0" }}>
            {/* Text Field for Shape Name */}
            <div className={classes.TextField}>
              <TextField
                fullWidth
                variant="outlined"
                label="Name"
                type="text"
                error={showError}
                //placeholder= "Enter Name"
                value={dataName}
                autoComplete="disabled"
                onChange={evt => setDataName(evt.target.value)}
                helperText={showError ? 'Name is required!' : ''}
                required
              ></TextField>
            </div>
            <div className={classes.TextField}>
              <TextField
                fullWidth
                variant="outlined"
                label="Gross Acres"
                type="text"
                //placeholder= "Enter Name"
                value={grossAcres}
                autoComplete="disabled"
                onChange={evt => setGrossAcres(evt.target.value)}
              ></TextField>
            </div>

            {/* <div className={classes.TextField}>
           <TextField
          variant="outlined" 
          label= "Project"
            type="text"
            placeholder="Add Project Name"
            value={dataProject}
            onChange={evt => setDataProject(evt.target.value)}
          ></TextField>
        </div> */}

            {/* Text Field for Acres covered */}
            <div className={classes.TextField}>
              <TextField
                disabled
                autoComplete="disabled"
                variant="outlined"
                label="Calc. Acres"
                fullWidth
                defaultValue={calculateLandArea()}
              ></TextField>
            </div>

            {/* Text Field for Notes*/}
            {/* <div className={classes.TextField}>
              <TextField
                fullWidth
                variant="outlined"
                multiline
                minWidth="100%"
                label="Notes"
                rows="6"
                value={dataNotes}
                onChange={updateDataNotes}
              ></TextField>
            </div> */}
          </div>
        )}
      </CardActions>
      <CardContent className={classes.buttonContainer}>
        {/* save button*/}
        <Button
          variant="contained"
          color="secondary"
          //disableRipple={true}
          //size="medium"
          className={classes.button}
          onClick={saveSpatialData}
          //paddingRight= "6px"
          disabled={dataType === ""}
        >
          {dataType !== "title" ? "Save" : "Next"}
        </Button>

        {/* delete button*/}
        {/* <Button
          variant="contained"
          //disableRipple={true}
          // size="medium"
          className={classes.button}
          style={{ backgroundColor: "light gray", color: "dark gray" }}
          onClick={deleteSpatialData}
        >
          {" "}
          Delete
        </Button> */}
        <Modal
          open = {openDeleteModal}
          onClose = {handleClose}
          aria-labelledby="delete-modal-title"
          aria-describedby="delete-modal-description"
        >
          <div className={classes.modalContainer}>
            <h2 id="delete-modal-title">Are you sure?</h2>
            <p id="delete-modal-description">Are you sure want to remove this shape?</p>
            <div className={classes.buttonContainer} >
              <Button
                variant="contained"
                className={classes.button}
                style={{ backgroundColor: "light gray", color: "dark gray" }}
                onClick={handleClose}
              >
                Back
              </Button>
              <Button
                variant="contained"
                className={classes.button}
                style={{ backgroundColor: "light gray", color: "dark gray" }}
                onClick={deleteSpatialData}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      </CardContent>
    </Card>
  );
}
