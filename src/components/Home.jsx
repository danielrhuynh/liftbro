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

const Home = () => {
    const [model, setModel] = useState(null);
    const [isPoseEstimation, setIsPoseEstimation] = useState(false)
    const [workoutState, setWorkoutState] = useState({ workout: '', name: 'Dan', });
    const [isCollectingData, setIsCollectingData] = useState('inactive');
    const [dataCollecting, setDataCollecting] = useState(false);
    const [dataNotCollecting, setDataNotCollecting] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);

    const [dataCollect, setDataCollect] = useState(false);
    const [rawData, setRawData] = useState([]);

    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const poseEstimationLoop = useRef(null);

    const ref = {
        webcamRef: webcamRef,
        canvasRef: canvasRef
    };

    let state = 'waiting';

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

    const collectData = () => {
        setTimeout(() => {
            startPoseEstimation();
            openDataCollecting();
            state = 'collecting';
        }, 5000);

        setTimeout(() => {
            //Potentially just call handlePoseEstimation lol
            openDataNotCollecting();
            stopPoseEstimation();
            setIsPoseEstimation(false);
            setDataCollect(false);
            state = 'waiting';
            setIsCollectingData('inactive');
        }, 15000);
    };

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

                    drawCanvas(pose, videoWidth, videoHeight, canvasRef);
                });
            }, 100);
        }
    };

    const stopPoseEstimation = () => {
        clearInterval(poseEstimationLoop.current);
        clearCanvas();
    }

    const handlePoseEstimation = (input) => {
        if (isPoseEstimation) {
            openWait();
        }
        else {
            if (input === 'COLLECT_DATA') {
                if (isPoseEstimation || state === 'collecting' || isCollectingData === true) {
                    if (isCollectingData === 'inactive') {
                        setIsPoseEstimation(current => !current);
                        stopPoseEstimation();
                        setDataCollect(false);
                        state = 'waiting';
                    }
                } else {
                    if (workoutState.workout.length > 0) {
                        setIsPoseEstimation(!isPoseEstimation);
                        setDataCollect(true);
                        collectData();
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
            const [numOfFeatures, convertedDatasetTraining, convertedDatasetValidation] = processData(rawData);
        }
    };

    useEffect(() => {
        loadPosenet();
    }, []);

    return (
        <div className={styles.home}>
            <MediaContainer ref={ref} />
            <Grid container className={styles.gridContainer}>
                <LiftCards />
                <LiftForm 
                handleWorkoutSelect={handleWorkoutSelect} 
                workoutState={workoutState} 
                handlePoseEstimation={handlePoseEstimation} 
                isPoseEstimation={isPoseEstimation} 
                dataCollect={dataCollect} 
                handleTrainModel={handleTrainModel}
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
        </div>
    );
}

export default Home;
