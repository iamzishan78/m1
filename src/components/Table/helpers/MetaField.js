import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Menu from "@material-ui/core/Menu";
import CheckIcon from "@material-ui/icons/Check";
import AddIcon from "@material-ui/icons/Add";
import { arrayMoveImmutable } from "array-move";
import { useLazyQuery, useMutation } from "@apollo/client";
import { AppContext } from "AppContext";

import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import {
  SortableContainer,
  SortableElement,
  sortableHandle,
} from "react-sortable-hoc";

import { ADD_META_DATA } from "graphQL/useMutationAddMetaData";
import { UPDATE_META_DATA } from "graphQL/useMutationUpdateMetaData";
import { colorPallete } from "components/Table/helpers";

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 30px",
  },
  selectedType: {
    borderBottom: "4px solid #01B0F0",
    color: "#01B0F0",
    display: "inline",
    cursor: "pointer",
  },
  unSelectedType: {
    display: "inline",
    color: "#827F7F",
    cursor: "pointer",
  },
  select: {
    width: "100%",
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
    marginTop: 1,
  },
  tabs: {
    margin: "0px 10px",
    paddingBottom: 8,
    borderBottom: "1px solid #EEF1F4",
  },
}));

const MetaField = () => {
  const classes = useStyles();
  const [selectedTab, setSelectedTab] = useState("new");
  const [showAddDescription, setShowAddDescription] = useState(false);
  const { control, reset, setValue, register, getValues, watch } = useForm();
  const [stateApp, setStateApp] = useContext(AppContext);
  const type = watch("type", stateApp.selectedMeta? stateApp.selectedMeta.type : "dropdown");
  
  const [items, setItems] = useState([{ palleteId: colorPallete[0].id}]);
  
  useEffect(() => {
    if(stateApp.selectedMeta){
      setTimeout(() => {
        setValue("type", stateApp.selectedMeta.type);
        setValue("title", stateApp.selectedMeta.label);
        setItems(stateApp.selectedMeta.dropdownOptions);
      },100)
    }
  },[stateApp.selectedMeta])
  
  const [addMetaData, { data }] = useMutation(ADD_META_DATA);
  const [updateMetaData, { }] = useMutation(UPDATE_META_DATA);

  const options = [
    { value: "dropdown", label: "Drop-down" },
    { value: "text", label: "Text" },
  ];

  const viewOptions = [
    {
      label: "Create new",
      value: "new",
    },
    {
      label: "Choose from library",
      value: "existing",
    },
  ];

  const categoryOptions = [
    {
      label: "Docs",
      value: "Docs",
    },
    {
      label: "Contacts",
      value: "Contacts",
    },
    {
      label: "Flow",
      value: "Flow",
    },
    {
      label: "All",
      value: "All",
    },
  ];

  const handleSave = () => {
    const values = getValues();
    if(stateApp.selectedMeta){
      updateMetaData({
        variables: {
          metaData: {
            _id: stateApp.selectedMeta._id,
            label: values.title,
            dropdownOptions: items,
          },
        },
        refetchQueries: ["getMetaData"],
        awaitRefetchQueries: true,
      });
    } else {
      addMetaData({
        variables: {
          metaData: {
            name: values.title.replace(/ /g, "_").toLowerCase(),
            label: values.title,
            esKey: `custom_data.${values.title.replace(/ /g, "_").toLowerCase()}.value.keyword`,
            options: {
              display: true,
              filter: true,
              searchable: false,
              sort: false,
              download: false,
              print: false,
              viewColumns: true,
            },
            type: values.type,
            category: values.category,
            user: stateApp.user.mongoId,
            dropdownOptions: items,
            isCustom: true,
          },
        },
        refetchQueries: ["getMetaData"],
        awaitRefetchQueries: true,
      });
    }
    handleClose()
  };

  const handleClose = () => {
    setItems([]);
    setStateApp((stateApp) => ({
      ...stateApp,
      showFieldModal: false,
      selectedMeta: null
    }))
  }
  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={true}
      onClose={() =>
        setStateApp((stateApp) => ({
          ...stateApp,
          showFieldModal: false,
        }))
      }
    >
      <div>
        <div className={classes.header}>
          {stateApp.selectedMeta ? <h3>Edit Field</h3> : <h3>Add Field</h3>}
          <IconButton
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <div>
          <div className={classes.tabs}>
            {viewOptions.map((option) => {
              return (
                <span
                  style={{ marginLeft: 13, padding: 5 }}
                  onClick={() => setSelectedTab(option.value)}
                  className={
                    selectedTab === option.value
                      ? classes.selectedType
                      : classes.unSelectedType
                  }
                >
                  {option.label}
                </span>
              );
            })}
          </div>
          <div style={{ padding: 35 }}>
            <Grid container spacing={0}>
              <Grid
                container
                item
                xs={7}
                style={{ paddingRight: 20 }}
                alignItems="center"
              >
                <label style={{ margin: "5px 0px" }}>Field title</label>
                <Controller
                  control={control}
                  name="title"
                  render={(props) => (
                    <TextField
                      size="small"
                      type="text"
                      variant="outlined"
                      value={props.value}
                      inputRef={props.ref}
                      onWheel={(e) => e.target.blur()}
                      onChange={(e) => {
                        props.onChange(e.target.value);
                      }}
                      placeholder="e.g. Priority, Stage, Status"
                      fullWidth
                      defaultValue=""
                    />
                  )}
                />
              </Grid>
              <Grid container item xs={5} alignItems="center">
                <label style={{ margin: "5px 0px" }}>Field type</label>
                <Controller
                  control={control}
                  name="type"
                  defaultValue={options[0].value}
                  render={(props) => (
                    <Select
                      styles={{
                        menu: provided => ({ ...provided, zIndex: 9999 })
                      }}
                      value={options.find((op) => op.value === props.value)}
                      menuPlacement="auto"
                      onChange={(e) => {
                        props.onChange(e.value);
                      }}
                      options={options}
                      className={classes.select}
                      isDisabled={stateApp.selectedMeta}
                    />
                  )}
                />
              </Grid>
              <Grid container item xs={7} style={{ paddingRight: 20 }}>
                {!showAddDescription ? (
                  <div
                    className={classes.addField}
                    onClick={() => {
                      setShowAddDescription(true);
                    }}
                  >
                    <AddIcon className={classes.addIcon} />{" "}
                    <span className={classes.f13}>Add Description</span>
                  </div>
                ) : (
                  <Controller
                    control={control}
                    name="description"
                    render={(props) => (
                      <TextField
                        style={{ paddingTop: 20 }}
                        size="small"
                        type="text"
                        variant="outlined"
                        value={props.value}
                        inputRef={props.ref}
                        onWheel={(e) => e.target.blur()}
                        onChange={(e) => {
                          props.onChange(e.target.value);
                        }}
                        placeholder="Description"
                        fullWidth
                        defaultValue=""
                        multiline
                        rows={3}
                        rowsMax={4}
                      />
                    )}
                  />
                )}
              </Grid>
              <Grid container item xs={5} style={{ paddingTop: 20 }}>
                <Controller
                  control={control}
                  name="category"
                  defaultValue={categoryOptions[0].value}
                  render={(props) => (
                    <Select
                      styles={{
                        menu: provided => ({ ...provided, zIndex: 9999 })
                      }}
                      value={categoryOptions.find(
                        (op) => op.value === props.value
                      )}
                      menuPlacement="auto"
                      options={categoryOptions}
                      className={classes.select}
                      isDisabled={stateApp.selectedMeta}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </div>
          {type === "dropdown" && (
            <div style={{ padding: "0px 35px" }}>
              <SortableComponent setItems={setItems} items={items} />
            </div>
          )}
          <div
            style={{
              borderTop: "1px solid #EEF1F4",
            }}
          >
            <div style={{ float: "right" }}>
              <Button
                style={{ margin: "25px 5px 25px 0px" }}
                variant="outlined"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                style={{ margin: "25px 25px 25px 5px" }}
                variant="outlined"
                onClick={handleSave}
              >
                {stateApp.selectedMeta ? 'Updated Field' : 'Create Field' }
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

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

const SortableComponent = ({ setItems, items }) => {
  const onSortEnd = ({ oldIndex, newIndex }) => {
    setItems(arrayMoveImmutable(items, oldIndex, newIndex));
  };

  return (
    <>
      <SortableList
        setItems={setItems}
        items={items}
        onSortEnd={onSortEnd}
        useDragHandle
      />
      <div
        style={{
          color: "#929292",
          marginTop: 15,
          marginLeft: 25,
          display: "flex",
          cursor: "pointer",
        }}
        onClick={() => {
          const newItems = JSON.parse(JSON.stringify(items));
          newItems.push({ palleteId: colorPallete[0].id });
          setItems(newItems);
        }}
      >
        <AddIcon
          style={{
            fontSize: "18px",
            marginTop: 1,
          }}
        />{" "}
        <span style={{ fontSize: 13 }}>Add an Option</span>
      </div>
    </>
  );
};

const SortableList = SortableContainer(({ items, setItems }) => {
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
          key={`item-${item.value}`}
          index={index}
          item={item}
          removeIndex={removeIndex}
          updateIndex={updateIndex}
          itemIndex={index}
        />
      ))}
    </List>
  );
});

const DragHandle = sortableHandle(({ display }) => (
  <DragIndicatorIcon
    style={{ fontSize: 18, visibility: display ? "visible" : "hidden" }}
  />
));

const SortableItem = SortableElement(
  ({ item, removeIndex, itemIndex, updateIndex }) => {
    const classes = useSortableStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [showDrag, setShowDrag] = useState(false);
    const [itemValue, setItemValue] = useState(item.value);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
      <ListItem
        ContainerComponent="div"
        style={{ zIndex: 1300, padding: 0 }}
        onMouseOver={() => setShowDrag(true)}
        onMouseLeave={() => setShowDrag(false)}
      >
        <DragHandle display={showDrag} />
        <div className={classes.itemContainer}>
          <div style={{ width: "100%" }}>
            <div
              style={{
                marginTop: 4,
                marginLeft: 10,
                marginRight: 10,
                width: 15,
                height: 15,
                backgroundColor: colorPallete.find(
                  (pallete) => pallete.id === item.palleteId
                ).color,
                display: "inline-block",
                borderRadius: 10,
              }}
              onClick={handleClick}
            ></div>

            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <div style={{ width: "220px", padding: "0px 10px" }}>
                {colorPallete.map((pallet) => {
                  return (
                    <div
                      style={{ display: "inline-block" }}
                      onClick={() => {
                        handleClose();
                        updateIndex(itemIndex, {
                          ...item,
                          palleteId: pallet.id,
                        });
                      }}
                    >
                      <div
                        style={{
                          marginTop: 4,
                          marginLeft: 5,
                          marginRight: 5,
                          width: 15,
                          height: 15,
                          backgroundColor: pallet.color,
                          display: "inline-block",
                        }}
                      >
                        {item.color === pallet.color && (
                          <CheckIcon style={{ fontSize: 13 }} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Menu>
            <TextField
              type="text"
              variant="standard"
              placeholder="Enter option"
              style={{ width: "95%", marginTop: 3 }}
              value={itemValue}
              onChange={(e) => {
                setItemValue(e.target.value);
              }}
              onBlur={() =>
                updateIndex(itemIndex, { ...item, value: itemValue })
              }
              InputProps={{
                disableUnderline: true,
              }}
            />
          </div>
          <IconButton
            style={{ padding: "4px" }}
            onClick={() => removeIndex(itemIndex)}
          >
            <CloseIcon style={{ fontSize: 16, alignSelf: "center" }} />
          </IconButton>
        </div>
      </ListItem>
    );
  }
);

export default MetaField;
