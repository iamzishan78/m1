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

const AgreementTypeMenu = ({ agreementAnchorEl, setAgreementAnchorEl, saveAndOpenShapeDetail, updateAndOpenShapeDetail, classes }) => {
  const [selectedType, setSelectedType] = useState("new");
  const [selectedShapeType, setSelectedShapeType] = useState('lease');
  const [selectedAgreement, setSelectedAgreement] = useState();
  const shapeActionClasses = useStyles();

  return (
    <Fragment>
      <Menu
        id="simple-menu"
        elevation={0}
        getContentAnchorEl={null}
        anchorEl={agreementAnchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          style: {
            marginLeft: '173px',
          },
        }}
        open={Boolean(agreementAnchorEl)}
        onClose={() => setAgreementAnchorEl(null)}
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
              New Agreement
            </h4>
            <h4
              onClick={() => {
                setSelectedType("existing");
              }}
              className={selectedType === "existing" ? shapeActionClasses.selectedType : shapeActionClasses.unSelectedType}
              style={{ marginLeft: "20px" }}
            >
              Existing Agreement
            </h4>
          </ListItemText>
        </ListItem>
        {
          selectedType === "new" && <>
            <FormControl variant="outlined" fullWidth className={shapeActionClasses.inputField} size="small">
              <InputLabel id="agreement-outlined-label">
                Agreement Type
              </InputLabel>
              <Select
                labelId="agreement-outlined-label"
                defaultValue={'lease'}
                id="agreement-outlined"
                value={selectedShapeType}
                fullWidth
                onChange={(e) => { setSelectedShapeType(e.target.value) }}
                label="Agreement Type"
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
              <AutoCompleteESShapeLayer label='Agreement Search' filters={[{ "field": "shapeJson.properties.type", "value": 'agreement' }]} setSelectedShapeLayer={setSelectedAgreement} />
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
            onClick={() => { setAgreementAnchorEl(null) }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="primary"
            id="addShapeButton"
            size="medium"
            disabled={selectedType === 'new' ? !selectedType : !selectedAgreement}
            disableElevation
            onClick={() => {
              selectedType === 'new' ? saveAndOpenShapeDetail("agreement", selectedShapeType) : updateAndOpenShapeDetail(selectedAgreement)
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

export default AgreementTypeMenu;