import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Checkbox from "@material-ui/core/Checkbox";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import { AppContext } from "AppContext";

import { useMutation } from "@apollo/client";
import { UPDATE_META_DATA } from "graphQL/useMutationUpdateMetaData";

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
  const [stateApp, setStateApp] = useContext(AppContext);
  const { updateColumns, columns, tableColumns } = props;

  const [updateMetaData, {}] = useMutation(UPDATE_META_DATA);

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
              setStateApp((stateApp) => ({
                ...stateApp,
                showFieldModal: true
              }));
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
                  <span style={{ alignSelf: 'center' }} >{col.label}</span>
                  <span style={{ display: 'flex' }}>
                    {tableColumns.find(co => co.name === col.name)?.isCustom && (
                      <IconButton style={{ padding: 6 }} onClick={() => {
                        var element = document.querySelector('[aria-label="Close"]');
                        element.click();
                        setStateApp((stateApp) => ({
                          ...stateApp,
                          selectedMeta: tableColumns.find(co => co.name === col.name),
                          showFieldModal: true
                        }));
                      }}>
                        <EditIcon style={{ alignSelf: 'center', fontSize: 20 }} />
                      </IconButton>
                    )}
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
                        const tableCol = tableColumns.find(co => co.name === col.name)
                        if(tableCol && tableCol.isCustom){
                          updateMetaData({
                            variables: {
                              metaData: {
                                _id: tableCol._id,
                                options: { ...tableCol.options, display: col.display === "true" }
                              },
                            },
                            awaitRefetchQueries: true,
                          });
                        }
                        updateColumns(columns);
                      }}
                      color="primary"
                    />
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default CustomerViewCol;
