import React, { useEffect, useRef } from 'react';
import styles from './MediaContainer.module.css';
import Webcam from 'react-webcam'
import * as posenet from '@tensorflow-models/posenet';
import { drawKeypoints, drawSkeleton } from '../utils/poses';
require('@tensorflow/tfjs-backend-webgl');

const MediaContainer = () => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    // const poseEstimationLoop = useRef(null);
    // const [model, setModel] = useState(null);

    useEffect(() => {
        loadPosenet();
    }, []);

    const loadPosenet = async () => {
        const loadedModel = await posenet.load({
            architecture: 'MobileNetV1',
            outputStride: 16,
            inputResolution: { width: 640, height: 480 },
            multiplier: 0.75
        });

        // setModel(loadedModel); TODO: state not being set which is caused errors -> temp fix
        setInterval(() => {
            startPoseEstimation(loadedModel);
        }, 100);
    };

    const startPoseEstimation = (model) => {
        if (typeof webcamRef.current !== "undefined" && webcamRef.current !== null && webcamRef.current.video.readyState === 4) {
            const video = webcamRef.current.video;
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;

            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;

            model.estimateSinglePose(video, {
                flipHorizontal: false
            }).then(pose => {
                drawCanvas(pose, videoWidth, videoHeight, canvasRef);
            });
        }
    };

    const drawCanvas = (pose, videoWidth, videoHeight, canvas) => {
        const ctx = canvas.current.getContext("2d");
        canvas.current.width = videoWidth;
        canvas.current.height = videoHeight;

        ctx.drawImage(webcamRef.current.video, 0, 0, videoWidth, videoHeight)
        drawKeypoints(pose["keypoints"], 0.5, ctx);
        drawSkeleton(pose["keypoints"], 0.5, ctx);
    };

    return (
        <div className={styles.mediaContainer}>
            <Webcam className={styles.media} ref={webcamRef} />
            <canvas className={styles.canvas} ref={canvasRef} />
        </div>
    );
};

export default MediaContainer;