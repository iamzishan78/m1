import React, { useEffect, useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Checkbox from "@material-ui/core/Checkbox";
import { AppContext } from "../../../AppContext";
import { anyToDate } from "@amcharts/amcharts4/.internal/core/utils/Utils";
// queries
import { MenuItem, Select } from "@material-ui/core";
// import { GET_ES_SIMPLE_SEARCH } from "graphQL/useQueryESSimpleSearch";
// import { GET_ES_PAGINATED_LIST } from "graphQL/useQueryESPaginatedList";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: "50vh",
    overflow: "scroll",
    overflowX: "hidden",
    "&::-webkit-scrollbar": {
      width: "0.75em",
      height: "0.75em",
    },
    // "&:hover::-webkit-scrollbar": {
    //     width: "1.0em",
    // },
    // "&::-webkit-scrollbar-track": {
    //     "-webkitBoxShadow": "inset 0 0 6px rgba(0,0,0,0.00)",
    // },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#929292",
      borderRadius: 10,
    },
  },
});
const main_div = {
  textAlign: "center",
  padding: "1.5vh",
};
const style_papaer = {
  background: "none",
  maxWidth: "550px",
  margin: "15px auto",
  boxShadow: "none",
};
const table_cell_input = {
  padding: "3px",
};
const big_text = {
  fontSize: "27px",
  fontWeight: "bold",
  color: "#101010",
};
const medium_text = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#101010",
};
const padding_div_top = {
  paddingTop: "1.3vh",
};
const text_grey = {
  fontSize: "15px",
  fontWeight: "bold",
  color: "#a6a6a6",
};

const headers_input = {
  width: "100%",
  borderRadius: "5px",
  border: "1px solid rgb(255 255 255)",
  height: "4vh",
  background: "unset",
  padding: "0 8px",
  color: "#a6a6a6",
};

const StyledTableCell = withStyles((theme) => ({
  head: {
    fontWeight: "bold",
    border: "1px solid #ddd",
    padding: "8px 15px",
    color: "#a6a6a6",
    // background: "white",
  },
  body: {
    fontWeight: "bold",
    border: "1px solid #ddd",
    padding: "0px 15px",
    color: "#a6a6a6",
    "& .MuiIconButton-root.Mui-disabled": {
      color: "rgb(0 0 0 / 6%) !important",
    },
  },
}))(TableCell);

export default function M1neralHeaders() {
  const classes = useStyles();
  const [stateApp, setStateApp] = React.useContext(AppContext);

  let columns = [
    { label: "Import" },
    { label: "Your Headers" },
    { label: "M1neral Headers" },
  ];
  let data = stateApp.m1neralHeaders;
  let CSV_headers = stateApp.mappedHeadersFromCSV;

  // let options_from_list = options()
  const UpdateState = () => {
    for (let index in CSV_headers) {
      for (let index2 in data) {
        if (CSV_headers[index].actual_key === data[index2].actual_key) {
          data[index2].mapped_key = CSV_headers[index].mapped_key;
          data[index2].required = CSV_headers[index].required;
        }
      }
    }
    setStateApp((state) => ({
      ...state,
      m1neralHeaders: data,
      mappedHeadersFromCSV: CSV_headers,
    }));
  };

  const handleChange_select = async (event, index) => {
    const selectedHeader = data.find(el => el?.actual_key === event.target.value)
    CSV_headers[index].actual_key = selectedHeader?.actual_key;
    CSV_headers[index].label = selectedHeader?.label;
    CSV_headers[index].required = true;
    await changeDataToSendState();
    UpdateState();
  };

  const handleChange_checkBox = async (event, index) => {
    CSV_headers[index].required = event.target.checked;
    await changeDataToSendState();
    UpdateState();
  };

  const createLeadSource = () => {
    var newDate = new Date().toISOString();
    // newDate = newDate.split("T")[0];
    // newDate = newDate.split("-").reverse().join(".");

    newDate = anyToDate(newDate).toLocaleString("en-US", {
      year: "numeric",
      day: "numeric",
      month: "numeric",
    });

    let leadSource = "Manual Upload on " + newDate;
    return leadSource;
  };

  const changeDataToSendState = async () => {
    let headers = stateApp.mappedHeadersFromCSV;
    let arr_data = stateApp.csvDataList;
    let filtered_data_to_send = [];
    for await (const obj of arr_data) {
      let return_obj = {};
      for (let header of headers) {
        if (
          header.required &&
          obj.data[header.mapped_key] !== undefined &&
          header.mapped_key !== "initial"
        ) {
          return_obj[header.actual_key] = obj.data[header.mapped_key];
        }
      }
      if (['PROPERTIES'].includes(stateApp.jobType)) {
        Object.keys(return_obj).forEach(key => {
          if (return_obj[key] instanceof Date) {
            return_obj[key] = return_obj[key].toISOString()
          }
          if (key === 'wellsApiNumbers' && typeof return_obj[key] === 'number') {
            return_obj[key] = return_obj[key].toString()
          }
        })
      }
      if (['PARCELINTERESTS'].includes(stateApp.jobType)) {
        if (!return_obj["parcel._id"] ||
          !return_obj["parcel.name"]) {
          filtered_data_to_send.push(null)
          continue;
        }
      }
      if (['SHAPEOWNER'].includes(stateApp.jobType)) {
        if (!return_obj["shape._id"] ||
          !return_obj["shape.name"]) {
          filtered_data_to_send.push(null)
          continue;
        }
      }
      if (['CONTACTS', 'PARCELINTERESTS', 'SHAPEOWNER'].includes(stateApp.jobType)) {
        if (
          return_obj === {} ||
          !(
            return_obj["_id"] ||
            return_obj["entityDetail.firstName"] ||
            return_obj["entityDetail.lastName"] ||
            return_obj["entityDetail.name"]
          )
        ) {
          filtered_data_to_send.push(null)
          continue;
        }
        //// mandatory fields

        if (!return_obj["leadSource"])
          return_obj["leadSource"] = createLeadSource();
        if (!return_obj["status"])
          return_obj["status"] = "Lead";

        if (!return_obj["entityDetail.name"]) {
          if (return_obj["entityDetail.firstName"] && return_obj["entityDetail.lastName"]) {
            return_obj["entityDetail.name"] =
              return_obj["entityDetail.firstName"] + " " + return_obj["entityDetail.lastName"];
          } else {
            if (return_obj["entityDetail.firstName"]) {
              return_obj["entityDetail.name"] = return_obj["entityDetail.firstName"];
            }
            if (return_obj["entityDetail.lastName"]) {
              return_obj["entityDetail.name"] = return_obj["entityDetail.lastName"];
            }
          }
        }
      }

      filtered_data_to_send.push(return_obj)
    };
    filtered_data_to_send = filtered_data_to_send.filter((obj) => {
      if (obj && Object.keys(obj).length !== 0) {
        return true;
      }
      return false;
    });

    setStateApp((state) => ({
      ...state,
      csvDataToSend: filtered_data_to_send,
    }));
  };

  const shapeTransferOptions = [
    { key: 'Both', label: 'Create new and update existing' },
    { key: 'New', label: 'Only create new' },
    { key: 'Existing', label: 'Only update existing' }
  ]

  useEffect(() => {
    changeDataToSendState();
  }, []);

  return (
    <div style={main_div}>
      <div style={{ ...big_text, ...padding_div_top }}>
        Match your headers to M1neral headers
      </div>
      <div style={{ ...text_grey, ...padding_div_top }}>
        Select the M1neral header that best represents the headers from your
        file
      </div>
      <div style={padding_div_top}>
        <Paper className={classes.root} style={style_papaer}>
          <TableContainer className={classes.container}>
            <Table id="headerTable" stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <StyledTableCell key={column.label}>
                      {column.label}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {CSV_headers.map((row, index) => {
                  return (
                    <TableRow key={index}>
                      <StyledTableCell key={columns[0].label}>
                        <Checkbox
                          id={`checkbox-${index}`}
                          disabled={row.actual_key === "" ? true : false}
                          checked={row.required}
                          color="default"
                          onChange={(event) =>
                            handleChange_checkBox(event, index)
                          }
                          inputProps={{
                            "aria-label": "checkbox with default color",
                          }}
                        />
                      </StyledTableCell>
                      <StyledTableCell key={columns[1].label}>
                        {row.mapped_key}
                      </StyledTableCell>
                      <StyledTableCell
                        key={columns[2].label}
                        style={table_cell_input}
                      >
                        <div>
                          <select
                            style={headers_input}
                            id={"select" + index}
                            defaultValue={(() => {
                              const matchedKeyIndex = data.find(el => el?.actual_key === row?.actual_key)
                              return row.actual_key === ""
                                ? "initial"
                                : matchedKeyIndex?.actual_key
                            })()}
                            onChange={(event) =>
                              handleChange_select(event, index)
                            }
                          >
                            <option disabled hidden value="initial">
                              {" "}
                              Select Header{" "}
                            </option>
                            {[...data].sort((a, b) => a.label.toUpperCase() < b.label.toUpperCase() ? -1 : 1)
                              .map((option, i) => {
                                return (
                                  <option value={option.actual_key} key={i}>
                                    {(() => {
                                      return option.label
                                    })()}
                                  </option>
                                );
                              })}
                          </select>
                        </div>
                      </StyledTableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {['AGREEMENT_HEADER', 'SHAPE_TO_M1_LAYER', 'UNITS'].includes(stateApp.jobType) ?
          (
            <>
              <div style={{ ...medium_text, ...padding_div_top }}>
                Select an import option for your data
              </div>
              <div >
                <Select
                  variant='outlined'
                  style={{ width: '400px', marginTop: '10px', marginBottom: '10px', height: 40 }}
                  labelId="agreement-outlined-label"
                  id="agreement-outlined"
                  value={stateApp.selectedShapeLayerOption}
                  dense
                  fullWidth
                  onChange={(e) => {
                    setStateApp((state) => ({ ...state, selectedShapeLayerOption: e.target.value }));
                  }}
                >
                  {shapeTransferOptions.map((option) => <MenuItem id={`${option.label}`} style={{ display: stateApp.selectedShapeLayerOption === option ? 'none' : 'inherit' }} value={option.key} >{option.label}</MenuItem>)}
                </Select>
              </div>

              {stateApp.jobType !== 'UNITS' && (
                <div style={{ ...text_grey }}>
                  *Note: Existing {stateApp?.transferData?.selectedPlatformCategory?.label} will be matched on M1neral ID{stateApp?.transferData?.selectedPlatformCategory?.label === "Agreements" && ' or Agreement Number'}
                </div>
              )}

            </>

          ) : ['AGREEMENT_PROVISIONS'].includes(stateApp.jobType) ? (
            <>
              <div style={{ ...medium_text, ...padding_div_top }}>
                Select an import option for your data
              </div>
              <div >
                <Select
                  variant='outlined'
                  style={{ width: '400px', marginTop: '10px', marginBottom: '10px', height: 40 }}
                  labelId="agreement-outlined-label"
                  id="agreement-outlined"
                  value={stateApp.selectedShapeLayerOption}
                  dense
                  fullWidth
                  onChange={(e) => { setStateApp((state) => ({ ...state, selectedShapeLayerOption: e.target.value })); }}
                >
                  {shapeTransferOptions.map((option) => <MenuItem id={`${option.label}`} style={{ display: stateApp.selectedShapeLayerOption === option ? 'none' : 'inherit' }} value={option.key} >{option.label}</MenuItem>)}
                </Select>
              </div>

              <div style={{ ...text_grey }}>
                *Note: Existing agreements will be matched on M1neral ID or Agreement Number
              </div>

            </>
          ) : ['AGREEMENT_COMMENTS'].includes(stateApp.jobType) ? (
            <div>
              * Comment will be tied to agreement when match on Agreement System ID or Agreement Number is made
            </div>
          ) : !['CHECKDETAILS'].includes(stateApp.jobType) && (
            <div style={{ ...text_grey }}>
              *First Name or Last Name is required to be mapped <br /> before
              uploading contacts.
            </div>
          )
        }
      </div>
    </div>
  );
}
