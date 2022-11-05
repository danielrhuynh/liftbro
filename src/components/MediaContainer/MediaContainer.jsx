import React, { useEffect, useRef } from 'react';
import styles from './MediaContainer.module.css';
import Webcam from 'react-webcam'
import {loadPosenet} from '../utils/poses';
require('@tensorflow/tfjs-backend-webgl');

const MediaContainer = () => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        loadPosenet(webcamRef, canvasRef);
    }, []);

    return (
        <div className={styles.mediaContainer}>
            <Webcam className={styles.media} ref={webcamRef} />
            <canvas className={styles.canvas} ref={canvasRef} />
        </div>
    );
};

export default MediaContainer;
