import { Grid } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import MuiDialogActions from "@material-ui/core/DialogActions";
import MuiDialogContent from "@material-ui/core/DialogContent";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { ProfileContext } from "./ProfileContext";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    // padding: theme.spacing(2),
  },
  image: {
    width: "400px",
    // height: "300px",
  },
  thumb: {
    width: "128px",
    height: "128px",
  },
  preview: {
    width: "100%",
    maxWidth: "36ch",
  },
  inline: {
    display: "inline",
  },
  ptitle: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  actions: {
    margin: 0,
    padding: theme.spacing(1),
  },
}));

const getResizedCanvas = (canvas, newWidth, newHeight) => {
  const tmpCanvas = document.createElement("canvas");
  tmpCanvas.width = newWidth;
  tmpCanvas.height = newHeight;

  const ctx = tmpCanvas.getContext("2d");
  ctx.drawImage(
    canvas,
    0,
    0,
    canvas.width,
    canvas.height,
    0,
    0,
    newWidth,
    newHeight
  );

  return tmpCanvas;
};

function getCroppedImg(previewCanvas, crop) {
  if (!crop || !previewCanvas) {
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  const canvas =
    dpr !== 1
      ? getResizedCanvas(previewCanvas, crop.width, crop.height)
      : previewCanvas;

  return canvas.toDataURL("image/png");
}

const ImageModalContent = () => {
  const classes = useStyles();
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [stateProfile, setStateProfile] = useContext(ProfileContext);
  const [crop, setCrop] = useState({ unit: "%", width: 70, aspect: 1 });
  const [completedCrop, setCompletedCrop] = useState(null);

  const {
    selectedImage,
    fields: { fullname, displayname },
  } = stateProfile;

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;
    const dpr = window.devicePixelRatio || 1;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");

    canvas.width = crop.width * dpr;
    canvas.height = crop.height * dpr;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * dpr,
      crop.height * dpr
    );
  }, [completedCrop]);

  const handleSave = async () => {
    const profileImage = await getCroppedImg(
      previewCanvasRef.current,
      completedCrop
    );
    await setStateProfile({
      ...stateProfile,
      fields: {
        ...stateProfile.fields,
        profileImage
      },
      isImageModalOpen: false,
    });
  };

  const handleClose = async () => {
    imgRef.current = null;
    await setStateProfile({
      ...stateProfile,
      selectedImage: null,
      isImageModalOpen: false,
    });
  };

  return (
    <Fragment>
      <MuiDialogContent className={classes.root}>
        <Grid container direction="column">
          <Grid item>
            {selectedImage ? (
              <div className={classes.image}>
                <ReactCrop
                  src={selectedImage}
                  onImageLoaded={onLoad}
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                />
              </div>
            ) : (
              <Skeleton variant="rect" className={classes.image} />
            )}
          </Grid>
          <Grid item className={classes.ptitle}>
            <Typography variant="body2">Preview</Typography>
          </Grid>
          <Grid item>
            <Paper className={classes.preview} elevation={0}>
              <Grid container wrap="nowrap" spacing={2}>
                <Grid item>
                  {previewCanvasRef ? (
                    <canvas
                      ref={previewCanvasRef}
                      style={{
                        width: 64,
                        height: 64,
                      }}
                    />
                  ) : (
                    <Avatar>{fullname}</Avatar>
                  )}
                </Grid>
                <Grid item xs zeroMinWidth>
                  <Typography noWrap>{fullname}</Typography>
                  <Typography noWrap>{displayname}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </MuiDialogContent>
      <MuiDialogActions style={{ root: classes.actions }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          color="primary"
          style={{ textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          style={{
            textTransform: "none",
            color: "white",
            background: "#0e5721",
          }}
          variant="outlined"
          onClick={handleSave}
        >
          Save
        </Button>
      </MuiDialogActions>
    </Fragment>
  );
};

export default ImageModalContent;
