import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { Table, TableCell, TableBody, FormControl } from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
const tableData = [
  {
    label: 'Unit Name',
    type: 'text',
    key: 'uName'
  },
  {
    label: 'Unit Number',
    type: 'text',
    key: 'uNumber'
  }, {
    label: 'Unit Type',
    type: 'select',
    options: ['Drilling Unit'],
    key: 'uType'
  }, {
    label: 'Unit Status',
    type: 'select',
    options: ['Held by Production'],
    key: 'uStatus'
  }, {
    label: 'Primary Operator',
    type: 'text',
    key: 'uPrimaryOperator'
  }, {
    label: 'Calculated Acres',
    type: 'text',
    key: 'uCalcAcres'
  }, {
    label: 'Field Name',
    type: 'text',
    key: 'uFieldName'
  }, {
    label: 'Unit Acres',
    type: 'number',
    key: 'uUnitAcres'
  }, {
    label: 'Calc. Acres',
    type: 'number',
    key: 'uCalcAcres'
  }, {
    label: 'Net Royality Acres(NRA)',
    type: 'number',
    key: 'uNetRoyalityAcres'
  }, {
    label: 'Unit Depth',
    type: 'number',
    key: 'uDepth'
  }, {
    label: 'Primary Bench',
    type: 'text',
    key: 'uPrimaryBench'
  }, {
    label: 'Unit Pricing(per NRA)',
    type: 'number',
    key: 'uUnitPricing'
  }
]

const useStyles = makeStyles((theme) => ({

  table: {
    width: "100%",
    height: "100%",
    margin: "0px",
    padding: "0px"
    // borderStyle: "none",
  },
  rowGrey: {
    background: "#f7f8f9",
    border: "0px",
  },
  rowWhite: {
    background: "#FFF",
    border: "0px",
  },
  cell1: {
    border: "0px",
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "bolder",
    fontSize: "12px",
    lineHeight: "18px",
    color: "black",
    borderRight: "1px solid rgba(224, 224, 224, 1)"
  },
  cell2: {
    border: "0px",
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 300,
    fontSize: "12px",
    lineHeight: "18px",
    color: "#75767A",
    height: '55px'
  },

  select: {
    '& .MuiOutlinedInput-root': {
      height: '38px'
    }
  },
  foodText: {
    position: "absolute",
    bottom: "20px",
    right: "0px",
    fontSize: "10px",
    color: "#6e6e6e",
    margin: "0 !important",
    textAlign: "right",
    height: "0",
    paddingRight: "10px",
    "& span": {
      fontWeight: "bold",
    },
  }


}));

export default function UnitTableInfo({ updateUnit, unitProperties, setProperties }) {
  const classes = useStyles();
  const [tableDataState, setTableDataState] = useState({});

  return <Table
    className={classes.table}
    size="small"
    aria-label="unit table"
  >
    <TableBody>
      {tableData.map((data, index) => <>
        <TableRow className={index % 2 === 0 ? classes.rowGrey : classes.rowWhite}>
          <TableCell className={classes.cell1} align="left">
            {data.label}
          </TableCell>
          <TableCell className={classes.cell2} align="right">
            {
              tableDataState[data.key] ?
                <>
                  {data.type === 'select' ?
                    <FormControl variant="outlined">
                      <Select
                        className={classes.select}
                        fullWidth
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={unitProperties[data.key]}
                        onChange={(e) => {
                          e.keyCode = 13
                          setProperties({ ...unitProperties, [data.key]: e.target.value });
                          updateUnit(e, data.key, e.target.value);
                        }}
                      >
                        {data.options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                      </Select>
                    </FormControl> : <TextField
                      size="small"
                      type={data.type}
                      value={unitProperties[data.key]}
                      variant="outlined"
                      onChange={(e) => {
                        setProperties({ ...unitProperties, [data.key]: e.target.value });
                      }}
                      onKeyDown={(e) => {
                        updateUnit(e, data.key, unitProperties[data.key]);
                      }}
                      onFocus={() => { setTableDataState({ [data.key]: true }) }}
                      onBlur={() => { setTableDataState({ [data.key]: false }) }}
                      InputProps={{
                        endAdornment: (tableDataState[data.key] === true &&
                          <p className={classes.foodText}>
                            <span>Return</span> to save
                          </p>)
                      }}
                      fullWidth
                    />}
                </> :
                <div style={{ minWidth: '30px', cursor: "pointer" }} onClick={() => { setTableDataState({ [data.key]: true }) }}>
                  {unitProperties[data.key] || '-'}
                </div>
            }
          </TableCell>
        </TableRow>
      </>
      )}
    </TableBody>
  </Table>

}
