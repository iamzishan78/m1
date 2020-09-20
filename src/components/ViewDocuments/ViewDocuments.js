import React, { useEffect, useState } from "react";
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
  Icon,
  Typography,
  OutlinedInput,
  TextField,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import DeleteIcon from "@material-ui/icons/Delete";
import GetAppIcon from "@material-ui/icons/GetApp";
import DeleteDocumentConfirmation from "../Shared/DeleteDocumentConfirmation";

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
    alignSelf: "center",
  },
  greySquare: {
    cursor: "pointer",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#999",
    fontSize: "30px",
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

const docs = [
  { title: "Test Upload1.pdf" },
  { title: "Test Upload2.pdf" },
  { title: "Test Upload3.pdf" },
  { title: "Test Upload4.pdf" },
  { title: "Test Upload5.pdf" },
];

export default function ViewDocuments(props) {
  const classes = useStyles();
  const [documentSearch, setDocumentSearch] = useState("");
  const [allDocuments, setAllDocuments] = useState(docs);
  const [filteredDocuments, setFilteredDocuments] = useState([]);

  useEffect(() => {
    // Search logic (Search on change in search field text)
    let filtered = allDocuments.filter((doc) =>
      doc.title.toLowerCase().includes(documentSearch.toLowerCase())
    );
    setFilteredDocuments(filtered);
  }, [documentSearch, allDocuments]);

  return (
    <div className={classes.viewAllCard}>
      <div className={classes.header}>
        <div className={classes.headerLeft}>
          <TextField
            fullWidth
            value={documentSearch}
            onChange={(e) => setDocumentSearch(e.target.value)}
            variant="outlined"
            label={"Search Documents"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            labelWidth={70}
          />
        </div>
      </div>
      <div className={classes.divider} />

      <ul className={classes.documentsList}>
        {filteredDocuments.map((doc) => (
          <li className={classes.document} key={doc.title}>
            <div className={classes.documentLeft}>
              <div
                className={classes.greySquare}
                onClick={props.downloadDocument}
              >
                <GetAppIcon fontSize="large" />
              </div>
              <div className={classes.fileText}>
                <h4 className={classes.uploadTitle}>{doc.title}</h4>
                <h5 className={classes.uploadSubtext}>Kyle Chapman</h5>
                <h5 className={classes.uploadSubtext}>July 04, 2020</h5>
              </div>
            </div>
            <div className={classes.documentRight}>
              <IconButton
                style={{ marginBottom: "8px" }}
                onClick={props.handleOpen}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          </li>
        ))}
      </ul>
      {/* <DeleteDocumentConfirmation
        open={props.open}
        handleClose={props.handleClose}
        handleAccept={props.handleAccept}
      /> */}
    </div>
  );
}
