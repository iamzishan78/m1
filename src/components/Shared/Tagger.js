import React, { useContext, useState, useEffect } from "react";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { AppContext } from "../../AppContext";
import { CircularProgress } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { USERAVAILABLETAGSQUERY } from "../../graphQL/useQueryUserAvailableTags";
import { TAGSBYOBJECTSIDS } from "../../graphQL/useQueryTagsByObjectsIds";
import { TAGSBYOBJECTIDQUERY } from "../../graphQL/useQueryTagsByObjectId";
import { UPSERTTAG } from "../../graphQL/useMutationUpsertTag";
import { REMOVETAG } from "../../graphQL/useMutationRemoveTag";
import Grid from "@material-ui/core/Grid";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import ClearIcon from "@material-ui/icons/Clear";
import "./Tagger.css";

const AntSwitch = withStyles((theme) => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    "&$checked": {
      transform: "translateX(12px)",
      color: theme.palette.common.white,
      "& + $track": {
        opacity: 1,
        backgroundColor: "#12ABE0",
        borderColor: "#12ABE0",
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: "none",
  },
  track: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.common.white,
  },
  checked: {},
}))(Switch);

const useStyles = makeStyles((theme) => ({
  rootDiv: {
    width: ({ width }) => (width ? width : "500px"),
    "& > * + *": {
      marginTop: theme.spacing(5),
    },
    "& .MuiAutocomplete-clearIndicator": {
      display: "none",
    },
  },
  switchButtom: {
    float: "right",
    width: "fit-content",
    alignSelf: "flex-end",
    marginRight: 0,
    "& span.MuiTypography-body1": {
      fontSize: "0.9rem",
    },
  },
  switchTextDeselected: {
    color: "rgb(141, 141, 141)",
  },
  publicLeftBottom: {
    float: "none",
    flexDirection: "row",
    alignSelf: "unset",
    margin: 0,
    "& .MuiTypography-root": {
      display: "none",
    },
    "& .h4Before": { margin: "0 13px", color: "#202020 !important" },
    "& .h4After": { margin: "0 0 0 13px", color: "#B7B7B7 !important" },
  },
  chip: {
    "& .MuiAutocomplete-inputRoot": { minHeight: "56px" },
    "& .MuiChip-root": {
      backgroundColor: "#ECEDED",
      color: "#606060",
    },
  },
  input: {
    "& input": {
      caretColor: ({ showPlusAddIcon }) =>
        !showPlusAddIcon ? "" : "transparent",
      color: ({ showPlusAddIcon }) => (!showPlusAddIcon ? "" : "#008ebf"),
      backgroundColor: ({ showPlusAddIcon }) =>
        !showPlusAddIcon ? "" : "#D5F4FF",
      maxWidth: ({ showPlusAddIcon }) => (!showPlusAddIcon ? "" : "33px"),
      width: ({ showPlusAddIcon }) => (!showPlusAddIcon ? "" : "33px"),
      height: ({ showPlusAddIcon }) => (!showPlusAddIcon ? "" : "32px"),
      fontSize: ({ showPlusAddIcon }) => (!showPlusAddIcon ? "" : "25px"),
      margin: ({ showPlusAddIcon }) => (!showPlusAddIcon ? "" : "3px"),
      padding: ({ showPlusAddIcon }) =>
        !showPlusAddIcon ? "" : "0px !important",
      borderRadius: ({ showPlusAddIcon }) => (!showPlusAddIcon ? "" : "50%"),
      textAlign: ({ showPlusAddIcon }) => (!showPlusAddIcon ? "" : "center"),
      cursor: ({ showPlusAddIcon }) => (!showPlusAddIcon ? "" : "pointer"),
      "&:hover": {
        boxShadow: ({ showPlusAddIcon }) =>
          !showPlusAddIcon
            ? ""
            : "0px 2px 2px -1px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.12), 0px 1px 10px 0px rgba(0,0,0,0.1)",
        backgroundColor: ({ showPlusAddIcon }) =>
          !showPlusAddIcon ? "" : "rgba(0, 0, 0, 0.08)",
      },
      transition: ({ showPlusAddIcon }) =>
        !showPlusAddIcon
          ? ""
          : "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    },
  },
}));

export default function Tags(props) {
  const [stateApp] = useContext(AppContext);
  const [tagsArray, setTagsArray] = useState([]);
  const [userAvailableTagsArray, setUserAvailableTagsArray] = useState([]);
  const [tFActive, setTFActive] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [loadingTags, setLoadingTags] = useState(true);
  const [addInDropDown, setAddInDropDown] = useState(false);
  const [publicTag, setPublicTag] = useState(true);

  const showPlusAddIcon = () => {
    if (tFActive || textValue) return false;
    return true;
  };

  const classes = useStyles({ ...props, showPlusAddIcon: showPlusAddIcon() });

  const [getTagsByObjectId, { data: dataTags }] = useLazyQuery(
    TAGSBYOBJECTIDQUERY,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  const [getTagsByObjectsIds, { data: dataTagsMultiIds }] = useLazyQuery(
    TAGSBYOBJECTSIDS,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  const [getUserAvailableTags, { data: dataUserAvailableTags }] = useLazyQuery(
    USERAVAILABLETAGSQUERY,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  const [upsertTag] = useMutation(UPSERTTAG);
  const [removeTag] = useMutation(REMOVETAG);

  ///////////////////// START FETCHING TAGS DATA ////////////////////////////////////////////

  ////All Object Tag For The Input
  useEffect(() => {
    if (!props.multipleIds) {
      setLoadingTags(true);
      getTagsByObjectId({
        variables: {
          objectId: props.targetSourceId,
        },
      });
    } else {
      getTagsByObjectsIds({
        variables: {
          objectsIdsArray: props.multipleIds,
          userId: stateApp.user.mongoId,
        },
      });
    }
  }, [props.targetSourceId, props.multipleIds]);

  useEffect(() => {
    if (dataTags && dataTags.tagsByObjectId) {
      setTagsArray(dataTags.tagsByObjectId);
    }
    setLoadingTags(false);
  }, [dataTags]);

  useEffect(() => {
    if (dataTagsMultiIds && dataTagsMultiIds.tagsByObjectsIds) {
      const checkIfUserMatch = (user) => {
        for (let i = 0; i < user.length; i++) {
          if (user[i]._id !== stateApp.user.mongoId) return false;
        }
        return user[0];
      };

      let tags = [];
      for (let i = 0; i < dataTagsMultiIds.tagsByObjectsIds.length; i++) {
        const element = dataTagsMultiIds.tagsByObjectsIds[i];
        if (
          element.taggedOn.length === props.multipleIds.length &&
          element.public.filter((v) => v === publicTag).length ===
            props.multipleIds.length
        ) {
          tags.push({
            ...element,
            user: checkIfUserMatch(element.user)
              ? checkIfUserMatch(element.user)
              : { name: "", email: "" },
            public: publicTag,
          });
        }
      }

      setTagsArray(tags);
    }
    setLoadingTags(false);
  }, [dataTagsMultiIds, publicTag]);

  ////All User Available Tags For The DropDown
  useEffect(() => {
    if (stateApp.user && stateApp.user.mongoId) {
      getUserAvailableTags({
        variables: {
          userId: stateApp.user.mongoId,
        },
      });
    }
  }, [stateApp.user]);

  useEffect(() => {
    if (
      dataUserAvailableTags &&
      dataUserAvailableTags.userAvailableTags &&
      tagsArray
    ) {
      let defaultTags = [
        "High Cash Flow",
        "Interested Seller",
        "Recent Death",
        "Recent Divorce",
        "Recently Inherited",
        "Out Of State Seller",
      ];

      defaultTags = defaultTags.filter((defaultTag) => {
        let found;
        tagsArray.map((tag) => {
          if (tag.tag === defaultTag) {
            found = true;
          }
        });
        return (
          found ||
          dataUserAvailableTags.userAvailableTags.indexOf(defaultTag) === -1
        );
      });

      setUserAvailableTagsArray([
        ...defaultTags,
        ...dataUserAvailableTags.userAvailableTags,
      ]);
    }
  }, [dataUserAvailableTags, tagsArray]);

  ///////////////////// INSERTING NEW TAG ///////////////////////////////////////////////

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const UpperAndCleanTagText = (tagText) => {
    return tagText
      .trim()
      .split(" ")
      .filter((word) => word !== "")
      .map((word) => capitalizeFirstLetter(word))
      .join(" ");
  };

  const NewTag = (tagText) => {
    tagText = UpperAndCleanTagText(tagText);
    if (addInDropDown && tagText === addInDropDown) {
      tagText = UpperAndCleanTagText(textValue);
    }
    setTextValue("");

    let found = false;
    tagsArray.map((tag) => {
      if (tag.tag === tagText) {
        found = true;
      }
    });
    if (!found) {
      if (!props.multipleIds) {
        upsertTag({
          variables: {
            tag: {
              tag: tagText,
              public: publicTag,
              user: stateApp.user.mongoId,
              taggedOn: props.targetSourceId,
              objectType: props.targetLabel,
            },
          },
          refetchQueries: [
            "getTagsByObjectId",
            "getUserAvailableTags",
            "getTagSamples",
            "getUserAvailableFilterTags",
            "getObjectsFromTagsArray",
            "getWellsIdsFromTagsArray",
            "getOwnersIdsFromTagsArray",
          ],
          awaitRefetchQueries: true,
        });
      } else {
        for (let i = 0; i < props.multipleIds.length; i++) {
          upsertTag({
            variables: {
              tag: {
                tag: tagText,
                public: publicTag,
                user: stateApp.user.mongoId,
                taggedOn: props.multipleIds[i],
                objectType: props.targetLabel,
              },
            },
            refetchQueries: [
              "getTagsByObjectId",
              "getUserAvailableTags",
              "getTagSamples",
              "getUserAvailableFilterTags",
              "getObjectsFromTagsArray",
              "getWellsIdsFromTagsArray",
              "getOwnersIdsFromTagsArray",
              "getTagsByObjectsIds",
            ],
            awaitRefetchQueries: true,
          });
        }
      }
    }
  };

  ///////////////////// DELETING A TAG ///////////////////////////////////////////////

  const DeleteTag = (TagIdOIds) => {
    if (!props.multipleIds)
      removeTag({
        variables: {
          tagId: TagIdOIds,
        },
        refetchQueries: [
          "getTagsByObjectId",
          "getUserAvailableTags",
          "getTagSamples",
          "getUserAvailableFilterTags",
          "getObjectsFromTagsArray",
          "getWellsIdsFromTagsArray",
          "getOwnersIdsFromTagsArray",
          "getTagsByObjectsIds",
        ],
        awaitRefetchQueries: true,
      });
    else {
      let ids = TagIdOIds.split("???|||///");

      for (let i = 0; i < ids.length; i++) {
        removeTag({
          variables: {
            tagId: ids[i],
          },
          refetchQueries: [
            "getTagsByObjectId",
            "getUserAvailableTags",
            "getTagSamples",
            "getUserAvailableFilterTags",
            "getObjectsFromTagsArray",
            "getWellsIdsFromTagsArray",
            "getOwnersIdsFromTagsArray",
            "getTagsByObjectsIds",
          ],
          awaitRefetchQueries: true,
        });
      }
    }
  };

  ////////////////////////////////////////////////////////////////////////////////////////

  const handleChangeTags = (e, v) => {
    e.persist();

    if (e.key && e.key === "Enter") {
      ////A new tag by keyboard
      NewTag(v[v.length - 1]);
    } else if (e.target.tagName === "svg" || e.target.tagName === "path") {
      ////A tag was deleted
      let TagIdOIds;
      if (e.target.tagName === "svg") {
        TagIdOIds = e.target.parentNode.id;
      }
      if (e.target.tagName === "path") {
        TagIdOIds = e.target.parentNode.parentNode.id;
      }
      DeleteTag(TagIdOIds);
    } else {
      if (e.type === "click") {
        ////A new tag by click on the dropdown
        NewTag(e.target.innerText);
      }
    }
  };

  const cleanDropDownArray = () => {
    const tags = tagsArray.map((tag) => tag.tag);

    let cleanArray = userAvailableTagsArray.filter(
      (tag) => tags.indexOf(tag) === -1
    );
    cleanArray = [...new Set(cleanArray)];
    cleanArray.sort();
    return { cleanArray, tags };
  };

  const AddingAddRowToDropDown = () => {
    let { cleanArray } = cleanDropDownArray();

    // if (props.multipleIds && userAvailableTagsArray) {
    //   cleanArray = [...userAvailableTagsArray];
    // }
    if (addInDropDown) {
      cleanArray.unshift(addInDropDown);
    }
    return cleanArray;
  };

  useEffect(() => {
    const { cleanArray, tags } = cleanDropDownArray();
    if (
      cleanArray.indexOf(UpperAndCleanTagText(textValue)) === -1 &&
      tags.indexOf(UpperAndCleanTagText(textValue)) === -1 &&
      textValue.trim() !== ""
    ) {
      setAddInDropDown(`Add "${UpperAndCleanTagText(textValue)}"`);
    } else {
      setAddInDropDown(false);
    }
  }, [textValue]);

  const TogglePublicButton = () => {
    return (
      <FormGroup style={{ display: "block" }}>
        {!props.publicLeftBottom && (
          <h3 style={{ width: "fit-content", margin: "0", float: "left" }}>
            Tags
          </h3>
        )}
        <FormControlLabel
          className={`${classes.switchButtom} ${
            props.publicLeftBottom ? classes.publicLeftBottom : ""
          } ${!publicTag ? classes.switchTextDeselected : ""}`}
          control={
            <React.Fragment>
              {props.publicLeftBottom && <h4 className="h4Before">Tags</h4>}
              <AntSwitch
                checked={publicTag}
                onChange={() => {
                  setPublicTag(!publicTag);
                }}
                name="checkedC"
              />

              {props.publicLeftBottom && <h4 className="h4After">Shared</h4>}
            </React.Fragment>
          }
          label="Shared"
          labelPlacement="start"
        />
      </FormGroup>
    );
  };

  return (
    <div id="taggerRoot" className={classes.rootDiv}>
      {!loadingTags ? (
        <Grid container>
          <Grid item xs={12}>
            <TogglePublicButton />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              className={classes.chip}
              multiple
              id="tags-outlined"
              onChange={(e, newValue) => {
                handleChangeTags(e, newValue);
              }}
              options={AddingAddRowToDropDown().map((option) => option)}
              value={tagsArray}
              freeSolo
              renderTags={(value, getTagProps) =>
                value.map((tag, index) => {
                  if (
                    (publicTag && tag.public) ||
                    (!publicTag &&
                      !tag.public &&
                      stateApp.user.email === tag.user.email)
                  ) {
                    return (
                      <Chip
                        key={index}
                        id={
                          !props.multipleIds
                            ? tag._id
                            : tag.ids.join("???|||///")
                        }
                        label={tag.tag}
                        {...getTagProps({ index })}
                        deleteIcon={<ClearIcon />}
                      />
                    );
                  }
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  className={classes.input}
                  // label={!props.publicLeftBottom ? "Tags" : null}
                  placeholder={!showPlusAddIcon() ? "" : "+"}
                  fullWidth
                  value={textValue}
                  onChange={(e) => {
                    setTextValue(e.target.value);
                  }}
                  onClick={() => {
                    setTFActive(true);
                  }}
                  onBlur={() => {
                    setTFActive(false);
                  }}
                />
              )}
            />
          </Grid>
          {/* {props.publicLeftBottom && (
            <Grid item xs={12}>
              <TogglePublicButton />
            </Grid>
          )} */}
        </Grid>
      ) : (
        <CircularProgress color="secondary"></CircularProgress>
      )}
    </div>
  );
}
