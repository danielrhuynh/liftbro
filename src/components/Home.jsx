import React, { useState, useRef, useEffect } from 'react';
import styles from './Home.module.css';
import MediaContainer from './MediaContainer/MediaContainer';
import LiftCards from './LiftCards/LiftCards';
import { Grid, Snackbar, Alert } from '@mui/material';
import LiftForm from './LiftForm/LiftForm';
import * as posenet from '@tensorflow-models/posenet';
import { drawKeypoints, drawSkeleton } from './utils/canvas';
import { processData } from './utils/dataProcessing';
import { runTraining } from './utils/modelTraining';
import { runInference } from './utils/modelInference';
import * as tf from '@tensorflow/tfjs';

const delay = (time) => {
    return new Promise((resolve, reject) => {
        if (isNaN(time)) {
            reject(new Error('delay requires a valid number.'));
        } else {
            setTimeout(resolve, time);
        }
    });
}

const Home = () => {
    const [model, setModel] = useState(null);
    const [isPoseEstimation, setIsPoseEstimation] = useState(false)
    const [isPoseEstimationWorkout, setIsPoseEstimationWorkout] = useState(false);
    const [workoutState, setWorkoutState] = useState({ workout: '', name: 'Dan', });
    const [isCollectingData, setIsCollectingData] = useState('inactive');
    const [dataCollecting, setDataCollecting] = useState(false);
    const [dataNotCollecting, setDataNotCollecting] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);

    const [dataCollect, setDataCollect] = useState(false);
    const [trainModel, setTrainModel] = useState(false);
    const [rawData, setRawData] = useState([]);
    const [snackbarTrainingError, setSnackbarTrainingError] = useState(false);
    const [snackbarWorkoutError, setSnackbarWorkoutError] = useState(false);

    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const poseEstimationLoop = useRef(null);

    const ref = {
        webcamRef: webcamRef,
        canvasRef: canvasRef
    };

    let state = 'waiting';
    let runningWorkout = false;
    let modelWorkout = null;
    let workoutCallDelay = false;
    let workoutDelayStart = 0;

    const [jumpingJackCount, setJumpingJackCount] = useState(0);
    let jjCount = 0;
    const [wallSitCount, setWallSitCount] = useState(0);
    let wsCount = 0;
    const [lungesCount, setLungesCount] = useState(0);
    let lCount = 0;

    const windowWidth = 640;
    const windowHeight = 480;

    const openDataCollecting = () => {
        setDataCollecting(true);
    };

    const closeDataCollecting = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setDataCollecting(false);
    };

    const openDataNotCollecting = () => {
        setDataNotCollecting(true);
    };

    const closeDataNotCollecting = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setDataNotCollecting(false);
    };

    const openWait = () => {
        setIsWaiting(true);
    };

    const closeWait = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setIsWaiting(false);
    };

    const openSnackbarTrainingError = () => {
        setSnackbarTrainingError(true);
    };

    const closeSnackbarTrainingError = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarTrainingError(false);
    };

    const openSnackbarWorkoutError = () => {
        setSnackbarWorkoutError(true);
    };

    const closeSnackbarWorkoutError = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarWorkoutError(false);
    };

    const collectData = async () => {
        setIsCollectingData('active');
        await delay(10000);

        openDataCollecting();
        console.log('collecting');
        state = 'collecting';

        await delay(30000);

        openDataNotCollecting();
        console.log('not collecting');
        state = 'waiting';

        setIsCollectingData('inactive');
    };

    const updateStats = (workoutType) => {
        let workoutCount = localStorage.getItem(workoutType);
        if (workoutCount === null) {
            localStorage.setItem(workoutType, 1);
        } else {

            localStorage.setItem(workoutType, parseInt(workoutCount) + 1);
        }
    }

    const loadPosenet = async () => {
        let loadedModel = await posenet.load({
            architecture: 'MobileNetV1',
            outputStride: 16,
            inputResolution: { width: 640, height: 480 },
            multiplier: 0.75
        });

        setModel(loadedModel);
    };

    const startPoseEstimation = () => {
        if (typeof webcamRef.current !== "undefined" && webcamRef.current !== null && webcamRef.current.video.readyState === 4) {
            poseEstimationLoop.current = setInterval(() => {
                const video = webcamRef.current.video;
                const videoWidth = webcamRef.current.video.videoWidth;
                const videoHeight = webcamRef.current.video.videoHeight;

                webcamRef.current.video.width = videoWidth;
                webcamRef.current.video.height = videoHeight;

                model.estimateSinglePose(video, {
                    flipHorizontal: false
                }).then(pose => {
                    let inputs = [];
                    for (let i = 0; i < pose.keypoints.length; i++) {
                        let x = pose.keypoints[i].position.x;
                        let y = pose.keypoints[i].position.y;
                        if (pose.keypoints[i].score < 0.1) {
                            x = 0;
                            y = 0;
                        } else {
                            x = (x / (windowWidth / 2)) - 1;
                            y = (y / (windowHeight / 2)) - 1;
                        }
                        inputs.push(x);
                        inputs.push(y);
                    }

                    console.log('STATE->' + state);
                    if (state === 'collecting') {
                        console.log(workoutState.workout);

                        const rawDataRow = { xs: inputs, ys: workoutState.workout };
                        rawData.push(rawDataRow);
                        setRawData(rawData);
                    }

                    if (runningWorkout === true) {
                        if (workoutCallDelay === false) {
                            const rawDataRow = { xs: inputs };
                            const result = runInference(modelWorkout, rawDataRow);

                            if (result !== null) {
                                if (result === 'JUMPING_JACKS') {
                                    jjCount += 1;
                                    setJumpingJackCount(jjCount);
                                    updateStats('JUMPING_JACKS');
                                } else if (result === 'WALL_SIT') {
                                    wsCount += 1;
                                    setWallSitCount(wsCount);
                                    updateStats('WALL_SIT');
                                } else if (result === 'LUNGES') {
                                    lCount += 1;
                                    setLungesCount(lCount);
                                    updateStats('LUNGES');
                                }
                                workoutCallDelay = true;
                                workoutDelayStart = new Date().getTime();
                            }
                        } else {
                            const workoutTimeDiff = new Date().getTime() - workoutDelayStart;
                            if (workoutTimeDiff > 1500) {
                                workoutDelayStart = 0;
                                workoutCallDelay = false;
                            }
                        }
                    }

                    drawCanvas(pose, videoWidth, videoHeight, canvasRef);
                });
            }, 100);
        }
    };

    const stopPoseEstimation = () => {
        clearInterval(poseEstimationLoop.current);
        clearCanvas();
    }

    const handlePoseEstimation = async (input) => {
        if (isPoseEstimationWorkout || state === 'collecting') openWait();
        else {

            if (input === 'COLLECT_DATA') {
                if (isPoseEstimation) {
                    if (isCollectingData === 'inactive') {
                        setIsPoseEstimation(current => !current);
                        stopPoseEstimation();
                        state = 'waiting';
                        setDataCollect(false);
                    }
                } else {
                    if (workoutState.workout.length > 0) {
                        setIsPoseEstimation(current => !current);
                        startPoseEstimation();
                        collectData();
                        setDataCollect(true);
                    }
                }
            }

            if (input === 'START_WORKOUT') {
                if (isPoseEstimationWorkout) {
                    runningWorkout = false;
                    setIsPoseEstimationWorkout(false);
                    stopPoseEstimation();
                } else {
                    runningWorkout = true;
                    try {
                        modelWorkout = await tf.loadLayersModel('indexeddb://fitness-assistant-model');
                        setIsPoseEstimationWorkout(true);
                        startPoseEstimation();
                    } catch (err) {
                        openSnackbarWorkoutError();
                    }
                }
            }
        }
    };

    const drawCanvas = (pose, videoWidth, videoHeight, canvas) => {
        const ctx = canvas.current.getContext("2d");
        canvas.current.width = videoWidth;
        canvas.current.height = videoHeight;

        drawKeypoints(pose["keypoints"], 0.5, ctx);
        drawSkeleton(pose["keypoints"], 0.5, ctx);
    };

    const clearCanvas = () => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    const handleWorkoutSelect = (event) => {
        const name = event.target.name;
        setWorkoutState({
            ...workoutState,
            [name]: event.target.value,
        });
    };

    const handleTrainModel = async () => {
        if (rawData.length > 0) {
            console.log('Data size: ' + rawData.length);
            setTrainModel(true);
            const [numOfFeatures, convertedDatasetTraining, convertedDatasetValidation] = processData(rawData);
            await runTraining(convertedDatasetTraining, convertedDatasetValidation, numOfFeatures);
            setTrainModel(false);
        } else {
            openSnackbarTrainingError();
        }
    };

    const resetAll = async () => {
        setRawData([]);

        setJumpingJackCount(0);
        setWallSitCount(0);
        setLungesCount(0);

        indexedDB.deleteDatabase('tensorflowjs');
    }

    useEffect(() => {
        loadPosenet();
    }, []);

    return (
        <div className={styles.home}>
            <MediaContainer ref={ref} />
            <Grid container className={styles.gridContainer}>
                <LiftCards jumpingJackCount={jumpingJackCount} wallSitCount={wallSitCount} lungesCount={lungesCount} />
                <LiftForm
                    handleWorkoutSelect={handleWorkoutSelect}
                    workoutState={workoutState}
                    handlePoseEstimation={handlePoseEstimation}
                    isPoseEstimation={isPoseEstimation}
                    dataCollect={dataCollect}
                    trainModel={trainModel}
                    handleTrainModel={handleTrainModel}
                    isPoseEstimationWorkout={isPoseEstimationWorkout}
                    resetAll={resetAll}
                />
            </Grid>
            <Snackbar open={dataCollecting} autoHideDuration={2500} onClose={closeDataCollecting}>
                <Alert onClose={closeDataCollecting} severity="info">
                    Started collecting pose data!
                </Alert>
            </Snackbar>
            <Snackbar open={dataNotCollecting} autoHideDuration={2500} onClose={closeDataNotCollecting}>
                <Alert onClose={closeDataNotCollecting} severity="success">
                    Completed collecting pose data!
                </Alert>
            </Snackbar>
            <Snackbar open={isWaiting} autoHideDuration={2500} onClose={closeWait}>
                <Alert onClose={closeWait} severity="error">
                    Please wait!
                </Alert>
            </Snackbar>
            <Snackbar open={snackbarTrainingError} autoHideDuration={2000} onClose={closeSnackbarTrainingError}>
                <Alert onClose={closeSnackbarTrainingError} severity="error">
                    Training data is not available!
                </Alert>
            </Snackbar>
            <Snackbar open={snackbarWorkoutError} autoHideDuration={2000} onClose={closeSnackbarWorkoutError}>
                <Alert onClose={closeSnackbarWorkoutError} severity="error">
                    Model is not available!
                </Alert>
            </Snackbar>
        </div>
    );
}

export default Home;
