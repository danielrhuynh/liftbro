import React, { useEffect, useRef, useState } from 'react';
import Button from '../Button/Button'
import styles from './MediaContainer.module.css';
import Webcam from 'react-webcam'
import * as posenet from '@tensorflow-models/posenet';
import * as tf from '@tensorflow/tfjs';
import { drawKeypoints, drawSkeleton } from '../utils/poses';

const MediaContainer = ({ }) => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const poseEstimationLoop = useRef(null);
    const [model, setModel] = useState(null);
    const [isPoseEstimation, setIsPoseEstimation] = useState(false)

    useEffect(() => {
        loadPosenet();
    }, [])

    const loadPosenet = async () => {
        let loadedModel = await posenet.load({
            architecture: 'MobileNetV1',
            outputStride: 16,
            inputResolution: { width: 640, height: 480 },
            multiplier: 0.75
        });

        setModel(loadedModel)
        console.log("Posenet Model Loaded..")
    };

    const startPoseEstimation = () => {
        if (webcamRef.current !== null && webcamRef.current.video.readyState === 4) {
            poseEstimationLoop.current = setInterval(() => {
                const video = webcamRef.current.video;
                const videoWidth = webcamRef.current.video.videoWidth;
                const videoHeight = webcamRef.current.video.videoHeight;

                webcamRef.current.video.width = videoWidth;
                webcamRef.current.video.height = videoHeight;

                var tic = new Date().getTime()
                model.estimateSinglePose(video, {
                    flipHorizontal: false
                }).then(pose => {
                    var toc = new Date().getTime()
                    // console.log(toc - tic, " ms")
                    // console.log(tf.getBackend())
                    // console.log(pose)

                drawCanvas(pose, videoWidth, videoHeight, canvasRef);
                });
            }, 100);
        }
    };

    const stopPoseEstimation = () => clearInterval(poseEstimationLoop.current);

    const handlePoseEstimation = () => {
        if (isPoseEstimation)
            stopPoseEstimation();
        else
            startPoseEstimation();

        setIsPoseEstimation(current => !current)
    };

    const drawCanvas = (pose, videoWidth, videoHeight, canvas) => {
        const ctx = canvas.current.getContext("2d");
        canvas.current.width = videoWidth;
        canvas.current.height = videoHeight;

        drawKeypoints(pose["keypoints"], 0.5, ctx);
        drawSkeleton(pose["keypoints"], 0.5, ctx);
    };


    return (
        <div className={styles.mediaContainer}>
            <Webcam className={styles.media} ref={webcamRef} />
            <canvas className={styles.canvas} ref={canvasRef} />
            <Button onClick={handlePoseEstimation}>Turn On</Button>
        </div>
    );
};

export default MediaContainer;