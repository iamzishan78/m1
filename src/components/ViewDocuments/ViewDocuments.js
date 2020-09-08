import React, { useState } from "react";
// import MUIDataTable from "mui-datatables";
import { makeStyles } from "@material-ui/core/styles";
import {
  MenuItem,
  Checkbox,
  Select,
  InputLabel,
  Grid,
  Button,
  FormControl,
  Typography,
  OutlinedInput,
  InputAdornment,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  viewAllCard: {
    backgroundColor: "#ffffff",
  },
  header: {
    margin: "30px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerLeft: {
    flex: 3,
  },
  headerRight: {
    flex: 1,
    textAlign: "right",
    alignSelf: "center",
    margin: "0",
    color: "#757575",
    fontWeight: "normal",
  },
  divider: {
    height: "2px",
    backgroundColor: "#cecece",
    margin: "0px 30px 15px 30px",
  },
  documentsList: {
    padding: 0,
    margin: "0 30px",
  },
  document: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: "20px",
    paddingTop: "20px",
    borderBottom: "1px solid #cecece",
  },
  documentLeft: {
    display: "flex",
    flexDirection: "row",
  },
  documentRight: {
    textAlign: "right",
    alignSelf: "center",
    color: "rgb(176, 176, 176)",
    margin: "0",
    fontWeight: "normal",
  },
  greySquare: {
    borderRadius: "12px",
    display: "block",
    height: "80px",
    width: "80px",
    backgroundColor: "#cecece",
  },
  fileText: {
    marginLeft: "20px",
    alignSelf: "center",
  },
  uploadTitle: {
    margin: "0",
    color: "#757575",
    fontWeight: "normal",
    marginBottom: "8px",
  },
  uploadSubtext: {
    color: "rgb(176, 176, 176)",
    margin: "0",
    fontWeight: "normal",
  },
}));

export default function ViewDocuments() {
  const classes = useStyles();
  const [documentSearch, setDocumentSearch] = useState("");

  return (
    <div className={classes.viewAllCard}>
      <div className={classes.header}>
        <div className={classes.headerLeft}>
          <FormControl fullWidth className={classes.margin} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-amount">
              Search Documents
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              value={documentSearch}
              onChange={(e) => setDocumentSearch(e.target.value)}
              label={"Search Documents"}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
              labelWidth={70}
            />
          </FormControl>
        </div>

        <h3 className={classes.headerRight}>Date</h3>
      </div>
      <div className={classes.divider} />

      <ul className={classes.documentsList}>
        {[1, 2, 3, 4, 5].map((doc) => (
          <li className={classes.document} key={doc}>
            <div className={classes.documentLeft}>
              <div className={classes.greySquare} />
              <div className={classes.fileText}>
                <h4 className={classes.uploadTitle}>Testupload.pdf</h4>
                <h5 className={classes.uploadSubtext}>Kyle Chapman</h5>
              </div>
            </div>
            <h5 className={classes.documentRight}>July 04, 2020</h5>
          </li>
        ))}
      </ul>
    </div>
  );
}
