import React, { useState, Fragment } from "react";
import { FormControl, InputLabel, ListItem, ListItemText, Menu, MenuItem, Select } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/styles";
import AutoCompleteESShapeLayer from "components/Shared/Forms/Fields/AutoCompleteESShapeLayer";

const useStyles = makeStyles({
  selectedType: {
    borderBottom: "4px solid #01B0F0",
    display: "inline",
    cursor: "pointer",
  },
  unSelectedType: {
    display: "inline",
    color: "#827F7F",
    cursor: "pointer",
  },
  inputField: {
    marginTop: '10px',
    padding: '10px',
  },
  dialogFooter: {
    padding: '10px',
    justifyContent: 'end',
    display: 'flex'
  }
});

const OPTIONS = {
  agreement: {
    label: 'Agreement'
  },
  tract: {
    label: 'Tract'
  },
  unit: {
    label: 'Unit'
  },
}

const ShapeTypeMenu = ({ shapeAnchorEl, setShapeAnchorEl, saveAndOpenShapeDetail, updateAndOpenShapeDetail, classes, type }) => {
  const [selectedType, setSelectedType] = useState("new");
  const [selectedShapeType, setSelectedShapeType] = useState('lease');
  const [selectedShape, setSelectedShape] = useState();
  const shapeActionClasses = useStyles();

  return (
    <Fragment>
      <Menu
        id="simple-menu"
        elevation={0}
        getContentAnchorEl={null}
        anchorEl={shapeAnchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          style: {
            marginLeft: '173px',
          },
        }}
        open={Boolean(shapeAnchorEl)}
        onClose={() => setShapeAnchorEl(null)}
        className={classes.parcelPopover}
      >
        <ListItem
          style={{
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "start",
          }}
        >
          <ListItemText>
            <h4
              onClick={() => {
                setSelectedType("new");
              }}
              className={selectedType === "new" ? shapeActionClasses.selectedType : shapeActionClasses.unSelectedType}
            >
              New {OPTIONS[type].label}
            </h4>
            <h4
              onClick={() => {
                setSelectedType("existing");
              }}
              className={selectedType === "existing" ? shapeActionClasses.selectedType : shapeActionClasses.unSelectedType}
              style={{ marginLeft: "20px" }}
            >
              Existing {OPTIONS[type].label}
            </h4>
          </ListItemText>
        </ListItem>
        {
          selectedType === "new" && <>
            <FormControl variant="outlined" fullWidth className={shapeActionClasses.inputField} size="small">
              <InputLabel id={`${type}-outlined-label`}>
              {OPTIONS[type].label} Type
              </InputLabel>
              <Select
                labelId={`${type}-outlined-label`}
                defaultValue={'lease'}
                id={`${type}-outlined`}
                value={selectedShapeType}
                fullWidth
                onChange={(e) => { setSelectedShapeType(e.target.value) }}
                label={`${OPTIONS[type].label} Type`}
              >
                <MenuItem value={"contract"} >Contract</MenuItem>
                <MenuItem value={"deed"} >Deed</MenuItem>
                <MenuItem value={"lease"} >Lease</MenuItem>
                <MenuItem value={"surface"} >Surface/Row</MenuItem>
              </Select>
            </FormControl>
          </>
        }
        {
          selectedType === 'existing' && <>
            <FormControl variant="outlined" fullWidth className={shapeActionClasses.inputField} size="small">
              <AutoCompleteESShapeLayer label={`${OPTIONS[type].label} Search`} filters={[{ "field": "shapeJson.properties.type", "value": type }]} setSelectedShapeLayer={setSelectedShape} />
            </FormControl>
          </>
        }

        <div className={shapeActionClasses.dialogFooter}>
          <Button
            variant="contained"
            color="default"
            size="medium"
            className={classes.footerButton}
            style={{ margin: "0px 15px 0px 0px" }}
            onClick={() => { setShapeAnchorEl(null) }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="primary"
            id="addShapeButton"
            size="medium"
            disabled={selectedType === 'new' ? !selectedType : !selectedShape}
            disableElevation
            onClick={() => {
              selectedType === 'new' ? saveAndOpenShapeDetail(type, selectedShapeType) : updateAndOpenShapeDetail(selectedShape)
            }}
            className={classes.footerButton}
          >
            Add Shape
          </Button>
        </div>
      </Menu>
    </Fragment>
  );
};

export default ShapeTypeMenu;