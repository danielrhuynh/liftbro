import React, { useState, useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
import styles from './Home.module.css';
import { Grid } from '@mui/material';

import MediaContainer from './MediaContainer/MediaContainer';
import LiftCards from './LiftCards/LiftCards';
import LiftForm from './LiftForm/LiftForm';
import Snackbars from './Snackbars/Snackbars';

import { drawKeypoints, drawSkeleton } from './utils/canvas';
import { processData } from './utils/dataProcessing';
import { runTraining } from './utils/modelTraining';
import { runInference } from './utils/modelInference';

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
    const [collectingDataOpperation, setCollectingDataOperation] = useState('inactive');

    const [dataCollect, setDataCollect] = useState(false);
    const [trainModel, setTrainModel] = useState(false);
    const [rawData, setRawData] = useState([]);

    const [dataCollectingSB, setDataCollectingSB] = useState(false);
    const [dataNotCollectingSB, setDataNotCollectingSB] = useState(false);
    const [trainingErrorSB, setTrainingErrorSB] = useState(false);
    const [workoutErrorSB, setWorkoutErrorSB] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);

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
        setDataCollectingSB(true);
    };

    const closeDataCollecting = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setDataCollectingSB(false);
    };

    const openDataNotCollecting = () => {
        setDataNotCollectingSB(true);
    };

    const closeDataNotCollecting = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setDataNotCollectingSB(false);
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
        setTrainingErrorSB(true);
    };

    const closeSnackbarTrainingError = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setTrainingErrorSB(false);
    };

    const openSnackbarWorkoutError = () => {
        setWorkoutErrorSB(true);
    };

    const closeSnackbarWorkoutError = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setWorkoutErrorSB(false);
    };

    const collectData = async () => {
        setCollectingDataOperation('active');
        await delay(10000);

        openDataCollecting();
        console.log('collecting');
        state = 'collecting';

        await delay(30000);

        openDataNotCollecting();
        console.log('not collecting');
        state = 'waiting';

        setCollectingDataOperation('inactive');
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

            if (input === 'COLLECT_DATA') {
                if (isPoseEstimation) {
                    if (collectingDataOpperation === 'inactive') {
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
            <Snackbars
                dataCollectingSB={dataCollectingSB}
                closeDataCollecting={closeDataCollecting}
                dataNotCollectingSB={dataNotCollectingSB}
                closeDataNotCollecting={closeDataNotCollecting}
                isWaiting={isWaiting}
                closeWait={closeWait}
                trainingErrorSB={trainingErrorSB}
                closeSnackbarTrainingError={closeSnackbarTrainingError}
                workoutErrorSB={workoutErrorSB}
                closeSnackbarWorkoutError={closeSnackbarWorkoutError}
            />
        </div>
    );
}

export default Home;
