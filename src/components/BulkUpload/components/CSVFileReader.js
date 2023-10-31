import React, { useContext, useEffect, useRef } from "react";
import { NavigationContext } from "../../Navigation/NavigationContext";
import { Button, Grid } from "@material-ui/core";
import { CSVReader /* CSVDownloader */ } from "react-papaparse";
import CSVDownloader from "react-csv-downloader";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import { useDispatch } from "react-redux";
import Select from "@material-ui/core/Select";
import { showErrorMessage } from "../../../actions";
import { jobController } from "hookstate/jobStateController";

const useStyles = makeStyles(() => ({
  table: {
    margin: "0px auto",
    fontSize: "14px",
  },
  csvReader: ({ disabled }) => ({
    padding: "14px 0 30px 0",
    margin: "auto",
    maxWidth: 550,
    "&> div": {
      padding: "50px 0 30px 0 !important",
      borderRadius: "0 !important",
      backgroundColor: disabled ? "#f2f2f2" : "transparent",
      cursor: disabled ? "not-allowed" : "default",
    },
  }),
  linkStyle: {
    fontSize: "15px",
    cursor: "pointer",
    "&:hover": {
      textDecorationLine: "underline",
    },
    color: "rgba(23, 170, 221, 1)",
  },
  lightblueBtn: ({ disabled }) => ({
    textTransform: "capitalize !important",
    backgroundColor: disabled ? "gray" : "rgba(23, 170, 221, 1)",
    color: "#fff !important",
  }),
}));

function createData(firstName, lastName, address, city, state, zip, email, phone) {
  return { firstName, lastName, address, city, state, zip, email, phone };
}

const rows = [
  createData("John", "Doe", "708 Main Street", "Houston", "TX", "77002", "john_doe@domain.com", "123-456-7890"),
  createData("John", "Doe", "708 Main Street", "Houston", "TX", "77002", "john_doe@domain.com", "123-456-7890"),
  createData("John", "Doe", "708 Main Street", "Houston", "TX", "77002", "john_doe@domain.com", "123-456-7890"),
  createData("John", "Doe", "708 Main Street", "Houston", "TX", "77002", "john_doe@domain.com", "123-456-7890"),
];

const rowsUpdated = [
  "0315.001.01",
  "",
  "8/1/2022",
  "GAS",
  "0.053711",
  "RO",
  "4.84",
  "79.16",
  "383.51",
  "0.43",
  "0.43",
  "-0.15",
  "SEVERANCE",
  "0",
  "",
  "1.91",
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
  const dispatch = useDispatch();
  const [stateNav] = useContext(NavigationContext);
  const classes = useStyles({ disabled: props.disabled });
  let unmounted = useRef(false);

  const { jobStateValues } = jobController.useState(
    ['m1neralHeaders', 'jobType'],
    'jobStateValues'
  );

  const csvColumns = [Object.fromEntries(jobStateValues.m1neralHeaders.map((col) => [col.label, ""]))];

  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);

  // this function splits an upload array of comma seperated values 
  // it should be used for tag seperation on upload
  const separateValuesWithComas = (data) => {
    if (!Array.isArray(data)) {
      throw new Error('Passed argument is not an Array');
    }
    const newData = [];
    data.forEach((row) => {
      const newRow = {};
      Object.keys(row.data).forEach(key => {
        if (row.data[key]?.includes?.(',') && key === "Tags") {
          newRow[key] = row.data[key].split(',');
        } else {
          newRow[key] = row.data[key]
        }
      })
      newData.push({ ...row, data: newRow, })
    })

    return newData
  }

  let handleOnDrop = (data) => {
    if (!unmounted.current) {
      if (data && data.length <= 10001) {

        data = separateValuesWithComas(data);
        stateNav.bulkUploadFromMap &&
          stateNav.bulkUploadParcel &&
          data.forEach((data) => {
            Object.assign(data.data, {
              ...(stateNav.bulkUploadParcel?.id && { "Parcel Id": stateNav.bulkUploadParcel?.id }),
              ...(stateNav.bulkUploadParcel?.shapeLabel && { "Parcel Name": stateNav.bulkUploadParcel?.shapeLabel }),
            });
          });
        stateNav.bulkUploadFromMap &&
          stateNav.bulkUploadShape &&
          data.forEach((data) => {
            Object.assign(data.data, {
              ...(stateNav.bulkUploadShape?.id && { "Shape Id": stateNav.bulkUploadShape?.id }),
              ...(stateNav.bulkUploadShape?.shapeLabel && { "Shape Name": stateNav.bulkUploadShape?.shapeLabel }),
              ...(stateNav.bulkUploadShape?.shapeType && { "Shape Type": stateNav.bulkUploadShape?.shapeType }),
            });
          });

        if (["TRACTS", "UNITS"].includes(jobStateValues.jobType) === "TRACTS") {
          data.forEach((data) => {
            Object.assign(data.data, {
              ...((data.data["PLSS Township"] || data.data["PLSS Range"]) && {
                "PLSS Township/Range": [data.data["PLSS Township"], data.data["PLSS Range"]].join(" "),
              }),
            });
          });
        }

        mapped_headers_from_CSV(data);
        jobController.updateState({
          csvDataList: data,
        })
        jobController.nextStep()
      } else {
        dispatch(
          showErrorMessage(
            "The file you have uploaded contains more than 10,000 rows of data. Please upload a new file with less than 10,000 rows of data."
          )
        );
      }
    }
  };

  const mapped_headers_from_CSV = (data) => {
    if (data.length > 0) {
      let uniqueKeys = Object.keys(data[0].data);
      let matchedKeys = [...jobStateValues.m1neralHeaders];
      uniqueKeys = [...matchedKeys.filter(mk => !uniqueKeys.includes(mk.label)).map(mk => mk.label), ...uniqueKeys];
      for (let index in uniqueKeys) {
        const matchedKey = matchedKeys.find((el) => el?.label === uniqueKeys[index]);

        uniqueKeys[index] = {
          mapped_key: uniqueKeys[index],
          required: !!matchedKey?.actual_key,
          actual_key: matchedKey?.actual_key || "",
          label: matchedKey?.label || "",
        };

        if (uniqueKeys[index]?.actual_key === matchedKey?.actual_key) {
          matchedKey.mapped_key = uniqueKeys[index].mapped_key;
          matchedKey.required = uniqueKeys[index].required;
        }
      }

      jobController.updateState({
        mappedHeadersFromCSV: uniqueKeys,
        m1neralHeaders: matchedKeys
      })
    }
  };

  let handleOnError = (err, file, inputElem, reason) => {
    if (!unmounted.current) {
    }
  };

  let handleOnRemoveFile = (data) => {
    if (!unmounted.current) {
    }
  };

  return (
    <div style={main_div}>
      {props.selectedJob.name === "Comments Uploader" && (
        <>
          <div style={{ ...big_text, ...padding_div_top }}>Begin by selecting the entity in which the comment should be associated</div>
          <div>
            <Select
              variant="outlined"
              style={{ width: "400px", marginTop: "10px", marginBottom: "10px", height: 40 }}
              native
              labelId="activity-type-label"
              id="activity-type-input"
              value={props.selectedJob.type}
              onChange={(e) => {
                props.setSelectedJob({
                  ...props.selectedJob,
                  type: e.target.value,
                });
              }}
            >
              <option value={"AGREEMENT_COMMENTS"}>Agreement</option>
              <option value={"CONTACT_COMMENTS"}>Contact</option>
              <option value={"TRACT_COMMENTS"}>Tract</option>
            </Select>
          </div>
        </>
      )}
      <div style={{ ...big_text, ...padding_div_top }}>Select a File to Import (Max 10,000 rows)</div>
      <div style={{ ...text_grey, ...padding_div }}>Don't forget to upload CSV with first row containing the column headers</div>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <div className={classes.csvReader}>
            <CSVReader
              onDrop={(csvData) => {
                csvData.forEach(({ data }) => {
                  Object.entries(data).forEach(([key, value]) => {
                    if (typeof value !== 'string') return

                    data[key] = value.replace('@#$%:', '')

                    if (data[key].startsWith('string=')) data[key] = data[key].replace('string=', '')
                  })
                })

                return handleOnDrop(csvData.filter((el) => el.errors.length === 0))
              }}

              onError={handleOnError}
              addRemoveButton
              removeButtonColor="#659cef"
              config={{
                header: true,
                transform: (value, header) => {
                  return (!value || value === "") ? undefined : `@#$%:${value}`;
                },
                dynamicTyping: true,
              }}
              onRemoveFile={handleOnRemoveFile}
              style={upload_box}
              noClick={!!props.disabled}
            >
              <span style={uploadText}>Drop File To Upload or</span>
              <Button className={classes.lightblueBtn} variant="contained">
                Choose File
              </Button>
            </CSVReader>
          </div>
        </Grid>
      </Grid>

      <div style={sample_table_area}>
        <div style={{ ...big_text, ...padding_div_top }}>Preferred File Setup</div>
        <div style={mainContent}>
          <div style={big_grey_text}>You can use any CSV file but leveraging our template will save time mapping column headers</div>
          <CSVDownloader datas={csvColumns} filename={`Sample_${jobStateValues.jobType}_Upload`} type="link" className={classes.linkStyle}>
            Click this link to download sample CSV template
          </CSVDownloader>
        </div>

        <div style={{ ...padding_div_top, ...padding_div_bottom }}>
          {/* <TableContainer component={Paper} style={style_papaer}>
            <Table className={classes.table} aria-label="simple table">
              {props.importType === "" ? (
                <>
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
                        <StyledTableCell align="left">{row.firstName}</StyledTableCell>
                        <StyledTableCell align="left">{row.lastName}</StyledTableCell>
                        <StyledTableCell align="left">{row.address}</StyledTableCell>
                        <StyledTableCell align="left">{row.city}</StyledTableCell>
                        <StyledTableCell align="left">{row.state}</StyledTableCell>
                        <StyledTableCell align="left">{row.zip}</StyledTableCell>
                        <StyledTableCell align="left">{row.email}</StyledTableCell>
                        <StyledTableCell align="left">{row.phone}</StyledTableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </>
              ) : (
                <>
                  <TableHead>
                    <TableRow>
                      {M1neral_headers[props.selectedJob.type]
                        ?.filter((jobKey) => jobKey.showAsSample !== false)
                        .map((jobKeys, index) => (
                          <React.Fragment>
                            <StyledTableCell align="left">{jobKeys.label}</StyledTableCell>
                          </React.Fragment>
                        ))}
                    </TableRow>
                  </TableHead>
                  <TableBody style={table_body}>
                    <TableRow>
                      {rowsUpdated.map((row, i) => (
                        <StyledTableCell key={i + row} align="left">
                          {row}
                        </StyledTableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </>
              )}
            </Table>
          </TableContainer> */}
        </div>

      </div>
    </div>
  );
}
