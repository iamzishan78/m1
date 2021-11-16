import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "15px 20px",
    width: "300px",
  },
  columnLabel: {
    color: "#929292",
    marginTop: 5,
  },
  addField: {
    color: "#929292",
    marginTop: 15,
    float: "right",
    display: "flex",
    cursor: "pointer",
  },
  addIcon: {
    fontSize: "18px",
    marginTop: -1,
  },
  f13: {
    fontSize: "13px",
  },
  columnContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

const CustomerViewCol = (props) => {
  const classes = useStyles();
  const { updateColumns, columns, setShowFieldModal } = props;
  return (
    <>
      <div className={classes.container}>
        <div className={classes.columnLabel}>Columns</div>
        <div>
          <div
            className={classes.addField}
            onClick={() => {
              var element = document.querySelector('[aria-label="Close"]');
              element.click();
              setShowFieldModal(true);
            }}
          >
            <AddIcon className={classes.addIcon} />{" "}
            <span className={classes.f13}>Add field</span>
          </div>
        </div>
        <div style={{ marginTop: 40 }}>
          {columns
            .filter((col) => col.viewColumns)
            .map((col) => {
              return (
                <div key={col.name} className={classes.columnContainer}>
                  <span>{col.label}</span>
                  <Checkbox
                    style={{ padding: 3 }}
                    checked={col.display === "true"}
                    onChange={(e) => {
                      const index = columns.findIndex(
                        (co) => co.name === col.name
                      );
                      col.display === "false"
                        ? (columns[index].display = "true")
                        : (columns[index].display = "false");
                      updateColumns(columns);
                    }}
                    color="primary"
                  />
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default CustomerViewCol;
