import React, { memo, useCallback, useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Checkbox from "@material-ui/core/Checkbox";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import { AppContext } from "AppContext";

import { useMutation } from "@apollo/client";
import { UPDATE_META_DATA } from "graphQL/useMutationUpdateMetaData";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import {
  SortableContainer,
  SortableElement,
  sortableHandle,
} from "react-sortable-hoc";
import { findInFunction } from "utils/helper";
import { arrayMoveImmutable } from "array-move";
import { setStateIfDeepEqual } from "components/Shared/functions";

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
}));

const CustomerViewCol = (props) => {
  const classes = useStyles();
  const { setStateApp } = props

  const { updateColumns, onColumnUpdate, columns, tableColumns, updateColumnSorting, selectedGridView } = props;
  const [items, Items] = useState([]);
  const setItems = (newState) => { setStateIfDeepEqual(Items, newState); };

  const [updateMetaData, { }] = useMutation(UPDATE_META_DATA);

  useEffect(() => {
    setItems(columns.filter((col) => col.viewColumns))
  }, [columns])

  return (
    <>
      <div className={classes.container} id="customViewColumns">
        <div className={classes.columnLabel}>Columns</div>
        <div>
          <div
            className={classes.addField}
            onClick={() => {
              var element = document.querySelector('[aria-label="Close"]');
              element.click();
              setStateApp((stateApp) => ({
                ...stateApp,
                showFieldModal: true,
              }));
            }}
          >
            <AddIcon className={classes.addIcon} />{" "}
            <span className={classes.f13}>Add field</span>
          </div>
        </div>
        <div style={{ marginTop: 40 }}>
          <SortableComponent
            items={items}
            selectedGridView={selectedGridView}
            tableColumns={tableColumns}
            updateColumns={updateColumns}
            onColumnUpdate={onColumnUpdate}
            updateMetaData={updateMetaData}
            columns={columns}
            updateColumnSorting={updateColumnSorting}
            setItems={(value) => {
              setItems(value)
              const stickyColumns = columns.filter(column => column.setCellProps && findInFunction("sticky", column.setCellProps))
              updateColumnSorting(stickyColumns.concat(value))
            }}
          />
        </div>
      </div>
    </>
  );
};
const MemoCustomerViewCol = memo(CustomerViewCol)

export const CustomerViewColContainer = (props) => {
  const [, setStateApp] = useContext(AppContext);
  const setStateAppCallback = useCallback(setStateApp, [setStateApp])

  return <MemoCustomerViewCol {...props} setStateApp={setStateAppCallback} />
}

const useSortableStyles = makeStyles((theme) => ({
  itemContainer: {
    width: "100%",
    display: "flex",
    padding: "10px 0px",
    justifyContent: "space-between",
    borderBottom: "1px solid #EEF1F4",
    "& .MuiInputBase-input": {
      padding: "0 !important",
      fontSize: "15px",
    },
  },
}));

const SortableComponent = ({
  setItems,
  tableColumns,
  columns,
  onColumnUpdate,
  selectedGridView,
  updateColumnSorting,
  updateColumns,
  updateMetaData,
  items,
}) => {
  const onSortEnd = ({ oldIndex, newIndex }) => {
    setItems(arrayMoveImmutable(items, oldIndex, newIndex));
  };

  return (
    <>
      <SortableList
        setItems={setItems}
        items={items}
        columns={columns}
        onColumnUpdate={onColumnUpdate}
        selectedGridView={selectedGridView}
        updateColumnSorting={updateColumnSorting}
        tableColumns={tableColumns}
        updateColumns={updateColumns}
        updateMetaData={updateMetaData}
        onSortEnd={onSortEnd}
        useDragHandle
      />
    </>
  );
};

const SortableList = SortableContainer(
  ({
    items,
    tableColumns,
    columns,
    onColumnUpdate,
    selectedGridView,
    updateColumnSorting,
    updateColumns,
    updateMetaData,
    setItems,
  }) => {
    const removeIndex = (index) => {
      const newItems = JSON.parse(JSON.stringify(items));
      newItems.splice(index, 1);
      setItems(newItems);
    };

    const updateIndex = (index, data) => {
      const newItems = JSON.parse(JSON.stringify(items));
      newItems[index] = data;
      setItems(newItems);
    };

    return (
      <List style={{ margin: 0, padding: 0 }} component="div">
        {items.map((item, index) => (
          <SortableItem
            key={`item-${index}-${item.value}`}
            index={index}
            item={item}
            columns={columns}
            onColumnUpdate={onColumnUpdate}
            selectedGridView={selectedGridView}
            updateColumnSorting={updateColumnSorting}
            tableColumns={tableColumns}
            updateColumns={updateColumns}
            updateMetaData={updateMetaData}
            removeIndex={removeIndex}
            updateIndex={updateIndex}
            itemIndex={index}
          />
        ))}
      </List>
    );
  }
);

const DragHandle = sortableHandle(({ display }) => (
  <DragIndicatorIcon
    style={{ fontSize: 18, visibility: display ? "visible" : "hidden" }}
  />
));

const SortableItem = SortableElement(
  ({
    item,
    tableColumns,
    columns,
    updateColumns,
    onColumnUpdate,
    selectedGridView,
    updateColumnSorting,
    updateMetaData,
    removeIndex,
    itemIndex,
    updateIndex,
  }) => {
    const classes = useSortableStyles();
    const [showDrag, setShowDrag] = useState(false);
    const [, setStateApp] = useContext(AppContext);

    return (
      <ListItem
        ContainerComponent="div"
        style={{ zIndex: 1400, padding: 0 }}
        onMouseOver={() => setShowDrag(true)}
        onMouseLeave={() => setShowDrag(false)}
      >
        <DragHandle display={showDrag} />
        <div className={classes.itemContainer}>
          <span style={{ alignSelf: "center" }}>{item.label}</span>
          <span style={{ display: "flex" }}>
            {tableColumns.find((co) => co.name === item.name)?.isCustom && (
              <IconButton
                style={{ padding: 6 }}
                onClick={() => {
                  var element = document.querySelector('[aria-label="Close"]');
                  element.click();
                  setStateApp((stateApp) => ({
                    ...stateApp,
                    selectedMeta: tableColumns.find(
                      (co) => co.name === item.name
                    ),
                    showFieldModal: true,
                  }));
                }}
              >
                <EditIcon style={{ alignSelf: "center", fontSize: 20 }} />
              </IconButton>
            )}
            <Checkbox
              style={{ padding: 3 }}
              id={item?.name}
              checked={item.display === "true" || item.display === true}
              onChange={(e) => {
                const index = columns.findIndex((co) => co.name === item.name);
                columns[index].display = e.target.checked.toString()
                onColumnUpdate(index)
                updateColumns(columns);
                updateColumnSorting(columns)
              }}
              color="primary"
            />
          </span>
        </div>
      </ListItem>
    );
  }
);

export default CustomerViewColContainer;
