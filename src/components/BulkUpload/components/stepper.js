import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { set, get } from "lodash";
import { useForm } from "react-hook-form";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Checkbox } from "@material-ui/core";
import clsx from "clsx";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import { useDispatch } from "react-redux";
import StepConnector from "@material-ui/core/StepConnector";
import Button from "@material-ui/core/Button";
import CSVFileReader from "./CSVFileReader";
import RevenueStatementInfoForm from "./Fields/RevenueStatementInfoForm";
import M1neralHeaders from "./M1neralHeaders";
import ReviewCSV from "./ReviewCSV";
import UploadStepperComponent from "./UploadStepperComponent";
import { AppContext } from "../../../AppContext";
import { useHistory } from "react-router-dom";
import { matchRoutes } from "react-router-config";
import { useMutation, useLazyQuery, useApolloClient } from "@apollo/client";
import { showErrorMessage } from "actions";
import { CREATE_JOB } from "graphQL/useMutationCreateJob";
import { UPDATE_JOB } from "graphQL/useMutationUpdateJob";
import { GET_JOB_UPLOAD_URI } from "graphQL/useQueryGetJobUploadUri";
import { BlockBlobClient } from "@azure/storage-blob";
import jobHeaders from "../jobHeaders";
import { INITIALIZE_EXPORT_JOB } from "graphQL/useMutationinitializeExportJob";
import { getDateWithoutTime } from "components/Shared/functions";

const QontoConnector = withStyles({
  alternativeLabel: {
    flexDirection: "column",
    left: "calc(-50% + 12px)",
    right: "calc(50% + 12px)",
  },
  active: {
    "& $line": {
      borderColor: "#17aadd",
    },
  },
  completed: {
    "& $line": {
      borderColor: "#17aadd",
    },
  },
  line: {
    borderColor: "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
})(StepConnector);

const NewSteplabel = withStyles({
  alternativeLabel: {
    flexDirection: "column !important",
  },
  active: {
    color: "#17aadd !important",
  },
  completed: {
    color: "#17aadd !important",
  },
})(StepLabel);
const useQontoStepIconStyles = makeStyles({
  root: {
    color: "#17aadd",
    display: "flex",
    height: 22,
    alignItems: "center",
    flexDirection: "column !important",
  },
  active: {
    color: "#17aadd",
  },
  circle: {
    width: 15,
    height: 15,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
  completed: {
    color: "#0084e2",
    zIndex: 1,
    fontSize: 18,
  },
  alternativeLabel: {
    flexDirection: "column !important",
  },
});

const style_radio = {
  color: "#17aadd",
  width: 15,
  height: 15,
  border: "3px solid #17aadd",
  borderRadius: "50%",
};
const style_hollow_grey = {
  height: 15,
  width: 15,
  color: "#eaeaf0",
  border: "3px solid",
  borderRadius: "50%",
};
function QontoStepIcon(props) {
  const classes = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}
    >
      {completed ? (
        <Checkbox style={style_radio} color="primary" checked={true} />
      ) : active ? (
        <Checkbox style={style_radio} color="primary" checked={true} />
      ) : (
        <Checkbox style={style_hollow_grey} color="primary" checked={true} />
      )}
    </div>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   */
  active: PropTypes.bool,
  /**
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  buttonback: {
    color: "#17aadd",
    fontWeight: 900,
    padding: "3px 25px",
    marginRight: theme.spacing(1),
    backgroundColor: "#d5f4fd",
  },
  buttonselect: {
    backgroundColor: "#17aadd",
    fontWeight: 900,
    padding: "3px 25px",
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps(job) {
  if (job?.skipReview) {
    return ["Select", "Match", "Upload"];
  }
  return ["Select", "Match", "Review", "Upload"];
}

const mapping_buttons_div = {
  maxWidth: "20%",
  margin: "8px auto",
  textAlign: "center",
};
const stepper_style = {
  padding: "35px 0px",
};
export default function CustomizedSteppers(props) {
  const classes = useStyles();
  const { control, watch, getValues, reset } = useForm();
  const [stateApp, setStateApp] = React.useContext(AppContext);
  const client = useApolloClient();
  const history = useHistory();
  const previousRoute = matchRoutes(props.routes, history.pathHistory[1]);

  const [contactList, setContactList] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [processing, setProcessing] = useState(false);

  const [buttonTitle, setButtonTitle] = useState("false");

  const steps = getSteps(stateApp.job);
  const dispatch = useDispatch();
  const [getJobUploadUri, { data: contactUploadUri }] = useLazyQuery(GET_JOB_UPLOAD_URI, {
    fetchPolicy: "no-cache",
  });
  const [createJob, { data: createJobData }] = useMutation(CREATE_JOB);
  const [updateJob] = useMutation(UPDATE_JOB);

  const userID = stateApp.user.mongoId;
  let data_to_send = stateApp.csvDataToSend;

  const payor = watch("payor");
  const checkAmount = watch("checkAmount");
  const checkNumber = watch("checkNumber");

  useEffect(() => {
    setButtonTitle(
      stateApp.activeStepNumber >= steps.length - 2 ? (stateApp.activeStepNumber === steps.length - 1 ? "Close" : "Upload") : "Continue"
    );
  }, []);

  useEffect(() => {
    if (createJobData?.createJob && jobId) {
      updateJob({
        variables: {
          job: {
            _id: jobId,
            createJobResponse: createJobData?.createJob.body,
          },
        },
      });
    }
  }, [createJobData, jobId]);

  useEffect(() => {
    if (contactUploadUri?.getJobUploadUri?.success && !processing) {
      setProcessing(true);
      setStateApp((state) => ({
        ...state,
        bulkUpload: !stateApp.bulkUpload,
      }));
      const uri = contactUploadUri.getJobUploadUri.job.uri;
      const id = contactUploadUri.getJobUploadUri.job.id;
      const interal_key = contactUploadUri.getJobUploadUri.job.internalKey;

      setJobId(id);

      const blockBlobClient = new BlockBlobClient(uri);
      blockBlobClient
        .uploadBrowserData(contactList, {
          maxSingleShotSize: 4 * 1024 * 1024,
          blobHTTPHeaders: {
            blobContentDisposition: `attachment; filename="${id}"`,
          },
          metadata: {
            Internalkey: interal_key || "",
          },
        })
        .then((res) => {
          if (res?._response?.status === 201) {
            createJob({
              variables: {
                jobId: id,
                sendEmail: true,
              },
            });
          } else {
            dispatch(showErrorMessage("Upload failed"));
          }
        })
        .catch((err) => console.log(err));
    }
  }, [contactUploadUri]);

  const setValue = (_obj, key, value) => {
    if (_obj[key]) delete _obj[key];
    set(_obj, key, value);
  };

  const handleNext = async () => {
    if (stateApp.activeStepNumber === steps.length - 2) {
      if (stateApp.jobType === "SHAPE_TO_M1_LAYER") {
        const jobInitialization = await client.mutate({
          mutation: INITIALIZE_EXPORT_JOB,
          variables: {
            jobName: "SHAPE TO M1 LAYER",
            jobType: "SHAPE_TO_M1_LAYER",
            requestPayload: {
              transferData: stateApp.transferData,
              mappedHeadersFromCSV: stateApp.mappedHeadersFromCSV,
              selectedShapeLayerOption: stateApp.selectedShapeLayerOption,
            },
            userId: userID,
          },
        });
        await client.mutate({
          mutation: CREATE_JOB,
          variables: {
            jobId: jobInitialization?.data?.initializeExportJob?.job?._id,
            sendEmail: true,
          },
        });
        setStateApp((state) => ({
          ...state,
          bulkUpload: !state.bulkUpload,
        }));
      } else {
        const changeDate = new Date();
        const statementInfo = get(stateApp, "uploaderFormValues", {});
        let data_to_send = stateApp.csvDataToSend.map((element, index) => {
          element.createBy = userID;
          element.createAt = changeDate;
          element.lastUpdateBy = userID;
          element.lastUpdateAt = changeDate;
          element = { ...statementInfo, ...element };
          element['checkDate'] = getDateWithoutTime(element['check.checkDate'])
          element['check.checkDate'] = getDateWithoutTime(element['check.checkDate'])
          setValue(element, "check.sourceId", statementInfo.sourceId);
          setValue(element, "check.importType", statementInfo.importType);
          if (props.selectedJob.type === "UNITS") {
            element["shape.shapeType"] = "Unit";
          }
          if (props.selectedJob.type === "AGREEMENT_HEADER") {
            element.shapeType = "Agreement";
          }
          delete element.tableData;
          return element
        });
        const requestPayload = {
          sampleCsv: jobHeaders[props.selectedJob.type],
          uploadType: stateApp.selectedShapeLayerOption,
        };

        if (stateApp.jobType === "UNITS") {
          const autoCalculateOfferPrice = !!stateApp?.user?.features?.find((f) => f.name === "autoCalculateOfferPrice");
          requestPayload["autoCalculateOfferPrice"] = autoCalculateOfferPrice;
        }

        if (stateApp.jobType === "AGREEMENT_COMMENTS") {
          requestPayload["type"] = "agreement";
        }
        if (stateApp.jobType === "TRACT_COMMENTS") {
          requestPayload["type"] = "tract";
        }
        if (stateApp.jobType === "CONTACT_COMMENTS") {
          requestPayload["type"] = "contact";
        }

        getJobUploadUri({
          variables: {
            requestPayload,
            jobName: props.selectedJob.name,
            jobType: props.selectedJob.type,
            userId: userID,
          },
        });
        setContactList(JSON.stringify(data_to_send));

        setStateApp((state) => ({
          ...state,
          activeStepNumber: stateApp.activeStepNumber + 1,
          uploaderFormValues: {}
        }));
      }

      setStateApp((state) => ({
        ...state,
        activeStepNumber: stateApp.activeStepNumber + 1,
      }));
    } else {
      setStateApp((state) => ({
        ...state,
        activeStepNumber: stateApp.activeStepNumber + 1,
      }));
    }
    if (stateApp.activeStepNumber === steps.length - 1) {
      handleReset();
      routeChange(props.selectedJob.redirectTo || previousRoute[0]?.match?.url);
    }
  };

  const handleBack = () => {
    if (stateApp.activeStepNumber === 0) {
      handleReset();
      routeChange(previousRoute[0]?.match?.url);
    } else {
      setStateApp((state) => ({
        ...state,
        activeStepNumber: stateApp.activeStepNumber - 1,
      }));
    }
  };

  const handleReset = () => {
    setStateApp((state) => ({
      ...state,
      activeStepNumber: 0,
      csvDataList: [],
      csvDataToSend: [],
      mappedHeadersFromCSV: [],
    }));
  };

  let routeChange = (route) => {
    history.push(route || "/");
  };

  const isDisabled = useMemo(() => {
    if (stateApp.jobType === "SHAPE_TO_M1_LAYER") {
      return !(stateApp.selectedShapeLayerOption && stateApp.transferData);
    } else if (stateApp.jobType === "AGREEMENT_HEADER") {
      return (
        (stateApp.activeStepNumber === 1 && !stateApp.csvDataToSend) ||
        stateApp.csvDataToSend.length === 0 ||
        !stateApp.selectedShapeLayerOption
      );
    } else {
      return (stateApp.activeStepNumber === 1 && !stateApp.csvDataToSend) || stateApp.csvDataToSend.length === 0;
    }
  }, [stateApp.selectedShapeLayerOption, stateApp.activeStepNumber, stateApp.csvDataToSend, stateApp.transferData, stateApp.jobType]);

  return (
    <div className={classes.root}>
      <Stepper style={stepper_style} alternativeLabel activeStep={stateApp.activeStepNumber} connector={<QontoConnector />}>
        {steps.map((label) => (
          <Step key={label}>
            <NewSteplabel StepIconComponent={QontoStepIcon}>{label}</NewSteplabel>
          </Step>
        ))}
      </Stepper>
      <div>
        <div>
          <div>
            {steps[stateApp.activeStepNumber] === "Select" ? (
              <>
                {props.selectedJob.type === "CHECKDETAILS" && (
                  <RevenueStatementInfoForm
                    control={control}
                    watch={watch}
                    getValues={getValues}
                    reset={reset}
                    setStateApp={setStateApp}
                    uploaderFormValues={stateApp.uploaderFormValues}
                  />
                )}
                <CSVFileReader
                  importType={getValues().importType}
                  selectedJob={props.selectedJob}
                  setSelectedJob={props.setSelectedJob}
                />
              </>
            ) : null}
            {steps[stateApp.activeStepNumber] === "Match" ? <M1neralHeaders /> : null}
            {steps[stateApp.activeStepNumber] === "Review" ? <ReviewCSV /> : null}
            {steps[stateApp.activeStepNumber] === "Upload" ? <UploadStepperComponent /> : null}
          </div>
          <div style={mapping_buttons_div}>
            {steps[stateApp.activeStepNumber] !== "Upload" ? (
              <Button onClick={handleBack} className={classes.buttonback}>
                Back
              </Button>
            ) : null}
            {steps[stateApp.activeStepNumber] !== "Select" ? (
              <Button
                id={`${buttonTitle}-button`}
                disabled={isDisabled}
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.buttonselect}
              >
                {buttonTitle}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
