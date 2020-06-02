/* eslint-disable no-use-before-define */
import React, { useContext, useState, useEffect } from "react";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { AppContext } from "../../AppContext";
import { CircularProgress } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { USERAVAILABLETAGSQUERY } from "../../graphQL/useQueryUserAvailableTags";
import { TAGSBYOBJECTIDQUERY } from "../../graphQL/useQueryTagsByObjectId";
import { UPSERTTAG } from "../../graphQL/useMutationUpsertTag";
import { REMOVETAG } from "../../graphQL/useMutationRemoveTag";
import Grid from "@material-ui/core/Grid";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { USERBYEMAIL } from "../../graphQL/useQueryUserByEmail"; //////////////temporary while signed user fixed

const useStyles = makeStyles((theme) => ({
  rootDiv: {
    width: (props) => (props.width ? props.width : "500px"),
    "& > * + *": {
      marginTop: theme.spacing(5),
    },
    "& .MuiAutocomplete-clearIndicator": {
      display: "none",
    },
  },
  switchButtom: {
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
    flexDirection: "row",
    alignSelf: "unset",
    margin: 0,
    "& h3": { margin: "0 0 0 13px", color: "#8D8D8D !important" },
  },
}));

export default function Tags(props) {
  const [stateApp] = useContext(AppContext);
  const classes = useStyles(props);

  const [tagsArray, setTagsArray] = useState([]);
  const [userAvailableTagsArray, setUserAvailableTagsArray] = useState([]);
  const [textValue, setTextValue] = useState("");
  const [loadingTags, setLoadingTags] = useState(true);
  const [addInDropDown, setAddInDropDown] = useState(false);
  const [publicTag, setPublicTag] = useState(true);

  const [getTagsByObjectId, { data: dataTags }] = useLazyQuery(
    TAGSBYOBJECTIDQUERY
  );
  const [getUserAvailableTags, { data: dataUserAvailableTags }] = useLazyQuery(
    USERAVAILABLETAGSQUERY
  );
  const [upsertTag] = useMutation(UPSERTTAG);
  const [removeTag] = useMutation(REMOVETAG);

  //////begin////////temporary  while signed user fixed

  const [getUserByEmail, { data: dataUser }] = useLazyQuery(USERBYEMAIL);
  const [user, setUser] = useState({ _id: "" });

  useEffect(() => {
    if (stateApp && stateApp.user && stateApp.user.email) {
      getUserByEmail({
        variables: {
          userEmail: stateApp.user.email,
        },
      });
    }
  }, [stateApp.user.email]);

  useEffect(() => {
    if (dataUser && dataUser.userByEmail) {
      setUser(dataUser.userByEmail);
    }
  }, [dataUser]);

  /////end/////////temporary while signed user fixed

  ///////////////////// START FETCHING TAGS DATA ////////////////////////////////////////////

  ////All Object Tag For The Input
  useEffect(() => {
    setLoadingTags(true);
    getTagsByObjectId({
      variables: {
        objectId: props.targetSourceId,
      },
    });
  }, [props.targetSourceId]);

  useEffect(() => {
    if (dataTags && dataTags.tagsByObjectId) {
      setTagsArray(dataTags.tagsByObjectId);
    }
    setLoadingTags(false);
  }, [dataTags]);

  ////All User Available Tags For The DropDown
  useEffect(() => {
    //////stateApp.user._id//////////temporary
    if (user._id !== "") {
      getUserAvailableTags({
        variables: {
          userId: user._id, //////stateApp.user._id//////////temporary
        },
      });
    }
  }, [user]); ////////////remove dependency//////////temporary

  useEffect(() => {
    if (dataUserAvailableTags && dataUserAvailableTags.userAvailableTags) {
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
  }, [dataUserAvailableTags]);

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
    if (tagText === addInDropDown && addInDropDown) {
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
      upsertTag({
        variables: {
          tag: {
            tag: tagText,
            public: publicTag,
            user: user._id, //////stateApp.user._id////////temporary while signed user fixed
            taggedOn: props.targetSourceId,
          },
        },
        refetchQueries: [
          "getTagsByObjectId",
          "getUserAvailableTags",
          "getTagSamples",
        ],
        awaitRefetchQueries: true,
      });
    }
  };

  ///////////////////// DELETING A TAG ///////////////////////////////////////////////

  const DeleteTag = (tagId) => {
    removeTag({
      variables: {
        tagId: tagId,
      },
      refetchQueries: [
        "getTagsByObjectId",
        "getUserAvailableTags",
        "getTagSamples",
      ],
      awaitRefetchQueries: true,
    });
  };

  ////////////////////////////////////////////////////////////////////////////////////////

  const handleChangeTags = (e, v) => {
    e.persist();

    if (e.key && e.key === "Enter") {
      ////A new tag by keyboard
      NewTag(v[v.length - 1]);
    } else if (e.target.tagName === "svg" || e.target.tagName === "path") {
      ////A tag was deleted
      let TagId;
      if (e.target.tagName === "svg") {
        TagId = e.target.parentNode.id;
      }
      if (e.target.tagName === "path") {
        TagId = e.target.parentNode.parentNode.id;
      }
      DeleteTag(TagId);
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
    const { cleanArray } = cleanDropDownArray();

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
      <FormGroup>
        <FormControlLabel
          className={`${classes.switchButtom} ${
            props.publicLeftBottom ? classes.publicLeftBottom : ""
          } ${!publicTag ? classes.switchTextDeselected : ""}`}
          control={
            <React.Fragment>
              {props.publicLeftBottom && <h3>Tags</h3>}
              <Switch
                size="small"
                checked={publicTag}
                onChange={() => {
                  setPublicTag(!publicTag);
                }}
              />
            </React.Fragment>
          }
          label="Shared"
          labelPlacement="start"
        />
      </FormGroup>
    );
  };

  return (
    <div className={classes.rootDiv}>
      {!loadingTags ? (
        <Grid container>
          <Grid item xs={12}>
            <TogglePublicButton />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
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
                        id={tag._id}
                        variant="outlined"
                        label={tag.tag}
                        {...getTagProps({ index })}
                      />
                    );
                  }
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label={!props.publicLeftBottom ? "Tags" : null}
                  placeholder="New..."
                  fullWidth
                  value={textValue}
                  onChange={(e) => {
                    setTextValue(e.target.value);
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
