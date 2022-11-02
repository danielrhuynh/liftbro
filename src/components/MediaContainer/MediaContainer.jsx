// import { PoseNet } from '@tensorflow-models/posenet';
import React, { useRef } from 'react';
import Webcam from 'react-webcam'
import * as posenet from '@tensorflow-models/posenet';
import '@tensorflow/tfjs-backend-webgl';
import styles from './MediaContainer.module.css';

const MediaContainer = ({ text }) => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    const detect = async (net) => {
        if (typeof webcamRef.current !== 'undefined' && webcamRef.current !== null && 
        (webcamRef.current).video.readyState === 4) {
            const video = webcamRef.current.video;
            const videoWidth = webcamRef.current.video?.videoWidth;
            const videoHeight = webcamRef.current.video?.videoHeight;

            (webcamRef.current).video.width = videoWidth;
            (webcamRef.current).video.height = videoHeight;

            const pose = await net.estimateSinglePose(video);
            console.log(pose);

        }
    };

    const runPosenet = async () => {
        const net = await posenet.load();
        setInterval(() => detect(net), 100);

    }

    runPosenet();

    return (
        <div className={styles.mediaContainer}>
            <Webcam className={styles.media} ref={webcamRef} />
            <canvas className={styles.canvas} ref={canvasRef}/>
        </div>
    );
};

export default MediaContainer;