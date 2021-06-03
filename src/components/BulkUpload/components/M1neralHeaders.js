import React, { useEffect } from "react";
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

export default function M1neralHeaders(props) {
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
  const handleChange_select = (event, index) => {
    CSV_headers[index].actual_key = data[event.target.value].actual_key;
    CSV_headers[index].label = data[event.target.value].label;
    CSV_headers[index].required = true;
    changeDataToSendState();
    UpdateState();
  };
  const handleChange_checkBox = (event, index) => {
    CSV_headers[index].required = event.target.checked;
    changeDataToSendState();
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

  const changeDataToSendState = () => {
    let headers = stateApp.mappedHeadersFromCSV;
    let arr_data = stateApp.csvContactsList;

    let filtered_data_to_send = arr_data.map((obj) => {
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
      if (
        return_obj === {} ||
        !(
          return_obj["firstName"] ||
          return_obj["lastName"] ||
          return_obj["name"]
        )
      ) {
        return null;
      }
      //// mandatory fields

      if (!return_obj["leadSource"])
        return_obj["leadSource"] = createLeadSource();

      if (!return_obj["name"]) {
        return_obj["name"] = "";
        if (return_obj["firstName"] && return_obj["lastName"]) {
          return_obj["name"] =
            return_obj["firstName"] + " " + return_obj["lastName"];
        } else {
          if (return_obj["firstName"]) {
            return_obj["name"] = return_obj["firstName"];
          }
          if (return_obj["lastName"]) {
            return_obj["name"] = return_obj["lastName"];
          }
        }
      }

      return return_obj;
    });
    filtered_data_to_send = filtered_data_to_send.filter((obj) => {
      if (obj && Object.keys(obj).length !== 0) {
        return true;
      }
      return false;
    });

    setStateApp((state) => ({
      ...state,
      csvContactsListToSend: filtered_data_to_send,
    }));
  };

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
            <Table stickyHeader aria-label="sticky table">
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
                              const matchedKeyIndex = data.findIndex(el => el?.actual_key === row?.actual_key)
                              return row.actual_key === "" 
                                ? "initial"
                                : matchedKeyIndex
                            })()}
                            onChange={(event) =>
                              handleChange_select(event, index)
                            }
                          >
                            <option disabled hidden value="initial">
                              {" "}
                              Select Header{" "}
                            </option>
                            {data.map((option, i) => {
                              return (
                                <option value={i} key={i}>
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
        <div style={{ ...text_grey }}>
          *First Name or Last Name is required to be mapped <br /> before
          uploading contacts.
        </div>
      </div>
    </div>
  );
}
