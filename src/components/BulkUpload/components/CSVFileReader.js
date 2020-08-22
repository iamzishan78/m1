import React, { useContext, useEffect, useRef } from "react";
import { AppContext } from "../../../AppContext";
import { Button, Grid } from "@material-ui/core";

import { CSVReader } from "react-papaparse";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
  table: {
    margin: "0px auto",
    fontSize: "14px",
  },
  csvReader: {
    padding: "14px 0 30px 0",
    margin: "auto",
    maxWidth: 550,
    "&> div": {
      padding: "50px 0 30px 0 !important",
      borderRadius: "0 !important",
    },
  },
});

function createData(
  first_name,
  last_name,
  address,
  city,
  state,
  zip,
  email,
  phone
) {
  return { first_name, last_name, address, city, state, zip, email, phone };
}

const rows = [
  createData(
    "John",
    "Doe",
    "708 Main Street",
    "Houston",
    "TX",
    "77002",
    "john_doe@domain.com",
    "123-456-7890"
  ),
  createData(
    "John",
    "Doe",
    "708 Main Street",
    "Houston",
    "TX",
    "77002",
    "john_doe@domain.com",
    "123-456-7890"
  ),
  createData(
    "John",
    "Doe",
    "708 Main Street",
    "Houston",
    "TX",
    "77002",
    "john_doe@domain.com",
    "123-456-7890"
  ),
  createData(
    "John",
    "Doe",
    "708 Main Street",
    "Houston",
    "TX",
    "77002",
    "john_doe@domain.com",
    "123-456-7890"
  ),
];

const main_div = {
  textAlign: "center",
  padding: "10px 12%",
};
const upload_box = {
  margin: "0 auto",
  width: "100%",
  borderRadius: "0",
  padding: "60px 0",
};

const big_text = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#101010",
};
const small_grey_text = {
  fontSize: "10px",
  fontWeight: "bold",
  color: "#a6a6a6",
};
const big_grey_text = {
  fontSize: "15px",
  color: "#a6a6a6",
};
const padding_div_top = {
  paddingTop: "3vh",
};
const padding_div_bottom = {
  paddingBottom: "3vh",
};
const padding_div = {
  padding: "16px 0",
};
const padidng_20 = {
  padding: "60px 0",
};
const normal_padidng = {
  padding: "5vh",
};
const text_grey = {
  fontSize: "13px",
  fontWeight: "bold",
  color: "#a6a6a6",
};
const sample_table_area = {
  background: "#f7f7f7",
  margin: "0px auto",
  width: "100%",
};
const table_body = {
  background: "white",
};
const style_papaer = {
  background: "none",
  width: "90%",
  margin: "0px auto",
};
const uploadText = {
  paddingBottom: "8px",
  color: "#a6a6a6",
};
const linkContent = {
  fontSize: "15px",
  textDecorationLine: "none",
  color: "rgba(23, 170, 221, 1)",
};
const mainContent = {
  padding: "14px 0px 0px  0px",
};

const StyledTableCell = withStyles((theme) => ({
  head: {
    fontWeight: "bold",
    border: "1px solid grey",
    fontSize: "12px",
    padding: "2px 16px",
  },
  body: {
    border: "1px solid grey",
    fontSize: "12px",
    padding: "2px 16px",
  },
}))(TableCell);

export default function CSVFileReader(props) {
  let [stateApp, setStateApp] = useContext(AppContext);
  const classes = useStyles();
  let unmounted = useRef(false);

  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);

  let handleOnDrop = (data) => {
    if (!unmounted.current) {
      mapped_headers_from_CSV(data);
      setStateApp((state) => ({
        ...state,
        csvContactsList: data,
        activeStepNumber: stateApp.activeStepNumber + 1,
      }));
    }
  };

  const mapped_headers_from_CSV = (data) => {
    if (data.length > 0) {
      var uniqueKeys = Object.keys(data[0].data);
      // uniqueKeys = uniqueKeys.sort();
      for (let index in uniqueKeys) {
        uniqueKeys[index] = {
          mapped_key: uniqueKeys[index],
          required: false,
          actual_key: "",
          label: "",
        };
      }
      setStateApp((state) => ({ ...state, mappedHeadersFromCSV: uniqueKeys }));
    }
  };

  let handleOnError = (err, file, inputElem, reason) => {
    if (!unmounted.current) {
      console.log(err);
    }
  };

  let handleOnRemoveFile = (data) => {
    if (!unmounted.current) {
      console.log(data);
    }
  };

  return (
    <div style={main_div}>
      <div style={{ ...big_text, ...padding_div_top }}>
        Select a File to Import
      </div>
      <div style={{ ...text_grey, ...padding_div }}>
        Don't forget to upload CSV with first row containing the column headers
      </div>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <div className={classes.csvReader}>
            <CSVReader
              onDrop={handleOnDrop}
              onError={handleOnError}
              addRemoveButton
              removeButtonColor="#659cef"
              config={{
                header: true,
              }}
              onRemoveFile={handleOnRemoveFile}
              style={upload_box}
            >
              <span style={uploadText}>Drop File To Upload or</span>
              <Button className="lightblueBtn" variant="contained">
                Choose File
              </Button>
            </CSVReader>
          </div>
        </Grid>
      </Grid>

      <div style={sample_table_area}>
        <div style={{ ...big_text, ...padding_div_top }}>
          Preferred File Setup
        </div>
        <div style={mainContent}>
          <div style={big_grey_text}>
            A CSV with these columns will yield good results
          </div>
          <a
            href="#"
            style={linkContent}
            onClick={() => {
              return false;
            }}
          >
            Download sample CSV template and then upload with your information
          </a>
        </div>
        <div style={{ ...padding_div_top, ...padding_div_bottom }}>
          <TableContainer component={Paper} style={style_papaer}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="left">First Name</StyledTableCell>
                  <StyledTableCell align="left">Last Name</StyledTableCell>
                  <StyledTableCell align="left">Street Address</StyledTableCell>
                  <StyledTableCell align="left">City</StyledTableCell>
                  <StyledTableCell align="left">State</StyledTableCell>
                  <StyledTableCell align="left">Zip</StyledTableCell>
                  <StyledTableCell align="left">Email</StyledTableCell>
                  <StyledTableCell align="left">Phone Number</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody style={table_body}>
                {rows.map((row, i) => (
                  <TableRow key={i + row.first_name}>
                    <StyledTableCell align="left">
                      {row.first_name}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {row.last_name}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {row.address}
                    </StyledTableCell>
                    <StyledTableCell align="left">{row.city}</StyledTableCell>
                    <StyledTableCell align="left">{row.state}</StyledTableCell>
                    <StyledTableCell align="left">{row.zip}</StyledTableCell>
                    <StyledTableCell align="left">{row.email}</StyledTableCell>
                    <StyledTableCell align="left">{row.phone}</StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}
